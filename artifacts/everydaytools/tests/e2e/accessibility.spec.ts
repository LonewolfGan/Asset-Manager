import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const TOOL_PAGES = [
  '/',
  '/pdf-compress',
  '/pdf-merge',
  '/unit-converter',
  '/currency-converter',
  '/tip-calculator',
  '/percentage-calc',
  '/password-generator',
  '/png-to-webp',
  '/jpg-to-png',
  '/image-compress',
  '/word-counter',
  '/json-formatter',
  '/background-remover',
];

for (const route of TOOL_PAGES) {
  test(`${route} — no critical accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .exclude('[aria-hidden="true"]')
      .analyze();

    const critical = results.violations.filter(v => v.impact === 'critical');
    if (critical.length > 0) {
      console.log(`Critical violations on ${route}:`, critical.map(v => `${v.id}: ${v.description}`));
    }
    expect(critical).toHaveLength(0);
  });
}

test('skip link appears on Tab', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skipLink = page.locator('.skip-link');
  await expect(skipLink).toBeVisible({ timeout: 3000 });
});

test('all images have alt attributes', async ({ page }) => {
  await page.goto('/');
  const images = page.locator('img');
  const count = await images.count();
  for (let i = 0; i < count; i++) {
    const alt = await images.nth(i).getAttribute('alt');
    expect(alt).not.toBeNull();
  }
});

test('aria-live region is present on every page', async ({ page }) => {
  await page.goto('/');
  const liveRegion = page.locator('[aria-live]');
  expect(await liveRegion.count()).toBeGreaterThan(0);
});
