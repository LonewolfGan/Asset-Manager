# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: seo.spec.ts >> /pdf-merge — title, description, canonical, H1
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
      - generic [ref=e49]:
        - generic [ref=e50]:
          - generic [ref=e51]:
            - link "Home" [ref=e52] [cursor=pointer]:
              - /url: /
            - img [ref=e53]
          - generic [ref=e55]:
            - generic [ref=e56]: PDF Tools
            - img [ref=e57]
          - generic [ref=e60]: Merge PDFs
        - heading "Merge PDFs" [level=1] [ref=e61]
        - paragraph [ref=e62]: Combine multiple PDF files into one
        - button "Upload file. Drag and drop or press Enter to browse. Accepts .pdf, up to 50 MB." [ref=e64] [cursor=pointer]:
          - generic [ref=e65]:
            - img [ref=e67]
            - generic [ref=e70]:
              - paragraph [ref=e71]: Drop file here or click to browse
              - paragraph [ref=e72]: .pdf · max 50 MB
        - generic [ref=e74]: ad · horizontal · 100% × 90px
      - generic [ref=e75]:
        - region "How it works" [ref=e76]:
          - paragraph [ref=e77]: How it works
          - list [ref=e78]:
            - listitem [ref=e79]:
              - generic [ref=e80]: "1"
              - generic [ref=e81]:
                - strong [ref=e82]: Upload your PDFs
                - paragraph [ref=e83]: Click the upload area or drag multiple PDF files. You can add up to 20 files at once.
            - listitem [ref=e84]:
              - generic [ref=e85]: "2"
              - generic [ref=e86]:
                - strong [ref=e87]: Arrange the order
                - paragraph [ref=e88]: Drag files in the list to set the order they will appear in the merged document.
            - listitem [ref=e89]:
              - generic [ref=e90]: "3"
              - generic [ref=e91]:
                - strong [ref=e92]: Download the merged PDF
                - paragraph [ref=e93]: Click Merge. A single combined PDF downloads to your device.
        - region "About this tool" [ref=e94]:
          - paragraph [ref=e95]: About this tool
          - generic [ref=e96]:
            - paragraph [ref=e97]: EverydayTools Hub Merge PDF tool combines multiple PDF files into a single document — entirely in your browser, with no server uploads and no account required.
            - paragraph [ref=e98]: Merging PDFs is a common task when compiling reports, assembling application packages, combining scanned documents, or creating presentation portfolios. The tool uses pdf-lib to read each uploaded PDF, extract its pages, and write them sequentially into a new PDF document.
            - paragraph [ref=e99]: Up to 20 PDF files can be merged in one operation. The order can be adjusted by dragging files in the upload list before merging. All PDF metadata from individual files is replaced with fresh metadata in the output.
            - paragraph [ref=e100]: For the inverse operation, use the Split PDF tool to divide a merged document back into individual pages or sections. The Compress PDF tool can then reduce the size of the resulting merged file. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e101]:
          - paragraph [ref=e102]: Frequently asked questions
          - generic [ref=e103]:
            - group [ref=e104]:
              - generic "How do I merge PDF files online for free?" [ref=e105] [cursor=pointer]
            - group [ref=e106]:
              - generic "How many PDF files can I merge at once?" [ref=e107] [cursor=pointer]
            - group [ref=e108]:
              - generic "Can I change the order of pages when merging?" [ref=e109] [cursor=pointer]
            - group [ref=e110]:
              - generic "Will the merged PDF be larger than the individual files combined?" [ref=e111] [cursor=pointer]
            - group [ref=e112]:
              - generic "Can I merge password-protected PDFs?" [ref=e113] [cursor=pointer]
            - group [ref=e114]:
              - generic "Is Merge PDF free?" [ref=e115] [cursor=pointer]
        - navigation "Related tools" [ref=e116]:
          - paragraph [ref=e117]: Related tools
          - generic [ref=e118]:
            - link "Split PDF - Split a PDF into individual pages or custom page ranges in your browser. Free, no upload to servers, no account needed." [ref=e119] [cursor=pointer]:
              - /url: /en/split-pdf
              - generic [ref=e120]:
                - paragraph [ref=e121]: Split PDF
                - paragraph [ref=e122]: Split a PDF into individual pages or custom page ranges in your browser. Free, no upload to servers, no account needed.
            - link "Compress PDF - Reduce PDF file size online for free, entirely in your browser. No upload to servers, no account required. Smaller PDFs in seconds." [ref=e123] [cursor=pointer]:
              - /url: /en/compress-pdf
              - generic [ref=e124]:
                - paragraph [ref=e125]: Compress PDF
                - paragraph [ref=e126]: Reduce PDF file size online for free, entirely in your browser. No upload to servers, no account required. Smaller PDFs in seconds.
            - link "Rotate PDF Pages - Rotate PDF pages 90, 180, or 270 degrees in your browser. Free, no upload, no account. Fix upside-down or sideways PDF pages instantly." [ref=e127] [cursor=pointer]:
              - /url: /en/rotate-pdf
              - generic [ref=e128]:
                - paragraph [ref=e129]: Rotate PDF Pages
                - paragraph [ref=e130]: Rotate PDF pages 90, 180, or 270 degrees in your browser. Free, no upload, no account. Fix upside-down or sideways PDF pages instantly.
    - contentinfo [ref=e131]:
      - generic [ref=e132]:
        - generic [ref=e133]:
          - link "EverydayTools" [ref=e134] [cursor=pointer]:
            - /url: /
            - img [ref=e135]
            - generic [ref=e140]: EverydayTools
          - paragraph [ref=e141]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e142]:
          - heading "PDF Tools" [level=3] [ref=e143]
          - list [ref=e144]:
            - listitem [ref=e145]:
              - link "PDF to Word" [ref=e146] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e147]:
              - link "PDF to Text" [ref=e148] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e149]:
              - link "Compress PDF" [ref=e150] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e151]:
              - link "Merge PDFs" [ref=e152] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e153]:
              - link "Split PDF" [ref=e154] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e155]:
              - link "Protect PDF" [ref=e156] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e157]:
          - heading "Image Tools" [level=3] [ref=e158]
          - list [ref=e159]:
            - listitem [ref=e160]:
              - link "Image Converter" [ref=e161] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e162]:
              - link "Background Remover" [ref=e163] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e164]:
              - link "Compress Image" [ref=e165] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e166]:
              - link "Resize Image" [ref=e167] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e168]:
              - link "HEIC to JPG" [ref=e169] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e170]:
              - link "Image to PDF" [ref=e171] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e172]:
          - heading "Utilities" [level=3] [ref=e173]
          - list [ref=e174]:
            - listitem [ref=e175]:
              - link "Metadata Cleaner" [ref=e176] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e177]:
              - link "AI Text Scrubber" [ref=e178] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e179]:
              - link "Password Generator" [ref=e180] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e181]:
              - link "Currency Converter" [ref=e182] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e183]:
              - link "Unit Converter" [ref=e184] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e185]:
              - link "Percentage Calculator" [ref=e186] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e187]:
        - generic [ref=e188]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e189]:
          - link "Privacy Policy" [ref=e190] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e191] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e192] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e193]:
      - paragraph [ref=e194]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e195]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e196] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e197]:
        - button "Essential only" [ref=e198] [cursor=pointer]
        - button "Accept all" [ref=e199] [cursor=pointer]
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