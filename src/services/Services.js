import { OAuth2Client, OAuth2Fetch } from '@badgateway/oauth2-client';

import Connexion from '@/services/ServiceConnection';
import Users from '@/services/ServiceUsers';
import Documents from '@/services/ServiceDocuments';

import { useServiceStore } from '@/stores/serviceStore';

// INFO
// recuperation des informations sur l'env
const IAM_URL = import.meta.env.IAM_URL;
const IAM_REALM = import.meta.env.IAM_REALM;
const IAM_CLIENT_ID = import.meta.env.IAM_CLIENT_ID;
const IAM_CLIENT_SECRET = import.meta.env.IAM_CLIENT_SECRET; 

/**
 * @description 
 * Classe de service de connexion à la geoplateforme
 * cf. {@link https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type}
 * ou {@link https://stackoverflow.blog/2022/04/14/the-authorization-code-grant-in-excruciating-detail/#h2-97e8b796eefc0}
 * ou {@link https://www.ory.sh/docs/oauth2-oidc/authorization-code-flow}
 * 
 * @see env
 * @example
 * import Services from '@/services/Services';
 * var service = new Services(options);
 * // requêtes
 * service.getAccessLogin();
 * service.getAccessToken();
 * service.getAccessLogout();
 * ...
 * // propriétés
 * service.authenticated;
 * service.token;
 * service.state;
 * ...
 */
class Services {

  /** Constructeur */
  constructor (options) {

    this.options = options || {};

    /** authentification */
    this.authenticated = this.options.authenticated || false;
    /** state session */
    this.session = this.options.session || "";
    /** code verificated */
    this.codeVerifier = this.options.codeVerifier || "";
    /** code */
    this.code = this.options.code || "";
    /** token */
    this.token = this.options.token || "";
    /** user */
    this.user = this.options.user || {};
    /** erreurs IAM */
    this.error = this.options.error || {};
    
    // à instancier !
    this.client = null;
    this.fetchWrapper = null;
    this.url = null;

    this.#initialize();

    return this;
  }

  /**
   * Initialisation du client oauth
   */
  #initialize () {
    this.url = encodeURI(location.origin + import.meta.env.BASE_URL);
    var settings = this.options.client ? this.options.client.settings : {
      server: `${IAM_URL}`,

      clientId: `${IAM_CLIENT_ID}`,
      clientSecret: `${IAM_CLIENT_SECRET}`,
      index: `${IAM_REALM}`,

      tokenEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/token`,
      authorizationEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/auth`,
      discoveryEndpoint: `/realms/${IAM_REALM}/.well-known/openid-configuration`,
      revocationEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/revoke`
    };

    this.client = new OAuth2Client(settings);
    this.fetchWrapper = new OAuth2Fetch({
      client: this.client,
      getNewToken: async () => {
        var token = await this.client.authorizationCode.getToken({
            code: this.code,
            redirectUri: this.url,
            code_verifier: this.codeVerifier
        });
        return token;
      },
      storeToken: (token) => {
        this.token = token;
        this.addTokenStorage();
      },
      getStoredToken: () => {
        const token = this.getTokenStorage();
        if (token) {
          return token;
        }
        return null;
      },
      onError: (e) => {
        console.error(e);
      }
    });
  }

  /**
   * Permet de valider la connexion en obtenant un token
   */
  isAccessValided () {
    var store = useServiceStore();
    // si login via IAM, on récupère le code dans l'url
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    // parametres
    var code = urlParams.get('code');
    var session = urlParams.get('session_state');
    var error = urlParams.get('error');

    var status = null;
    // IAM login
    if (code && session) {
      this.session = session;
      this.code = code;
      this.authenticated = true;
      status = "login";
    }
    // IAM logout
    if (!code && session && session === this.session) {
      this.session = null;
      this.code = null;
      this.authenticated = false;
      this.token = null;
      this.removeTokenStorage();
      this.user = {};
      this.error = {};
      status = "logout";
    }
    // Error
    if (error) {
      this.error = {
        name: error,
        message: urlParams.get('error_description')
      };
      return Promise.reject(this.error);
    }
    // enregistrement dans le storage du statut de la connexion
    store.setService(this);

    return Promise.resolve(status);
  }
};

// Mixin
Object.assign(Services.prototype, Connexion);
Object.assign(Services.prototype, Users);
Object.assign(Services.prototype, Documents);

export default Services;