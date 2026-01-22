import ServiceBase from "@/services/ServiceBase";

import { useServiceStore } from '@/stores/serviceStore';

import { OAuth2Client, OAuth2Fetch } from '@badgateway/oauth2-client';
import { generateCodeVerifier } from '@badgateway/oauth2-client';
import Keycloak from "keycloak-js";

import { inject } from 'vue';

const IAM_URL = import.meta.env.IAM_URL;
const IAM_REALM = import.meta.env.IAM_REALM;
const IAM_CLIENT_ID = import.meta.env.IAM_CLIENT_ID;
const IAM_CLIENT_SECRET = import.meta.env.IAM_CLIENT_SECRET;

const IAM_ENTREPOT_API_URL = import.meta.env.IAM_ENTREPOT_API_URL;

class ServiceLocal extends ServiceBase {

  #client
  #fetchWrapper

  constructor(options) {
    super(options);

    /** state session */
    this.session = options.session || "";
    /** code verificated */
    this.codeVerifier = options.codeVerifier || "";
    /** code */
    this.code = options.code || "";
    /** token */
    this.token = options.token || "";
    /** erreurs */
    this.error = options.error || {};

    // variables à instancier !
    this.#client = null;
    this.#fetchWrapper = null;

    this.api = IAM_ENTREPOT_API_URL;
    
    this.#initialize(options);
    
    return this;
  }
  
  /**
   * Initialisation du client oauth
  */
  #initialize (options) {
    var settings = options.client ? options.client.settings : {
      server: `${IAM_URL}`,
  
      clientId: `${IAM_CLIENT_ID}`,
      clientSecret: `${IAM_CLIENT_SECRET}`,
      index: `${IAM_REALM}`,
  
      tokenEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/token`,
      authorizationEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/auth`,
      discoveryEndpoint: `/realms/${IAM_REALM}/.well-known/openid-configuration`,
      revocationEndpoint: `/realms/${IAM_REALM}/protocol/openid-connect/revoke`
    };
  
    this.#client = new OAuth2Client(settings);

