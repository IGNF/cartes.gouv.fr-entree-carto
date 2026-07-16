// https://playwright.dev/docs/pom
// https://playwright.dev/docs/api/class-page
// https://github.com/ortoniKC/Playwright-Test-Runner/blob/main/customWaits/waitForTitle.test.ts

import { expect, type Page } from '@playwright/test';

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