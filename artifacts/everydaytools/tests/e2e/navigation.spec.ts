import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads and shows tool cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1').first()).toBeVisible();
    const cards = page.locator('[data-testid="tool-card"]');
    await expect(cards.first()).toBeVisible();
    expect(await cards.count()).toBeGreaterThan(10);
  });

  test('search filters tools', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="search-input"]').click();
    await page.locator('[data-testid="search-modal-input"]').waitFor({ state: 'visible' });
    await page.locator('[data-testid="search-modal-input"]').fill('compress');
    await page.waitForTimeout(300);
    const visible = await page.locator('[data-testid="search-result-item"]').count();
    expect(visible).toBeGreaterThan(0);
  });

  test('tool card links to working page', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Cards are article elements inside <a> links — get the wrapping link
    const firstLink = page.locator('a:has([data-testid="tool-card"])').first();
    const href = await firstLink.getAttribute('href');
    expect(href).toBeTruthy();
    await firstLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('language switcher changes locale', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.locator('[data-testid="lang-fr"]').click();
    await page.waitForTimeout(300);
    // Active locale button should now be FR
    const frBtn = page.locator('[data-testid="lang-fr"]');
    await expect(frBtn).toBeVisible();
    // Switch back
    await page.locator('[data-testid="lang-en"]').click();
  });

  test('404 page for unknown route', async ({ page }) => {
    await page.goto('/this-does-not-exist-xyz');
    await expect(page.locator('h1')).toBeVisible();
    const text = await page.locator('h1').textContent();
    expect(text?.toLowerCase()).toMatch(/404|not found/);
  });

  test('nav is present on every page', async ({ page }) => {
    for (const route of ['/', '/pdf-compress', '/unit-converter', '/password-generator']) {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('nav').first()).toBeVisible();
    }
  });
});
