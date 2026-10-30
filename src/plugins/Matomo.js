import { inject } from 'vue';

import router from '@/router';

const matomoSymbol = Symbol('vue-matomo-plugin');

const MATOMO_OPTOUT_COOKIE = 'mtm_consent_removed';
  
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
   * Installation du plugin
   * @param {*} app 
   */
  install(app) {
    app.provide(matomoSymbol, this);
    app.config.globalProperties.$matomo = this;
  }
}

export function createMatomo(options) {
  return new PluginMatomo(options);
}

export function useMatomo() {
  const matomo = inject(matomoSymbol);
  return matomo;
}
