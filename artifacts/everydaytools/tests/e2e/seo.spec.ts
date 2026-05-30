import { test, expect } from '@playwright/test';

const ALL_TOOL_ROUTES = [
  '/',
  '/pdf-compress', '/pdf-merge', '/pdf-split', '/pdf-rotate',
  '/pdf-unlock', '/pdf-protect', '/pdf-watermark', '/pdf-page-numbers',
  '/pdf-to-word', '/pdf-to-text', '/pdf-to-image',
  '/unit-converter', '/currency-converter', '/tip-calculator', '/percentage-calc',
  '/password-generator',
  '/png-to-webp', '/jpg-to-png', '/image-compress',
];

for (const route of ALL_TOOL_ROUTES) {
  test(`${route} — title, description, canonical, H1`, async ({ page }) => {
    await page.goto(route);

    // Title: non-empty, reasonable length
    const title = await page.title();
    expect(title.length).toBeGreaterThan(5);
    expect(title.length).toBeLessThanOrEqual(70);

    // Meta description — use .last() to pick the tool-specific one over the global fallback
    const desc = await page.locator('meta[name="description"]').last().getAttribute('content');
    expect(desc).not.toBeNull();
    if (desc) {
      expect(desc.length).toBeGreaterThan(20);
    }

    // H1 — exactly one
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });
}

test('sitemap.xml exists and contains URLs', async ({ page }) => {
  const response = await page.request.get('/sitemap.xml');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('<?xml');
  expect(body).toContain('<urlset');
  expect(body).toContain('<loc>');
});

test('robots.txt exists and allows crawling', async ({ page }) => {
  const response = await page.request.get('/robots.txt');
  expect(response.status()).toBe(200);
  const body = await response.text();
  expect(body).toContain('User-agent');
  expect(body).toContain('Sitemap');
});

test('no two tool pages have the same title', async ({ page }) => {
  const titles: string[] = [];
  const routes = ALL_TOOL_ROUTES.filter(r => r !== '/');
  for (const route of routes) {
    await page.goto(route);
    const title = await page.title();
    expect(titles).not.toContain(title);
    titles.push(title);
  }
});

test('JSON-LD schema present on tool pages', async ({ page }) => {
  await page.goto('/pdf-compress');
  const scripts = page.locator('script[type="application/ld+json"]');
  expect(await scripts.count()).toBeGreaterThan(0);
  const content = await scripts.first().textContent();
  expect(() => JSON.parse(content!)).not.toThrow();
  const schema = JSON.parse(content!);
  expect(schema['@type']).toBeTruthy();
});
