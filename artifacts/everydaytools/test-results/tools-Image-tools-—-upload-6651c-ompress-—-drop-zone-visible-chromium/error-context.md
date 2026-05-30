# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tools.spec.ts >> Image tools — upload zone present >> /image-compress — drop zone visible
- Location: tests/e2e/tools.spec.ts:65:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-testid="drop-zone"]').first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 15000ms
  - waiting for locator('[data-testid="drop-zone"]').first()

```

```yaml
- link "Skip to main content":
  - /url: "#main-content"
- navigation:
  - link "EverydayTools":
    - /url: /
  - button "PDF Tools":
    - text: PDF Tools
    - img
  - button "Documents":
    - text: Documents
    - img
  - button "Images":
    - text: Images
    - img
  - button "Text & Code":
    - text: Text & Code
    - img
  - button "Tools":
    - text: Tools
    - img
  - searchbox "Search tools"
  - button "EN"
  - button "FR"
  - button "Toggle theme":
    - img
- main:
  - link "Home":
    - /url: /
  - img
  - text: Tools
  - img
  - text: Image Compressor
  - heading "Compress Image" [level=1]
  - paragraph: Reduce image file size with a quality slider
  - paragraph: Drop images here or click to select — up to 20 files, 20 MB each
  - paragraph: JPEG · PNG · WEBP · AVIF
  - text: ad · horizontal · 100% × 90px
  - region "How it works":
    - paragraph: How it works
    - list:
      - listitem:
        - strong: Upload your image
        - paragraph: Click the upload area or drag your image file. JPEG, PNG, and WEBP are supported.
      - listitem:
        - strong: Adjust the quality
        - paragraph: Use the quality slider to balance file size and visual quality. 80% is a good default for most use cases.
      - listitem:
        - strong: Download the compressed image
        - paragraph: Click Compress. Your smaller image downloads. The tool shows both before and after file sizes.
  - region "About this tool":
    - paragraph: About this tool
    - paragraph: EverydayTools Hub Compress Image tool reduces the file size of JPEG, PNG, and WEBP images using a quality slider — entirely in your browser, with no server uploads and no account required.
    - paragraph: Large image files slow down websites, consume storage, and make file transfers slower. The compressor uses the HTML5 Canvas API to re-encode the image at a lower quality level. A quality of 80% typically reduces JPEG file sizes by 60–80% while maintaining visually acceptable quality for web use.
    - paragraph: The quality slider goes from 1% (maximum compression, most quality loss) to 100% (lossless re-encoding). Most web images benefit from a quality setting of 70–85%. The tool displays the original and compressed file sizes side by side, so you can see the trade-off before downloading.
    - paragraph: For changing image format (for example to WEBP for better compression), use the Image Converter. For changing image dimensions, use the Resize Image tool. EverydayTools Hub is free, browser-based, and no signup is required.
  - region "Frequently asked questions":
    - paragraph: Frequently asked questions
    - group: How do I compress an image for free online?
    - group: What quality setting should I use?
    - group: Does compression reduce the image dimensions?
    - group: Is PNG compression lossless?
    - group: What is the maximum image size I can compress?
    - group: Is Compress Image free?
  - navigation "Related tools":
    - paragraph: Related tools
    - link "Image Format Converter - Convert images between PNG, JPEG, WEBP, AVIF, BMP, GIF, and more in your browser. Free, no upload, batch up to 20 files.":
      - /url: /en/convert-image-format
      - paragraph: Image Format Converter
      - paragraph: Convert images between PNG, JPEG, WEBP, AVIF, BMP, GIF, and more in your browser. Free, no upload, batch up to 20 files.
    - link "Resize Image - Resize images by pixel dimensions or percentage in your browser. Free, no upload, no account. Change image size instantly for web or print.":
      - /url: /en/resize-image
      - paragraph: Resize Image
      - paragraph: Resize images by pixel dimensions or percentage in your browser. Free, no upload, no account. Change image size instantly for web or print.
    - link "HEIC to JPG Converter - Convert iPhone HEIC photos to JPEG or PNG in your browser. Free, no upload, no account. Open iPhone photos on Windows and Android.":
      - /url: /en/convert-heic-to-jpg
      - paragraph: HEIC to JPG Converter
      - paragraph: Convert iPhone HEIC photos to JPEG or PNG in your browser. Free, no upload, no account. Open iPhone photos on Windows and Android.
