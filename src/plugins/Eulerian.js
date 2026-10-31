import { inject } from 'vue';

/**
 * Nom du plugin
 */
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
    console.debug("eulerian", options);

    // INFO
    // pour activer le mode debug : 
    // > window.dsfr.analytics.isDebugging = true
    // pour modifier le niveau du logger en mode production
    // > window.dsfr.inspector.level = 10;

    this.options = options;

    window.dsfr = {
      analytics: options,
    };

    // chargement des scripts de l'API Analytics Eulerain
    this.load().then(() => {
      // activation de la collecte 
      this.start();
    });
  }
  
  /**
   * Chargement de l'API Analytics Eulerain
   */
  async load() {
    await import("@gouvfr/dsfr/standalone/analytics/analytics.module.standalone.js").then(() => {
      console.debug("import dynamic analytics.module.standalone !");
    })
  }

  /**
   * Activation de la collecte
   * @public
   */
  start () {
    window.dsfr.analytics.opt.enable();
  }

  /**
   * Desactivation de la collecte
   * @public
   */
  stop () {
    window.dsfr.analytics.opt.disable();
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