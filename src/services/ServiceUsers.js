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
   * Obtenir les informations de l'utilisateur
   * Ceci afin d'y afficher dans l'interface : prénom - nom 
   * 
   * @param {String} token - jeton d'authentification
   * @returns {Promise} - ...
   */
  getUserMe : function (token) {
    var url = `https://data.geopf.fr/api/users/me`;
    var settings = {
      method : "GET",
      headers : {
        "Authorization" : `Bearer ${token}`,
        "Accept" : "application/json"
      },
      mode : 'cors',
      // credentials : "same-origin"
    };

    return useRequest(url, settings);
  }
};

export default Users;