import { useRequest } from '@/services/request';

// INFO
// recuperation des informations sur l'env
const IAM_URL = import.meta.env.IAM_URL;
const IAM_REALM = import.meta.env.IAM_REALM;
const IAM_CLIENT_ID = import.meta.env.IAM_CLIENT_ID;
const IAM_CLIENT_SECRET = import.meta.env.IAM_CLIENT_SECRET; 

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
   * @see isAccessValided
   * @example
   * // requête :
   * https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/auth?
   *  scope=openid%20profile%20email&
   *  response_type=code&
   *  approval_prompt=auto&
   *  redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcartes.gouv.fr-entree-carto/login&
   *  client_id=cartes-gouv-dev
   * // réponse avec redirection :
   * http://localhost:5173/cartes.gouv.fr-entree-carto/login?
   *  session_state=968321a6-385e-4058-a17a-571ab08303bd&
   *  iss=https%3A%2F%2Fsso.geopf.fr%2Frealms%2Fgeoplateforme&
   *  code=168e7dd8-ae1f-4f8b-99f7-ae0aac066067.968321a6-385e-4058-a17a-571ab08303bd.3038d336-2dfa-4c2e-954e-090ee781ed7f
   * 
   */
  getAccessLogin : function () {
    // INFO
    // La réponse fournit le 'code', 
    // et il doit être utiliser pour obtenir le token 
    // cf. getAccessToken()

    const url = this.url.includes("login") ? this.url : this.url + "/login";
    return `${IAM_URL}/realms/${IAM_REALM}/protocol/openid-connect/auth?
      scope=openid%20profile%20email&
      approval_prompt=auto&
      response_type=code&
      state=xcoiv98y2kd22vusuye3kch&
      redirect_uri=${url}&
      client_id=${IAM_CLIENT_ID}`.replace(/ /g, '');
  },

  /** 
   * IAM pour se deconnecter
   * 
   * @see isAccessValided
   * @example
   * // requête :
   * https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/logout?
   *  post_logout_redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fcartes.gouv.fr-entree-carto/logout&
   *  scope=profile%20email&
   *  response_type=code&
   *  approval_prompt=auto&
   *  client_id=cartes-gouv-dev
   * // réponse avec redirection :
   * http://localhost:5173/cartes.gouv.fr-entree-carto/?
   *  session_state=968321a6-385e-4058-a17a-571ab08303bd
   */
  getAccessLogout : function () {
    // INFO
    // La reponse fournit la 'session',
    // et la session doit être identique à celle issue de login

    const url = this.url.includes("logout") ? this.url : this.url + "/logout";
    return `${IAM_URL}/realms/${IAM_REALM}/protocol/openid-connect/logout?
      scope=openid%20profile%20email&
      approval_prompt=auto&
      response_type=code&
      post_logout_redirect_uri=${url}?session_state=${this.session}&
      client_id=${IAM_CLIENT_ID}`.replace(/ /g, '');
  },

  /** 
   * IAM pour obtenir le token
   * 
   * @see isAccessValided
   * @fixme le post ne renvoie pas de réponse !? credentials no-cors ?
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
  getAccessToken : function () {
    
    // curl --request POST  --url "https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/token"  --header "content-type: application/x-www-form-urlencoded" -d 'client_id='cartes-gouv-dev'&client_secret='heH4uOv2ihsxn2ziE8pyNBOI6dbCy1sp'&grant_type=client_credentials'
    // fetch("https://sso.geopf.fr/realms/geoplateforme/protocol/openid-connect/token", {
    //   "headers": {
    //     "content-type": "application/x-www-form-urlencoded"
    //   },
    //   "body": "client_id=cartes-gouv-dev&client_secret=heH4uOv2ihsxn2ziE8pyNBOI6dbCy1sp&grant_type=client_credentials",
    //   "method": "POST"
    // })
    // .then((response) => response.json())
    // .then((data) => {
    //     console.log(data);
    // });
    var url = `${IAM_URL}/realms/${IAM_REALM}/protocol/openid-connect/token`;
    var settings = {
      method : "POST",
      headers : {
        "Content-Type" : "application/x-www-form-urlencoded",
        "Accept" : "application/json"
      },
      mode : 'cors', 
      // credentials : "same-origin",
      body : new URLSearchParams({
        "grant_type": "client_credentials", //  authorization_code
        "code": this.code,
        "redirect_uri": this.url,
        "client_id": IAM_CLIENT_ID,
        "client_secret": IAM_CLIENT_SECRET
      }).toString()
    };

    return useRequest(url, settings);
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
    return JSON.parse(localStorage.getItem("auth"));
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
