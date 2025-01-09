import { useServiceStore } from '@/stores/serviceStore';
/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @todo gestion de la pagination
 * 
 * @see env
 * @example
 * import Documents from '@/services/serviceDocuments';
 * // requêtes
 * Documents.getDocuments();
 * Documents.getDocumentsByLabel();
 * Documents.getDocumentById();
 * Documents.getDrawing(id);
 * Documents.setDrawing(data);
 * Documents.getImport(id);
 * Documents.setImport(data);
 * Documents.getCompute(id);
 * Documents.setCompute(data);
 * Documents.getService(id);
 * Documents.setService(data);
 * Documents.getCartes();
 * Documents.setCartes();
 * ...
 * // propriétés
 * Documents.documents;
 * ...
 */

var Documents = {
  /**
   * Label obligatoire pour les documents du Portail
   */
  tag : "cartes.gouv.fr",

  /**
   * Liste des méta informations (labels) possible par thématique
   */
  labels : [
    "drawing",
    "import",
    "compute",
    "service",
    "carte"
  ],
  
  /**
   * Autre méta informations possible
   */
  labelsFormats : [
    "geojson", 
    "gpx", 
    "kml", 
    "mapbox", 
    "wms", 
    "wmts"
  ],
  
  labelsTarget : [
    "internal",
    "external"
  ],
  
  labelsCompute : [
    "isochron",
    "route",
    "profil" 
  ],

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
  getDocuments : async function () {
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
   * @fixme pagination des resultats !
   * @param {*} label 
   * @returns {Promise} - Liste des documents filtrée
   */
  getDocumentsByLabel : async function (label) {
    if (! this.labels.includes(label)) {
      return Promise.reject("Label filter not allowed !");
    }

    var params = [
      "owned=true",
      "shared=false",
      "page=1",
      "limit=100"
    ];
    var kvp = `${params.join('&')}&labels=${this.tag}&labels=${label}`;
    var response = await this.getFetch().fetch(`${this.api}/users/me/documents?${kvp}`, {
      method: 'GET'
    });
    var data = await response.json();
    this.documents[label] = data;

    var store = useServiceStore();
    store.setService(this);
    
    return data;
  },

  /**
   * Obtenir des informations sur le document
   * 
   * On surcharge la reponse avec d'autres informations (champ extra):
   * - date
   * - format
   * - target
   * - compute
   * 
   * @todo eviter une requête si l'information est disponible dans le store
   * @param {*} id 
   * @returns {Promise} - Information du document
   */
  getDocumentById : async function (id) {
    var response = await this.getFetch().fetch(`${this.api}/users/me/documents/${id}`, {
      method: 'GET'
    });
    var data = await response.json();

    // on ajoute des informations utiles sous forme de key/value
    // à partir des labels
    const extra = (labels) => {
      return {
        format : this.labelsFormats.find((e) => labels.includes(e)),
        target : this.labelsTarget.find((e) => labels.includes(e)),
        compute : this.labelsCompute.find((e) => labels.includes(e))
      }
    };

    var document = {};
    var founded = false;
    for (let i = 0; i < this.labels.length; i++) {
      if (founded) {
        break;
      }
      const label = this.labels[i];
      for (let j = 0; j < this.documents[label].length; j++) {
        document = this.documents[label][j];
        if (document._id === data._id) {
          document.labels = data.labels;
          document.description = data.description;
          document.mime_type = data.mime_type;
          document.extra = {
            ...data.extra,
            ...extra(data.labels)
          };
          founded = true;
          break;
        }
      }
    }

    if (! founded) {
      return Promise.reject(`Le document (${id}) n'a pas été trouvé !`);
    }

    var store = useServiceStore();
    store.setService(this);
    
    return document;
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
  getFileById : async function (id) {
    var response = await this.getFetch().fetch(`${this.api}/users/me/documents/${id}/file`, {
      method: 'GET'
    });
    var type = response.headers.get("content-type");
    var data = null;
    if (type === "application/json") {
      data = await response.json();
    } else {
      data = await response.text();
    }
    return data;
  },

  /**
   * Obtenir un croquis (téléchargement)
   * 
   * On retourne le contenu au format texte
   * car le contenu est toujours en XML
   * 
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getDrawing : async function (id) {
    return await this.getFileById(id);
  },
  setDrawing : async function (data) {},

  /**
   * Obtenir un import (téléchargement)
   * 
   * On retourne le contenu au format texte ou json 
   * en fonction du format.
   * 
   * @todo analyse du contenu pour savoir si cet import est du type 'compute'
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getImport : async function (id) {
    var promise = null;

    var data = await this.getFileById(id);

    var store = useServiceStore();
    var storage = store.getService();
    var document = storage.documents.import.find((doc) => doc._id === id);
    // 2 cas : "internal" ou "external"
    if (document.labels.includes("internal")) {
      promise = new Promise((resolve, reject) => {
        resolve(data); // retourne un texte ou json !
      });
    }
    if (document.labels.includes("external")) {
      promise = new Promise((resolve, reject) => {
        resolve(data.url); // retourne une string !
      });
    }
    // exception
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        reject("Exception pour récuperer le fichier !!!");
      });
    }
    return promise;
  },
  setImport : async function (data) {},

  /**
   * Obtenir un calcul (téléchargement)
   * 
   * On retourne toujours le contenu au format JSON
   * 
   * @todo analyse du contenu pour connaitre le type de calcul : 
   *   isochrone, profil altimétrique ou itineraire
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getCompute : async function (id) {
    return await this.getFileById(id);
  },
  setCompute : async function (data) {},

  /**
   * Obtenir un service (téléchargement)
   * 
   * Les 3 services : 
   * - wms
   * - wmts
   * - mapbox
   * 
   * Le contenu est un parametrage technique du service.
   * Le format est en JSON.
   * 
   * Pour le format MapBox, on a soit :
   * - une url vers le style
   * - un fichier JSON de style
   * Le format est du texte pour l'url, sinon au format JSON.
   * 
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getService : async function (id) {
    var promise = null;

    var data = await this.getFileById(id);

    var store = useServiceStore();
    var storage = store.getService();
    var document = storage.documents.service.find((doc) => doc._id === id);

    if (document.labels.includes("wmts") || document.labels.includes("wms")) {
      // on est forcement en "external" !
      promise = new Promise((resolve, reject) => {
        resolve(data); // retourne un json de parametres !
      });
    }
    if (document.labels.includes("mapbox")) {
      // 2 cas : "internal" ou "external"
      if (document.labels.includes("internal")) {
        promise = new Promise((resolve, reject) => {
          resolve(data); // retourne un json !
        });
      }
      if (document.labels.includes("external")) {
        promise = new Promise((resolve, reject) => {
          resolve(data.url); // retourne une string !
        });
      }
    }
    // exception
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        reject("Exception pour récuperer le fichier !!!");
      });
    }
    return promise;
  },
  setService : async function (data) {},

  /**
   * Obtenir la liste des cartes (téléchargement)
   * 
   * Le contenu est une liste de permaliens sous forme
   * de clef/valeur.
   * 
   * @todo analyse du contenu pour savoir si cet import est du type 'compute'
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getCartes : async () => {},
  setCartes : async () => {}

};

export default Documents;