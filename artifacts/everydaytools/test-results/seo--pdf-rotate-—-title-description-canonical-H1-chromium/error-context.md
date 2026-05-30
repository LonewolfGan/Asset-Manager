# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seo.spec.ts >> /pdf-rotate — title, description, canonical, H1
- Location: tests/e2e/seo.spec.ts:14:3

# Error details

```
Error: expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - link "Skip to main content" [ref=e4] [cursor=pointer]:
      - /url: "#main-content"
    - navigation [ref=e6]:
      - generic [ref=e7]:
        - link "EverydayTools" [ref=e8] [cursor=pointer]:
          - /url: /
          - img [ref=e9]
          - generic [ref=e14]: EverydayTools
        - generic [ref=e15]:
          - button "PDF Tools" [ref=e17] [cursor=pointer]:
            - text: PDF Tools
            - img [ref=e18]
          - button "Documents" [ref=e21] [cursor=pointer]:
            - text: Documents
            - img [ref=e22]
          - button "Images" [ref=e25] [cursor=pointer]:
            - text: Images
            - img [ref=e26]
          - button "Text & Code" [ref=e29] [cursor=pointer]:
            - text: Text & Code
            - img [ref=e30]
          - button "Tools" [ref=e33] [cursor=pointer]:
            - text: Tools
            - img [ref=e34]
        - generic [ref=e36]:
          - img [ref=e37]
          - searchbox "Search tools" [ref=e40]
        - generic [ref=e41]:
          - generic [ref=e42]:
            - button "EN" [ref=e43] [cursor=pointer]
            - button "FR" [ref=e44] [cursor=pointer]
          - button "Toggle theme" [ref=e45] [cursor=pointer]:
            - img [ref=e46]
    - main [ref=e48]:
      - generic [ref=e49]: Loading…
    - contentinfo [ref=e50]:
      - generic [ref=e51]:
        - generic [ref=e52]:
          - link "EverydayTools" [ref=e53] [cursor=pointer]:
            - /url: /
            - img [ref=e54]
            - generic [ref=e59]: EverydayTools
          - paragraph [ref=e60]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e61]:
          - heading "PDF Tools" [level=3] [ref=e62]
          - list [ref=e63]:
            - listitem [ref=e64]:
              - link "PDF to Word" [ref=e65] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e66]:
              - link "PDF to Text" [ref=e67] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e68]:
              - link "Compress PDF" [ref=e69] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e70]:
              - link "Merge PDFs" [ref=e71] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e72]:
              - link "Split PDF" [ref=e73] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e74]:
              - link "Protect PDF" [ref=e75] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e76]:
          - heading "Image Tools" [level=3] [ref=e77]
          - list [ref=e78]:
            - listitem [ref=e79]:
              - link "Image Converter" [ref=e80] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e81]:
              - link "Background Remover" [ref=e82] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e83]:
              - link "Compress Image" [ref=e84] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e85]:
              - link "Resize Image" [ref=e86] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e87]:
              - link "HEIC to JPG" [ref=e88] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e89]:
              - link "Image to PDF" [ref=e90] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e91]:
          - heading "Utilities" [level=3] [ref=e92]
          - list [ref=e93]:
            - listitem [ref=e94]:
              - link "Metadata Cleaner" [ref=e95] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e96]:
              - link "AI Text Scrubber" [ref=e97] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e98]:
              - link "Password Generator" [ref=e99] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e100]:
              - link "Currency Converter" [ref=e101] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e102]:
              - link "Unit Converter" [ref=e103] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e104]:
              - link "Percentage Calculator" [ref=e105] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e106]:
        - generic [ref=e107]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e108]:
          - link "Privacy Policy" [ref=e109] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e110] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e111] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e112]:
      - paragraph [ref=e113]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e114]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e115] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e116]:
        - button "Essential only" [ref=e117] [cursor=pointer]
        - button "Accept all" [ref=e118] [cursor=pointer]
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const ALL_TOOL_ROUTES = [
  4  |   '/',
  5  |   '/pdf-compress', '/pdf-merge', '/pdf-split', '/pdf-rotate',
  6  |   '/pdf-unlock', '/pdf-protect', '/pdf-watermark', '/pdf-page-numbers',
  7  |   '/pdf-to-word', '/pdf-to-text', '/pdf-to-image',
  8  |   '/unit-converter', '/currency-converter', '/tip-calculator', '/percentage-calc',
  9  |   '/password-generator',
  10 |   '/png-to-webp', '/jpg-to-png', '/image-compress',
  11 | ];
  12 | 
  13 | for (const route of ALL_TOOL_ROUTES) {
  14 |   test(`${route} — title, description, canonical, H1`, async ({ page }) => {
  15 |     await page.goto(route);
  16 | 
  17 |     // Title: non-empty, reasonable length
  18 |     const title = await page.title();
  19 |     expect(title.length).toBeGreaterThan(5);
  20 |     expect(title.length).toBeLessThanOrEqual(70);
  21 | 
  22 |     // Meta description
  23 |     const desc = await page.locator('meta[name="description"]').getAttribute('content');
  24 |     expect(desc).not.toBeNull();
  25 |     if (desc) {
  26 |       expect(desc.length).toBeGreaterThan(20);
  27 |     }
  28 | 
  29 |     // H1 — exactly one
  30 |     const h1Count = await page.locator('h1').count();
> 31 |     expect(h1Count).toBeGreaterThanOrEqual(1);
     |                     ^ Error: expect(received).toBeGreaterThanOrEqual(expected)
  32 |   });
  33 | }
  34 | 
  35 | test('sitemap.xml exists and contains URLs', async ({ page }) => {
  36 |   const response = await page.request.get('/sitemap.xml');
  37 |   expect(response.status()).toBe(200);
  38 |   const body = await response.text();
  39 |   expect(body).toContain('<?xml');
  40 |   expect(body).toContain('<urlset');
  41 |   expect(body).toContain('<loc>');
  42 | });
  43 | 
  44 | test('robots.txt exists and allows crawling', async ({ page }) => {
  45 |   const response = await page.request.get('/robots.txt');
  46 |   expect(response.status()).toBe(200);
  47 |   const body = await response.text();
  48 |   expect(body).toContain('User-agent');
  49 |   expect(body).toContain('Sitemap');
  50 | });
  51 | 
  52 | test('no two tool pages have the same title', async ({ page }) => {
  53 |   const titles: string[] = [];
  54 |   const routes = ALL_TOOL_ROUTES.filter(r => r !== '/');
  55 |   for (const route of routes) {
  56 |     await page.goto(route);
  57 |     const title = await page.title();
  58 |     expect(titles).not.toContain(title);
  59 |     titles.push(title);
  60 |   }
  61 | });
  62 | 
  63 | test('JSON-LD schema present on tool pages', async ({ page }) => {
  64 |   await page.goto('/pdf-compress');
  65 |   const scripts = page.locator('script[type="application/ld+json"]');
  66 |   expect(await scripts.count()).toBeGreaterThan(0);
  67 |   const content = await scripts.first().textContent();
  68 |   expect(() => JSON.parse(content!)).not.toThrow();
  69 |   const schema = JSON.parse(content!);
  70 |   expect(schema['@type']).toBeTruthy();
  71 | });
  72 | 
```