- contentinfo:
  - link "EverydayTools":
    - /url: /
  - paragraph: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
  - heading "PDF Tools" [level=3]
  - list:
    - listitem:
      - link "PDF to Word":
        - /url: /pdf-to-word
    - listitem:
      - link "PDF to Text":
        - /url: /pdf-to-text
    - listitem:
      - link "Compress PDF":
        - /url: /pdf-compress
    - listitem:
      - link "Merge PDFs":
        - /url: /pdf-merge
    - listitem:
      - link "Split PDF":
        - /url: /pdf-split
    - listitem:
      - link "Protect PDF":
        - /url: /pdf-protect
  - heading "Image Tools" [level=3]
  - list:
    - listitem:
      - link "Image Converter":
        - /url: /image-converter
    - listitem:
      - link "Background Remover":
        - /url: /background-remover
    - listitem:
      - link "Compress Image":
        - /url: /image-compress
    - listitem:
      - link "Resize Image":
        - /url: /image-resize
    - listitem:
      - link "HEIC to JPG":
        - /url: /heic-to-jpg
    - listitem:
      - link "Image to PDF":
        - /url: /image-to-pdf
  - heading "Utilities" [level=3]
  - list:
    - listitem:
      - link "Metadata Cleaner":
        - /url: /metadata-cleaner
    - listitem:
      - link "AI Text Scrubber":
        - /url: /ai-text-scrubber
    - listitem:
      - link "Password Generator":
        - /url: /password-generator
    - listitem:
      - link "Currency Converter":
        - /url: /currency-converter
    - listitem:
      - link "Unit Converter":
        - /url: /unit-converter
    - listitem:
      - link "Percentage Calculator":
        - /url: /percentage-calc
  - text: © 2026 EverydayTools Hub. All rights reserved.
  - navigation:
    - link "Privacy Policy":
      - /url: /privacy
    - link "Terms of Service":
      - /url: /terms
    - button "Cookie Preferences"
- dialog "Cookie preferences":
  - paragraph:
    - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
    - strong: never uploaded
    - text: —
    - link "Privacy policy":
      - /url: /privacy
  - button "Essential only"
  - button "Accept all"
- region "Notifications (F8)":
  - list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | const FIXTURES = path.join(process.cwd(), 'tests/fixtures');
  5  | 
  6  | test.describe('PDF Compress — tool flow', () => {
  7  |   test('page loads with upload zone', async ({ page }) => {
  8  |     await page.goto('/pdf-compress');
  9  |     await expect(page.locator('h1')).toBeVisible();
  10 |     await expect(page.locator('[data-testid="drop-zone"]')).toBeVisible();
  11 |   });
  12 | 
  13 |   test('rejects non-PDF file', async ({ page }) => {
  14 |     await page.goto('/pdf-compress');
  15 |     const input = page.locator('input[type="file"]');
  16 |     await input.setInputFiles(path.join(FIXTURES, 'test.png'));
  17 |     await expect(page.locator('[role="alert"]')).toBeVisible({ timeout: 5000 });
  18 |   });
  19 | });
  20 | 
  21 | test.describe('Unit Converter — tool flow', () => {
  22 |   test('page loads with selectors', async ({ page }) => {
  23 |     await page.goto('/unit-converter');
  24 |     await expect(page.locator('h1')).toBeVisible();
  25 |     await expect(page.locator('input, select').first()).toBeVisible();
  26 |   });
  27 | 
  28 |   test('converting value shows result', async ({ page }) => {
  29 |     await page.goto('/unit-converter');
  30 |     const input = page.locator('input[type="number"]').first();
  31 |     if (await input.isVisible()) {
  32 |       await input.fill('100');
  33 |       await page.waitForTimeout(200);
  34 |       // result panel should show a value
  35 |       const result = page.locator('[data-testid="result"], output, [role="status"]').first();
  36 |       if (await result.isVisible()) {
  37 |         const text = await result.textContent();
  38 |         expect(text?.trim()).toBeTruthy();
  39 |       }
  40 |     }
  41 |   });
  42 | });
  43 | 
  44 | test.describe('Password Generator — tool flow', () => {
  45 |   test('page loads with generated password', async ({ page }) => {
  46 |     await page.goto('/password-generator');
  47 |     await expect(page.locator('h1')).toBeVisible();
  48 |     // A password should be displayed on load
  49 |     await page.waitForTimeout(500);
  50 |     const body = await page.locator('body').textContent();
  51 |     // Should have some non-trivial content after loading
  52 |     expect(body?.length).toBeGreaterThan(100);
  53 |   });
  54 | });
  55 | 
  56 | test.describe('Image tools — upload zone present', () => {
  57 |   const IMAGE_TOOL_ROUTES = [
  58 |     '/png-to-webp',
  59 |     '/jpg-to-png',
  60 |     '/image-compress',
  61 |     '/background-remover',
  62 |   ];
  63 | 
  64 |   for (const route of IMAGE_TOOL_ROUTES) {
  65 |     test(`${route} — drop zone visible`, async ({ page }) => {
  66 |       await page.goto(route);
  67 |       await page.waitForLoadState('networkidle');
  68 |       await expect(page.locator('h1')).toBeVisible();
> 69 |       await expect(page.locator('[data-testid="drop-zone"]').first()).toBeVisible();
     |                                                                       ^ Error: expect(locator).toBeVisible() failed
  70 |     });
  71 |   }
  72 | });
  73 | 
```