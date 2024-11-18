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

    options = options || {};

    /** authentification */
    this.authenticated = options.authenticated || false;
    /** token */
    this.token = options.token || "";
    /** state session */
    this.session = options.session || "";
    /** code */
    this.code = options.code || "";
    /** erreurs IAM */
    this.error = options.error || {};
    /** user */
    this.user = options.user || {};

    this.url = encodeURI(location.origin + import.meta.env.BASE_URL);

    return this;
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
    // IAM login
    if (code && session) {
      this.session = session;
      this.code = code;
      this.authenticated = true;
      this.getAccessToken()
        .then((data) => {
          this.token = data;
          this.addTokenStorage();
        })
        .then(() => {
          store.setService(this);
        })
        .catch((e) => {
          console.error(e.message);
        });
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
    }
    // Error
    if (error) {
      // FIXME où afficher l'erreur ?
      this.error = {
        name: error,
        message: urlParams.get('error_description')
      };
    }
    // enregistrement dans le storage du statut de la connexion
    store.setService(this);
  }
};

// Mixin
Object.assign(Services.prototype, Connexion);
Object.assign(Services.prototype, Users);

export default Services;