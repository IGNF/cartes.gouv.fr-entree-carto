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
  await import('@gouvfr/dsfr/standalone/analytics/analytics.module.standalone.js');
  window.dsfr.analytics.opt.enable();

  // config et chargement Matomo
  const { initMatomo } = await import('@certible/use-matomo');
  return initMatomo({
    host: MATOMO_HOST,
    siteId: MATOMO_SITE_ID,
    trackRouter: true,
  });
}