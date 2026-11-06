import { inject } from 'vue';

import router from '@/router';

const matomoSymbol = Symbol('vue-matomo-plugin');

const MATOMO_OPTOUT_COOKIE = 'mtm_consent_removed';

/**
 * Plugin Matomo pour Vue
 *
 * Fournit l'intégration de Matomo pour le suivi des pages
 * et des événements dans une application Vue.js.
 *
 * @example
 * // Création et utilisation du plugin Matomo dans une application Vue
 * const matomo = createMatomo({
 *   host: 'https://matomo.example.com',
 *   siteId: '1',
 *   environment: 'production'
 * });
 * app.use(matomo);
 *
 * @returns {PluginMatomo} instance du plugin Matomo
 */
export class PluginMatomo {
  
  /**
   * constructeur
  */
  constructor(options) {
    this.options = options;
    this.initAnalytics()
    .then(() => {
      console.log('Analytics initialized successfully', options);
    })
    .catch((error) => {
      console.error('Analytics initialization failed', error);
    });
  }

  hasCookie(name, cookie = document.cookie) {
    return cookie.split(';').some((item) => item.trim().split('=')[0] === name);
  }
  isAnalyticsOptedOut({ cookie = document.cookie } = {}) {
    return this.hasCookie(MATOMO_OPTOUT_COOKIE, cookie);
  }

  /**
   * Initialise l'analytics Matomo
   * si l'utilisateur n'a pas opté pour le refus et si l'environnement est en production.
   */
  async initAnalytics() {
    
    // si pas en production ou cookie d'opt-out présent => rien
    const optedOut = this.isAnalyticsOptedOut();
    if (this.options.environment !== 'production' || optedOut) {
      return undefined;
    }

    // config et chargement Matomo
    // (basé sur @certible/use-matomo, car pas adapté au changement via setDocumentTitle)
    window._paq = window._paq || [];
    window._paq.push(['setTrackerUrl', `${this.options.host}/matomo.php`]);
    window._paq.push(['setSiteId', this.options.siteId]);
    window._paq.push(['setDoNotTrack', true]);

    let previousUrl = window.location.href;
    const trackPageView = () => {
      const currentUrl = window.location.href;
      // on est dans une SPA: met à jour les urls
      window._paq.push(['setReferrerUrl', previousUrl]);
      window._paq.push(['setCustomUrl', currentUrl]);
      // préfixe le documentTitle avec [Explorer]
      window._paq.push(['setDocumentTitle', `[Explorer]${document.title}`]);
      window._paq.push(['deleteCustomVariables', 'page']);
      window._paq.push(['trackPageView']);
      previousUrl = currentUrl;
    };

    trackPageView();
    window._paq.push(['enableLinkTracking']);

    const script = document.createElement('script');
    script.async = true;
    script.src = `${this.options.host}/matomo.js`;
    document.head.appendChild(script);

    // trackPageView à chaque changement de route
    router.afterEach((to, from, failure) => {
      if (failure) return;

      trackPageView();
    });
  }

  /**
   * Track un evenement utilisateur
   * 
   * @param {string} category 
   * @param {string} action 
   * @param {string} [name] 
   * @param {number} [value] 
   * @returns 
   */
  trackEvent(category, action, name, value) {
    if (!window._paq) return

    window._paq.push([
      'trackEvent',
      category,
      action,
      ...(name !== undefined ? [name] : []),
      ...(value !== undefined ? [value] : []),
    ])
  }

  /**
   * Installation du plugin
   * @param {*} app 
   */
  install(app) {
    app.provide(matomoSymbol, this);
    app.config.globalProperties.$matomo = this;
  }
}

/**
 * Créé une instance du plugin Matomo avec les options fournies.
 * 
 * @param {*} options 
 * @param {string} options.host URL du serveur Matomo
 * @param {string} options.siteId ID du site Matomo
 * @param {string} [options.environment] Environnement de l'application (ex: 'production')
 * @returns {PluginMatomo} instance du plugin Matomo
 * 
 * @example
 * const matomo = createMatomo({
 *   host: 'https://matomo.example.com',
 *   siteId: '1',
 *   environment: 'production'
 * });
 * app.use(matomo);
 */
export function createMatomo(options) {
  return new PluginMatomo(options);
}

/**
 * Utilisation du plugin Matomo dans un composant Vue 
 * pour suivre un événement utilisateur.
 * 
 * @returns {PluginMatomo} instance du plugin Matomo
 * 
 * @example
 * const matomo = useMatomo();
 * matomo.trackEvent('suggestions', 'click-add', 'Couche source', 'Couche cible');
 */
export function useMatomo() {
  const matomo = inject(matomoSymbol);
  return matomo;
}
