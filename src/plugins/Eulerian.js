import { inject } from 'vue';

/**
 * Nom du plugin
 */
const eulerianSymbol = Symbol('vue-eulerian-plugin');

/**
 * Gestion de la collecte via Eulerian
 * @see https://github.com/GouvernementFR/dsfr/blob/main/src/analytics/doc/analytics.md
 * @see https://eulerian.wiki/doku.php?id=fr:start
 */
export class Eulerian {
  /**
   * constructeur
   * @param {*} options 
   * @see https://github.com/GouvernementFR/dsfr/blob/main/src/analytics/example/spa/vue/config.ejs
   */
  constructor(options) {
    console.debug("eulerian", options);
    // INFO
    // pour tester la collecte des statistiques en local, 
    // il faut modifier l'URL (filtre Eulerian) :
    // > BASE_URL=stat.cartes.gouv.fr npm run dev

    // INFO
    // pour activer le mode debug : 
    // > window.dsfr.analytics.isDebugging = true
    // pour modifier le niveau du logger en mode production
    // > window.dsfr.inspector.level = 10;

    this.options = options;

    window.dsfr = {
      verbose: options.verbose,
      mode: "vue"
    }
    window.dsfr.analytics = options;

    /**
     * clef du consentement
     * @example
     * {"eulerianAnalytics":false,"isFullConsent":false}
     */
    this.key = "@codegouvfr/react-dsfr finalityConsent eulerianAnalytics";

    /**
     * Statut du demarrage de l'import de la librairie Analytics Eulerian
     * @example
     * import("@gouvfr/dsfr/dist/analytics/analytics.module").then(() => {
     *   console.debug("import dynamic analytics.module !");
     * })
     */
    this.loaded = false;

    /**
     * Statut de l'activation de la collecte
     * @returns {Boolean} - true|false
     */
    this.status = false;

    // chargement des scripts de l'API Analytics Eulerain
    this.loadModule().then(() => {
      if (!this.options.autoStart) {
        return;
      }
      window.dsfr.start();
      // activation de la collecte si la clef de consentement est déjà active
      var value = JSON.parse(localStorage.getItem(this.key));
      if (value) {
        if (value.eulerianAnalytics) {
          if (!this.loaded) {
            this.loadAnalytics().then(() => {
              this.start();
            });
          }
        } else {
          this.stop();
        }
      }
    });
  }
  
  /**
   * Chargement de l'API Analytics Eulerain
   */
  async loadModule() {
    await import("@gouvfr/dsfr/dist/dsfr.module").then(() => {
      console.debug("import dynamic dsfr.module !");
    })
  }

  async loadAnalytics() {
    await import("@gouvfr/dsfr/dist/analytics/analytics.module").then(() => {
      console.debug("import dynamic analytics.module !");
      this.loaded = true;
    })
  }

  /**
   * Activation de la collecte
   * @public
   */
  start () {
    if (!this.options.autoStart) {
      return;
    }
    console.debug("start");
    localStorage.setItem(this.key, '{"eulerianAnalytics":true,"isFullConsent":true}');
    if (!this.loaded) {
      this.loadAnalytics().then(() => {
        this._start();
      });
    } else {
      this._start();
    }
  }

  _start() {
    window.dsfr.analytics.opt.enable();
    window.dsfr.start();
    window.dsfr.analytics.readiness.then(() => {
      console.debug("start promise !");
      if (!this.options.verbose) {
        window.dsfr.inspector.level = 10;
      }
      window.dsfr.analytics.reset();
      window.dsfr.analytics.collect(); // envoie les données
    });
    this.status = true;
  }

  /**
   * Desactivation de la collecte
   * @public
   */
  stop () {
    if (!this.options.autoStart) {
      return;
    }
    console.debug("stop");
    localStorage.setItem(this.key, '{"eulerianAnalytics":false,"isFullConsent":false}');
    // window.dsfr.analytics.opt.disable();
    window.dsfr.stop();
    this.status = false;
  }

  /**
   * Pause dans la collecte
   * @public
   */
  pause () {
    if (!this.options.autoStart) {
      return;
    }
    if (this.status) {
      window.dsfr.stop();
    }
    console.debug("pause", this.status);
  }
  
  /**
   * Reprise de la collecte
   * @public
   */
  resume () {
    if (!this.options.autoStart) {
      return;
    }
    if (this.status) {
      window.dsfr.start();
    }
    console.debug("resume", this.status);
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

  /**
   * La clef exsite t elle ?
   * @returns {Boolean} - true/false
   */
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