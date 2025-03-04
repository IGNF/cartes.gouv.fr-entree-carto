import { inject } from 'vue';
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
 * Users.user;
 */

var Users = {

  /**
   * Obtenir les informations de l'utilisateur
   * 
   * @doc
   * @typedef {Object} user
   * @property {String} user.last_name
   * @property {String} user.first_name
   * @property {String} user.email
   * @property {Number} user.documents_quota
   * @property {Number} user.documents_use
   * @returns {Object} - informations utilisateur
   */
  getUser : function () {
    return this.user;
  },

  /**
   * Obtenir les informations de l'utilisateur
   * afin de les afficher dans l'interface : prénom - nom 
   * 
   * @type {Object}
   * @returns {Promise} - ...
   */
  getUserMe : async function () {
    var response = await this.getFetch()(`${this.api}/users/me`, {
      method: 'GET',
      headers: {
        "X-Requested-With" : "XMLHttpRequest"
      }
    });
    var data = await response.json();
    this.user = data;
    
    var store = useServiceStore();
    store.setService(this);

    return data;
  },

  /**
   * Obtenir les informations sur la taille du volume des documents
   * Si la taille des documents depasse 80%, une alerte est ajoutée
   * 
   * @returns {Object} - infos { size:10000, ratio:10, alert:false }
   */
  getUserSize : function () {
    if (!this.user) {
      return;
    }
    var quota = this.user.documents_quota;
    var use = this.user.documents_use;
    var ratio = Math.round((100 * use) / quota);
    var alert = (ratio > 80);
    return {
      size : quota - use,
      ratio : ratio,
      alert : alert
    };
  }
};

export default Users;
