# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> /png-to-webp — iPhone SE — no horizontal overflow
- Location: tests/e2e/responsive.spec.ts:13:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: false
Received: true
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
        - button "Open menu" [ref=e16] [cursor=pointer]:
          - img [ref=e17]
    - main [ref=e19]:
      - generic [ref=e20]:
        - generic [ref=e21]:
          - generic [ref=e22]:
            - link "Home" [ref=e23] [cursor=pointer]:
              - /url: /
            - img [ref=e24]
          - generic [ref=e26]:
            - generic [ref=e27]: Image Tools
            - img [ref=e28]
          - generic [ref=e31]: PNG to WebP
        - heading "PNG to WebP" [level=1] [ref=e32]
        - paragraph [ref=e33]: Convert PNG images to WebP format for smaller file sizes
        - button "Upload PNG files. Drag and drop or click to browse." [ref=e34] [cursor=pointer]:
          - paragraph [ref=e35]: Drop PNG files here or click to browse
          - paragraph [ref=e36]: .PNG · up to 20 files · max 50 MB each
        - generic [ref=e38]: ad · horizontal · 100% × 90px
    - contentinfo [ref=e39]:
      - generic [ref=e40]:
        - generic [ref=e41]:
          - link "EverydayTools" [ref=e42] [cursor=pointer]:
            - /url: /
            - img [ref=e43]
            - generic [ref=e48]: EverydayTools
          - paragraph [ref=e49]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e50]:
          - heading "PDF Tools" [level=3] [ref=e51]
          - list [ref=e52]:
            - listitem [ref=e53]:
              - link "PDF to Word" [ref=e54] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e55]:
              - link "PDF to Text" [ref=e56] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e57]:
              - link "Compress PDF" [ref=e58] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e59]:
              - link "Merge PDFs" [ref=e60] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e61]:
              - link "Split PDF" [ref=e62] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e63]:
              - link "Protect PDF" [ref=e64] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e65]:
          - heading "Image Tools" [level=3] [ref=e66]
          - list [ref=e67]:
            - listitem [ref=e68]:
              - link "Image Converter" [ref=e69] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e70]:
              - link "Background Remover" [ref=e71] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e72]:
              - link "Compress Image" [ref=e73] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e74]:
              - link "Resize Image" [ref=e75] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e76]:
              - link "HEIC to JPG" [ref=e77] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e78]:
              - link "Image to PDF" [ref=e79] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e80]:
          - heading "Utilities" [level=3] [ref=e81]
          - list [ref=e82]:
            - listitem [ref=e83]:
              - link "Metadata Cleaner" [ref=e84] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e85]:
              - link "AI Text Scrubber" [ref=e86] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e87]:
              - link "Password Generator" [ref=e88] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e89]:
              - link "Currency Converter" [ref=e90] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e91]:
              - link "Unit Converter" [ref=e92] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e93]:
              - link "Percentage Calculator" [ref=e94] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e95]:
        - generic [ref=e96]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e97]:
          - link "Privacy Policy" [ref=e98] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e99] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e100] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e101]:
      - paragraph [ref=e102]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e103]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e104] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e105]:
        - button "Essential only" [ref=e106] [cursor=pointer]
        - button "Accept all" [ref=e107] [cursor=pointer]
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const VIEWPORTS = [
  4  |   { name: 'iPhone SE', width: 375, height: 667 },
  5  |   { name: 'iPad', width: 768, height: 1024 },
  6  |   { name: 'Desktop', width: 1280, height: 800 },
  7  | ];
  8  | 
  9  | const PAGES_TO_TEST = ['/', '/unit-converter', '/png-to-webp', '/password-generator'];
  10 | 
  11 | for (const viewport of VIEWPORTS) {
  12 |   for (const route of PAGES_TO_TEST) {
  13 |     test(`${route} — ${viewport.name} — no horizontal overflow`, async ({ page }) => {
  14 |       await page.setViewportSize({ width: viewport.width, height: viewport.height });
  15 |       await page.goto(route);
  16 |       await page.waitForLoadState('networkidle');
  17 | 
  18 |       const hasHorizontalScroll = await page.evaluate(() =>
  19 |         document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
  20 |       );
> 21 |       expect(hasHorizontalScroll).toBe(false);
     |                                   ^ Error: expect(received).toBe(expected) // Object.is equality
  22 |     });
  23 |   }
  24 | }
  25 | 
  26 | test('inputs have font-size >= 16px on mobile (prevents iOS zoom)', async ({ page }) => {
  27 |   await page.setViewportSize({ width: 375, height: 667 });
  28 |   await page.goto('/unit-converter');
  29 |   const inputs = await page.locator('input:not([type="range"]):not([type="checkbox"]):not([type="radio"]), select').all();
  30 |   for (const input of inputs) {
  31 |     if (await input.isVisible()) {
  32 |       const fontSize = await input.evaluate(el =>
  33 |         parseFloat(window.getComputedStyle(el).fontSize)
  34 |       );
  35 |       expect(fontSize).toBeGreaterThanOrEqual(16);
  36 |     }
  37 |   }
  38 | });
  39 | 
  40 | test('nav is accessible on mobile', async ({ page }) => {
  41 |   await page.setViewportSize({ width: 375, height: 667 });
  42 |   await page.goto('/');
  43 |   const hamburger = page.locator('[data-testid="hamburger-menu"]');
  44 |   await expect(hamburger).toBeVisible();
  45 | });
  46 | 
```