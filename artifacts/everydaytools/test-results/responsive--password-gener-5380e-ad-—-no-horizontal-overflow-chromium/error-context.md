# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> /password-generator — iPad — no horizontal overflow
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
            - generic [ref=e55]: Calculators
            - img [ref=e56]
          - generic [ref=e59]: Password Generator
        - heading "Password Generator" [level=1] [ref=e60]
        - paragraph [ref=e61]: Generate cryptographically secure passwords with entropy display
        - generic [ref=e62]:
          - generic [ref=e63]:
            - heading ".vSRe8>*%;[FG7'y" [level=2] [ref=e64]
            - button "Copy" [ref=e65] [cursor=pointer]
          - generic [ref=e66]:
            - generic [ref=e67]: Exceptional
            - generic [ref=e68]: (105 bits)
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e72]: "Length: 16"
              - slider [ref=e73] [cursor=pointer]: "16"
            - generic [ref=e74]:
              - generic [ref=e75] [cursor=pointer]:
                - checkbox "Uppercase (A-Z)" [checked] [ref=e76]
                - text: Uppercase (A-Z)
              - generic [ref=e77] [cursor=pointer]:
                - checkbox "Lowercase (a-z)" [checked] [ref=e78]
                - text: Lowercase (a-z)
              - generic [ref=e79] [cursor=pointer]:
                - checkbox "Numbers (0-9)" [checked] [ref=e80]
                - text: Numbers (0-9)
              - generic [ref=e81] [cursor=pointer]:
                - checkbox "Symbols (!@#$)" [checked] [ref=e82]
                - text: Symbols (!@#$)
              - generic [ref=e83] [cursor=pointer]:
                - checkbox "Pronounceable mode" [ref=e84]
                - text: Pronounceable mode
            - generic [ref=e85]:
              - generic [ref=e86]:
                - generic [ref=e87]: Generate Count
                - combobox [ref=e88]:
                  - option "1" [selected]
                  - option "5"
                  - option "10"
                  - option "25"
              - button "Regenerate" [ref=e89] [cursor=pointer]
        - generic [ref=e90]:
          - generic [ref=e91]:
            - heading "History" [level=3] [ref=e92]
            - button "Clear History" [ref=e93] [cursor=pointer]
          - generic [ref=e96]: .vSRe8>*%;[FG7'y
        - generic [ref=e98]: ad · horizontal · 100% × 90px
      - generic [ref=e99]:
        - region "How it works" [ref=e100]:
          - paragraph [ref=e101]: How it works
          - list [ref=e102]:
            - listitem [ref=e103]:
              - generic [ref=e104]: "1"
              - generic [ref=e105]:
                - strong [ref=e106]: Configure your options
                - paragraph [ref=e107]: "Choose the password length (4–128 characters), and toggle character sets: uppercase, lowercase, numbers, and symbols."
            - listitem [ref=e108]:
              - generic [ref=e109]: "2"
              - generic [ref=e110]:
                - strong [ref=e111]: Generate instantly
                - paragraph [ref=e112]: The generator uses crypto.getRandomValues() — the browser's cryptographically secure random number generator — to produce the password.
            - listitem [ref=e113]:
              - generic [ref=e114]: "3"
              - generic [ref=e115]:
                - strong [ref=e116]: Copy and use
                - paragraph [ref=e117]: Click the copy button to copy the password to your clipboard. The entropy in bits is displayed alongside.
        - region "About this tool" [ref=e118]:
          - paragraph [ref=e119]: About this tool
          - generic [ref=e120]:
            - paragraph [ref=e121]: EverydayTools Hub Password Generator creates cryptographically secure random passwords using your browser's built-in crypto.getRandomValues() API — no server involved, no data stored, completely free and private.
            - paragraph [ref=e122]: Weak passwords are the most common cause of account compromises. A strong password should be at least 16 characters long, use a mix of uppercase letters, lowercase letters, numbers, and symbols, and be unique for each account. The Password Generator creates passwords meeting these criteria instantly.
            - paragraph [ref=e123]: "The tool displays the entropy of each generated password in bits. Entropy measures the unpredictability of the password: a password with 80 bits of entropy is roughly 1 trillion trillion times harder to guess than one with 40 bits. Security experts recommend at least 80 bits of entropy for general passwords and 128+ bits for high-security accounts."
            - paragraph [ref=e124]: Passwords are generated entirely in your browser and never transmitted anywhere. For storing passwords securely, use a password manager. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e125]:
          - paragraph [ref=e126]: Frequently asked questions
          - generic [ref=e127]:
            - group [ref=e128]:
              - generic "How do I generate a secure password for free?" [ref=e129] [cursor=pointer]
            - group [ref=e130]:
              - generic "How long should a password be?" [ref=e131] [cursor=pointer]
            - group [ref=e132]:
              - generic "What is password entropy?" [ref=e133] [cursor=pointer]
            - group [ref=e134]:
              - generic "Is the generated password stored anywhere?" [ref=e135] [cursor=pointer]
            - group [ref=e136]:
              - generic "What character sets should I include?" [ref=e137] [cursor=pointer]
            - group [ref=e138]:
              - generic "Is the Password Generator free?" [ref=e139] [cursor=pointer]
        - navigation "Related tools" [ref=e140]:
          - paragraph [ref=e141]: Related tools
          - generic [ref=e142]:
            - link "Protect PDF with Password - Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly." [ref=e143] [cursor=pointer]:
              - /url: /en/protect-pdf
              - generic [ref=e144]:
                - paragraph [ref=e145]: Protect PDF with Password
                - paragraph [ref=e146]: Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly.
            - link "Metadata Cleaner - Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info." [ref=e147] [cursor=pointer]:
              - /url: /en/clean-file-metadata
              - generic [ref=e148]:
                - paragraph [ref=e149]: Metadata Cleaner
                - paragraph [ref=e150]: Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e151] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e152]:
                - paragraph [ref=e153]: Percentage Calculator
                - paragraph [ref=e154]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
    - contentinfo [ref=e155]:
      - generic [ref=e156]:
        - generic [ref=e157]:
          - link "EverydayTools" [ref=e158] [cursor=pointer]:
            - /url: /
            - img [ref=e159]
            - generic [ref=e164]: EverydayTools
          - paragraph [ref=e165]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e166]:
          - heading "PDF Tools" [level=3] [ref=e167]
          - list [ref=e168]:
            - listitem [ref=e169]:
              - link "PDF to Word" [ref=e170] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e171]:
              - link "PDF to Text" [ref=e172] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e173]:
              - link "Compress PDF" [ref=e174] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e175]:
              - link "Merge PDFs" [ref=e176] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e177]:
              - link "Split PDF" [ref=e178] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e179]:
              - link "Protect PDF" [ref=e180] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e181]:
          - heading "Image Tools" [level=3] [ref=e182]
          - list [ref=e183]:
            - listitem [ref=e184]:
              - link "Image Converter" [ref=e185] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e186]:
              - link "Background Remover" [ref=e187] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e188]:
              - link "Compress Image" [ref=e189] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e190]:
              - link "Resize Image" [ref=e191] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e192]:
              - link "HEIC to JPG" [ref=e193] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e194]:
              - link "Image to PDF" [ref=e195] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e196]:
          - heading "Utilities" [level=3] [ref=e197]
          - list [ref=e198]:
            - listitem [ref=e199]:
              - link "Metadata Cleaner" [ref=e200] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e201]:
              - link "AI Text Scrubber" [ref=e202] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e203]:
              - link "Password Generator" [ref=e204] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e205]:
              - link "Currency Converter" [ref=e206] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e207]:
              - link "Unit Converter" [ref=e208] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e209]:
              - link "Percentage Calculator" [ref=e210] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e211]:
        - generic [ref=e212]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e213]:
          - link "Privacy Policy" [ref=e214] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e215] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e216] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e217]:
      - paragraph [ref=e218]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e219]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e220] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e221]:
        - button "Essential only" [ref=e222] [cursor=pointer]
        - button "Accept all" [ref=e223] [cursor=pointer]
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