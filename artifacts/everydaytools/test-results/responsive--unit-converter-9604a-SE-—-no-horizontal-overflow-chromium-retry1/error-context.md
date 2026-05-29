# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> /unit-converter — iPhone SE — no horizontal overflow
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
          - generic [ref=e31]: Unit Converter
        - heading "Unit Converter" [level=1] [ref=e32]
        - paragraph [ref=e33]: Convert between 200+ units across 13 measurement categories
        - generic [ref=e34]:
          - button "Length" [ref=e35] [cursor=pointer]
          - button "Weight" [ref=e36] [cursor=pointer]
          - button "Temperature" [ref=e37] [cursor=pointer]
          - button "Volume" [ref=e38] [cursor=pointer]
          - button "Area" [ref=e39] [cursor=pointer]
          - button "Speed" [ref=e40] [cursor=pointer]
          - button "Pressure" [ref=e41] [cursor=pointer]
          - button "Energy" [ref=e42] [cursor=pointer]
          - button "Power" [ref=e43] [cursor=pointer]
          - button "Data" [ref=e44] [cursor=pointer]
          - button "Time" [ref=e45] [cursor=pointer]
          - button "Angle" [ref=e46] [cursor=pointer]
          - button "Frequency" [ref=e47] [cursor=pointer]
        - generic [ref=e49]:
          - generic [ref=e50]:
            - generic [ref=e51]:
              - generic [ref=e52]: From
              - button "Meter (m)" [ref=e54]:
                - generic [ref=e55]: Meter (m)
                - img [ref=e56]
            - button "Swap units" [ref=e58] [cursor=pointer]: ⇄
            - generic [ref=e59]:
              - generic [ref=e60]: To
              - button "Kilometer (km)" [ref=e62]:
                - generic [ref=e63]: Kilometer (km)
                - img [ref=e64]
          - generic [ref=e66]:
            - spinbutton [ref=e68]: "1"
            - generic [ref=e69]: "0.001"
          - generic [ref=e70]:
            - generic [ref=e71]: 1 m = 0.001 km
            - button "Pin" [ref=e72] [cursor=pointer]: ☆ Pin
        - generic [ref=e74]: ad · horizontal · 100% × 90px
      - generic [ref=e75]:
        - region "How it works" [ref=e76]:
          - paragraph [ref=e77]: How it works
          - list [ref=e78]:
            - listitem [ref=e79]:
              - generic [ref=e80]: "1"
              - generic [ref=e81]:
                - strong [ref=e82]: Select a category
                - paragraph [ref=e83]: "Choose from 13 categories: length, weight, temperature, volume, area, speed, time, digital storage, energy, pressure, power, angle, or frequency."
            - listitem [ref=e84]:
              - generic [ref=e85]: "2"
              - generic [ref=e86]:
                - strong [ref=e87]: Enter the value and unit
                - paragraph [ref=e88]: Type the value in any unit in the category. All equivalent values in other units update instantly.
            - listitem [ref=e89]:
              - generic [ref=e90]: "3"
              - generic [ref=e91]:
                - strong [ref=e92]: Read the result
                - paragraph [ref=e93]: All conversions are shown simultaneously, so you can compare units at a glance.
        - region "About this tool" [ref=e94]:
          - paragraph [ref=e95]: About this tool
          - generic [ref=e96]:
            - paragraph [ref=e97]: EverydayTools Hub Unit Converter converts between more than 200 units across 13 measurement categories — entirely in your browser, with no server involved, no account required, and completely free.
            - paragraph [ref=e98]: "The 13 supported categories are: length (metres, feet, inches, miles, kilometres, nautical miles, and more), mass/weight (kilograms, pounds, ounces, stones, tonnes), temperature (Celsius, Fahrenheit, Kelvin, Rankine), volume (litres, gallons, pints, cups, fluid ounces), area, speed, time, digital storage, energy, pressure, power, angle, and frequency."
            - paragraph [ref=e99]: All conversions use a graph-based conversion system — each unit has a defined relationship to a canonical base unit, and conversions are calculated by chaining these relationships. This ensures accuracy across all unit pairs without needing to store a conversion table for every possible combination.
            - paragraph [ref=e100]: For currency conversions with live exchange rates, use the Currency Converter. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e101]:
          - paragraph [ref=e102]: Frequently asked questions
          - generic [ref=e103]:
            - group [ref=e104]:
              - generic "How do I convert units online for free?" [ref=e105] [cursor=pointer]
            - group [ref=e106]:
              - generic "What unit categories are supported?" [ref=e107] [cursor=pointer]
            - group [ref=e108]:
              - generic "How accurate are the conversions?" [ref=e109] [cursor=pointer]
            - group [ref=e110]:
              - generic "Can I convert between metric and imperial units?" [ref=e111] [cursor=pointer]
            - group [ref=e112]:
              - generic "Does the tool support temperature conversion including Kelvin?" [ref=e113] [cursor=pointer]
            - group [ref=e114]:
              - generic "Is the Unit Converter free?" [ref=e115] [cursor=pointer]
        - navigation "Related tools" [ref=e116]:
          - paragraph [ref=e117]: Related tools
          - generic [ref=e118]:
            - link "Currency Converter - Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com." [ref=e119] [cursor=pointer]:
              - /url: /en/currency-converter
              - generic [ref=e120]:
                - paragraph [ref=e121]: Currency Converter
                - paragraph [ref=e122]: Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e123] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e124]:
                - paragraph [ref=e125]: Percentage Calculator
                - paragraph [ref=e126]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
            - link "Password Generator - Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser." [ref=e127] [cursor=pointer]:
              - /url: /en/password-generator
              - generic [ref=e128]:
                - paragraph [ref=e129]: Password Generator
                - paragraph [ref=e130]: Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser.
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