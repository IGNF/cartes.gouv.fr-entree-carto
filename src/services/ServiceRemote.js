import ServiceBase from "@/services/ServiceBase";

import { useServiceStore } from '@/stores/serviceStore';

import { inject } from 'vue';

const IAM_REDIRECT_REMOTE = import.meta.env.IAM_REDIRECT_REMOTE;

const IAM_ENTREPOT_API_URL_REMOTE = import.meta.env.IAM_ENTREPOT_API_URL_REMOTE;

class ServiceRemote extends ServiceBase {

  constructor(options) {
    super(options);

    this.api = IAM_ENTREPOT_API_URL_REMOTE;
    this.setFetch(window.fetch);

    return this;
  }

  async isAccessValided () {
    const emitter = inject('emitter');
    var store = useServiceStore();

    const bLogin = location.href.includes("login");
    console.log("route login ?", bLogin, location.href);

    // si IAM, on récupère les informations dans l'url
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    // parametres
    var auth_failed = urlParams.get('authentication_failed'); // utilisé ?
    var auth_success = urlParams.get('success');

    var promise = null;
    var status = "no-auth";

    // IAM login distant
    if (bLogin && auth_success !== null) {
      if (parseInt(auth_success, 10)) {
        this.authenticated = true;
        status = "login";
        try {
          const user = await this.getUserMe();
          console.debug(user);
          emitter.dispatchEvent("service:user:loaded", {
            bubbles: true,
            detail: user
          });

          const documents = await this.getDocuments();
          console.debug(documents);
          emitter.dispatchEvent("service:documents:loaded", {
            bubbles: true,
            detail: documents
          });

          promise = Promise.resolve(status);
        } catch (e) {
          console.error('Error:', e);
          promise = Promise.reject('Error to get user info or documents (' + e.message + ')');
        };
      } else {
        promise = Promise.reject("Erreur inattendue !");
      }
    }

    // IAM logout
    if (!bLogin && auth_success !== null) {
      this.authenticated = false;
      this.user = {};
      this.documents = {};
      this.error = {};
      status = "logout";
      promise = Promise.resolve(status);
    }
    
    if (auth_failed !== null) {
      promise = Promise.reject("Erreur inattendue !");
    }
    
    // enregistrement dans le storage du statut de la connexion
    store.setService(this);
    return promise || Promise.resolve(status);
  }

  async getAccessLogin() {
    return `${IAM_REDIRECT_REMOTE}/login?app=entree-carto`;
  }

  async getAccessLogout() {
    return `${IAM_REDIRECT_REMOTE}/logout?app=entree-carto`;
  }

  async getAccessToken() {
    // Implémentation de la méthode getAccessToken si nécessaire
  }
}

export default ServiceRemote;
