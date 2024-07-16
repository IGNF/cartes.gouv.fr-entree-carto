import { inject } from 'vue';

// nom du plugin
const eulerianSymbol = Symbol('vue-eulerian-plugin');

/**
 * Gestion de la collecte via Eulerian
 * @see https://github.com/GouvernementFR/dsfr/blob/main/src/analytics/doc/analytics.md
 */
export class Eulerian {
  /**
   * constructeur
   * @param {*} options 
   * @see https://github.com/GouvernementFR/dsfr/blob/main/src/analytics/example/spa/vue/config.ejs
   */
  constructor(options) {
    console.debug(options);
    // INFO
    // pour tester la collecte des statistiques en local, il faut modifier l'URL (filtre Eulerian) :
    // > BASE_URL=stat.cartes.gouv.fr npm run dev

    // INFO
    // pour activer le mode debug, taper dans la console du navigateur : 
    // > window.dsfr.analytics.isDebugging = true
    window.dsfr = {
      verbose: true,
      mode: "vue"
    }
    window.dsfr.analytics = options;
    
    /**
     * clef du consentement
     * @example
     * {"eulerianAnalytics":false,"isFullConsent":false}
     */
    this.key = "@codegouvfr/react-dsfr finalityConsent eulerianAnalytics";

    // chargement des scripts de l'API Analytics Eulerain
    this.load().then(() => {
      console.debug("import dynamic dsfr !");
      // activation de la collecte si la clef de consentement est déjà active
      var value = localStorage.getItem(this.key);
      if (value) {
        if (value.eulerianAnalytics) {
          this.enable();
        }
      }
    });
  }
  
  /**
   * Chargement de l'API Analytics Eulerain
   */
  async load() {
    await import("@gouvfr/dsfr/dist/dsfr.module").then(() => {
      console.debug("import dynamic dsfr.module !");
    })
    await import("@gouvfr/dsfr/dist/analytics/analytics.module").then(() => {
      console.debug("import dynamic analytics.module !");
    })
  }

  /**
   * Activation de la collecte
   * @public
   */
  enable() {
    console.debug("enable");
    localStorage.setItem(this.key, '{"eulerianAnalytics":true,"isFullConsent":true}');
    window.dsfr.analytics.opt.enable();
  }

  /**
   * Desactivation de la collecte
   * @public
   */
  disable() {
    console.debug("disable");
    localStorage.setItem(this.key, '{"eulerianAnalytics":false,"isFullConsent":false}');
    window.dsfr.analytics.opt.disable();
  }

  /**
   * Statut de l'activation de la collecte
   * @returns {Boolean} - true|false
   */
  isDisabled() {
    return window.dsfr.analytics.opt.isDisabled;
  }

  /**
   * Obtenir la clef d'enregistrement de la collecte
   * @returns {String} - clef du localStorage
   */
  getKey() {
    return this.key;
  }

  /**
   * Modifier la clef d'enregistrement de la collecte
   * @param {String} key - clef d'enregistrement de la collecte
   */
  setKey(key) {
    this.key = key;
  }

  hasKey() {
    var value = localStorage.getItem(this.key);
    return !!value;
  }

  /**
   * Installation du plugin
   * @param {*} app 
   */
  install(app) {
    app.provide(eulerianSymbol, this);
    app.config.globalProperties.$eulerian = this;
  }
}

/**
 *  Creation d'une instance
 * 
 * @param {*} options 
 * @returns {Eulerian}
 * @public
 * @example
 * import { createEulerian } from 'vue-eulerian-plugin';
 * 
 * const eulerian = createEulerian({
 *  domain: "exemple.com", // domaine de tracking Eulerian
 *  site: {
 *    environment: isProduction ? "production" : "development",
 *    entity: "Exemple"
 *   }
 * })
 * 
 * createApp(App)
 *  .use(eulerian)
 *  .mount('#app');
 */
export function createEulerian(options) {
  return new Eulerian(options);
}

/**
 * Utilisation d'une instance
 * 
 * @returns {Eulerian}
 * @public
 * @example
 * import { useEulerian } from 'vue-eulerian-plugin';
 * 
 * const eulerian = useEulerian();
 * eulerian.enable();
 * eulerian.disable();
 * eulerian.isDisabled();
 * eulerian.getKey();
 * eulerian.setKey();
 */
export function useEulerian() {
  const eulerian = inject(eulerianSymbol)
  return eulerian;
}