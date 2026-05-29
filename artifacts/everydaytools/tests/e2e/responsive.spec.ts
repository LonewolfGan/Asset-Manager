import { test, expect } from '@playwright/test';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPad', width: 768, height: 1024 },
  { name: 'Desktop', width: 1280, height: 800 },
];

const PAGES_TO_TEST = ['/', '/unit-converter', '/png-to-webp', '/password-generator'];

for (const viewport of VIEWPORTS) {
  for (const route of PAGES_TO_TEST) {
    test(`${route} — ${viewport.name} — no horizontal overflow`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route);
      await page.waitForLoadState('networkidle');

      const hasHorizontalScroll = await page.evaluate(() =>
        document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
      );
      expect(hasHorizontalScroll).toBe(false);
    });
  }
}

test('inputs have font-size >= 16px on mobile (prevents iOS zoom)', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/unit-converter');
  const inputs = await page.locator('input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), select').all();
  for (const input of inputs) {
    if (await input.isVisible()) {
      const fontSize = await input.evaluate(el =>
        parseFloat(window.getComputedStyle(el).fontSize)
      );
      expect(fontSize).toBeGreaterThanOrEqual(16);
    }
  }
});

test('nav is accessible on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');
  const hamburger = page.locator('[data-testid="hamburger-menu"]');
  await expect(hamburger).toBeVisible();
});
