import { useServiceStore } from '@/stores/serviceStore';
/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @todo completer "documents" à chaque enregistrement d'une donnée
 * @fixme gestion de la pagination
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
    "external"
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
          element = data;
          founded = true;
          break;
        }
      }
      
    }

    if (! founded) {
      return Promise.reject(`Document (${id}) not founded !`);
    }

    var store = useServiceStore();
    store.setService(this);
    
    return data;
  },

  getDrawing : async function (id) {},
  setDrawing : async function (data) {},
  getImport : async function (id) {},
  setImport : async function (data) {},
  getCompute : async function (id) {},
  setCompute : async function (data) {},

  getCartes : async () => {},
  setCartes : async () => {}

};

export default Documents;