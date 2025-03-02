import { useServiceStore } from '@/stores/serviceStore';

/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @see env
 * @example
 * import Documents from '@/services/serviceDocuments';
 * // requêtes
 * Documents.setDrawing(data);
 * Documents.setImport(data);
 * Documents.setCompute(data);
 * Documents.setService(data);
 * Documents.setCartes(data);
 * ...
 * // propriétés
 * Documents.documents;
 * ...
 */

var SetDocuments = {

  /**
   * Obtenir le mime-type à partir du format
   * 
   * ex.
   * text/plain
   * application/xml
   * application/gpx+xml
   * application/json
   * application/vnd.google-earth.kml+xml
   * application/octet-stream
   * 
   * @param {String} format 
   * @returns {String} - mime-type
   */
  getMimeType : (format) => {
    var mimeType = "";
    switch (format.toLowerCase()) {
      case "json":
        mimeType = "application/json";
        break;
      case "geojson":
        mimeType = "application/geo+json";
        break;
      case "kml":
        mimeType = "application/vnd.google-earth.kml+xml";
        break;
      case "gpx":
        mimeType = "application/gpx+xml";
        break;
      default:
        mimeType = "application/octet-stream";
        break;
    }
    return mimeType;
  },

  /**
   * Enregistrer un document
   * 
   * Appels de l'API Entrepôt :
   * - POST /users/me/documents -> 201 response json
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : ex. service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @example
   * curl -X 'POST' \
   * 'https://data.geopf.fr/api/users/me/documents' \
   * -H 'accept: application/json' \
   * -H 'Authorization: Bearer .....
   * -H 'Content-Type: multipart/form-data' \
   * -F 'file=@export-iso.gpx;type=application/gpx+xml' \
   * -F 'description=test' \
   * -F 'name=test' \
   * -F 'labels=test'
   * 
   * @param {Object} obj 
   * @property {String} obj.content - export
   * @property {String} obj.name - name
   * @property {String} obj.description - description
   * @property {String} obj.format - format : kml, geojson, ...
   * @property {String} obj.type - drawing, import, ...
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  setDocument : async function (obj) {
    const formData = new FormData();
    formData.append("name", obj.name);
    formData.append("description", obj.description);
    formData.append("labels", this.tag);
    formData.append("labels", obj.type);
    formData.append("labels", this.labelsFormats.find((e) => obj.format.toLowerCase().includes(e)));
    formData.append("extra", {
      format: obj.format.toLowerCase(),
      target: "internal",
      date: new Date().toLocaleDateString()
    }); // FIXME string ou json ?

    const content = obj.content;
    const blob = new Blob([content], { type: this.getMimeType(obj.format) });
    formData.append("file", blob); // FIXME blob ou text ?

    console.debug(...formData)

    var response = await this.getFetch()(`${this.api}/users/me/documents/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        "X-Requested-With" : "XMLHttpRequest",
        'Content-Type': 'application/x-www-form-urlencoded' // 'multipart/form-data' ?
      },
      body: formData
    });

    var data = await response.json();
    
    if (response.status !== 200 && response.status !== 201) {
      // ERROR !
      throw data;
    }

    // enregistrer la réponse
    this.documents[obj.type].push(data);

    // uuid
    var uuid = data._id;

    // mise à jour du store
    var store = useServiceStore();
    store.setService(this);
    
    return {
      uuid : uuid,
      action : "added"
    };
  },

  /**
   * Mettre à jour du document
   * 
   * Appels de l'API Entrepôt :
   * - PUT /users/me/documents/{document}
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : ex. service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @example
   * ...
   * 
   * @param {*} obj
   * @property {String} obj.uuid - ...
   * @property {String} obj.type - drawing, import, ...
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  updateDocument : async function (obj) {
    return Promise.resolve();
  },

  /**
   * Mettre à jour le nom du document
   * 
   * Appels de l'API Entrepôt :
   * - PATCH /users/me/documents/{document}
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : ex. service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @example
   * curl -X 'PATCH' \
   * 'https://data.geopf.fr/api/users/me/documents/a6187561-bed1-4b3c-aea2-89227387ac45' \
   * -H 'accept: application/json' \
   * -H 'Authorization: Bearer ... \
   * -H 'Content-Type: application/json' \
   * -d '{
   *  "name": "test3",
   *  "public_url": true
   * }'
   * 
   * @param {*} obj
   * @property {String} obj.uuid - ...
   * @property {String} obj.type - drawing, import, ...
   * @property {String} obj.name - nouveau nom
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  renameDocument : async function (obj) {
    var uuid = obj.uuid;
    // recherche du document
    var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
    if (idx === -1) {
      // ERROR !
      throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
    }
    // construction du body
    var body = this.documents[obj.type][idx];
    body.name = obj.name;

    var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
        "X-Requested-With" : "XMLHttpRequest"
      },
      body: JSON.stringify(body)
    });

    var data = await response.json();
    
    if (response.status !== 200 && response.status !== 201) {
      // ERROR !
      throw data;
    }

    // enregistrer la réponse
    this.documents[obj.type][idx] = data;

    // uuid
    var uuid = data._id;

    // mise à jour du store
    var store = useServiceStore();
    store.setService(this);
    
    return {
      uuid : uuid,
      action : "updated"
    };
  },

  /**
   * Supprimer un document
   * 
   * Appels de l'API Entrepôt :
   * - DELETE /users/me/documents/{document} -> 204
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : ex. service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @example
   * curl -X 'DELETE' \
   * 'https://data.geopf.fr/api/users/me/documents/73b21b14-ef88-47d0-a341-91f432469f3a' \
   * -H 'accept: *\/*' \
   * -H 'Authorization: Bearer ...
   * 
   * @param {*} obj
   * @property {String} obj.uuid - ...
   * @property {String} obj.type - drawing, import, ...
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  deleteDocument : async function (obj) {
    var uuid = obj.uuid;
    var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
      method: 'DELETE',
      headers: {
        'Accept': '*/*',
        "X-Requested-With" : "XMLHttpRequest"
      }
    });

    if (response.status !== 204) {
      // ERROR !
      throw response;
    }

    // supprimer la réponse
    var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
    if (idx === -1) {
      // ERROR !
      throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
    }
    this.documents[obj.type].splice(idx, 1);

    // mise à jour du store
    var store = useServiceStore();
    store.setService(this);

    return {
      uuid : uuid,
      action : "deleted"
    };
  },

  /**
   * Exporter un document
   * 
   * Appels de l'API Entrepôt :
   * - GET /users/me/documents/${document}/file
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : ex. service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @example
   * ...
   * 
   * @param {*} obj
   * @property {String} obj.uuid - ...
   * @property {String} obj.type - drawing, import, ...
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  exportDocument : async function (obj) {
    var uuid = obj.uuid;
    var infos = this.documents[obj.type].find((e) => e._id === uuid);
    if (!infos) {
      // ERROR !
      throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
    }
    // on demande plus d'information !
    if (!infos.extra) {
      var moreInfos = await this.getDocumentById(uuid);
      Object.assign(infos, moreInfos);
    }
    // appel de la requête de télechargement du fichier
    var content = await this.getFileById(uuid);
    if (!content) {
      // ERROR !
      throw new Error(`Le document ${uuid} n'a pas été téléchargé !`);
    }
    var json = (infos.extra.format === 'json' || infos.extra.format === 'geojson');
    return {
      uuid : uuid,
      action : "exported",
      extra : {
        content : (json) ? JSON.stringify(content) : content,
        mimeType : this.getMimeType(infos.extra.format),
        name : infos.name,
        ext : infos.extra.format
      }
    };
  }
};

export default SetDocuments;
