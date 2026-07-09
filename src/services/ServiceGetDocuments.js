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
   * @fixme Analyse du contenu via un schema pour savoir si c'est un croquis
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getDrawing : async function (id) {
    // Analyse de la reponse pour determiner si c'est un bien un croquis !
    return await this.getFileById(id);
  },

  /**
   * Obtenir un import (téléchargement)
   * 
   * On retourne le contenu au format texte ou json 
   * en fonction du format.
   * 
   * @todo analyse du contenu via un schema pour savoir si c'est un import
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getImport : async function (id) {
    var promise = null;

    // FIXME analyse de la reponse pour determiner si c'est un bien un import !
    var data = await this.getFileById(id);

    var store = useServiceStore();
    var storage = store.getService();
    var document = storage.documents.import.find((doc) => doc._id === id);
    var none = true;
    // 3 cas : "internal" ou "external" ou aucun
    if (document.labels.includes("internal")) {
      none = false;
      promise = new Promise((resolve, /* reject */) => {
        resolve(data); // retourne un texte ou json !
      });
    }
    if (document.labels.includes("external")) {
      none = false;
      promise = new Promise((resolve, /* reject */) => {
        resolve(data.url); // retourne une string !
      });
    }
    if (none) {
      promise = new Promise((resolve, /* reject */) => {
        resolve(data); // retourne un texte ou json !
      });
    }

    // exception
    if (!promise) {
      promise = new Promise((/* resolve, reject */) => {
        // reject("Exception pour récuperer le fichier !!!");
      });
    }
    return promise;
  },

  /**
   * Obtenir un calcul (téléchargement)
   * 
   * On retourne toujours le contenu au format GeoJSON
   * 
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getCompute : async function (id) {
    // Analyse de la reponse pour determiner si c'est un bien un calcul !
    // Un compute est forcement un GeoJSON avec une property global : "geoportail:compute"
    // La property "geoportail:compute" contient un objet avec la propriété "type" qui peut être : 
    // "isochrone", "profil" ou "route | itineraire"
    var promise = null;
    var data = await this.getFileById(id);
    if (typeof data === "string") {
      try {
        // eslint-disable-next-line secure-coding/no-xxe-injection -- schéma validé dans la promise
        data = JSON.parse(data);
      } catch {
        return Promise.reject("Le contenu du calcul n'est pas un JSON valide");
      }
    }
    promise = new Promise((resolve, reject) => {
      if (!data || typeof data !== "object") {
        reject("Le contenu du calcul est invalide");
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(data, "geoportail:compute") || !data["geoportail:compute"]) {
        reject("La propriété 'geoportail:compute' est introuvable dans les données");
        return;
      }
      resolve(data); // retourne un json !
    });

    return promise;
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
   * @fixme Analyse du contenu via un schema pour savoir si c'est un service wms, wmts ou mapbox
   * @param {*} id 
   * @returns {Promise} - Le contenu du fichier
   */
  getService : async function (id) {
    var promise = null;

    var data = await this.getFileById(id);
    if (typeof data === "string") {
      try {
        // eslint-disable-next-line secure-coding/no-xxe-injection -- schéma validé dans la promise
        data = JSON.parse(data);
      } catch {
        return Promise.reject("Le contenu du service n'est pas un JSON valide");
      }
    }
    var store = useServiceStore();
    var storage = store.getService();
    var document = storage.documents.service.find((doc) => doc._id === id);

    if (!data || typeof data !== "object") {
      return Promise.reject("Le contenu du service est invalide");
    }

    // on est forcement en "external" !
    if (document.labels.includes("wmts") || document.labels.includes("wms")) {
      document.labels.push("json"); // forcer le format json pour les services classiques
      promise = new Promise((resolve, /* reject */) => {
        // FIXME pas possible de contrôler le contenu du fichier, on retourne le json de parametres
        resolve(data); // retourne un json de parametres !
      });
    }
    if (document.labels.includes("mapbox")) {
      // 2 cas : "internal" ou "external"
      if (document.labels.includes("internal")) {
        promise = new Promise((resolve, /* reject */) => {
          // FIXME pas possible de contrôler le contenu du fichier, on retourne le json de style
          resolve(data); // retourne un json !
        });
      }
      if (document.labels.includes("external")) {
        promise = new Promise((resolve, reject) => {
          if (!Object.prototype.hasOwnProperty.call(data, "url") || !data.url) {
            reject("L'url du service mapbox est introuvable dans les données");
            return;
          }
          resolve(data.url); // retourne une string !
        });
      }
    }
    // exception
    if (!promise) {
      promise = new Promise((/* resolve, */ reject) => {
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
      try {
        // eslint-disable-next-line secure-coding/no-xxe-injection -- schéma validé dans la promise
        data = JSON.parse(data);
      } catch {
        return Promise.reject("Le contenu des cartes n'est pas un JSON valide");
      }
    }
    var promise = new Promise((resolve, reject) => {
      if (!data || typeof data !== "object") {
        reject("Le contenu des cartes est invalide");
        return;
      }
      if (!Object.prototype.hasOwnProperty.call(data, "permalink") || !data.permalink) {
        reject("Le permalink est introuvable dans les données");
        return;
      }
      resolve(data.permalink); // retourne une string !
    });
    return promise;
  }

};

export default GetDocuments;