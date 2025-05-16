// https://playwright.dev/docs/pom
// https://playwright.dev/docs/api/class-page
// https://github.com/ortoniKC/Playwright-Test-Runner/blob/main/customWaits/waitForTitle.test.ts

import { expect, type Locator, type Page } from '@playwright/test';

export class MainPage {
  readonly page: Page;
  readonly route: string;

  constructor(page: Page) {
    this.page = page;
    this.route = "/";
  }

  async goto() {
    await this.page.goto(this.route);
  }

  async wait() {
    await this.page.waitForLoadState('domcontentloaded');
    const canvas = this.page.locator('canvas');
    await canvas.waitFor();
  }

  async checkMainPageTitle() {
    await expect(this.page).toHaveTitle(/Le service public des cartes et données du territoire | cartes.gouv.fr/);
  }
}