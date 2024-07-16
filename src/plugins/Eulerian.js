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

    this.load().then(() => {
      console.debug("import dynamic dsfr !");
      // activation si la clef de consentement est déjà active
      var value = localStorage.getItem(this.key);
      if (value) {
        if (value.eulerianAnalytics) {
          this.enable();
        }
      }
    });
  }
  
  async load() {
    await import("@gouvfr/dsfr/dist/dsfr.module").then(() => {
      console.debug("import dynamic dsfr.module !");
    })
    await import("@gouvfr/dsfr/dist/analytics/analytics.module").then(() => {
      console.debug("import dynamic analytics.module !");
    })
  }

  enable() {
    console.debug("enable");
    localStorage.setItem(this.key, '{"eulerianAnalytics":true,"isFullConsent":true}');
    window.dsfr.analytics.opt.enable();
  }

  disable() {
    console.debug("disable");
    localStorage.setItem(this.key, '{"eulerianAnalytics":false,"isFullConsent":false}');
    window.dsfr.analytics.opt.disable();
  }

  isDisabled() {
    return window.dsfr.analytics.opt.isDisabled;
  }

  install(app) {
    app.provide(eulerianSymbol, this);
    app.config.globalProperties.$eulerian = this;
  }
}

export function createEulerian(options) {
  return new Eulerian(options);
}

export function useEulerian() {
  const eulerian = inject(eulerianSymbol)
  return eulerian;
}