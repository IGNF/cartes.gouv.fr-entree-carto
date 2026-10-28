import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { cleanLegacyAnalyticsStorage, initAnalytics, isAnalyticsOptedOut } from '@/features/analytics';

// spies (vi.fn()) créés à l'avance et hoisted pour les mocks qui suivent
const trackers = vi.hoisted(() => ({
  enableEulerian: vi.fn(),
  disableEulerian: vi.fn(),
  afterEach: vi.fn(),
}));

vi.mock('@/router', () => ({
  default: { afterEach: trackers.afterEach },
}));

// simulations
vi.mock('@gouvfr/dsfr/standalone/analytics/analytics.module.standalone.js', () => {
  window.dsfr.analytics.opt = {
    enable: trackers.enableEulerian,
    disable: trackers.disableEulerian,
  };
  return {};
});

describe('features/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.cookie = 'mtm_consent_removed=; Max-Age=0; path=/';
    window.dsfr = undefined;
    window._paq = [];
    vi.spyOn(document.head, 'appendChild').mockImplementation((script) => script);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
    delete window._paq;
  });

  it('U-AN-01 - cleanLegacyAnalyticsStorage - supprime la cle Eulerian historique', () => {
    // Ce faux storage enregistre l'appel sans modifier le localStorage du navigateur.
    const storage = {
      removeItem: vi.fn(),
    };

    cleanLegacyAnalyticsStorage(storage);

    expect(storage.removeItem).toHaveBeenCalledWith(
      '@codegouvfr/react-dsfr finalityConsent eulerianAnalytics',
    );
  });

  it('U-AN-02 - isAnalyticsOptedOut - détecte le cookie de refus Matomo partagé', () => {
    expect(isAnalyticsOptedOut({ cookie: 'mtm_consent_removed=1' })).toBe(true);
  });

  it('U-AN-03 - isAnalyticsOptedOut - autorise la collecte sans cookie de refus', () => {
    expect(isAnalyticsOptedOut({ cookie: '' })).toBe(false);
  });

  it('U-AN-04 - initAnalytics - démarre Eulerian et Matomo sans refus', async () => {
    vi.stubEnv('VITE_GPF_CONTEXT', 'production');

    await initAnalytics();

    expect(trackers.enableEulerian).toHaveBeenCalledOnce();
    expect(trackers.disableEulerian).not.toHaveBeenCalled();
    expect(document.head.appendChild).toHaveBeenCalledOnce();
    expect(document.head.appendChild.mock.calls[0][0].src).toBe('https://matomo.ign.fr/matomo.js');
    expect(window._paq).toContainEqual(['setTrackerUrl', 'https://matomo.ign.fr/matomo.php']);
    expect(window._paq).toContainEqual(['setSiteId', '11']);
    expect(window._paq).toContainEqual(['setDoNotTrack', true]);
    expect(window._paq.filter(([command]) => command === 'trackPageView')).toHaveLength(1);
    expect(window._paq).toContainEqual(['setDocumentTitle', `[Explorer]${document.title}`]);

    const initialTitle = document.title;
    const initialUrl = window.location.href;
    try {
      window.history.pushState({}, '', '/nouvelle-page');
      document.title = 'Nouvelle page';
      trackers.afterEach.mock.calls[0][0]({ fullPath: '/nouvelle-page' }, { fullPath: '/' });
      expect(window._paq.filter(([command]) => command === 'trackPageView')).toHaveLength(2);
      expect(window._paq).toContainEqual(['setDocumentTitle', '[Explorer]Nouvelle page']);
      expect(window._paq).toContainEqual(['setReferrerUrl', initialUrl]);
      expect(window._paq).toContainEqual(['setCustomUrl', window.location.href]);
      expect(document.title).toBe('Nouvelle page');

      trackers.afterEach.mock.calls[0][0]({}, {}, new Error('Navigation annulée'));
      expect(window._paq.filter(([command]) => command === 'trackPageView')).toHaveLength(2);
    } finally {
      document.title = initialTitle;
      window.history.replaceState({}, '', initialUrl);
    }
  });

  it('U-AN-05 - initAnalytics - charge Matomo même si Eulerian échoue', async () => {
    vi.stubEnv('VITE_GPF_CONTEXT', 'production');
    const eulerianError = new Error('Eulerian indisponible');
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
    trackers.enableEulerian.mockImplementationOnce(() => {
      throw eulerianError;
    });
    window.dsfr = {
      analytics: {
        opt: { enable: trackers.enableEulerian },
      },
    };

    await expect(initAnalytics()).resolves.toBeUndefined();

    expect(consoleError).toHaveBeenCalledWith('Eulerian initialization failed', eulerianError);
    expect(document.head.appendChild).toHaveBeenCalledOnce();
    expect(document.head.appendChild.mock.calls[0][0].src).toBe('https://matomo.ign.fr/matomo.js');
    expect(window._paq.filter(([command]) => command === 'trackPageView')).toHaveLength(1);
    expect(trackers.afterEach).toHaveBeenCalledOnce();
  });

  it('U-AN-06 - initAnalytics - ne charge aucun tracker hors production', async () => {
    vi.stubEnv('VITE_GPF_CONTEXT', 'development');

    await initAnalytics();

    expect(window.dsfr).toBeUndefined();
    expect(trackers.enableEulerian).not.toHaveBeenCalled();
  });

  it('U-AN-07 - initAnalytics - applique le refus aux deux outils', async () => {
    vi.stubEnv('VITE_GPF_CONTEXT', 'production');
    document.cookie = 'mtm_consent_removed=1; path=/';

    await initAnalytics();

    expect(window.dsfr).toBeUndefined();
    expect(trackers.disableEulerian).not.toHaveBeenCalled();
    expect(trackers.enableEulerian).not.toHaveBeenCalled();
  });
});