import ServiceBase from "@/services/ServiceBase";

import { useServiceStore } from '@/stores/serviceStore';

const IAM_REDIRECT_REMOTE = import.meta.env.IAM_REDIRECT_REMOTE;

const IAM_ENTREPOT_API_URL_REMOTE = import.meta.env.IAM_ENTREPOT_API_URL_REMOTE;

class ServiceRemote extends ServiceBase {

  constructor(options) {
    super(options);

    this.api = IAM_ENTREPOT_API_URL_REMOTE;
    this.setFetch(fetch);

    return this;
  }

  async isAccessValided () {
    var store = useServiceStore();

    // si IAM, on récupère les informations dans l'url
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    // parametres
    var login_auth = urlParams.get('authentication_failed');
    var logout_auth = urlParams.get('success');

    var promise = null;
    var status = "no-auth";

    // IAM login distant
    if (login_auth !== null) {
      if (parseInt(login_auth, 10)) {
        promise = new Promise((resolve, reject) => {
          reject("Erreur inattendue !");
        });
      } else {
        this.authenticated = true;
        status = "login";
        // TODO 
        // on met en place une serie de promise chainées :
        // - getUserMe
        // - getDocuments
      }
    }

    // IAM logout
    if (logout_auth !== null) {
      this.authenticated = false;
      this.user = {};
      this.documents = {};
      this.error = {};
      status = "logout";
      promise = new Promise((resolve, reject) => {
        resolve(status);
      });
    }
    
    // enregistrement dans le storage du statut de la connexion
    store.setService(this);
    return promise || Promise.resolve(status);
  }

  async getAccessLogin () {
    return IAM_REDIRECT_REMOTE + "/login?app=entree-carto";
  }
  async getAccessLogout () {
    return IAM_REDIRECT_REMOTE + "/logout?app=entree-carto";
  }
  async getAccessToken () {}
}

export default ServiceRemote;