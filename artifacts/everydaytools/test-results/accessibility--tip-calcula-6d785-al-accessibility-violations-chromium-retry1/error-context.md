# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> /tip-calculator — no critical accessibility violations
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
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydayto...\" data-component-name=\"input\" min=\"0\" step=\"0.01\" type=\"number\" value=\"50\" style=\"width: 100%; padding...\">", "impact": "critical", "none": [], "target": ["input[step=\"0.01\"]"]}, {"all": [], "any": [{"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-placeholder", "impact": "critical", "message": "Element has no placeholder attribute", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydaytools/src/pages/tip-calculator.tsx:134:16\" data-component-name=\"input\" min=\"0\" max=\"50\" step=\"1\" type=\"range\" value=\"20\" style=\"width: 100%; accent-color: var(--accent); margin-bottom: 12px;\">", "impact": "critical", "none": [], "target": ["input[max=\"50\"]"]}, {"all": [], "any": [{"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-placeholder", "impact": "critical", "message": "Element has no placeholder attribute", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydaytools/src/pages/tip-calculator.tsx:153:16\" data-component-name=\"input\" min=\"1\" max=\"20\" step=\"1\" type=\"range\" value=\"1\" style=\"width: 100%; accent-color: var(--accent);\">", "impact": "critical", "none": [], "target": ["input[min=\"1\"]"]}], "tags": ["cat.forms", "wcag2a", "wcag412", "section508", "section508.22.n", "TTv5", "TT5.c", "EN-301-549", "EN-9.4.1.2", "ACT", …]}]
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
          - generic [ref=e60]: Tip Calculator
        - heading "Tip Calculator" [level=1] [ref=e61]
        - paragraph [ref=e62]: Calculate tip and split the bill across any number of people
        - generic [ref=e64]: ad · horizontal · 100% × 90px
        - generic [ref=e65]:
          - button "Tip Calculator" [ref=e66] [cursor=pointer]
          - button "Percentages" [ref=e67] [cursor=pointer]
        - generic [ref=e68]:
          - generic [ref=e69]:
            - generic [ref=e70]:
              - generic [ref=e71]: Bill Amount
              - generic [ref=e72]:
                - generic [ref=e73]: $
                - spinbutton [ref=e74]: "50"
            - generic [ref=e75]:
              - generic [ref=e76]:
                - generic [ref=e77]: Tip Percentage
                - generic [ref=e78]: 20%
              - slider [ref=e79] [cursor=pointer]: "20"
              - generic [ref=e80]:
                - button "15%" [ref=e81] [cursor=pointer]
                - button "18%" [ref=e82] [cursor=pointer]
                - button "20%" [ref=e83] [cursor=pointer]
                - button "25%" [ref=e84] [cursor=pointer]
            - generic [ref=e85]:
              - generic [ref=e86]:
                - generic [ref=e87]: Number of People
                - generic [ref=e88]: "1"
              - slider [ref=e89] [cursor=pointer]: "1"
          - generic [ref=e90]:
            - generic [ref=e91]:
              - generic [ref=e92]: Bill
              - generic [ref=e93]: $50.00
            - generic [ref=e94]:
              - generic [ref=e95]: Tip (20%)
              - generic [ref=e96]: $10.00
            - generic [ref=e97]:
              - generic [ref=e98]: Total
              - generic [ref=e99]: $60.00
        - generic [ref=e102]: ad · horizontal · 100% × 90px
    - contentinfo [ref=e103]:
      - generic [ref=e104]:
        - generic [ref=e105]:
          - link "EverydayTools" [ref=e106] [cursor=pointer]:
            - /url: /
            - img [ref=e107]
            - generic [ref=e112]: EverydayTools
          - paragraph [ref=e113]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e114]:
          - heading "PDF Tools" [level=3] [ref=e115]
          - list [ref=e116]:
            - listitem [ref=e117]:
              - link "PDF to Word" [ref=e118] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e119]:
              - link "PDF to Text" [ref=e120] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e121]:
              - link "Compress PDF" [ref=e122] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e123]:
              - link "Merge PDFs" [ref=e124] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e125]:
              - link "Split PDF" [ref=e126] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e127]:
              - link "Protect PDF" [ref=e128] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e129]:
          - heading "Image Tools" [level=3] [ref=e130]
          - list [ref=e131]:
            - listitem [ref=e132]:
              - link "Image Converter" [ref=e133] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e134]:
              - link "Background Remover" [ref=e135] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e136]:
              - link "Compress Image" [ref=e137] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e138]:
              - link "Resize Image" [ref=e139] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e140]:
              - link "HEIC to JPG" [ref=e141] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e142]:
              - link "Image to PDF" [ref=e143] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e144]:
          - heading "Utilities" [level=3] [ref=e145]
          - list [ref=e146]:
            - listitem [ref=e147]:
              - link "Metadata Cleaner" [ref=e148] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e149]:
              - link "AI Text Scrubber" [ref=e150] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e151]:
              - link "Password Generator" [ref=e152] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e153]:
              - link "Currency Converter" [ref=e154] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e155]:
              - link "Unit Converter" [ref=e156] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e157]:
              - link "Percentage Calculator" [ref=e158] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e159]:
        - generic [ref=e160]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e161]:
          - link "Privacy Policy" [ref=e162] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e163] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e164] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e165]:
      - paragraph [ref=e166]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e167]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e168] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e169]:
        - button "Essential only" [ref=e170] [cursor=pointer]
        - button "Accept all" [ref=e171] [cursor=pointer]
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