import { test, expect } from '@playwright/test';
import { MainPage } from './MainPage';

test.describe('02-navigation', () => {
  test('RGAA 12.7 - Lien d\'évitement vers la carte', async ({ page }) => {
    // la modale d'accueil prendrait le focus : on la marque comme déjà fermée
    await page.addInitScript(() => {
      localStorage.setItem('cartes.gouv.fr.modals', JSON.stringify(['welcome']));
    });
    const main = new MainPage(page);
    await main.goto();
    await main.wait();

    const skipLink = page.getByRole('link', { name: 'Accéder à la carte' });

    await test.step('Le lien est le premier élément atteint au clavier et visible au focus', async () => {
      await page.keyboard.press('Tab');
      await expect(skipLink).toBeFocused();
      await expect(skipLink).toBeInViewport();
    });

    await test.step('Le lien donne le focus à la carte, dans la zone de contenu principal', async () => {
      await page.keyboard.press('Enter');
      await expect(page.locator('main #mainMap')).toBeFocused();
    });
  });
});
