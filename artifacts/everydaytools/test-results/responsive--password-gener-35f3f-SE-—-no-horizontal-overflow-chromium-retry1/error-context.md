# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> /password-generator — iPhone SE — no horizontal overflow
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
            - generic [ref=e27]: Calculators
            - img [ref=e28]
          - generic [ref=e31]: Password Generator
        - heading "Password Generator" [level=1] [ref=e32]
        - paragraph [ref=e33]: Generate cryptographically secure passwords with entropy display
        - generic [ref=e34]:
          - generic [ref=e35]:
            - heading "1>b$v<Vn<-ZS3y@a" [level=2] [ref=e36]
            - button "Copy" [ref=e37] [cursor=pointer]
          - generic [ref=e38]:
            - generic [ref=e39]: Exceptional
            - generic [ref=e40]: (105 bits)
          - generic [ref=e41]:
            - generic [ref=e42]:
              - generic [ref=e44]: "Length: 16"
              - slider [ref=e45] [cursor=pointer]: "16"
            - generic [ref=e46]:
              - generic [ref=e47] [cursor=pointer]:
                - checkbox "Uppercase (A-Z)" [checked] [ref=e48]
                - text: Uppercase (A-Z)
              - generic [ref=e49] [cursor=pointer]:
                - checkbox "Lowercase (a-z)" [checked] [ref=e50]
                - text: Lowercase (a-z)
              - generic [ref=e51] [cursor=pointer]:
                - checkbox "Numbers (0-9)" [checked] [ref=e52]
                - text: Numbers (0-9)
              - generic [ref=e53] [cursor=pointer]:
                - checkbox "Symbols (!@#$)" [checked] [ref=e54]
                - text: Symbols (!@#$)
              - generic [ref=e55] [cursor=pointer]:
                - checkbox "Pronounceable mode" [ref=e56]
                - text: Pronounceable mode
            - generic [ref=e57]:
              - generic [ref=e58]:
                - generic [ref=e59]: Generate Count
                - combobox [ref=e60]:
                  - option "1" [selected]
                  - option "5"
                  - option "10"
                  - option "25"
              - button "Regenerate" [ref=e61] [cursor=pointer]
        - generic [ref=e62]:
          - generic [ref=e63]:
            - heading "History" [level=3] [ref=e64]
            - button "Clear History" [ref=e65] [cursor=pointer]
          - generic [ref=e68]: 1>b$v<Vn<-ZS3y@a
        - generic [ref=e70]: ad · horizontal · 100% × 90px
      - generic [ref=e71]:
        - region "How it works" [ref=e72]:
          - paragraph [ref=e73]: How it works
          - list [ref=e74]:
            - listitem [ref=e75]:
              - generic [ref=e76]: "1"
              - generic [ref=e77]:
                - strong [ref=e78]: Configure your options
                - paragraph [ref=e79]: "Choose the password length (4–128 characters), and toggle character sets: uppercase, lowercase, numbers, and symbols."
            - listitem [ref=e80]:
              - generic [ref=e81]: "2"
              - generic [ref=e82]:
                - strong [ref=e83]: Generate instantly
                - paragraph [ref=e84]: The generator uses crypto.getRandomValues() — the browser's cryptographically secure random number generator — to produce the password.
            - listitem [ref=e85]:
              - generic [ref=e86]: "3"
              - generic [ref=e87]:
                - strong [ref=e88]: Copy and use
                - paragraph [ref=e89]: Click the copy button to copy the password to your clipboard. The entropy in bits is displayed alongside.
        - region "About this tool" [ref=e90]:
          - paragraph [ref=e91]: About this tool
          - generic [ref=e92]:
            - paragraph [ref=e93]: EverydayTools Hub Password Generator creates cryptographically secure random passwords using your browser's built-in crypto.getRandomValues() API — no server involved, no data stored, completely free and private.
            - paragraph [ref=e94]: Weak passwords are the most common cause of account compromises. A strong password should be at least 16 characters long, use a mix of uppercase letters, lowercase letters, numbers, and symbols, and be unique for each account. The Password Generator creates passwords meeting these criteria instantly.
            - paragraph [ref=e95]: "The tool displays the entropy of each generated password in bits. Entropy measures the unpredictability of the password: a password with 80 bits of entropy is roughly 1 trillion trillion times harder to guess than one with 40 bits. Security experts recommend at least 80 bits of entropy for general passwords and 128+ bits for high-security accounts."
            - paragraph [ref=e96]: Passwords are generated entirely in your browser and never transmitted anywhere. For storing passwords securely, use a password manager. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e97]:
          - paragraph [ref=e98]: Frequently asked questions
          - generic [ref=e99]:
            - group [ref=e100]:
              - generic "How do I generate a secure password for free?" [ref=e101] [cursor=pointer]
            - group [ref=e102]:
              - generic "How long should a password be?" [ref=e103] [cursor=pointer]
            - group [ref=e104]:
              - generic "What is password entropy?" [ref=e105] [cursor=pointer]
            - group [ref=e106]:
              - generic "Is the generated password stored anywhere?" [ref=e107] [cursor=pointer]
            - group [ref=e108]:
              - generic "What character sets should I include?" [ref=e109] [cursor=pointer]
            - group [ref=e110]:
              - generic "Is the Password Generator free?" [ref=e111] [cursor=pointer]
        - navigation "Related tools" [ref=e112]:
          - paragraph [ref=e113]: Related tools
          - generic [ref=e114]:
            - link "Protect PDF with Password - Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly." [ref=e115] [cursor=pointer]:
              - /url: /en/protect-pdf
              - generic [ref=e116]:
                - paragraph [ref=e117]: Protect PDF with Password
                - paragraph [ref=e118]: Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly.
            - link "Metadata Cleaner - Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info." [ref=e119] [cursor=pointer]:
              - /url: /en/clean-file-metadata
              - generic [ref=e120]:
                - paragraph [ref=e121]: Metadata Cleaner
                - paragraph [ref=e122]: Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e123] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e124]:
                - paragraph [ref=e125]: Percentage Calculator
                - paragraph [ref=e126]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
    - contentinfo [ref=e127]:
      - generic [ref=e128]:
        - generic [ref=e129]:
          - link "EverydayTools" [ref=e130] [cursor=pointer]:
            - /url: /
            - img [ref=e131]
            - generic [ref=e136]: EverydayTools
          - paragraph [ref=e137]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e138]:
          - heading "PDF Tools" [level=3] [ref=e139]
          - list [ref=e140]:
            - listitem [ref=e141]:
              - link "PDF to Word" [ref=e142] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e143]:
              - link "PDF to Text" [ref=e144] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e145]:
              - link "Compress PDF" [ref=e146] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e147]:
              - link "Merge PDFs" [ref=e148] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e149]:
              - link "Split PDF" [ref=e150] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e151]:
              - link "Protect PDF" [ref=e152] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e153]:
          - heading "Image Tools" [level=3] [ref=e154]
          - list [ref=e155]:
            - listitem [ref=e156]:
              - link "Image Converter" [ref=e157] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e158]:
              - link "Background Remover" [ref=e159] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e160]:
              - link "Compress Image" [ref=e161] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e162]:
              - link "Resize Image" [ref=e163] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e164]:
              - link "HEIC to JPG" [ref=e165] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e166]:
              - link "Image to PDF" [ref=e167] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e168]:
          - heading "Utilities" [level=3] [ref=e169]
          - list [ref=e170]:
            - listitem [ref=e171]:
              - link "Metadata Cleaner" [ref=e172] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e173]:
              - link "AI Text Scrubber" [ref=e174] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e175]:
              - link "Password Generator" [ref=e176] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e177]:
              - link "Currency Converter" [ref=e178] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e179]:
              - link "Unit Converter" [ref=e180] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e181]:
              - link "Percentage Calculator" [ref=e182] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e183]:
        - generic [ref=e184]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e185]:
          - link "Privacy Policy" [ref=e186] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e187] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e188] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e189]:
      - paragraph [ref=e190]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e191]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e192] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e193]:
        - button "Essential only" [ref=e194] [cursor=pointer]
        - button "Accept all" [ref=e195] [cursor=pointer]
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