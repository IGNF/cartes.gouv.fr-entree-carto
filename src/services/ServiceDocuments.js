import GetDocuments from "./ServiceGetDocuments";
import SetDocuments from "./ServiceSetDocuments";

// nombre de documents à récupérer par page lors de la pagination
const LIMIT_PER_PAGE = 5;

/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @see env
 * @example
 * import Documents from '@/services/serviceDocuments';
 * Documents.getDocuments();
 * Documents.getDocumentsByLabel(label);
 * Documents.getDocumentById(id);
 * Documents.getFileById(id);
 * ...
 * // propriétés
 * Documents.documents;
 * ...
 */
var Documents = {
  /**
   * Label obligatoire pour les documents du Portail
   */
  tag: "cartes.gouv.fr",

  /**
   * Liste des méta informations (labels) possible par thématique
   */
  labels: [
    "drawing",
    "import",
    "compute",
    "service",
    "carte"
  ],

  /**
   * Autre méta informations possible
   */
  labelsFormats: [
    "geojson",
    "gpx",
    "kml",
    "mapbox",
    "json"
  ],

  labelsService: [
    "mapbox",
    "wms",
    "wmts"
  ],

  labelsTarget: [
    "internal",
    "external"
  ],

  labelsCompute: [
    "isocurve",
    "route",
    "profil"
  ],

  //////////////////////////
  // Méthodes helpers
  //////////////////////////

  /**
   * Verifie si aucun document n'est disponible
   * 
   * @returns {Boolean} - Vrai si aucun document n'est disponible
   */
  isEmpty: function () {
    for (let index = 0; index < this.labels.length; index++) {
      const label = this.labels[index];
      if (this.documents[label] && this.documents[label].length > 0) {
        return false;
      }
    }
    return true;
  },

  /**
   * Recherche un document par son uuid
   * 
   * @param {*} uuid 
   * @returns document
   */
  find: function (uuid) {
    for (let index = 0; index < this.labels.length; index++) {
      const label = this.labels[index];
      if (this.documents[label] && this.documents[label].length > 0) {
        var document = this.documents[label].find((doc) => doc._id === uuid);
        if (document) {
          return document;
        }
      }
    }
    return null;
  },

  //////////////////////////
  // Méthodes de service
  //////////////////////////

  /**
   * Obtenir la liste des documents
   * 
   * @typedef {Object} documents
   * @property {Object} documents.drawing
   * @property {Object} documents.compute
   * @property {Object} documents.carte
   * @property {Object} documents.import
   * @property {Object} documents.service
   * 
   * @returns {Promise} - Liste des documents
   */
  getDocuments: async function () {
    var promises = [];
    for (let index = 0; index < this.labels.length; index++) {
      const label = this.labels[index];
      promises.push(this.getDocumentsByLabel(label));
    }
    return Promise.allSettled(promises);
  },

  /**
   * Obtenir la liste des documents filtrée
   * 
   * @example
   * curl -X 'GET' \
   * 'https://data.geopf.fr/api/users/me/documents?owned=true&shared=false&labels=cartes.gouv.fr&page=1&limit=10' \
   * -H 'accept: application/json' \
   * -H 'Authorization: Bearer ....
   * 
   * @param {*} label 
   * @returns {Promise} - Liste des documents filtrée
   */
  getDocumentsByLabel: async function (label) {
    if (!this.labels.includes(label)) {
      return Promise.reject("Label filter not allowed !");
    }

    const emitter = this.getEmitter ? this.getEmitter() : null;

    try {
      var page = 1;
      var limit = LIMIT_PER_PAGE;
      var data = [];
      var total = null;

      while (true) {
        var response = await this._getDocumentsByLabelPerPage(label, page, limit);
        data = data.concat(response.data);

        // On récupère le total à partir du header Content-Range
        if (Number.isFinite(response.total)) {
          total = response.total;
        }

        // Si aucune donnée n'est retournée, on arrête la pagination
        if (response.data.length === 0) {
          break;
        }

        // Si le total est connu et que nous avons récupéré tous les documents, on arrête la pagination
        if (Number.isFinite(total) && data.length >= total) {
          break;
        }

        // Fallback si le header n'est pas exposé/correct.
        if (!Number.isFinite(total) && response.data.length < limit) {
          break;
        }

        // On passe à la page suivante
        page += 1;
      }

      this.documents[label] = data.sort((a, b) => a.update.localeCompare(b.update, "fr", { sensitivity: "base" }));

      this.saveStore();
  
      if (emitter) {
        emitter.dispatchEvent("service:documents:completed", {
          label : label,
          data : data,
          total : total
        });
      }

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération des documents pour le label ${label} :`, error);
      this.throwError(error);
    }
  },

  /**
   * Obtenir la liste des documents pour un label donné, paginée
   * @param {*} label 
   * @param {*} page 
   * @param {*} limit 
   * @returns {Promise} - Liste des documents pour un label donné, paginée
   * @private
   */
  _getDocumentsByLabelPerPage: async function (label, page = 1, limit = LIMIT_PER_PAGE) {
    if (!this.labels.includes(label)) {
      return Promise.reject("Label filter not allowed !");
    }

    try {
      var params = [
        "owned=true",
        "shared=false",
        `page=${page}`,
        `limit=${limit}`
      ];
      var kvp = `${params.join('&')}&labels=${this.tag}&labels=${label}`;
      var response = await this.getFetch()(`${this.api}/users/me/documents?${kvp}`, {
        method: 'GET',
        headers: {
          "X-Requested-With" : "XMLHttpRequest"
        }
      });
      var data = await response.json();
      var contentRange = response.headers.get("Content-Range") || response.headers.get("content-range");
      var total = null;

      if (contentRange) {
        var match = contentRange.match(/^(\d+)-(\d+)\/(\d+|\*)$/);
        if (match && match[3] !== "*") {
          total = Number.parseInt(match[3], 10);
        }
      }

      return {
        data,
        total,
        contentRange
      };
    } catch (error) {
      console.error(`Erreur lors de la récupération des documents pour le label ${label} :`, error);
      this.throwError(error);
    }
  },
  
  /**
   * Obtenir des informations sur le document
   * 
   * On surcharge la reponse avec d'autres informations (champ extra):
   * - id (short)
   * - date
   * - format
   * - target
   * - compute
   * 
   * @todo eviter une requête si l'information est disponible dans le store
   * @param {*} id 
   * @returns {Promise} - Information du document
   */
  getDocumentById: async function (id) {
    try {
      var response = await this.getFetch()(`${this.api}/users/me/documents/${id}`, {
        method: 'GET',
        headers: {
          "X-Requested-With" : "XMLHttpRequest"
        }
      });
      var data = await response.json();
  
      // on ajoute des informations utiles sous forme de key/value
      // à partir des labels
      const extra = (labels) => {
        return {
          id: id.split('-').slice(-1)[0], // short id
          format: this.labelsFormats.find((e) => labels.includes(e)),
          target: this.labelsTarget.find((e) => labels.includes(e)),
          compute: this.labelsCompute.find((e) => labels.includes(e)),
          kind: this.labelsService.find((e) => labels.includes(e)),
          date: new Date().toLocaleDateString()
        }
      };
  
      var document = {};
      var founded = false;
      for (let i = 0; i < this.labels.length; i++) {
        if (founded) {
          break;
        }
        const label = this.labels[i];
        if (!this.documents[label] || this.documents[label].length === 0) {
          console.warn(`Aucun document trouvé pour le label ${label} dans le store !`); 
          continue;
        }
        for (let j = 0; j < this.documents[label].length; j++) {
          document = this.documents[label][j];
          if (document._id === data._id) {
            document.labels = data.labels;
            document.description = data.description;
            document.mime_type = data.mime_type;
            document.public_url = data.public_url;
            document.extra = {
              ...extra(data.labels), // FIXME les extras additionnels ne sont pas enregistrés sur l'entrepot !
              ...data.extra
            };
            founded = true;
            break;
          }
        }
      }
  
      if (!founded) {
        return Promise.reject(`Le document (${id}) n'a pas été trouvé !`);
      }
  
      this.saveStore();
  
      return document;
    } catch (error) {
      console.error(`Erreur lors de la récupération du document avec l'id ${id} :`, error);
      this.throwError(error);
    }
  },

  /**
   * Obtenir un fichier
   * 
   * En fonction du content-type, on retourne le contenu 
   * au format texte ou json
   * 
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getFileById: async function (id) {
    try {
      var response = await this.getFetch()(`${this.api}/users/me/documents/${id}/file`, {
        method: 'GET',
        cache: "no-store",
        headers: {
          "X-Requested-With" : "XMLHttpRequest"
        }
      });
      var type = response.headers.get("content-type");
      var data = null;
      if (type === "application/json") {
        data = await response.json();
      } else {
        data = await response.text();
      }
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du fichier avec l'id ${id} :`, error);
      this.throwError(error);
    } finally {
      this.stopPending();
    }
  }
};

Object.assign(Documents, GetDocuments);
Object.assign(Documents, SetDocuments);

export default Documents;
