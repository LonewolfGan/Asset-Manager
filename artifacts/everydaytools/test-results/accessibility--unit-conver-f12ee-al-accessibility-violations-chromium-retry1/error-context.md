# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> /unit-converter — no critical accessibility violations
- Location: tests/e2e/accessibility.spec.ts:22:3

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 1
Received array:  [{"description": "Ensure every form element has a label", "help": "Form elements must have labels", "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/label?application=playwright", "id": "label", "impact": "critical", "nodes": [{"all": [], "any": [{"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-placeholder", "impact": "critical", "message": "Element has no placeholder attribute", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydayto...\" data-component-name=\"input\" type=\"number\" value=\"1\" style=\"width: 100%; padding...\">", "impact": "critical", "none": [], "target": ["input[type=\"number\"]"]}], "tags": ["cat.forms", "wcag2a", "wcag412", "section508", "section508.22.n", "TTv5", "TT5.c", "EN-301-549", "EN-9.4.1.2", "ACT", …]}]
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
            - generic [ref=e56]: Calculators
            - img [ref=e57]
          - generic [ref=e60]: Unit Converter
        - heading "Unit Converter" [level=1] [ref=e61]
        - paragraph [ref=e62]: Convert between 200+ units across 13 measurement categories
        - generic [ref=e63]:
          - button "Length" [ref=e64] [cursor=pointer]
          - button "Weight" [ref=e65] [cursor=pointer]
          - button "Temperature" [ref=e66] [cursor=pointer]
          - button "Volume" [ref=e67] [cursor=pointer]
          - button "Area" [ref=e68] [cursor=pointer]
          - button "Speed" [ref=e69] [cursor=pointer]
          - button "Pressure" [ref=e70] [cursor=pointer]
          - button "Energy" [ref=e71] [cursor=pointer]
          - button "Power" [ref=e72] [cursor=pointer]
          - button "Data" [ref=e73] [cursor=pointer]
          - button "Time" [ref=e74] [cursor=pointer]
          - button "Angle" [ref=e75] [cursor=pointer]
          - button "Frequency" [ref=e76] [cursor=pointer]
        - generic [ref=e78]:
          - generic [ref=e79]:
            - generic [ref=e80]:
              - generic [ref=e81]: From
              - button "Meter (m)" [ref=e83]:
                - generic [ref=e84]: Meter (m)
                - img [ref=e85]
            - button "Swap units" [ref=e87] [cursor=pointer]: ⇄
            - generic [ref=e88]:
              - generic [ref=e89]: To
              - button "Kilometer (km)" [ref=e91]:
                - generic [ref=e92]: Kilometer (km)
                - img [ref=e93]
          - generic [ref=e95]:
            - spinbutton [ref=e97]: "1"
            - generic [ref=e98]: "0.001"
          - generic [ref=e99]:
            - generic [ref=e100]: 1 m = 0.001 km
            - button "Pin" [ref=e101] [cursor=pointer]: ☆ Pin
        - generic [ref=e103]: ad · horizontal · 100% × 90px
      - generic [ref=e104]:
        - region "How it works" [ref=e105]:
          - paragraph [ref=e106]: How it works
          - list [ref=e107]:
            - listitem [ref=e108]:
              - generic [ref=e109]: "1"
              - generic [ref=e110]:
                - strong [ref=e111]: Select a category
                - paragraph [ref=e112]: "Choose from 13 categories: length, weight, temperature, volume, area, speed, time, digital storage, energy, pressure, power, angle, or frequency."
            - listitem [ref=e113]:
              - generic [ref=e114]: "2"
              - generic [ref=e115]:
                - strong [ref=e116]: Enter the value and unit
                - paragraph [ref=e117]: Type the value in any unit in the category. All equivalent values in other units update instantly.
            - listitem [ref=e118]:
              - generic [ref=e119]: "3"
              - generic [ref=e120]:
                - strong [ref=e121]: Read the result
                - paragraph [ref=e122]: All conversions are shown simultaneously, so you can compare units at a glance.
        - region "About this tool" [ref=e123]:
          - paragraph [ref=e124]: About this tool
          - generic [ref=e125]:
            - paragraph [ref=e126]: EverydayTools Hub Unit Converter converts between more than 200 units across 13 measurement categories — entirely in your browser, with no server involved, no account required, and completely free.
            - paragraph [ref=e127]: "The 13 supported categories are: length (metres, feet, inches, miles, kilometres, nautical miles, and more), mass/weight (kilograms, pounds, ounces, stones, tonnes), temperature (Celsius, Fahrenheit, Kelvin, Rankine), volume (litres, gallons, pints, cups, fluid ounces), area, speed, time, digital storage, energy, pressure, power, angle, and frequency."
            - paragraph [ref=e128]: All conversions use a graph-based conversion system — each unit has a defined relationship to a canonical base unit, and conversions are calculated by chaining these relationships. This ensures accuracy across all unit pairs without needing to store a conversion table for every possible combination.
            - paragraph [ref=e129]: For currency conversions with live exchange rates, use the Currency Converter. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e130]:
          - paragraph [ref=e131]: Frequently asked questions
          - generic [ref=e132]:
            - group [ref=e133]:
              - generic "How do I convert units online for free?" [ref=e134] [cursor=pointer]
            - group [ref=e135]:
              - generic "What unit categories are supported?" [ref=e136] [cursor=pointer]
            - group [ref=e137]:
              - generic "How accurate are the conversions?" [ref=e138] [cursor=pointer]
            - group [ref=e139]:
              - generic "Can I convert between metric and imperial units?" [ref=e140] [cursor=pointer]
            - group [ref=e141]:
              - generic "Does the tool support temperature conversion including Kelvin?" [ref=e142] [cursor=pointer]
            - group [ref=e143]:
              - generic "Is the Unit Converter free?" [ref=e144] [cursor=pointer]
        - navigation "Related tools" [ref=e145]:
          - paragraph [ref=e146]: Related tools
          - generic [ref=e147]:
            - link "Currency Converter - Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com." [ref=e148] [cursor=pointer]:
              - /url: /en/currency-converter
              - generic [ref=e149]:
                - paragraph [ref=e150]: Currency Converter
                - paragraph [ref=e151]: Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e152] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e153]:
                - paragraph [ref=e154]: Percentage Calculator
                - paragraph [ref=e155]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
            - link "Password Generator - Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser." [ref=e156] [cursor=pointer]:
              - /url: /en/password-generator
              - generic [ref=e157]:
                - paragraph [ref=e158]: Password Generator
                - paragraph [ref=e159]: Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser.
    - contentinfo [ref=e160]:
      - generic [ref=e161]:
        - generic [ref=e162]:
          - link "EverydayTools" [ref=e163] [cursor=pointer]:
            - /url: /
            - img [ref=e164]
            - generic [ref=e169]: EverydayTools
          - paragraph [ref=e170]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e171]:
          - heading "PDF Tools" [level=3] [ref=e172]
          - list [ref=e173]:
            - listitem [ref=e174]:
              - link "PDF to Word" [ref=e175] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e176]:
              - link "PDF to Text" [ref=e177] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e178]:
              - link "Compress PDF" [ref=e179] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e180]:
              - link "Merge PDFs" [ref=e181] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e182]:
              - link "Split PDF" [ref=e183] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e184]:
              - link "Protect PDF" [ref=e185] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e186]:
          - heading "Image Tools" [level=3] [ref=e187]
          - list [ref=e188]:
            - listitem [ref=e189]:
              - link "Image Converter" [ref=e190] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e191]:
              - link "Background Remover" [ref=e192] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e193]:
              - link "Compress Image" [ref=e194] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e195]:
              - link "Resize Image" [ref=e196] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e197]:
              - link "HEIC to JPG" [ref=e198] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e199]:
              - link "Image to PDF" [ref=e200] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e201]:
          - heading "Utilities" [level=3] [ref=e202]
          - list [ref=e203]:
            - listitem [ref=e204]:
              - link "Metadata Cleaner" [ref=e205] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e206]:
              - link "AI Text Scrubber" [ref=e207] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e208]:
              - link "Password Generator" [ref=e209] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e210]:
              - link "Currency Converter" [ref=e211] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e212]:
              - link "Unit Converter" [ref=e213] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e214]:
              - link "Percentage Calculator" [ref=e215] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e216]:
        - generic [ref=e217]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e218]:
          - link "Privacy Policy" [ref=e219] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e220] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e221] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e222]:
      - paragraph [ref=e223]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e224]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e225] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e226]:
        - button "Essential only" [ref=e227] [cursor=pointer]
        - button "Accept all" [ref=e228] [cursor=pointer]
  - region "Notifications (F8)":
    - list
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import AxeBuilder from '@axe-core/playwright';
  3  | 
  4  | const TOOL_PAGES = [
  5  |   '/',
  6  |   '/pdf-compress',
  7  |   '/pdf-merge',
  8  |   '/unit-converter',
  9  |   '/currency-converter',
  10 |   '/tip-calculator',
  11 |   '/percentage-calc',
  12 |   '/password-generator',
  13 |   '/png-to-webp',
  14 |   '/jpg-to-png',
  15 |   '/image-compress',
  16 |   '/word-counter',
  17 |   '/json-formatter',
  18 |   '/background-remover',
  19 | ];
  20 | 
  21 | for (const route of TOOL_PAGES) {
  22 |   test(`${route} — no critical accessibility violations`, async ({ page }) => {
  23 |     await page.goto(route);
  24 |     await page.waitForLoadState('networkidle');
  25 | 
  26 |     const results = await new AxeBuilder({ page })
  27 |       .withTags(['wcag2a', 'wcag2aa'])
  28 |       .exclude('[aria-hidden="true"]')
  29 |       .analyze();
  30 | 
  31 |     const critical = results.violations.filter(v => v.impact === 'critical');
  32 |     if (critical.length > 0) {
  33 |       console.log(`Critical violations on ${route}:`, critical.map(v => `${v.id}: ${v.description}`));
  34 |     }
> 35 |     expect(critical).toHaveLength(0);
     |                      ^ Error: expect(received).toHaveLength(expected)
  36 |   });
  37 | }
  38 | 
  39 | test('skip link appears on Tab', async ({ page }) => {
  40 |   await page.goto('/');
  41 |   await page.keyboard.press('Tab');
  42 |   const skipLink = page.locator('.skip-link');
  43 |   await expect(skipLink).toBeVisible({ timeout: 3000 });
  44 | });
  45 | 
  46 | test('all images have alt attributes', async ({ page }) => {
  47 |   await page.goto('/');
  48 |   const images = page.locator('img');
  49 |   const count = await images.count();
  50 |   for (let i = 0; i < count; i++) {
  51 |     const alt = await images.nth(i).getAttribute('alt');
  52 |     expect(alt).not.toBeNull();
  53 |   }
  54 | });
  55 | 
  56 | test('aria-live region is present on every page', async ({ page }) => {
  57 |   await page.goto('/');
  58 |   const liveRegion = page.locator('[aria-live]');
  59 |   expect(await liveRegion.count()).toBeGreaterThan(0);
  60 | });
  61 | 
```