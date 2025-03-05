import Users from '@/services/ServiceUsers';
import Documents from '@/services/ServiceDocuments';

import { useServiceStore } from '@/stores/serviceStore';

const IAM_AUTH_MODE = import.meta.env.IAM_AUTH_MODE;

class ServiceBase {

  #fetch

  constructor(options) {
    options = options || {};

    /** authentification */
    this.authenticated = options.authenticated || false;
    
    /** user */
    this.user = options.user || {};
    /** documents */
    this.documents = options.documents || {};
    /** erreurs IAM */
    this.error = options.error || {};

    /** mode local ou remote */
    this.mode = options.mode || IAM_AUTH_MODE;

    this.url = encodeURI(location.origin + import.meta.env.BASE_URL);
    this.api = null;

    // variables à instancier !
    this.#fetch = null;

    return this;
  }

  /**
   * Get Fetch
   * @returns {Object} - fetch
   */
  getFetch () {
    return this.#fetch;
  }

  /**
   * Set Fetch
   * @param {Object} fetch 
   */
  setFetch (fetcher) {
    this.#fetch = fetcher;
  }

  async isAccessValided () {
    // Enregistrement du statut par defaut dans le storage 
    var store = useServiceStore();
    store.setService(this);
    Promise.resolve();
  }
  async getAccessLogin () {
    Promise.reject('this must be overridden !');
  }
  async getAccessLogout () {
    Promise.reject('this must be overridden !');
  }
  async getAccessToken () {
    Promise.reject('this must be overridden !');
  }
}

// Mixin
Object.assign(ServiceBase.prototype, Users);
Object.assign(ServiceBase.prototype, Documents);

export default ServiceBase;