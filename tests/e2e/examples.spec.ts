import { test, expect } from '@playwright/test';
import { MainPage } from './MainPage';

test('Main page has title', async ({ page }) => {
  const main = new MainPage(page);
  await main.goto();
  await main.wait();

  // Expect a title "to contain" a substring.
  await main.checkMainPageTitle();
});
