import router from '@/router';

const LEGACY_EULERIAN_STORAGE_KEY = '@codegouvfr/react-dsfr finalityConsent eulerianAnalytics';
const MATOMO_OPTOUT_COOKIE = 'mtm_consent_removed';
const MATOMO_HOST = 'https://matomo.ign.fr';
const MATOMO_SITE_ID = '11';

function hasCookie(name, cookie = document.cookie) {
  return cookie.split(';').some((item) => item.trim().split('=')[0] === name);
}

export function cleanLegacyAnalyticsStorage(storage = localStorage) {
  storage.removeItem(LEGACY_EULERIAN_STORAGE_KEY);
}

export function isAnalyticsOptedOut({
  cookie = document.cookie,
} = {}) {
  return hasCookie(MATOMO_OPTOUT_COOKIE, cookie);
}

/** @returns {Promise<void>} */
export async function initAnalytics() {
  cleanLegacyAnalyticsStorage();

  // si pas en production ou cookie d'opt-out présent => rien
  const optedOut = isAnalyticsOptedOut();
  if (import.meta.env.VITE_GPF_CONTEXT !== 'production' || optedOut) {
    return undefined;
  }

  // config et chargement Eulerian
  if (!window.dsfr?.analytics) {
    window.dsfr = {
      analytics: {
        domain: 'acwg.cartes.gouv.fr',
        site: {
          environment: import.meta.env.MODE === 'production' ? 'production' : 'development',
          entity: 'IGN',
        },
      },
    };
  }
  try {
    await import('@gouvfr/dsfr/standalone/analytics/analytics.module.standalone.js');
    window.dsfr.analytics.opt.enable();
  } catch (error) {
    console.error('Eulerian initialization failed', error);
  }

  // config et chargement Matomo
  // (basé sur @certible/use-matomo, car pas adapté au changement via setDocumentTitle)
  window._paq = window._paq || [];
  window._paq.push(['setTrackerUrl', `${MATOMO_HOST}/matomo.php`]);
  window._paq.push(['setSiteId', MATOMO_SITE_ID]);
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
  script.src = `${MATOMO_HOST}/matomo.js`;
  document.head.appendChild(script);

  // trackPageView à chaque changement de route
  router.afterEach((to, from, failure) => {
    if (failure) return;

    trackPageView();
  });
}