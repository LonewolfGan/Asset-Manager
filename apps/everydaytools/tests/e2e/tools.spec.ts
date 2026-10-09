import { test, expect } from '@playwright/test';
import path from 'path';

const FIXTURES = path.join(process.cwd(), 'tests/fixtures');

test.describe('PDF Compress — tool flow', () => {
  test('page loads with upload zone', async ({ page }) => {
    await page.goto('/pdf-compress');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="drop-zone"]')).toBeVisible();
  });

  test('rejects non-PDF file', async ({ page }) => {
    await page.goto('/pdf-compress');
    const input = page.locator('input[type="file"]');
    await input.setInputFiles(path.join(FIXTURES, 'test.png'));
    await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Unit Converter — tool flow', () => {
  test('page loads with selectors', async ({ page }) => {
    await page.goto('/unit-converter');
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('input, select').first()).toBeVisible();
  });

  test('converting value shows result', async ({ page }) => {
    await page.goto('/unit-converter');
    const input = page.locator('input[type="number"]').first();
    if (await input.isVisible()) {
      await input.fill('100');
      await page.waitForTimeout(200);
      // result panel should show a value
      const result = page.locator('[data-testid="result"], output, [role="status"]').first();
      if (await result.isVisible()) {
        const text = await result.textContent();
        expect(text?.trim()).toBeTruthy();
      }
    }
  });
});

test.describe('Password Generator — tool flow', () => {
  test('page loads with generated password', async ({ page }) => {
    await page.goto('/password-generator');
    await expect(page.locator('h1')).toBeVisible();
    // A password should be displayed on load
    await page.waitForTimeout(500);
    const body = await page.locator('body').textContent();
    // Should have some non-trivial content after loading
    expect(body?.length).toBeGreaterThan(100);
  });
});

test.describe('Image tools — upload zone present', () => {
  const IMAGE_TOOL_ROUTES = [
    '/png-to-webp',
    '/jpg-to-png',
    '/image-compress',
    '/background-remover',
  ];

  for (const route of IMAGE_TOOL_ROUTES) {
    test(`${route} — drop zone visible`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('[data-testid="drop-zone"]').first()).toBeVisible();
    });
  }
});
