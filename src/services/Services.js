import Connexion from '@/services/ServiceConnection';
import Users from '@/services/ServiceUsers';

import { useServiceStore } from '@/stores/serviceStore';

/**
 * @description 
 * Classe de service de connexion à la geoplateforme
 * cf. {@link https://developer.okta.com/blog/2018/04/10/oauth-authorization-code-grant-type}
 * ou {@link https://stackoverflow.blog/2022/04/14/the-authorization-code-grant-in-excruciating-detail/#h2-97e8b796eefc0}
 * 
 * @see env
 * @example
 * import Services from '@/services/Services';
 * var service = new Services();
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
class Services {

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

    this.url = encodeURI(location.origin + import.meta.env.BASE_URL);

    return this;
  }

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
      this.authenticated = true;
      this.getAccessToken()
        .then((data) => {
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
    var store = useServiceStore();
    store.setService(this);
  }
};

// Mixin
Object.assign(Services.prototype, Connexion);
Object.assign(Services.prototype, Users);

export default Services;