    this.#fetchWrapper = new OAuth2Fetch({
      client: this.#client,
      scheduleRefresh: true,
      getNewToken: async () => {
        // en mode distant, on ne redemande pas de jeton
        if (this.token && Object.keys(this.token).length && this.token.expiresAt > Date.now()) {
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
      },
      getStoredToken: () => {
        const token = this.#getTokenStorage();
        if (token && Object.keys(token).length) {
          return token;
        }
        return null;
      },
      onError: (e) => {
        console.error(e);
        this.error = e;
      }
    });

    this.setFetch(this.#fetchWrapper.fetch.bind(this.#fetchWrapper));
  }

  /**
   * Retourne le token d'authentification du localStorage
   * @returns {Object} auth
   * @example
   * {
   *    "authenticator": "authenticator:oauth2",
   *    "access_token": "phwt5hfbfzequdvrl9uaqfblucocgdlm62wqvom6",
   *    "expires_in": 3600,
   *    "token_type": "Bearer",
   *    "scope": "basic",
   *    "refresh_token": "t7vni7a8nptovlbzfl4et15wfmvp9knja0y1fe5v",
   *    "expires_at": 1730393104613
   * }
   */
  #getTokenStorage () {
    var service = JSON.parse(localStorage.getItem("service"));
    if (service) {
      return service.connexion.token;
    }
    return null;
  }

  async checkKeycloakSession (adapter) {
    if (!adapter) {
      adapter = 'natif';
    }
    if (adapter !== 'keycloak') {
      return this.#checkKeycloakSessionAdapter1();
    } else {
      return this.#checkKeycloakSessionAdapter2();
    }
  }

  async #checkKeycloakSessionAdapter2 () {
    console.warn("use checkKeycloakSessionAdapter keycloak");
    const keycloak = new Keycloak({
      url: IAM_URL,
      realm: IAM_REALM,
      clientId: 'cartes-gouv-public'
    });

    return keycloak.init({ 
        onLoad: 'check-sso', 
        flow: "standard",
        pkceMethod: "S256",
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: this.url + '/silent-check-sso2.html'
    });
  }

  async #checkKeycloakSessionAdapter1 () {
    console.warn("use checkKeycloakSessionAdapter natif");
    return new Promise((resolve) => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        
        const checkUrl = new URL(this.#client.settings.server + this.#client.settings.authorizationEndpoint);
        checkUrl.searchParams.set('client_id', this.#client.settings.clientId);
        checkUrl.searchParams.set('redirect_uri', this.url + '/silent-check-sso.html');
        checkUrl.searchParams.set('response_type', 'code');
        checkUrl.searchParams.set('scope', 'openid');
        checkUrl.searchParams.set('prompt', 'none'); // ← CRUCIAL
        
        iframe.src = checkUrl.toString();
        document.body.appendChild(iframe);
        
        const timeout = setTimeout(() => {
          cleanup();
          resolve(false); // Timeout = pas de session
        }, 5000);
        
        function cleanup() {
          clearTimeout(timeout);
          window.removeEventListener('message', handleMessage);
          iframe.remove();
        }
        
        function handleMessage(event) {
          if (event.origin !== window.location.origin) return;
          
          cleanup();
          
          if (event.data.code) {
            // Session Keycloak active !
            resolve(true);
          } else {
            // Pas de session
            resolve(false);
          }
        }
        
        window.addEventListener('message', handleMessage);
    });
  }

  async isAccessValided () {
    const emitter = inject('emitter');
    var store = useServiceStore();

    // si IAM, on récupère les informations dans l'url
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    // parametres
    var code = urlParams.get('code');
    var session = urlParams.get('session_state');
    var error = urlParams.get('error');

    // INFO
    // on retourne une promise avec le statut 
    // - login
    // - logout
    // - unknow
    var promise = null;

    var status = "no-auth";

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
    if (!code && (session !== null || session === this.session)) {
      this.session = null;
      this.code = null;
      this.authenticated = false;
      this.token = null;
      this.user = {};
      this.documents = {};
      this.error = {};
      status = "logout";
      promise = new Promise((resolve, reject) => {
        resolve(status);
      });
    }

    // FIXME on ne traite pas les erreurs !?
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

  /** 
   * IAM pour se connecter
   * 
   * @type {Promise}
   * @see Login
   * @example
   * // requête :
   * https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/auth?
   *  scope=openid%20profile%20email&
   *  response_type=code&
   *  approval_prompt=auto&
   *  redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcartes.gouv.fr-entree-carto/login&
   *  client_id=IAM_CLIENT_ID
   * // réponse avec redirection :
   * http://localhost:5173/cartes.gouv.fr-entree-carto/login?
   *  session_state=968321a6-385e-4058-a17a-571ab08303bd&
   *  iss=https%3A%2F%2Fsso.geopf.fr%2Frealms%2Fgeoplateforme&
   *  code=168e7dd8-ae1f-4f8b-99f7-ae0aac066067.968321a6-385e-4058-a17a-571ab08303bd.3038d336-2dfa-4c2e-954e-090ee781ed7f
   * 
   */
  async getAccessLogin () {
    // INFO
    // Dans le mode auth local
    // La réponse fournit le 'code', 
    // et il doit être utiliser pour obtenir le token 
    // cf. getAccessToken()

    const url = this.url.includes("login") ? this.url : this.url + "/login";
      
    const codeVerifier = await generateCodeVerifier();
    this.codeVerifier = codeVerifier; // au cas où...
    localStorage.setItem("codeVerifier", codeVerifier);
    
    var responseIAM = await this.#client.authorizationCode.getAuthorizeUri({
      redirectUri: url,
      state: 'some-string',
      codeVerifier,
      scope: ['openid','profile','email'],
      extraParams: {
        approval_prompt: "auto"
      },
      responseMode: "query"
    });

    return responseIAM;
  }

  /** 
   * IAM pour se deconnecter
   * 
   * @type {Promise}
   * @see Logout
   * @example
   * // requête :
   * https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/logout?
   *  post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcartes.gouv.fr-entree-carto/logout&
   *  scope=profile%20email&
   *  response_type=code&
   *  approval_prompt=auto&
   *  client_id=IAM_CLIENT_ID
   * // réponse avec redirection :
   * http://localhost:5173/cartes.gouv.fr-entree-carto/?
   *  session_state=968321a6-385e-4058-a17a-571ab08303bd
   */
  async getAccessLogout () {
    // INFO
    // La reponse fournit la 'session',
    // et la session doit être identique à celle issue de login

    const url = this.url.includes("logout") ? this.url : this.url + "/logout";

    var responseIAM = `${this.#client.settings.server}/realms/${this.#client.settings.index}/protocol/openid-connect/logout?
      scope=openid%20profile%20email&
      approval_prompt=auto&
      response_type=code&
      post_logout_redirect_uri=${url}?session_state=${this.session}&
      client_id=${this.#client.settings.clientId}`.replace(/ /g, '');

    return Promise.resolve(responseIAM);
  }

  /** 
   * IAM pour obtenir le token
   * 
   * @type {Promise}
   * @see isAccessValided
   * @example
   * POST https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/token
   * content-type: application/x-www-form-urlencoded
   * data : {
   *   "grant_type": "authorization_code",
   *   "code": "558c7a7d-40f6-4bef-b326-445238e6e594.77d96aef-44c3-42fb-a542-c1d0a521ce29.c24814cd-85a8-4e3c-919f-22664ec080cc",
   *   "redirect_uri": "http://localhost/redirect",
   *   "client_id": "...",
   *   "client_secret": "..."
   * }
   * // réponse :
   * {
   *    "access_token": "...",
   *    "token_type": "Bearer",
   *    "expires_in": 43200,
   *    "session_state": "77d96aef-44c3-42fb-a542-c1d0a521ce29",
   *    ...
   * }
  */
  async getAccessToken () {
    const url = this.url.includes("login") ? this.url : this.url + "/login";
      
    var codeVerifier = this.codeVerifier || localStorage.getItem("codeVerifier");
    
    var token = await this.#client.authorizationCode.getTokenFromCodeRedirect(
      location,
      {
        redirectUri: url,
        state: 'some-string',
        codeVerifier,
      }
    );

    this.token = token;
  
    const today = new Date(token.expiresAt);
    console.debug("expires token", today);

    this.#fetchWrapper.token = token; // HACK !?

    var store = useServiceStore();
    store.setService(this);

    return this.token;
  }
}

export default ServiceLocal;