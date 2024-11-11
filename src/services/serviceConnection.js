import { useRequest } from '@/services/request';
import Users from '@/services/serviceUsers';

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
 * 
 * @see env
 * @see serviceStore
 * @example
 * import Service from '@/services/serviceConnection';
 * var service = new Service();
 * // requêtes
 * service.getAccessLogin();
 * service.getAccessToken();
 * service.getAccessLogout();
 * service.getAccessUser();
 * // propriétés
 * service.authenticated;
 * service.token;
 * service.state;
 * service.user;
 */
class Service {

  /** Constructeur */
  constructor (options) {

    this.options = options || {};

    /** authentification */
    this.authenticated = false;
    /** token */
    this.token = null;
    /** state session */
    this.session = null;
    /** code */
    this.code = null;
    /** erreurs IAM */
    this.error = {};

    this.url = encodeURI(location.origin + location.pathname);

    return this;
  }

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
  getAccessLogin () {
    // INFO
    // La réponse fournit le 'code', 
    // et il doit être utiliser pour obtenir le token 
    // cf. getAccessToken()

    const url = location.pathname.includes("login") ? this.url : this.url + "/login";
    return `${IAM_URL}/realms/${IAM_REALM}/protocol/openid-connect/auth?
      scope=openid%20profile%20email&
      approval_prompt=auto&
      response_type=code&
      state=xcoiv98y2kd22vusuye3kch&
      redirect_uri=${url}&
      client_id=${IAM_CLIENT_ID}`.replace(/ /g, '');
  }

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
  getAccessLogout () {
    // INFO
    // La reponse fournit la 'session',
    // et la session doit être identique à celle issue de login

    const url = location.pathname.includes("logout") ? this.url : this.url + "/logout";
    return `${IAM_URL}/realms/${IAM_REALM}/protocol/openid-connect/logout?
      scope=openid%20profile%20email&
      approval_prompt=auto&
      response_type=code&
      post_logout_redirect_uri=${url}?session_state=${this.session}&
      client_id=${IAM_CLIENT_ID}`.replace(/ /g, '');
  }

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
  getAccessToken () {
    
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
      mode : 'no-cors', 
      credentials : "same-origin",
      body : new URLSearchParams({
        "grant_type": "authorization_code",
        "code": this.code,
        "redirect_uri": this.url,
        "client_id": IAM_CLIENT_ID,
        "client_secret": IAM_CLIENT_SECRET
      }).toString()
    };

