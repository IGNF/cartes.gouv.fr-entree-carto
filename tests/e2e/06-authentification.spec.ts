import { test, expect } from '@playwright/test';
import { MainPage } from './MainPage';

test.describe('06-authentification', () => {
  test('Authentification - Connexion puis deconnexion OIDC - Profil et documents synchronises', async ({ page }) => {
    const main = new MainPage(page);
    await test.step('Ouvrir la carte sans session avec un fournisseur simule', async () => {
      await main.mockAuthentication();
      await main.openAuthenticationPage();
      await expect(page).toHaveURL('http://localhost:3000/');
    });
    await test.step('Se connecter et retrouver la carte et le profil', async () => {
      await main.signIn();
      await expect(page).toHaveURL('http://localhost:3000/');
      await main.openAccountMenu();
      await expect(page.getByText('Utilisateur Test', { exact: true })).toBeVisible();
      await expect.poll(() => main.documentAuthorizations.length).toBeGreaterThanOrEqual(5);
      expect(main.documentAuthorizations.every((value) => value === 'Bearer test-access-token')).toBe(true);
    });
    await test.step('Se deconnecter sans restaurer les documents du compte precedent', async () => {
      await main.signOut();
      await expect(page).toHaveURL('http://localhost:3000/');
      await expect(page.getByText('Utilisateur Test', { exact: true })).toHaveCount(0);
    });
  });

  test('Authentification - Callback silencieux - Le message OIDC est relaye a la meme origine', async ({ page }) => {
    await test.step('Ouvrir le callback statique et son script', async () => {
      await page.addInitScript(() => {
        window.addEventListener('message', (event) => {
          if (event.origin === location.origin && event.data.source === 'oidc-client') {
            document.documentElement.dataset.oidcCallback = event.data.keepOpen === false ? 'received' : 'invalid';
          }
        });
      });
      await page.goto('http://localhost:3000/silent-renew.html?state=test');
    });
    await test.step('Verifier que le script a effectivement execute le protocole attendu', async () => {
      await expect(page.locator('html')).toHaveAttribute('data-oidc-callback', 'received');
    });
  });
});