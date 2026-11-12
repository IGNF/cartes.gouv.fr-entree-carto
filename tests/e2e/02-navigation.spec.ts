import { test, expect } from '@playwright/test';
import { MainPage } from './MainPage';

test.describe('02-navigation', () => {
  test('RGAA 12.7 - Liens d\'évitement', async ({ page }) => {
    // la modale d'accueil prendrait le focus : on la marque comme déjà fermée
    await page.addInitScript(() => {
      localStorage.setItem('cartes.gouv.fr.modals', JSON.stringify(['welcome']));
    });
    const main = new MainPage(page);
    await main.goto();
    await main.wait();

    const skipLinks = page.getByRole('navigation', { name: 'Accès rapide' }).getByRole('link');

    await test.step('Les liens pointent vers des éléments visibles de la page', async () => {
      await expect(skipLinks).toHaveText(['Contenu principal', 'Navigation principale', 'Rechercher', 'Pied de page']);
      for (const href of await skipLinks.evaluateAll((links) => links.map((link) => link.getAttribute('href')))) {
        await expect(page.locator(href!)).toBeVisible();
      }
    });

    await test.step('Le premier lien est le premier élément atteint au clavier et visible au focus', async () => {
      await page.keyboard.press('Tab');
      await expect(skipLinks.first()).toBeFocused();
      await expect(skipLinks.first()).toBeInViewport();
    });

    await test.step('Le lien "Contenu principal" donne le focus à la carte', async () => {
      await page.keyboard.press('Enter');
      await expect(page.locator('main #mainMap')).toBeFocused();
    });

    await test.step('Le lien "Navigation principale" donne le focus au premier bouton du menu', async () => {
      await page.getByRole('link', { name: 'Navigation principale' }).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('#aide-button')).toBeFocused();
    });

    await test.step('Le lien "Rechercher" donne le focus au champ de recherche', async () => {
      await page.getByRole('link', { name: 'Rechercher' }).focus();
      await page.keyboard.press('Enter');
      await expect(page.locator('input.GPsearchInputText')).toBeFocused();
    });
  });
});
