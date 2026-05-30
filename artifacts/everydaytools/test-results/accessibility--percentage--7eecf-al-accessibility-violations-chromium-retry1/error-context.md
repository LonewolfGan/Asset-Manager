# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> /percentage-calc — no critical accessibility violations
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
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydayto...\" data-component-name=\"input\" type=\"number\" value=\"\" style=\"width: 100%; padding...\">", "impact": "critical", "none": [], "target": ["div[data-component-name=\"div\"]:nth-child(1) > input[type=\"number\"]"]}, {"all": [], "any": [{"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-placeholder", "impact": "critical", "message": "Element has no placeholder attribute", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydayto...\" data-component-name=\"input\" type=\"number\" value=\"\" style=\"width: 100%; padding...\">", "impact": "critical", "none": [], "target": ["div[data-component-name=\"div\"]:nth-child(2) > input[type=\"number\"]"]}], "tags": ["cat.forms", "wcag2a", "wcag412", "section508", "section508.22.n", "TTv5", "TT5.c", "EN-301-549", "EN-9.4.1.2", "ACT", …]}]
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
          - generic [ref=e60]: Percentage Calculator
        - heading "Percentage Calculator" [level=1] [ref=e61]
        - paragraph [ref=e62]: Calculate percentages, discounts, tips, and markup instantly
        - generic [ref=e63]:
          - button "X % of Y" [ref=e64] [cursor=pointer]
          - button "X is what % of Y" [ref=e65] [cursor=pointer]
          - button "Percentage Change" [ref=e66] [cursor=pointer]
          - button "Discount" [ref=e67] [cursor=pointer]
          - button "Tip & Split" [ref=e68] [cursor=pointer]
          - button "Markup / Margin" [ref=e69] [cursor=pointer]
        - generic [ref=e70]:
          - generic [ref=e71]:
            - generic [ref=e72]:
              - generic [ref=e73]: What is (X)%
              - spinbutton [ref=e74]
            - generic [ref=e75]:
              - generic [ref=e76]: of (Y)
              - spinbutton [ref=e77]
          - generic [ref=e78]:
            - generic [ref=e79]: Result
            - generic [ref=e80]: —
        - generic [ref=e82]: ad · horizontal · 100% × 90px
      - generic [ref=e83]:
        - region "How it works" [ref=e84]:
          - paragraph [ref=e85]: How it works
          - list [ref=e86]:
            - listitem [ref=e87]:
              - generic [ref=e88]: "1"
              - generic [ref=e89]:
                - strong [ref=e90]: Choose the calculation type
                - paragraph [ref=e91]: "Select the percentage problem you need to solve: basic percentage, discount, tip, markup, or percentage change."
            - listitem [ref=e92]:
              - generic [ref=e93]: "2"
              - generic [ref=e94]:
                - strong [ref=e95]: Enter the values
                - paragraph [ref=e96]: Fill in the known values. The calculator instantly shows the result as you type.
            - listitem [ref=e97]:
              - generic [ref=e98]: "3"
              - generic [ref=e99]:
                - strong [ref=e100]: Use the result
                - paragraph [ref=e101]: Copy the result or use it directly. No button to press — calculations update in real time.
        - region "About this tool" [ref=e102]:
          - paragraph [ref=e103]: About this tool
          - generic [ref=e104]:
            - paragraph [ref=e105]: EverydayTools Hub Percentage Calculator solves all common percentage problems instantly — entirely in your browser, with no account required and no data sent to any server.
            - paragraph [ref=e106]: "Percentage calculations appear in everyday situations: calculating a restaurant tip, working out a sale discount, determining the percentage change between two values, calculating tax, or finding what percentage one number is of another. The calculator covers all these use cases with clearly labelled inputs and instant results."
            - paragraph [ref=e107]: "The tool supports: basic percentage (X% of Y), percentage increase/decrease, percentage of total, discount calculation (original price minus percentage), tip calculation (bill amount plus tip percentage), and markup (cost plus markup percentage). All calculations update in real time as you type."
            - paragraph [ref=e108]: For currency conversions (including applying currency discounts), use the Currency Converter. For unit conversions, use the Unit Converter. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e109]:
          - paragraph [ref=e110]: Frequently asked questions
          - generic [ref=e111]:
            - group [ref=e112]:
              - generic "How do I calculate a percentage online?" [ref=e113] [cursor=pointer]
            - group [ref=e114]:
              - generic "How do I calculate a discount percentage?" [ref=e115] [cursor=pointer]
            - group [ref=e116]:
              - generic "How do I calculate a tip?" [ref=e117] [cursor=pointer]
            - group [ref=e118]:
              - generic "How do I find what percentage one number is of another?" [ref=e119] [cursor=pointer]
            - group [ref=e120]:
              - generic "How do I calculate percentage change?" [ref=e121] [cursor=pointer]
            - group [ref=e122]:
              - generic "Is the Percentage Calculator free?" [ref=e123] [cursor=pointer]
        - navigation "Related tools" [ref=e124]:
          - paragraph [ref=e125]: Related tools
          - generic [ref=e126]:
            - link "Unit Converter - Convert between 200+ units across 13 measurement categories in your browser. Free, no account. Length, weight, temperature, volume, and more." [ref=e127] [cursor=pointer]:
              - /url: /en/unit-converter
              - generic [ref=e128]:
                - paragraph [ref=e129]: Unit Converter
                - paragraph [ref=e130]: Convert between 200+ units across 13 measurement categories in your browser. Free, no account. Length, weight, temperature, volume, and more.
            - link "Currency Converter - Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com." [ref=e131] [cursor=pointer]:
              - /url: /en/currency-converter
              - generic [ref=e132]:
                - paragraph [ref=e133]: Currency Converter
                - paragraph [ref=e134]: Convert between 170 currencies with live exchange rates in your browser. Free, no account. Rates cached for 1 hour from open.er-api.com.
            - link "Password Generator - Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser." [ref=e135] [cursor=pointer]:
              - /url: /en/password-generator
              - generic [ref=e136]:
                - paragraph [ref=e137]: Password Generator
                - paragraph [ref=e138]: Generate cryptographically secure passwords with entropy display. Free, no signup. Customise length, symbols, and character sets in your browser.
    - contentinfo [ref=e139]:
      - generic [ref=e140]:
        - generic [ref=e141]:
          - link "EverydayTools" [ref=e142] [cursor=pointer]:
            - /url: /
            - img [ref=e143]
            - generic [ref=e148]: EverydayTools
          - paragraph [ref=e149]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e150]:
          - heading "PDF Tools" [level=3] [ref=e151]
          - list [ref=e152]:
            - listitem [ref=e153]:
              - link "PDF to Word" [ref=e154] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e155]:
              - link "PDF to Text" [ref=e156] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e157]:
              - link "Compress PDF" [ref=e158] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e159]:
              - link "Merge PDFs" [ref=e160] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e161]:
              - link "Split PDF" [ref=e162] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e163]:
              - link "Protect PDF" [ref=e164] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e165]:
          - heading "Image Tools" [level=3] [ref=e166]
          - list [ref=e167]:
            - listitem [ref=e168]:
              - link "Image Converter" [ref=e169] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e170]:
              - link "Background Remover" [ref=e171] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e172]:
              - link "Compress Image" [ref=e173] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e174]:
              - link "Resize Image" [ref=e175] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e176]:
              - link "HEIC to JPG" [ref=e177] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e178]:
              - link "Image to PDF" [ref=e179] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e180]:
          - heading "Utilities" [level=3] [ref=e181]
          - list [ref=e182]:
            - listitem [ref=e183]:
              - link "Metadata Cleaner" [ref=e184] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e185]:
              - link "AI Text Scrubber" [ref=e186] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e187]:
              - link "Password Generator" [ref=e188] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e189]:
              - link "Currency Converter" [ref=e190] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e191]:
              - link "Unit Converter" [ref=e192] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e193]:
              - link "Percentage Calculator" [ref=e194] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e195]:
        - generic [ref=e196]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e197]:
          - link "Privacy Policy" [ref=e198] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e199] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e200] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e201]:
      - paragraph [ref=e202]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e203]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e204] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e205]:
        - button "Essential only" [ref=e206] [cursor=pointer]
        - button "Accept all" [ref=e207] [cursor=pointer]
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