import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, createApp, effectScope } from 'vue';
import { createAuth, createAuthFetch, useAuth, resetAuth } from 'authentification-vue-oidc';
import { createPinia, setActivePinia } from 'pinia';
import { createAuthOptions } from '@/config/authentification-options.js';
import { useServiceSyncDocuments } from '@/services/ServiceSyncDocuments';
import { useServiceStore } from '@/stores/serviceStore';

let stop;
beforeEach(() => setActivePinia(createPinia()));
afterEach(() => {
  stop?.();
  resetAuth();
  localStorage.clear();
  sessionStorage.clear();
});

describe('Integration OIDC', () => {
  it('U-AU-01 - configuration - respecte le sous-repertoire et exclut le secret', () => {
    const options = createAuthOptions({
      BASE_URL: '/cartes/', IAM_URL: 'https://sso.example.org', IAM_REALM: 'realm',
      IAM_CLIENT_ID: 'public', IAM_ENTREPOT_API_URL: 'https://api.example.org',
      IAM_CLIENT_SECRET: 'obsolete',
      IAM_SCOPE: 'openid,profile,email',
    }, 'https://cartes.example.org');
    expect(options.redirectUri).toBe('https://cartes.example.org/cartes/login');
    expect(options.silentRedirectUri).toBe('https://cartes.example.org/cartes/silent-renew.html');
    expect(options.apiBaseUrls).toEqual(['https://api.example.org']);
    expect(options.scope).toBe('openid profile email');
    expect(options).not.toHaveProperty('clientSecret');
  });

  it('U-AU-03 - synchronisation - charge une session restauree et ignore une reponse apres logout', async () => {
    let resolveDocuments;
    const auth = { isAuthenticated: ref(true), user: ref({ sub: 'account' }) };
    const service = {
      resetDocuments: vi.fn(),
      getDocuments: vi.fn(() => new Promise((resolve) => { resolveDocuments = resolve; })),
    };
    const store = useServiceStore();
    const emitter = { dispatchEvent: vi.fn() };
    stop = useServiceSyncDocuments(auth, service, store, emitter, vi.fn());
    expect(store.authentificated).toBe(true);
    expect(service.getDocuments).toHaveBeenCalledTimes(1);
    auth.user.value = { sub: 'account', name: 'updated' };
    expect(service.getDocuments).toHaveBeenCalledTimes(1);
    auth.isAuthenticated.value = false;
    resolveDocuments([]);
    await Promise.resolve();
    expect(store.authentificated).toBe(false);
    expect(emitter.dispatchEvent).not.toHaveBeenCalled();
  });

  it('U-AU-05 - synchronisation - arrete le watcher et ignore les reponses au demontage', async () => {
    let resolveDocuments;
    const auth = { isAuthenticated: ref(true), user: ref({ sub: 'account' }) };
    const service = {
      resetDocuments: vi.fn(),
      getDocuments: vi.fn(() => new Promise((resolve) => { resolveDocuments = resolve; })),
    };
    const emitter = { dispatchEvent: vi.fn() };
    const onError = vi.fn();
    const scope = effectScope();
    scope.run(() => {
      stop = useServiceSyncDocuments(auth, service, useServiceStore(), emitter, onError);
    });
    scope.stop();
    resolveDocuments([{ status: 'rejected', reason: new Error('late error') }]);
    await Promise.resolve();
    auth.user.value = { sub: 'other-account' };
    expect(service.getDocuments).toHaveBeenCalledTimes(1);
    expect(emitter.dispatchEvent).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it('U-AU-04 - fetch officiel - utilise le token courant et limite le Bearer a la base autorisee', async () => {
    createApp({}).use(createAuth({
      authority: 'https://sso.example.org/realms/test', clientId: 'public',
      redirectUri: `${location.origin}/login`, silentRestore: false,
      apiBaseUrls: ['https://api.example.org/private'],
    }));
    const token = vi.spyOn(useAuth(), 'getAccessToken')
      .mockResolvedValueOnce('first-token').mockResolvedValueOnce('second-token');
    const fetcher = vi.fn(async () => new Response('{}'));
    const authenticatedFetch = createAuthFetch(fetcher);
    const form = new FormData();
    form.append('name', 'drawing');
    const controller = new AbortController();
    await authenticatedFetch('https://api.example.org/private/documents', {
      method: 'POST', headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: form, signal: controller.signal,
    });
    const request = fetcher.mock.calls[0][0];
    expect(request.headers.get('Authorization')).toBe('Bearer first-token');
    expect(request.headers.get('X-Requested-With')).toBe('XMLHttpRequest');
    expect((await request.formData()).get('name')).toBe('drawing');
    controller.abort();
    expect(request.signal.aborted).toBe(true);
    await authenticatedFetch('https://api.example.org/private/documents');
    expect(fetcher.mock.calls[1][0].headers.get('Authorization')).toBe('Bearer second-token');
    await authenticatedFetch('https://api.example.org/private-other');
    expect(fetcher.mock.calls[2][0].headers.has('Authorization')).toBe(false);
    expect(token).toHaveBeenCalledTimes(2);
  });
});