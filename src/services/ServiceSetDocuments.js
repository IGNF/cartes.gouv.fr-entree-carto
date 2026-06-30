
/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @see env
 * @example
 * import Documents from '@/services/serviceDocuments';
 * // requêtes
 * Documents.setDocument(data);
 * Documents.updateGeometryDocument(data);
 * Documents.updateMetadataDocument(data);
 * Documents.renameDocument(data);
 * Documents.deleteDocument(data);
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
   * Limiter le nombre de caractères d'un texte
   * @param {*} text 
   * @param {*} maxLength 
   * @returns 
   */
  sliceText : (text, maxLength) => {
    if (!text || typeof text !== 'string') {
      return "";
    }
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
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
   * -F 'labels=test' \
   * -F 'public_url=true'
   * 
   * @param {Object} obj 
   * @property {String} obj.content - export
   * @property {String} obj.name - name
   * @property {String} obj.description - description
   * @property {String} obj.format - format : kml, geojson, ...
   * @property {String} obj.type - drawing, import, ...
   * @property {String} obj.kind - wms, wmts, ...
   * @property {String} obj.compute - isocurve, route, ...
   * @property {String} obj.target - internal, external
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  setDocument : async function (obj) {
    if (this.isPending()) {
      // éviter les appels concurrents  
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }
    try {
      const formData = new FormData();
      formData.append("name", obj.name);
      formData.append("description", this.sliceText(obj.description, 255));

      const labels = [
        this.tag, // ex. cartes.gouv.fr
        obj.type, 
        this.labelsFormats.find((e) => obj.format.toLowerCase().includes(e)),
        this.labelsTarget.find((e) => obj.target.toLowerCase().includes(e))
      ];
      if (obj.kind) {
        var valueKind = this.labelsService.find((e) => obj.kind.toLowerCase().includes(e));
        if (valueKind) {
          labels.push(valueKind);
        }
      }
      if (obj.compute) {
        var valueCompute = this.labelsCompute.find((e) => obj.compute.toLowerCase().includes(e));
        if (valueCompute) {
          labels.push(valueCompute);
        }
      }
      formData.append("labels", labels.join(","));

      // FIXME
      // URL publique pour tous les documents, mais pas possible dans le POST !
      formData.append("url_public", true);

      // FIXME 
      // le champ extra n'est pas pris en compte par l'API Entrepot !?
      formData.append("extra", JSON.stringify({
        kind: (obj.kind) ? obj.kind.toLowerCase() : null,
        format: obj.format.toLowerCase(),
        target: "internal",
        date: new Date().toLocaleDateString()
      }));

      const content = obj.content;
      const blob = new Blob([content], { type: this.getMimeType(obj.format) });
      const file = new File([blob], `${obj.name}.${obj.format}`, { type: this.getMimeType(obj.format) });
      formData.append("file", file);

      // Débogage du contenu de formData
      for (let pair of formData.entries()) {
        console.debug(pair[0]+ ': ' + pair[1]);
      }

      var response = await this.getFetch()(`${this.api}/users/me/documents`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          "X-Requested-With" : "XMLHttpRequest",
          // 'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });

      var data = await response.json();
      
      if (response.status !== 200 && response.status !== 201) {
        // ERROR !
        throw new Error(`Le document n'a pas été enregistré !`, { cause: data });
      }

      // enregistrer la réponse
      this.documents[obj.type].push(data);

      // uuid
      var uuid = data._id;

      // mise à jour du store
      this.saveStore();
      
      return {
        uuid : uuid,
        action : "added"
      };
    } catch (error) {
      console.error("Erreur dans la création du document :", error);
      this.throwError(error);
    }
  },

  /**
   * Mettre à jour un document (Geometrie)
   * 
   * Appels de l'API Entrepôt :
   * - PUT /users/me/documents/{document}
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : ex. service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @fixme On ne peut pas mettre à jour le contenu d'un document avec le PUT pour le mode remote !
   * @example
   * ...
   * 
   * @param {*} obj
   * @property {String} obj.uuid - ...
   * @property {String} obj.content - export
   * @property {String} obj.format - format : kml, geojson, ...
   * @property {String} obj.type - drawing, import, ...
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  updateGeometryDocument : async function (obj) {
    if (this.isPending()) {
      // éviter les appels concurrents  
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }

    try {
      // uuid
      var uuid = obj.uuid;
  
      // recherche du document
      var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
      if (idx === -1) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
      }
  
      const formData = new FormData();
      const blob = new Blob([obj.content], { type: this.getMimeType(obj.format) });
      formData.append("file", blob); // FIXME blob ou text ?
  
      var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
        method: (this.mode === 'local') ? 'PUT' : 'POST', // HACK : PUT ou POST
        headers: {
          'Accept': 'application/json',
          "X-Requested-With" : "XMLHttpRequest",
          // 'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
  
      var data = await response.json();
      
      if (response.status !== 200) {
        if (response.status === 404) {
          throw new Error(`Le document ${uuid} n'existe plus sur le serveur.`, {
            cause: { status: response.status, data, code: "DOC_DELETED_REMOTELY" }
          });
        }
        if (response.status === 409 || response.status === 412) {
          throw new Error(`Le document ${uuid} est en conflit de synchronisation.`, {
            cause: { status: response.status, data, code: "DOC_VERSION_CONFLICT" }
          });
        }
        throw new Error(`Le document ${uuid} n'a pas été mis à jour !`, {
          cause: { status: response.status, data }
        });
      }
  
      // enregistrer la réponse
      this.documents[obj.type][idx] = data;
  
      // mise à jour du store
      this.saveStore();
      
      return {
        uuid : uuid,
        action : "updated"
      };
    } catch (error) {
      console.error("Erreur dans la mise à jour de la géométrie du document :", error);
      this.throwError(error);
    }
  },

  /**
   * Mettre à jour un document (extra, public_url, ...)
   * 
   * Appels de l'API Entrepôt :
   * - PATCH /users/me/documents/{document}
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
   * @property {Object} obj.extra - ...
   * @property {String} obj.name - ...
   * @property {String} obj.description - ...
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   * @param {*} obj 
   */
  updateMetadataDocument : async function (obj) {
    if (this.isPending()) {
      // éviter les appels concurrents  
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }

    try {
      let uuid = obj.uuid;
  
      // recherche du document
      var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
      if (idx === -1) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
      }
      // construction du body en evitant d'envoyer des champs vides 
      // et d'ecraser les champs existants dans extras
      var body = {};
      if (obj.extra) {
        // si existe déjà dans le document, on fusionne les champs
        if (this.documents[obj.type][idx].extra) {
          body.extra = { ...this.documents[obj.type][idx].extra, ...obj.extra };
        } else {
          body.extra = obj.extra;
        }
      }
      if (obj.name) {
        body.name = obj.name;
      }
      if (obj.description) {
        body.description = obj.description;
      }
  
      var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          "X-Requested-With" : "XMLHttpRequest",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      var data = await response.json();
      
      if (response.status !== 200) {
        if (response.status === 404) {
          throw new Error(`Le document ${uuid} n'existe plus sur le serveur.`, {
            cause: { status: response.status, data, code: "DOC_DELETED_REMOTELY" }
          });
        }
        if (response.status === 409 || response.status === 412) {
          throw new Error(`Le document ${uuid} est en conflit de synchronisation.`, {
            cause: { status: response.status, data, code: "DOC_VERSION_CONFLICT" }
          });
        }
        throw new Error(`Le document ${uuid} n'a pas été mis à jour !`, {
          cause: { status: response.status, data }
        });
      }
  
      // enregistrer la réponse
      this.documents[obj.type][idx] = data;
  
      // uuid
      uuid = data._id;
  
      // mise à jour du store
      this.saveStore();
      
      return {
        uuid : uuid,
        action : "updated"
      };
    } catch (error) {
      console.error("Erreur dans la mise à jour des métadonnées du document :", error);
      this.throwError(error);
    }
  },

  /**
   * Mettre à jour les labels d'un document
   * 
   * Appels de l'API Entrepôt :
   * - PATCH /users/me/documents/{document}
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
   * @property {Array} obj.labels - tableau de labels à ajouter
   * @returns {Promise} - { UUID, action : [added, updated, deleted], extra }
   */
  updateLabelsDocument : async function (obj) {
    if (this.isPending()) {
      // éviter les appels concurrents  
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }

    try {
      let uuid = obj.uuid;
  
      // recherche du document
      var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
      if (idx === -1) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
      }
      // Pour eviter que cette liste n'ecrase les labels existants,
      // on doit d'abord les récuperer, puis les fusionner avec les nouveaux labels
      // Attention, les labels doivent être disponibles dans le document, 
      // sinon on ne peut pas les fusionner
      const existingLabels = this.documents[obj.type][idx].labels;
      if (!existingLabels || !Array.isArray(existingLabels)) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas de labels existants !`);
      }
      const updatedLabels = [...new Set([...existingLabels, ...obj.labels])]; // Fusionner et supprimer les doublons

      // construction du body
      var body = {};
      body.labels = updatedLabels;
  
      var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          "X-Requested-With" : "XMLHttpRequest",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      var data = await response.json();
      
      if (response.status !== 200) {
        // ERROR !
        throw data;
      }
  
      // enregistrer la réponse
      this.documents[obj.type][idx] = data;
  
      // uuid
      uuid = data._id;
  
      // mise à jour du store
      this.saveStore();
      
      return {
        uuid : uuid,
        action : "updated"
      };
    } catch (error) {
      console.error("Erreur dans la mise à jour des labels du document :", error);
      this.throwError(error);
    }
  },

  /**
   * Mettre à jour un document (extra, public_url, ...)
   * 
   * Appels de l'API Entrepôt :
   * - PATCH /users/me/documents/{document}
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
   * @param {*} obj 
   */
  sharingDocument : async function (obj) {
    if (this.isPending()) {
      // éviter les appels concurrents  
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }

    try {
      let uuid = obj.uuid;
  
      // recherche du document
      var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
      if (idx === -1) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
      }
  
      var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          "X-Requested-With" : "XMLHttpRequest",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ public_url : true })
      });
  
      var data = await response.json();
      
      if (response.status !== 200) {
        if (response.status === 404) {
          throw new Error(`Le document ${uuid} n'existe plus sur le serveur.`, {
            cause: { status: response.status, data, code: "DOC_DELETED_REMOTELY" }
          });
        }
        if (response.status === 409 || response.status === 412) {
          throw new Error(`Le document ${uuid} est en conflit de synchronisation.`, {
            cause: { status: response.status, data, code: "DOC_VERSION_CONFLICT" }
          });
        }
        throw new Error(`Le document ${uuid} n'a pas été partagé !`, {
          cause: { status: response.status, data }
        });
      }
  
      // enregistrer la réponse
      this.documents[obj.type][idx] = data;
  
      // uuid
      uuid = data._id;
  
      // mise à jour du store
      this.saveStore();
      
      return {
        uuid : uuid,
        action : "shared"
      };
    } catch (error) {
      console.error("Erreur dans le partage du document :", error);
      this.throwError(error);
    }
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
    if (this.isPending()) {
      // éviter les appels concurrents
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }

    try {
      let uuid = obj.uuid;
  
      // recherche du document
      var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
      if (idx === -1) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
      }
      // construction du body
      var body = {
        name: obj.name
      };
  
      var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          "X-Requested-With" : "XMLHttpRequest",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
  
      var data = await response.json();
      
      if (response.status !== 200 && response.status !== 201) {
        if (response.status === 404) {
          throw new Error(`Le document ${uuid} n'existe plus sur le serveur.`, {
            cause: { status: response.status, data, code: "DOC_DELETED_REMOTELY" }
          });
        }
        if (response.status === 409 || response.status === 412) {
          throw new Error(`Le document ${uuid} est en conflit de synchronisation.`, {
            cause: { status: response.status, data, code: "DOC_VERSION_CONFLICT" }
          });
        }
        throw new Error(`Le document ${uuid} n'a pas été renommé !`, {
          cause: { status: response.status, data }
        });
      }
  
      // enregistrer la réponse
      this.documents[obj.type][idx] = data;
  
      // uuid
      uuid = data._id;
  
      // mise à jour du store
      this.saveStore();
      
      return {
        uuid : uuid,
        action : "updated"
      };
    } catch (error) {
      console.error("Erreur dans la mise à jour du nom du document :", error);
      this.throwError(error);
    }
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
   * - vérifier si le document supprimé est encore présent dans un document de type carte,
   *  si oui, on précise un message d'avertissement
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
    if (this.isPending()) {
      // éviter les appels concurrents  
      return Promise.reject(new Error("Une requête est déjà en cours, veuillez réessayer plus tard."));
    }

    try {
      var uuid = obj.uuid;
      var response = await this.getFetch()(`${this.api}/users/me/documents/${uuid}`, {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          "X-Requested-With" : "XMLHttpRequest"
        }
      });
  
      if (response.status !== 204) {
        if (response.status === 404) {
          throw new Error(`Le document ${uuid} n'existe plus sur le serveur.`, {
            cause: { status: response.status, response, code: "DOC_DELETED_REMOTELY" }
          });
        }
        if (response.status === 409 || response.status === 412) {
          throw new Error(`Le document ${uuid} est en conflit de synchronisation.`, {
            cause: { status: response.status, response, code: "DOC_VERSION_CONFLICT" }
          });
        }
        throw new Error(`Le document ${uuid} n'a pas été supprimé !`, {
          cause: { status: response.status, response }
        });
      }
  
      // supprimer la réponse
      var idx = this.documents[obj.type].findIndex((e) => e._id === uuid);
      if (idx === -1) {
        // ERROR !
        throw new Error(`Le document ${uuid} n'a pas été trouvé !`);
      }
      this.documents[obj.type].splice(idx, 1);
  
      // mise à jour du store
      this.saveStore();
  
      // on verifie si le document supprimé est encore present dans un document de type carte,
      // si oui, on precise un message d'avertissement
      var isPresentInBookmarksCarte = this.findInCarte(uuid);
      
      return {
        uuid : uuid,
        action : "deleted",
        extra : {
          isPresentInBookmarksCarte : isPresentInBookmarksCarte
        }
      };
    } catch (error) {
      console.error("Erreur dans la suppression du document :", error);
      this.throwError(error);
    }
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
      var error = new Error(`Le document ${uuid} n'a pas été téléchargé !`);
      console.error("Erreur dans l'export du document :", error);
      this.throwError(error);
    }
    return {
      uuid : uuid,
      action : "exported",
      extra : {
        content : content,
        mimeType : this.getMimeType(infos.extra.format),
        name : infos.name,
        ext : infos.extra.format
      }
    };
  }
};

export default SetDocuments;
