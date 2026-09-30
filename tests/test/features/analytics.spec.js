import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { cleanLegacyAnalyticsStorage, initAnalytics, isAnalyticsOptedOut } from '@/features/analytics';

// spies (vi.fn()) créés à l'avance et hoisted pour les mocks qui suivent
const trackers = vi.hoisted(() => ({
  enableEulerian: vi.fn(),
  disableEulerian: vi.fn(),
  initMatomo: vi.fn(),
}));

// simulations
vi.mock('@gouvfr/dsfr/standalone/analytics/analytics.module.standalone.js', () => {
  window.dsfr.analytics.opt = {
    enable: trackers.enableEulerian,
    disable: trackers.disableEulerian,
  };
  return {};
});

vi.mock('@certible/use-matomo', () => ({
  initMatomo: trackers.initMatomo,
}));

describe('features/analytics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.cookie = 'mtm_consent_removed=; Max-Age=0; path=/';
    window.dsfr = undefined;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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
    expect(trackers.initMatomo).toHaveBeenCalledWith({
      host: 'https://matomo.ign.fr',
      siteId: '11',
      trackRouter: true,
    });
  });

  it('U-AN-05 - initAnalytics - ne charge aucun tracker hors production', async () => {
    vi.stubEnv('VITE_GPF_CONTEXT', 'development');

    await initAnalytics();

    expect(window.dsfr).toBeUndefined();
    expect(trackers.enableEulerian).not.toHaveBeenCalled();
    expect(trackers.initMatomo).not.toHaveBeenCalled();
  });

  it('U-AN-06 - initAnalytics - applique le refus aux deux outils', async () => {
    vi.stubEnv('VITE_GPF_CONTEXT', 'production');
    document.cookie = 'mtm_consent_removed=1; path=/';

    await initAnalytics();

    expect(window.dsfr).toBeUndefined();
    expect(trackers.disableEulerian).not.toHaveBeenCalled();
    expect(trackers.enableEulerian).not.toHaveBeenCalled();
    expect(trackers.initMatomo).not.toHaveBeenCalled();
  });
});