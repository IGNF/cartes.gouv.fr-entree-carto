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
 * ...
 */

var Users = {

  /**
   * Obtenir les informations de l'utilisateur
   * Ceci afin d'y afficher dans l'interface : prénom - nom 
   * 
   * @fixme la réponse n'est pas la bonne !?
   * @param {String} token - jeton d'authentification
   * @returns {Promise} - ...
   */
  getUserMe : async function (token) {
    var url = `https://data.geopf.fr/api/users/me`;
    var settings = {
      method : "GET",
      headers : {
        "Authorization" : `Bearer ${token}`,
        "Accept" : "application/json"
      },
      mode : 'cors'
    };

    var self = this;
    const data = await useRequest(url, settings);
    self.user = data;
  }
};

export default Users;