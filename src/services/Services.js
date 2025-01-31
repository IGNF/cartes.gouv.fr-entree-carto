import { OAuth2Client, OAuth2Fetch } from '@badgateway/oauth2-client';

import Connexion from '@/services/ServiceConnection';
import Users from '@/services/ServiceUsers';
import Documents from '@/services/ServiceDocuments';

import { useServiceStore } from '@/stores/serviceStore';

import { inject } from 'vue';

// INFO
// recuperation des informations sur l'env
const IAM_URL = import.meta.env.IAM_URL;
const IAM_REALM = import.meta.env.IAM_REALM;
const IAM_CLIENT_ID = import.meta.env.IAM_CLIENT_ID;
const IAM_CLIENT_ID_REMOTE = import.meta.env.IAM_CLIENT_ID_REMOTE;
const IAM_CLIENT_SECRET = import.meta.env.IAM_CLIENT_SECRET;
const IAM_AUTH_MODE = import.meta.env.IAM_AUTH_MODE;
const IAM_REDIRECT_REMOTE = import.meta.env.IAM_REDIRECT_REMOTE;
const IAM_CLIENT_SECRET_REMOTE = import.meta.env.IAM_CLIENT_SECRET_REMOTE;

/**
 * @description 
 * Classe de service de connexion à la geoplateforme
 * cf. {@link https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type}
 * ou {@link https://stackoverflow.blog/2022/04/14/the-authorization-code-grant-in-excruciating-detail/#h2-97e8b796eefc0}
 * ou {@link https://www.ory.sh/docs/oauth2-oidc/authorization-code-flow}
 * 
 * @see env
 * @fires emitter#service:user:loaded
 * @fires emitter#service:documents:loaded
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

  #client
  #fetchWrapper

  /** Constructeur */
  constructor (options) {

    options = options || {};

    /** authentification */
    this.authenticated = options.authenticated || false;
    /** state session */
    this.session = options.session || "";
    /** code verificated */
    this.codeVerifier = options.codeVerifier || "";
    /** code */
    this.code = options.code || "";
    /** token */
    this.token = options.token || "";
    /** user */
    this.user = options.user || {};
    /** documents */
    this.documents = options.documents || {};
    /** erreurs IAM */
    this.error = options.error || {};

    /** mode local ou distant */
    this.mode = options.mode || IAM_AUTH_MODE;
    this.redirect = options.redirect || IAM_REDIRECT_REMOTE;

    // variables à instancier !
    this.#client = null;
    this.#fetchWrapper = null;
    
    this.api = null;
    this.url = null;

    this.#initialize(options);

    return this;
  }

  /**
   * Initialisation du client oauth
   */
  #initialize (options) {
    this.api = import.meta.env.VITE_API_URL || "https://data.geopf.fr/api";
    this.url = encodeURI(location.origin + import.meta.env.BASE_URL);
    var clientId = this.mode === "local" ? IAM_CLIENT_ID : IAM_CLIENT_ID_REMOTE;
    var clientSecret = this.mode === "local" ? IAM_CLIENT_SECRET : IAM_CLIENT_SECRET_REMOTE;
    var settings = options.client ? options.client.settings : {
      server: `${IAM_URL}`,

      clientId: `${clientId}`,
      clientSecret: `${clientSecret}`,
      index: `${IAM_REALM}`,

      tokenEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/token`,
      authorizationEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/auth`,
      discoveryEndpoint: `/realms/${IAM_REALM}/.well-known/openid-configuration`,
      revocationEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/revoke`
    };

    this.#client = new OAuth2Client(settings);
    this.#fetchWrapper = new OAuth2Fetch({
      client: this.#client,
      getNewToken: async () => {
        // en mode distant, on ne redemande pas de jeton
        if (this.token && Object.keys(this.token).length && this.mode === "remote") {
          return this.token;
        }
        var token = await this.#client.authorizationCode.getToken({
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
        if (token && Object.keys(token).length) {
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
   * Client OAuth
   * @returns {Object} - client oauth
   */
  getClient () {
    return this.#client;
  }

  /**
   * Fetch
   * @returns {Object} - fetch wrapper
   */
  getFetch () {
    return this.#fetchWrapper;
  }

  /**
   * Permet de valider la connexion en obtenant un token
   * @see getUserMe
   * @see getDocuments
   * @fires emitter#service:user:loaded
   * @fires emitter#service:documents:loaded
   * @returns {Promise} - statut : login / logout / unknow
   */
  isAccessValided () {
    const emitter = inject('emitter');
    var store = useServiceStore();
    // si IAM, on récupère les informations dans l'url
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    // parametres
    var code = urlParams.get('code');
    var session = urlParams.get('session_state');
    var error = urlParams.get('error');
    var token = urlParams.get('token');

    // INFO
    // on retourne une promise avec le statut 
    // - login
    // - logout
    // - unknow
    var promise = null;

    var status = "unknow";
    // IAM login local
    if (code && session) {
      this.session = session;
      this.code = code;
      this.authenticated = true;
      status = "login";
      // on demande un token...
      // et, ensuite, on met en place une serie de promise chainées :
      // - getUserMe
      // - getDocuments
      promise = this.getAccessToken()
        .then((token) => {
          if (token) {
            // on execute une autre promise chainée
            // ex. les informations de l'utilisateur !
            return this.getUserMe()
            .then((user) => {
              console.debug(user);
              emitter.dispatchEvent("service:user:loaded", {
                bubbles : true,
                detail : user
              });
              // on execute une autre promise chainée
              // ex. les favoris !
              return this.getDocuments()
              .then((documents) => {
                console.debug(documents);
                emitter.dispatchEvent("service:documents:loaded", {
                  bubbles : true,
                  detail : documents
                });
              })
              .catch((e) => {
                throw new Error('Error to get documents (' + e.message + ')');
              }) 
            })
            .catch((e) => {
              throw new Error('Error to get user info (' + e.message + ')');
            })
          }
        })
        .then(() => {
          // on retourne le statut
          return status;
        })
        .catch((e) => {
          throw new Error('Error to get token (' + e.message + ')');
        })
    }
    // IAM logout local
    if (!code && session && session === this.session) {
      this.session = null;
      this.code = null;
      this.authenticated = false;
      this.token = null;
      this.removeTokenStorage();
      this.user = {};
      this.documents = {};
      this.error = {};
      status = "logout";
      promise = new Promise((resolve, reject) => {
        resolve(status);
      });
    }
    // IAM login distant
    if (token && code) {
      this.authenticated = true;
      // INFO
      // on extrait les infos
      var c = JSON.parse(code);
      this.code = c.code;
      this.session = c.session_state;
      // INFO
      // conversion de format de token
      var t = JSON.parse(token);
      const today = new Date(t.expires);
      console.error("expires token", today);
      this.token = {
        accessToken : t.access_token,
        expiresAt : t.expires, // FIXME on utilise t.expires_in !?
        refreshToken : t.refresh_token
      };

      status = "login";
      promise = new Promise((resolve, reject) => {
        resolve(status);
      });
    }
    // Error
    if (error) {
      this.error = {
        name: error,
        message: urlParams.get('error_description')
      };
      promise = new Promise((resolve, reject) => {
        reject(this.error);
      });
    }

    // enregistrement dans le storage du statut de la connexion
    store.setService(this);

    return promise || Promise.resolve(status);
  }
};

// Mixin
Object.assign(Services.prototype, Connexion);
Object.assign(Services.prototype, Users);
Object.assign(Services.prototype, Documents);

export default Services;
