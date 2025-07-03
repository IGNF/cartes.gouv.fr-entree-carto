import Users from '@/services/ServiceUsers';
import Documents from '@/services/ServiceDocuments';

import { useServiceStore } from '@/stores/serviceStore';

const IAM_AUTH_MODE = import.meta.env.IAM_AUTH_MODE;

class ServiceBase {

  #fetch
  #pending

  /**
   * Constructor for ServiceBase
   * @param {*} options 
   * @returns {Object} - Instance of ServiceBase
   * @description
   * This class serves as a base for services that require user authentication 
   * and document management.
   * It initializes the service with options such as 
   * authentication status, user information, documents, and error handling.
   * It also sets the mode of operation (local or remote) and prepares the API URL.
   * The class includes methods for managing user access, such as checking 
   * if access is valid, getting login/logout information, and retrieving access tokens.
   */
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

    this.#pending = false;

    return this;
  }

  /**
   * Get Fetch
   * @returns {Object} - fetch
   */
  getFetch () {
    this.#pending = true;
    return this.#fetch;
  }

  /**
   * Set Fetch
   * @param {Object} fetch 
   */
  setFetch (fetcher) {
    this.#fetch = fetcher;
  }

  /**
   * Save the current service state to the store
   * @description
   * This method saves the current state of the service instance
   * to the service store. It is typically called after any changes
   * to the service's properties to ensure that the latest state is persisted.
   * @returns {void}
   * @example 
   * // Usage:
   * const service = new ServiceBase();
   * service.saveStore();
   */
  saveStore () {
    var store = useServiceStore();
    store.setService(this);
    this.#pending = false;
  }

  /**
   * Throw an error
   * @param {*} error 
   */
  throwError (error) {
    this.#pending = false;
    throw error;
  }

  /**
   * Check if the service is pending
   * @returns {boolean} - true if pending, false otherwise
   */
  isPending () {
    return this.#pending;
  }
  
  /**
   * Stop the pending state
   * @description
   * This method sets the pending state of the service to false,
   * indicating that the service is no longer in a pending state.
   * It is typically called when an operation is completed or cancelled.
   * @returns {void}
   */
  stopPending () {
    this.#pending = false;
  }

  /**
   * Check if the access is valid
   * @returns {Promise} - Promise that resolves if access is valid, rejects otherwise
   */
  async isAccessValided () {
    // Enregistrement du statut par defaut dans le storage 
    this.saveStore();
    Promise.resolve();
  }
  /**
   * Get the access login
   * @returns {Promise} - Promise that resolves with the access login
   */
  async getAccessLogin () {
    Promise.reject('this must be overridden !');
  }
  /**
   * Get the access logout
   * @returns {Promise} - Promise that resolves with the access logout
   */
  async getAccessLogout () {
    Promise.reject('this must be overridden !');
  }
  /**
   * Get the access token
   * @returns {Promise} - Promise that resolves with the access token
   */
  async getAccessToken () {
    Promise.reject('this must be overridden !');
  }
  async isAuthentificate () {
    var data = await this.getUserMe();
    return (data !== null);
  }
}

// Mixin
Object.assign(ServiceBase.prototype, Users);
Object.assign(ServiceBase.prototype, Documents);

export default ServiceBase;