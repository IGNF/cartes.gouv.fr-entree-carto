// https://playwright.dev/docs/pom
// https://playwright.dev/docs/api/class-page
// https://github.com/ortoniKC/Playwright-Test-Runner/blob/main/customWaits/waitForTitle.test.ts

import { expect, type Page } from '@playwright/test';
import { Buffer } from 'node:buffer';

export class MainPage {
  readonly page: Page;
  readonly route: string;
  readonly documentAuthorizations: string[] = [];

  constructor(page: Page) {
    this.page = page;
    this.route = "/";
  }

  async goto() {
    await this.page.goto(this.route);
  }

  async mockAuthentication() {
    let nonce = '';
    const authority = 'https://sso.geopf.fr/realms/geoplateforme';
    const profile = { sub: 'test-user', name: 'Utilisateur Test', email: 'test@example.org' };
    await this.page.context().route('**/*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      const headers = {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'authorization,content-type,x-requested-with',
        'access-control-allow-methods': 'GET,POST,PUT,DELETE,OPTIONS',
      };
      const json = (body: unknown) => route.fulfill({ headers, json: body });
      if (url.origin === 'http://localhost:3000') return route.continue();
      if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers });
      if (url.href === `${authority}/.well-known/openid-configuration`) {
        return json({
          issuer: authority,
          authorization_endpoint: `${authority}/protocol/openid-connect/auth`,
          token_endpoint: `${authority}/protocol/openid-connect/token`,
          userinfo_endpoint: `${authority}/protocol/openid-connect/userinfo`,
          end_session_endpoint: `${authority}/protocol/openid-connect/logout`,
        });
      }
      if (url.pathname.endsWith('/openid-connect/auth')) {
        const callback = new URL(url.searchParams.get('redirect_uri')!);
        callback.searchParams.set('state', url.searchParams.get('state')!);
        if (url.searchParams.get('prompt') === 'none') {
          callback.searchParams.set('error', 'login_required');
        } else {
          nonce = url.searchParams.get('nonce') || '';
          callback.searchParams.set('code', 'test-code');
        }
        return route.fulfill({ status: 302, headers: { location: callback.href } });
      }
      if (url.pathname.endsWith('/openid-connect/token')) {
        const now = Math.floor(Date.now() / 1000);
        const encode = (value: unknown) => Buffer.from(JSON.stringify(value)).toString('base64url');
        const idToken = `${encode({ alg: 'RS256' })}.${encode({
          ...profile, nonce, iss: authority, aud: 'cartes-gouv-public', iat: now, exp: now + 3600,
        })}.test-signature`;
        return json({
          access_token: 'test-access-token', id_token: idToken, token_type: 'Bearer',
          expires_in: 3600, scope: 'openid profile email',
        });
      }
      if (url.pathname.endsWith('/openid-connect/userinfo')) return json(profile);
      if (url.pathname.endsWith('/openid-connect/logout')) {
        return route.fulfill({ status: 302, headers: { location: url.searchParams.get('post_logout_redirect_uri')! } });
      }
      if (url.origin === 'https://data.geopf.fr' && url.pathname === '/api/users/me/documents') {
        this.documentAuthorizations.push(request.headers().authorization || '');
        return json([]);
      }
      return route.abort();
    });
  }

  async openAuthenticationPage() {
    await this.page.goto('http://localhost:3000/');
    await expect(this.page.getByRole('button', { name: 'Se connecter', exact: true }).first()).toBeEnabled();
    await this.page.getByRole('dialog').getByText('Ne plus afficher', { exact: true }).click();
    await expect(this.page.getByRole('dialog').getByRole('checkbox', { name: 'Ne plus afficher', exact: true })).toBeChecked();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Fermer', exact: true }).click();
  }

  async signIn() {
    await this.page.getByRole('button', { name: 'Se connecter', exact: true }).first().click();
    await expect(this.page.getByRole('button', { name: 'Mon espace', exact: true })).toBeVisible();
  }

  async openAccountMenu() {
    await this.page.getByRole('button', { name: 'Mon espace', exact: true }).click();
  }

  async signOut() {
    await this.page.getByRole('button', { name: 'Se déconnecter', exact: true }).click();
    await expect(this.page.getByRole('button', { name: 'Se connecter', exact: true }).first()).toBeVisible();
  }

  async waitForMapAndLayersReady(options?: { timeoutMs?: number }) {
    const timeoutMs = options?.timeoutMs ?? 15000;

    await this.page.waitForLoadState('domcontentloaded');

    const mapViewport = this.page.locator('.ol-viewport');
    await expect(mapViewport).toBeVisible({ timeout: timeoutMs });
    await expect(mapViewport.locator('canvas').first()).toBeVisible({ timeout: timeoutMs });

    // Signal emitted by Carto.vue once Layers.vue has emitted "ready".
    await expect(this.page.locator('.ol-map-fully-loaded')).toBeVisible({ timeout: timeoutMs });
  }

  async waitForControlsReady(options?: { timeoutMs?: number }) {
    const timeoutMs = options?.timeoutMs ?? 15000;

    await this.page.waitForLoadState('domcontentloaded');

    const mapViewport = this.page.locator('.ol-viewport');
    await expect(mapViewport).toBeVisible({ timeout: timeoutMs });
    await expect(mapViewport.locator('canvas').first()).toBeVisible({ timeout: timeoutMs });

    // Signal emitted by Carto.vue once Controls.vue has emitted "ready".
    await expect(this.page.locator('.ol-controls-fully-loaded')).toBeVisible({ timeout: timeoutMs });
  }

  async wait() {
    await this.waitForMapAndLayersReady();
    await this.waitForControlsReady();
  }

  async checkMainPageTitle() {
    await expect(this.page).toHaveTitle(/cartes.gouv.fr | Explorer les cartes/);
  }
}