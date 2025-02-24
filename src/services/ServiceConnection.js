import { generateCodeVerifier } from '@badgateway/oauth2-client';

import { useServiceStore } from '@/stores/serviceStore';

/**
 * @description 
 * Classe de service de connexion à la geoplateforme
 * 
 * @see env
 * @example
 * import Service from '@/services/serviceConnection';
 * // requêtes
 * Service.getAccessLogin();
 * Service.getAccessToken();
 * Service.getAccessLogout();
 * // propriétés
 * Service.authenticated;
 * Service.token;
 * Service.state;
 * ...
 */
var Connexion = {

  /////////////
  // requêtes
  /////////////

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
  getAccessLogin : async function () {

    if (this.mode === "local") {
      // INFO
      // Dans le mode auth local
      // La réponse fournit le 'code', 
      // et il doit être utiliser pour obtenir le token 
      // cf. getAccessToken()

      const url = this.url.includes("login") ? this.url : this.url + "/login";
      
      const codeVerifier = await generateCodeVerifier();
      this.codeVerifier = codeVerifier; // au cas où...
      localStorage.setItem("codeVerifier", codeVerifier);
      
      var responseIAM = await this.getClient().authorizationCode.getAuthorizeUri({
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
    } else {
      // INFO
      // Dans le mode auth distant, 
      // on redirige vers le syteme d'auth, 
      // et le token nous sera fournit dans la reponse
      return this.redirect;
    }
  },

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
  getAccessLogout : function () {
    // INFO
    // La reponse fournit la 'session',
    // et la session doit être identique à celle issue de login

    const url = this.url.includes("logout") ? this.url : this.url + "/logout";

    var responseIAM = `${this.getClient().settings.server}/realms/${this.getClient().settings.index}/protocol/openid-connect/logout?
      scope=openid%20profile%20email&
      approval_prompt=auto&
      response_type=code&
      post_logout_redirect_uri=${url}?session_state=${this.session}&
      client_id=${this.getClient().settings.clientId}`.replace(/ /g, '');

      return Promise.resolve(responseIAM);
  },

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
  getAccessToken : async function () {
    // INFO
    // en mode distant (remote), le token est déjà fourni
    var token = this.token; 
    if (this.mode === "local") {
      const url = this.url.includes("login") ? this.url : this.url + "/login";
      var codeVerifier = this.codeVerifier || localStorage.getItem("codeVerifier");
      token = await this.getClient().authorizationCode.getTokenFromCodeRedirect(
        location,
        {
            redirectUri: url,
            state: 'some-string',
            codeVerifier,
        }
      );
      this.token = token;
    }
    const today = new Date(token.expiresAt);
    console.debug("expires token", today);

    this.getFetch().token = token; // HACK !?
    this.addTokenStorage(); 

    var store = useServiceStore();
    store.setService(this);

    return this.token;
  },

  //////////////////
  // méthod private
  //////////////////

  /**
   * Retourne le token d'authentification du localStorage
   * @returns {Object} auth
   * @example
   * {
   *  authenticated : {
   *    "authenticator": "authenticator:oauth2",
   *    "access_token": "phwt5hfbfzequdvrl9uaqfblucocgdlm62wqvom6",
   *    "expires_in": 3600,
   *    "token_type": "Bearer",
   *    "scope": "basic",
   *    "refresh_token": "t7vni7a8nptovlbzfl4et15wfmvp9knja0y1fe5v",
   *    "expires_at": 1730393104613
   *  }
   * }
   */
  getTokenStorage : function () {
    var data = JSON.parse(localStorage.getItem("auth"));
    if (data) {
      return data.authenticated;
    }
    return null;
  },
  /**
   * Ajoute le token d'authentification du localStorage
   */
  addTokenStorage : function () {
    // ex. 
    // {
    //   "authenticator": "authenticator:oauth2",
    //   "access_token": "phwt5hfbfzequdvrl9uaqfblucocgdlm62wqvom6",
    //   "expires_in": 3600,
    //   "token_type": "Bearer",
    //   "scope": "basic",
    //   "refresh_token": "t7vni7a8nptovlbzfl4et15wfmvp9knja0y1fe5v",
    //   "expires_at": 1730393104613
    // }
    var data = JSON.stringify({
      authenticated : this.token
    });
    localStorage.setItem("auth", data);
  },
  /**
   * Reinitialise le token d'authentification du localStorage
   */
  removeTokenStorage : function () {
    var data = JSON.stringify({
      authenticated : {}
    });
    localStorage.setItem("auth", data);
  }
};

export default Connexion;
