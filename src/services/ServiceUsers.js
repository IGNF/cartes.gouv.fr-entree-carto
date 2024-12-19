import { useServiceStore } from '@/stores/serviceStore';

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
   * @type {Object}
   * @returns {Promise} - ...
   */
  getUserMe : async function () {
    var response = await this.getFetch().fetch('https://data.geopf.fr/api/users/me', {
      method: 'GET'
    });
    var data = await response.json();
    this.user = data;

    var store = useServiceStore();
    store.setService(this);
    
    return data;
  }
};

export default Users;