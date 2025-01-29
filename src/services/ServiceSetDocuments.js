import { useServiceStore } from '@/stores/serviceStore';
import { useBusEvent } from '@/plugins/BusEvent';

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
   * Enregistrer ou mettre à jour un croquis
   * 
   * Appels de l'API Entrepôt :
   * - POST /users/me/documents
   * - PUT /users/me/documents/{document}
   * - DELETE /users/me/documents/{document}
   * - PATCH /users/me/documents/{document}
   * 
   * Actions :
   * - enregistrer la réponse dans le localStorage : service.documents.drawing
   * - retourner le UUID et le type d'action
   * 
   * @param {Object} data 
   * @property {Object} data.layer - layer
   * @property {String} data.content - export
   * @property {String} data.name - name
   * @property {String} data.description - description
   * @property {String} data.format - format : kml, geojson, ...
   * @returns {Promise} - { UUID, action : added, updated, deleted }
   */
  setDrawing : async function (data) {
    var uuid = "54545454-54-54-54-54545454";
    // mise à jour de l'ID interne de la couche
    data.layer.gpResultLayerId = `bookmark:${data.format}:${uuid}`;
    this.documents.drawing.push({
      "name": "test.kml",
      "size": 2621,
      "_id": "54545454-54-54-54-54545454"
    });
    return Promise.resolve({
      uuid : uuid
    });
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