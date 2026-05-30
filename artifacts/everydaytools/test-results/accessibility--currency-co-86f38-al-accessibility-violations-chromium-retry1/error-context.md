# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> /currency-converter — no critical accessibility violations
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
          - generic [ref=e60]: Currency Converter
        - heading "Currency Converter" [level=1] [ref=e61]
        - paragraph [ref=e62]: Convert between 170 currencies with live rates
        - generic [ref=e64]:
          - generic [ref=e65]:
            - generic [ref=e66]:
              - generic [ref=e67]: From
              - button "USD - United States Dollar" [ref=e69]:
                - generic [ref=e70]: USD - United States Dollar
                - img [ref=e71]
            - button "Swap units" [ref=e73] [cursor=pointer]: ⇄
            - generic [ref=e74]:
              - generic [ref=e75]: To
              - button "EUR - Euro" [ref=e77]:
                - generic [ref=e78]: EUR - Euro
                - img [ref=e79]
          - generic [ref=e81]:
            - spinbutton [ref=e83]: "1"
            - generic [ref=e84]: "0.86"
          - generic [ref=e85]: Live rates, just updated
        - generic [ref=e86]:
          - generic [ref=e87]:
            - heading "Quick Conversions" [level=3] [ref=e88]
            - table [ref=e89]:
              - rowgroup [ref=e90]:
                - row "1 USD 0.86 EUR" [ref=e91]:
                  - cell "1 USD" [ref=e92]
                  - cell "0.86 EUR" [ref=e93]
                - row "10 USD 8.59 EUR" [ref=e94]:
                  - cell "10 USD" [ref=e95]
                  - cell "8.59 EUR" [ref=e96]
                - row "100 USD 85.89 EUR" [ref=e97]:
                  - cell "100 USD" [ref=e98]
                  - cell "85.89 EUR" [ref=e99]
                - row "1000 USD 858.92 EUR" [ref=e100]:
                  - cell "1000 USD" [ref=e101]
                  - cell "858.92 EUR" [ref=e102]
                - row "10000 USD 8589.21 EUR" [ref=e103]:
                  - cell "10000 USD" [ref=e104]
                  - cell "8589.21 EUR" [ref=e105]
          - generic [ref=e106]:
            - heading "Recent History" [level=3] [ref=e107]
            - paragraph [ref=e108]: No recent conversions.
        - generic [ref=e110]: ad · horizontal · 100% × 90px
      - generic [ref=e111]:
        - region "How it works" [ref=e112]:
          - paragraph [ref=e113]: How it works
          - list [ref=e114]:
            - listitem [ref=e115]:
              - generic [ref=e116]: "1"
              - generic [ref=e117]:
                - strong [ref=e118]: Select currencies
                - paragraph [ref=e119]: Choose the source currency and target currency from the dropdown. 170 currencies are available.
            - listitem [ref=e120]:
              - generic [ref=e121]: "2"
              - generic [ref=e122]:
                - strong [ref=e123]: Enter the amount
                - paragraph [ref=e124]: Type the amount to convert. The result updates in real time using live exchange rates.
            - listitem [ref=e125]:
              - generic [ref=e126]: "3"
              - generic [ref=e127]:
                - strong [ref=e128]: Read the result
                - paragraph [ref=e129]: The converted amount and the current exchange rate are displayed. Rates are refreshed from open.er-api.com and cached for 1 hour.
        - region "About this tool" [ref=e130]:
          - paragraph [ref=e131]: About this tool
          - generic [ref=e132]:
            - paragraph [ref=e133]: EverydayTools Hub Currency Converter converts between 170 world currencies using live exchange rates — entirely in your browser, with no account required and completely free.
            - paragraph [ref=e134]: Exchange rates are fetched from open.er-api.com, a free public API that provides mid-market rates updated every hour. The rates are cached in your browser's localStorage for 1 hour to reduce API requests and provide fast conversion even with a slow connection. If the live rate fetch fails, a built-in static fallback rate table is used.
            - paragraph [ref=e135]: The converter supports 170 currencies including all major currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY), all EU member state currencies, most emerging market currencies, and cryptocurrencies are not included (exchange rates for cryptocurrencies require specialised APIs due to their 24/7 volatility).
            - paragraph [ref=e136]: "Note: the rates shown are mid-market rates — the midpoint between buy and sell prices. Actual rates offered by banks, currency exchange services, or payment processors will include a spread or fee. EverydayTools Hub is free, browser-based, and no signup is required."
        - region "Frequently asked questions" [ref=e137]:
          - paragraph [ref=e138]: Frequently asked questions
          - generic [ref=e139]:
            - group [ref=e140]:
              - generic "How accurate are the exchange rates?" [ref=e141] [cursor=pointer]
            - group [ref=e142]:
              - generic "How often are rates updated?" [ref=e143] [cursor=pointer]
            - group [ref=e144]:
              - generic "What happens if the rate API is unavailable?" [ref=e145] [cursor=pointer]
            - group [ref=e146]:
              - generic "Are cryptocurrency exchange rates supported?" [ref=e147] [cursor=pointer]
            - group [ref=e148]:
              - generic "What is a mid-market exchange rate?" [ref=e149] [cursor=pointer]
            - group [ref=e150]:
              - generic "Is the Currency Converter free?" [ref=e151] [cursor=pointer]
        - navigation "Related tools" [ref=e152]:
          - paragraph [ref=e153]: Related tools
          - generic [ref=e154]:
            - link "Unit Converter - Convert between 200+ units across 13 measurement categories in your browser. Free, no account. Length, weight, temperature, volume, and more." [ref=e155] [cursor=pointer]:
              - /url: /en/unit-converter
              - generic [ref=e156]:
                - paragraph [ref=e157]: Unit Converter
                - paragraph [ref=e158]: Convert between 200+ units across 13 measurement categories in your browser. Free, no account. Length, weight, temperature, volume, and more.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e159] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e160]:
                - paragraph [ref=e161]: Percentage Calculator
                - paragraph [ref=e162]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
            - link "Password Generator - Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser." [ref=e163] [cursor=pointer]:
              - /url: /en/password-generator
              - generic [ref=e164]:
                - paragraph [ref=e165]: Password Generator
                - paragraph [ref=e166]: Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser.
    - contentinfo [ref=e167]:
      - generic [ref=e168]:
        - generic [ref=e169]:
          - link "EverydayTools" [ref=e170] [cursor=pointer]:
            - /url: /
            - img [ref=e171]
            - generic [ref=e176]: EverydayTools
          - paragraph [ref=e177]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e178]:
          - heading "PDF Tools" [level=3] [ref=e179]
          - list [ref=e180]:
            - listitem [ref=e181]:
              - link "PDF to Word" [ref=e182] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e183]:
              - link "PDF to Text" [ref=e184] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e185]:
              - link "Compress PDF" [ref=e186] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e187]:
              - link "Merge PDFs" [ref=e188] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e189]:
              - link "Split PDF" [ref=e190] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e191]:
              - link "Protect PDF" [ref=e192] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e193]:
          - heading "Image Tools" [level=3] [ref=e194]
          - list [ref=e195]:
            - listitem [ref=e196]:
              - link "Image Converter" [ref=e197] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e198]:
              - link "Background Remover" [ref=e199] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e200]:
              - link "Compress Image" [ref=e201] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e202]:
              - link "Resize Image" [ref=e203] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e204]:
              - link "HEIC to JPG" [ref=e205] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e206]:
              - link "Image to PDF" [ref=e207] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e208]:
          - heading "Utilities" [level=3] [ref=e209]
          - list [ref=e210]:
            - listitem [ref=e211]:
              - link "Metadata Cleaner" [ref=e212] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e213]:
              - link "AI Text Scrubber" [ref=e214] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e215]:
              - link "Password Generator" [ref=e216] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e217]:
              - link "Currency Converter" [ref=e218] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e219]:
              - link "Unit Converter" [ref=e220] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e221]:
              - link "Percentage Calculator" [ref=e222] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e223]:
        - generic [ref=e224]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e225]:
          - link "Privacy Policy" [ref=e226] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e227] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e228] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e229]:
      - paragraph [ref=e230]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e231]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e232] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e233]:
        - button "Essential only" [ref=e234] [cursor=pointer]
        - button "Accept all" [ref=e235] [cursor=pointer]
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