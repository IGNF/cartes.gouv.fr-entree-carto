import { useServiceStore } from '@/stores/serviceStore';

/**
 * @description 
 * Classe de service de gestion des documents utilisateurs
 * 
 * @see env
 * @example
 * import Documents from '@/services/serviceDocuments';
 * // requêtes
 * Documents.getDrawing(id);
 * Documents.getImport(id);
 * Documents.getCompute(id);.
 * Documents.getService(id);
 * Documents.getCartes();
 * ...
 * // propriétés
 * Documents.documents;
 * ...
 */

var GetDocuments = {

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
    var none = true;
    // 3 cas : "internal" ou "external" ou aucun
    if (document.labels.includes("internal")) {
      none = false;
      promise = new Promise((resolve, reject) => {
        resolve(data); // retourne un texte ou json !
      });
    }
    if (document.labels.includes("external")) {
      none = false;
      promise = new Promise((resolve, reject) => {
        resolve(data.url); // retourne une string !
      });
    }
    if (none) {
      promise = new Promise((resolve, reject) => {
        resolve(data); // retourne un texte ou json !
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

  /**
   * Obtenir la liste des cartes (téléchargement)
   * 
   * Le contenu est une liste de permaliens sous forme
   * de clef/valeur.
   * 
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getCartes : async function (id) {
    var data = await this.getFileById(id);
    if (typeof data === "string") {
      data = JSON.parse(data);
    }
    var promise = new Promise((resolve, reject) => {
      resolve(data.permalink); // retourne une string !
    });
    return promise;
  }

};

export default GetDocuments;