    return import.meta.env.VITE_HTTP_SIMULE_REQUEST === "1" ? new Promise((resolve, reject) => {
      resolve({
        "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJuQTM1bFJNeWVEMnU3WGJDTk9UbTRORjE0eTNoYlBMcGw4TXQtVzR3STJnIn0.eyJleHAiOjE3MzAzNjU1OTgsImlhdCI6MTczMDMyMjM5OCwiYXV0aF90aW1lIjoxNzMwMzIyMzk3LCJqdGkiOiI3YjFjM2YyZS1iNjNkLTQ1MjYtOGY4My1jZjhjZmNjYjZjMjQiLCJpc3MiOiJodHRwczovL3Nzby5nZW9wZi5mci9yZWFsbXMvZ2VvcGxhdGVmb3JtZSIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiIwOWUwOTFkYy01MWQ1LTRjMDQtOTYzNy0zMDQ1ZGY1Y2U0NzciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJicnVuby1yZXN0LWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiI3N2Q5NmFlZi00NGMzLTQyZmItYTU0Mi1jMWQwYTUyMWNlMjkiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9sb2NhbGhvc3QiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbImRlZmF1bHQtcm9sZXMtZ2VvcGxhdGVmb3JtZSIsIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJkZWxldGUtYWNjb3VudCIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsInNpZCI6Ijc3ZDk2YWVmLTQ0YzMtNDJmYi1hNTQyLWMxZDBhNTIxY2UyOSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJuYW1lIjoiamVhbi1waGlsaXBwZSBiYXpvbm5haXMiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqZWFuLXBoaWxpcHBlLmJhem9ubmFpcyIsImdpdmVuX25hbWUiOiJqZWFuLXBoaWxpcHBlIiwiZmFtaWx5X25hbWUiOiJiYXpvbm5haXMiLCJlbWFpbCI6ImplYW4tcGhpbGlwcGUuYmF6b25uYWlzQGlnbi5mciJ9.i4ELlTHnpbCMpwpVH-dl7BYPmKiFPcnps19lW8Zw50gXeBuXNLGBHuG8T8CGI5jxJA1JC_h3xveRRlLZCRVu9bDNGtB2A1JUzfS0NPp2yffO5brr3e6NSOTC490e9_P5AgQNzJPzFKsHOUtCF2zaDsemCzmOSGk7_GmEPY-YyCBgxDTvnhpg0Du2bf8tt2SKJpxZSK83U7K32YA27ioQo6_AVRn4QEJYQmz1QMkhOstDneMSFku1s64pN6vXsL6y1g0Bjvu-H6V5T8Ei4LJqj0mIiL2pQRgRCGJBXd4wpfYqVClCjh-GIx41znEpsE_whKXScq3HHbwHCjV_UGY6Og",
        "expires_in": 43200,
        "refresh_expires_in": 43199,
        "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI4ODI0ODAxYS05NGJiLTQwMjUtYjM2NS1kNDQwMDZiMWFhOGEifQ.eyJleHAiOjE3MzAzNjU1OTcsImlhdCI6MTczMDMyMjM5OCwianRpIjoiMWQ1NTJiM2YtODAyMC00NTU5LWFmNzctMjY3YjgyOTI3Y2QxIiwiaXNzIjoiaHR0cHM6Ly9zc28uZ2VvcGYuZnIvcmVhbG1zL2dlb3BsYXRlZm9ybWUiLCJhdWQiOiJodHRwczovL3Nzby5nZW9wZi5mci9yZWFsbXMvZ2VvcGxhdGVmb3JtZSIsInN1YiI6IjA5ZTA5MWRjLTUxZDUtNGMwNC05NjM3LTMwNDVkZjVjZTQ3NyIsInR5cCI6IlJlZnJlc2giLCJhenAiOiJicnVuby1yZXN0LWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiI3N2Q5NmFlZi00NGMzLTQyZmItYTU0Mi1jMWQwYTUyMWNlMjkiLCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJzaWQiOiI3N2Q5NmFlZi00NGMzLTQyZmItYTU0Mi1jMWQwYTUyMWNlMjkifQ.Q6aZUJ5nh6VQ77bqImOyqMqlAJfKCBs-eEYnF5-EbL4",
        "token_type": "Bearer",
        "not-before-policy": 0,
        "session_state": "77d96aef-44c3-42fb-a542-c1d0a521ce29",
        "scope": "profile email"
      });
    }) : useRequest(url, settings);
  }

  /////////////////
  // méthod public
  /////////////////

  /**
   * Permet de valider la connexion en obtenant un token
   */
  isAccessValided () {
    // si login via IAM, on récupère le code dans l'url
    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    // parametres
    var code = urlParams.get('code');
    var session = urlParams.get('session_state');
    var error = urlParams.get('error');
    // IAM login
    if (code && session) {
      this.session = session;
      this.code = code;
      this.getAccessToken()
        .then((data) => {
          this.authenticated = true;
          this.token = data;
          this.addTokenStorage();
          return data;
        })
        // .then((data) => {
        //   var token = data.access_token;
        //   this.getUserMe(token)
        //     .then((data) => {
        //       this.user = data;
        //     });
        // })
        .catch((e) => {
          console.error(e.message);
        });
    }
    // IAM logout
    // FIXME logout doit fournir la session !!!
    if (!code && session && session === this.session) {
      this.session = null;
      this.code = null;
      this.authenticated = false;
      this.token = null;
      this.removeTokenStorage();
      this.user = {};
      this.error = {};
    }
    // Error
    if (error) {
      // FIXME où afficher l'erreur ?
      this.error = {
        name: error,
        message: urlParams.get('error_description')
      };
    }
  }

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
  getTokenStorage () {
    return JSON.parse(localStorage.getItem("auth"));
  }
  /**
   * Ajoute le token d'authentification du localStorage
   */
  addTokenStorage () {
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
  }
  /**
   * Reinitialise le token d'authentification du localStorage
   */
  removeTokenStorage () {
    var data = JSON.stringify({
      authenticated : {}
    });
    localStorage.setItem("auth", data);
  }
};

// Mixin
Object.assign(Service.prototype, Users);

export default Service;
