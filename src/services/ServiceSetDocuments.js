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
   * Enregistrer ou mettre à jour un croquis
   * 
   * Appels de l'API Entrepôt :
   * - POST /users/me/documents -> 201 response json
   * - PUT /users/me/documents/{document}
   * - DELETE /users/me/documents/{document} -> 204
   * - PATCH /users/me/documents/{document}
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : service.documents.drawing
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
   * @property {Object} obj.layer - layer
   * @property {String} obj.content - export
   * @property {String} obj.name - name
   * @property {String} obj.description - description
   * @property {String} obj.format - format : kml, geojson, ...
   * @returns {Promise} - { UUID, action : added, updated, deleted }
   */
  setDrawing : async function (obj) {
    const formData = new FormData();
    formData.append("name", obj.name);
    formData.append("description", obj.description);
    formData.append("labels", this.tag);
    formData.append("labels", "drawing");
    formData.append("labels", this.labelsFormats.find((e) => obj.format.toLowerCase().includes(e)));
    formData.append("extra", JSON.stringify({
      format: obj.format.toLowerCase(),
      target: "internal",
      date: new Date().toLocaleDateString()
    }));

    const content = obj.content;
    const blob = new Blob([content], { type: this.getMimeType(obj.format) });
    formData.append("file", blob);

    var response = await this.getFetch().fetch(`${this.api}/users/me/documents/`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: formData
    });

    var data = await response.json();
    
    // enregistrer la réponse
    this.documents["drawing"].push(data);

    // uuid
    var uuid = data._id;

    // mise à jour de l'id interne de la couche
    if (obj.layer.gpResultLayerId) {
      obj.layer.gpResultLayerId = `bookmark:${obj.format.toLowerCase()}:${uuid}`;
    }

    var store = useServiceStore();
    store.setService(this);
    
    return {
      uuid : uuid,
      action : "added"
    };
  },
  setImport : async function (data) {
    return Promise.resolve();
  },
  setCompute : async function (data) {
    return Promise.resolve();
  },
  setService : async function (data) {
    return Promise.resolve();
  },
  setCartes : async function () {
    return Promise.resolve();
  }
};

export default SetDocuments;