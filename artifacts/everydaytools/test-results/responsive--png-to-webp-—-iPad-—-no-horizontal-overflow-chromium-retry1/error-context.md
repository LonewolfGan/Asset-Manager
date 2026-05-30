# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> /png-to-webp — iPad — no horizontal overflow
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
          - searchbox "Search tools"
        - generic [ref=e40]:
          - generic [ref=e41]:
            - button "EN" [ref=e42] [cursor=pointer]
            - button "FR" [ref=e43] [cursor=pointer]
          - button "Toggle theme" [ref=e44] [cursor=pointer]:
            - img [ref=e45]
    - main [ref=e47]:
      - generic [ref=e48]:
        - generic [ref=e49]:
          - generic [ref=e50]:
            - link "Home" [ref=e51] [cursor=pointer]:
              - /url: /
            - img [ref=e52]
          - generic [ref=e54]:
            - generic [ref=e55]: Image Tools
            - img [ref=e56]
          - generic [ref=e59]: PNG to WebP
        - heading "PNG to WebP" [level=1] [ref=e60]
        - paragraph [ref=e61]: Convert PNG images to WebP format for smaller file sizes
        - button "Upload PNG files. Drag and drop or click to browse." [ref=e62] [cursor=pointer]:
          - paragraph [ref=e63]: Drop PNG files here or click to browse
          - paragraph [ref=e64]: .PNG · up to 20 files · max 50 MB each
        - generic [ref=e66]: ad · horizontal · 100% × 90px
    - contentinfo [ref=e67]:
      - generic [ref=e68]:
        - generic [ref=e69]:
          - link "EverydayTools" [ref=e70] [cursor=pointer]:
            - /url: /
            - img [ref=e71]
            - generic [ref=e76]: EverydayTools
          - paragraph [ref=e77]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e78]:
          - heading "PDF Tools" [level=3] [ref=e79]
          - list [ref=e80]:
            - listitem [ref=e81]:
              - link "PDF to Word" [ref=e82] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e83]:
              - link "PDF to Text" [ref=e84] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e85]:
              - link "Compress PDF" [ref=e86] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e87]:
              - link "Merge PDFs" [ref=e88] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e89]:
              - link "Split PDF" [ref=e90] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e91]:
              - link "Protect PDF" [ref=e92] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e93]:
          - heading "Image Tools" [level=3] [ref=e94]
          - list [ref=e95]:
            - listitem [ref=e96]:
              - link "Image Converter" [ref=e97] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e98]:
              - link "Background Remover" [ref=e99] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e100]:
              - link "Compress Image" [ref=e101] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e102]:
              - link "Resize Image" [ref=e103] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e104]:
              - link "HEIC to JPG" [ref=e105] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e106]:
              - link "Image to PDF" [ref=e107] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e108]:
          - heading "Utilities" [level=3] [ref=e109]
          - list [ref=e110]:
            - listitem [ref=e111]:
              - link "Metadata Cleaner" [ref=e112] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e113]:
              - link "AI Text Scrubber" [ref=e114] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e115]:
              - link "Password Generator" [ref=e116] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e117]:
              - link "Currency Converter" [ref=e118] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e119]:
              - link "Unit Converter" [ref=e120] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e121]:
              - link "Percentage Calculator" [ref=e122] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e123]:
        - generic [ref=e124]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e125]:
          - link "Privacy Policy" [ref=e126] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e127] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e128] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e129]:
      - paragraph [ref=e130]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e131]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e132] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e133]:
        - button "Essential only" [ref=e134] [cursor=pointer]
        - button "Accept all" [ref=e135] [cursor=pointer]
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