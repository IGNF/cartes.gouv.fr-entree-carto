import { useRequest } from '@/services/request';
/**
 * @description 
 * Classe de service de gestion des utilisateurs
 * 
 * @see env
 * @example
 * import Users from '@/services/serviceUsers';
 * // requêtes
 * Users.getUserMe();
 * ...
 * // propriétés
 * Users.info = {};
 */

var Users = {
  /** Informations utilisateur */
  info: null,
  
  /**
   * Obtenir les informations utilisateurs 
   * Ceci afin d'y afficher dans l'interface : prénom - nom 
   * 
   * @param {String} token - jeton d'authentification
   * @returns {Promise} - ...
   */
  getUserMe : (token) => {
    var url = `https://data.geopf.fr/api/users/me`;
    var settings = {
      method : "GET",
      headers : {
        "Authorization" : `Bearer ${token}`,
        "Accept" : "application/json"
      },
      mode : 'cors',
      credentials : "same-origin"
    };

    return import.meta.env.VITE_HTTP_SIMULE_REQUEST === "1" ? new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({
          "email": "jean-philippe.bazonnais@ign.fr",
          "creation": "2024-01-10T11:21:28.618783Z",
          "last_call": "2024-11-05T13:43:56.168033Z",
          "communities_member": [
              {
                  "rights": [
                      "UPLOAD",
                      "ANNEX",
                      "BROADCAST",
                      "PROCESSING"
                  ],
                  "community": {
                      "name": "Découverte",
                      "technical_name": "sandbox",
                      "datastore": "122b878c-aad8-4507-87b2-465e664467d3",
                      "supervisor": "e175d6c4-a03d-4ade-a769-86e8dd2bed58",
                      "public": false,
                      "_id": "78068951-cebc-4aec-869c-81677d211d0e"
                  }
              },
              {
                  "rights": [
                      "UPLOAD",
                      "PROCESSING",
                      "COMMUNITY",
                      "BROADCAST",
                      "ANNEX"
                  ],
                  "community": {
                      "name": "cartes.gouv.fr-config",
                      "technical_name": "cartes.gouv.fr-config",
                      "datastore": "5cb4fdb0-6f6c-4422-893d-e04564bfcc10",
                      "supervisor": "09e091dc-51d5-4c04-9637-3045df5ce477",
                      "public": false,
                      "_id": "f7d7279b-043f-413f-a3a3-317f1c6b5b07"
                  }
              }
          ],
          "documents_quota": 500000000,
          "documents_use": 8610,
          "keys_quota": 10,
          "keys_use": 0,
          "technical": false,
          "administrator": false,
          "_id": "09e091dc-51d5-4c04-9637-3045df5ce477",
          "last_name": "bazonnais",
          "first_name": "jean-philippe"
        });
      }, 300);
    }): useRequest(url, settings);
  }
};

export default Users;