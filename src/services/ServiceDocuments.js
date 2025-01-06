import { useServiceStore } from '@/stores/serviceStore';
/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @todo completer "this.documents" à chaque enregistrement d'une donnée
 * @fixme gestion de la pagination
 * @fixme la migration ne differencie pas un import d'un compute, à faire coté client !
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
  otherLabels : [
    "geojson", 
    "gpx", 
    "kml", 
    "mapbox", 
    "wms", 
    "wmts",
    "internal",
    "external",
    "isochron", // TODO ...
    "route" // TODO ...
  ],

  /**
   * Obtenir la liste des documents
   * 
   * @doc
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
   * @param {*} id 
   * @returns {Promise} - Information du document
   */
  getDocumentById : async function (id) {
    var response = await this.getFetch().fetch(`${this.api}/users/me/documents/${id}`, {
      method: 'GET'
    });
    var data = await response.json();

    var founded = false;
    for (let i = 0; i < this.labels.length; i++) {
      if (founded) {
        break;
      }
      const label = this.labels[i];
      for (let j = 0; j < this.documents[label].length; j++) {
        var element = this.documents[label][j];
        if (element._id === data._id) {
          element.labels = data.labels;
          element.description = data.description;
          element.mime_type = data.mime_type;
          element.extra = data.extra; // ?
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
    
    return data;
  },

  getFileById : async function (id) {
    var response = await this.getFetch().fetch(`${this.api}/users/me/documents/${id}/file`, {
      method: 'GET'
    });
    var data = await response.text();
    return data;
  },

  /**
   * Obtenir un croquis (téléchargement)
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
   * @todo analyse du contenu pour savoir si cet import est du type 'compute'
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getImport : async function (id) {
    return await this.getFileById(id);
  },
  setImport : async function (data) {},

  /**
   * Obtenir un calcul (téléchargement)
   * 
   * @todo analyse du contenu pour connaitre le type de calcul : isochrone ou itineraire
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
   * Le contenu est un parametrage technique du service.
   * 
   * @todo analyse du contenu pour connaitre le type de service : wms, wmts ou mapbox
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getService : async function (id) {},
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