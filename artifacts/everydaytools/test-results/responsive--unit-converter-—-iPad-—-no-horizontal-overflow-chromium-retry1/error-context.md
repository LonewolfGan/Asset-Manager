# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: responsive.spec.ts >> /unit-converter — iPad — no horizontal overflow
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
          - generic [ref=e59]: Unit Converter
        - heading "Unit Converter" [level=1] [ref=e60]
        - paragraph [ref=e61]: Convert between 200+ units across 13 measurement categories
        - generic [ref=e62]:
          - button "Length" [ref=e63] [cursor=pointer]
          - button "Weight" [ref=e64] [cursor=pointer]
          - button "Temperature" [ref=e65] [cursor=pointer]
          - button "Volume" [ref=e66] [cursor=pointer]
          - button "Area" [ref=e67] [cursor=pointer]
          - button "Speed" [ref=e68] [cursor=pointer]
          - button "Pressure" [ref=e69] [cursor=pointer]
          - button "Energy" [ref=e70] [cursor=pointer]
          - button "Power" [ref=e71] [cursor=pointer]
          - button "Data" [ref=e72] [cursor=pointer]
          - button "Time" [ref=e73] [cursor=pointer]
          - button "Angle" [ref=e74] [cursor=pointer]
          - button "Frequency" [ref=e75] [cursor=pointer]
        - generic [ref=e77]:
          - generic [ref=e78]:
            - generic [ref=e79]:
              - generic [ref=e80]: From
              - button "Meter (m)" [ref=e82]:
                - generic [ref=e83]: Meter (m)
                - img [ref=e84]
            - button "Swap units" [ref=e86] [cursor=pointer]: ⇄
            - generic [ref=e87]:
              - generic [ref=e88]: To
              - button "Kilometer (km)" [ref=e90]:
                - generic [ref=e91]: Kilometer (km)
                - img [ref=e92]
          - generic [ref=e94]:
            - spinbutton [ref=e96]: "1"
            - generic [ref=e97]: "0.001"
          - generic [ref=e98]:
            - generic [ref=e99]: 1 m = 0.001 km
            - button "Pin" [ref=e100] [cursor=pointer]: ☆ Pin
        - generic [ref=e102]: ad · horizontal · 100% × 90px
      - generic [ref=e103]:
        - region "How it works" [ref=e104]:
          - paragraph [ref=e105]: How it works
          - list [ref=e106]:
            - listitem [ref=e107]:
              - generic [ref=e108]: "1"
              - generic [ref=e109]:
                - strong [ref=e110]: Select a category
                - paragraph [ref=e111]: "Choose from 13 categories: length, weight, temperature, volume, area, speed, time, digital storage, energy, pressure, power, angle, or frequency."
            - listitem [ref=e112]:
              - generic [ref=e113]: "2"
              - generic [ref=e114]:
                - strong [ref=e115]: Enter the value and unit
                - paragraph [ref=e116]: Type the value in any unit in the category. All equivalent values in other units update instantly.
            - listitem [ref=e117]:
              - generic [ref=e118]: "3"
              - generic [ref=e119]:
                - strong [ref=e120]: Read the result
                - paragraph [ref=e121]: All conversions are shown simultaneously, so you can compare units at a glance.
        - region "About this tool" [ref=e122]:
          - paragraph [ref=e123]: About this tool
          - generic [ref=e124]:
            - paragraph [ref=e125]: EverydayTools Hub Unit Converter converts between more than 200 units across 13 measurement categories — entirely in your browser, with no server involved, no account required, and completely free.
            - paragraph [ref=e126]: "The 13 supported categories are: length (metres, feet, inches, miles, kilometres, nautical miles, and more), mass/weight (kilograms, pounds, ounces, stones, tonnes), temperature (Celsius, Fahrenheit, Kelvin, Rankine), volume (litres, gallons, pints, cups, fluid ounces), area, speed, time, digital storage, energy, pressure, power, angle, and frequency."
            - paragraph [ref=e127]: All conversions use a graph-based conversion system — each unit has a defined relationship to a canonical base unit, and conversions are calculated by chaining these relationships. This ensures accuracy across all unit pairs without needing to store a conversion table for every possible combination.
            - paragraph [ref=e128]: For currency conversions with live exchange rates, use the Currency Converter. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e129]:
          - paragraph [ref=e130]: Frequently asked questions
          - generic [ref=e131]:
            - group [ref=e132]:
              - generic "How do I convert units online for free?" [ref=e133] [cursor=pointer]
            - group [ref=e134]:
              - generic "What unit categories are supported?" [ref=e135] [cursor=pointer]
            - group [ref=e136]:
              - generic "How accurate are the conversions?" [ref=e137] [cursor=pointer]
            - group [ref=e138]:
              - generic "Can I convert between metric and imperial units?" [ref=e139] [cursor=pointer]
            - group [ref=e140]:
              - generic "Does the tool support temperature conversion including Kelvin?" [ref=e141] [cursor=pointer]
            - group [ref=e142]:
              - generic "Is the Unit Converter free?" [ref=e143] [cursor=pointer]
        - navigation "Related tools" [ref=e144]:
          - paragraph [ref=e145]: Related tools
          - generic [ref=e146]:
            - link "Currency Converter - Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com." [ref=e147] [cursor=pointer]:
              - /url: /en/currency-converter
              - generic [ref=e148]:
                - paragraph [ref=e149]: Currency Converter
                - paragraph [ref=e150]: Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e151] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e152]:
                - paragraph [ref=e153]: Percentage Calculator
                - paragraph [ref=e154]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
            - link "Password Generator - Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser." [ref=e155] [cursor=pointer]:
              - /url: /en/password-generator
              - generic [ref=e156]:
                - paragraph [ref=e157]: Password Generator
                - paragraph [ref=e158]: Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser.
    - contentinfo [ref=e159]:
      - generic [ref=e160]:
        - generic [ref=e161]:
          - link "EverydayTools" [ref=e162] [cursor=pointer]:
            - /url: /
            - img [ref=e163]
            - generic [ref=e168]: EverydayTools
          - paragraph [ref=e169]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e170]:
          - heading "PDF Tools" [level=3] [ref=e171]
          - list [ref=e172]:
            - listitem [ref=e173]:
              - link "PDF to Word" [ref=e174] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e175]:
              - link "PDF to Text" [ref=e176] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e177]:
              - link "Compress PDF" [ref=e178] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e179]:
              - link "Merge PDFs" [ref=e180] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e181]:
              - link "Split PDF" [ref=e182] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e183]:
              - link "Protect PDF" [ref=e184] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e185]:
          - heading "Image Tools" [level=3] [ref=e186]
          - list [ref=e187]:
            - listitem [ref=e188]:
              - link "Image Converter" [ref=e189] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e190]:
              - link "Background Remover" [ref=e191] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e192]:
              - link "Compress Image" [ref=e193] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e194]:
              - link "Resize Image" [ref=e195] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e196]:
              - link "HEIC to JPG" [ref=e197] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e198]:
              - link "Image to PDF" [ref=e199] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e200]:
          - heading "Utilities" [level=3] [ref=e201]
          - list [ref=e202]:
            - listitem [ref=e203]:
              - link "Metadata Cleaner" [ref=e204] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e205]:
              - link "AI Text Scrubber" [ref=e206] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e207]:
              - link "Password Generator" [ref=e208] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e209]:
              - link "Currency Converter" [ref=e210] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e211]:
              - link "Unit Converter" [ref=e212] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e213]:
              - link "Percentage Calculator" [ref=e214] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e215]:
        - generic [ref=e216]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e217]:
          - link "Privacy Policy" [ref=e218] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e219] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e220] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e221]:
      - paragraph [ref=e222]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e223]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e224] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e225]:
        - button "Essential only" [ref=e226] [cursor=pointer]
        - button "Accept all" [ref=e227] [cursor=pointer]
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