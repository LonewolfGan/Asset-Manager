# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: accessibility.spec.ts >> /password-generator — no critical accessibility violations
- Location: tests/e2e/accessibility.spec.ts:22:3

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 2
Received array:  [{"description": "Ensure every form element has a label", "help": "Form elements must have labels", "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/label?application=playwright", "id": "label", "impact": "critical", "nodes": [{"all": [], "any": [{"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-placeholder", "impact": "critical", "message": "Element has no placeholder attribute", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element has no placeholder attribute
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<input data-replit-metadata=\"artifacts/everydaytools/src/pages/password-generator.tsx:128:12\" data-component-name=\"input\" min=\"8\" max=\"128\" type=\"range\" value=\"16\" style=\"width: 100%; accent-color: var(--accent);\">", "impact": "critical", "none": [], "target": ["input[min=\"8\"]"]}], "tags": ["cat.forms", "wcag2a", "wcag412", "section508", "section508.22.n", "TTv5", "TT5.c", "EN-301-549", "EN-9.4.1.2", "ACT", …]}, {"description": "Ensure select element has an accessible name", "help": "Select element must have an accessible name", "helpUrl": "https://dequeuniversity.com/rules/axe/4.11/select-name?application=playwright", "id": "select-name", "impact": "critical", "nodes": [{"all": [], "any": [{"data": null, "id": "implicit-label", "impact": "critical", "message": "Element does not have an implicit (wrapped) <label>", "relatedNodes": []}, {"data": null, "id": "explicit-label", "impact": "critical", "message": "Element does not have an explicit <label>", "relatedNodes": []}, {"data": null, "id": "aria-label", "impact": "critical", "message": "aria-label attribute does not exist or is empty", "relatedNodes": []}, {"data": null, "id": "aria-labelledby", "impact": "critical", "message": "aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty", "relatedNodes": []}, {"data": {"messageKey": "noAttr"}, "id": "non-empty-title", "impact": "critical", "message": "Element has no title attribute", "relatedNodes": []}, {"data": null, "id": "presentational-role", "impact": "critical", "message": "Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "relatedNodes": []}], "failureSummary": "Fix any of the following:
  Element does not have an implicit (wrapped) <label>
  Element does not have an explicit <label>
  aria-label attribute does not exist or is empty
  aria-labelledby attribute does not exist, references elements that do not exist or references elements that are empty
  Element has no title attribute
  Element's default semantics were not overridden with role=\"none\" or role=\"presentation\"", "html": "<select data-replit-metadata=\"artifacts/everydayto...\" data-component-name=\"select\" style=\"width: 100%; padding...\">", "impact": "critical", "none": [], "target": ["select"]}], "tags": ["cat.forms", "wcag2a", "wcag412", "section508", "section508.22.n", "TTv5", "TT5.c", "EN-301-549", "EN-9.4.1.2", "ACT", …]}]
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
          - generic [ref=e60]: Password Generator
        - heading "Password Generator" [level=1] [ref=e61]
        - paragraph [ref=e62]: Generate cryptographically secure passwords with entropy display
        - generic [ref=e63]:
          - generic [ref=e64]:
            - 'heading "=5=tCm{fp>PQ''HCx" [level=2] [ref=e65]'
            - button "Copy" [ref=e66] [cursor=pointer]
          - generic [ref=e67]:
            - generic [ref=e68]: Exceptional
            - generic [ref=e69]: (105 bits)
          - generic [ref=e70]:
            - generic [ref=e71]:
              - generic [ref=e73]: "Length: 16"
              - slider [ref=e74] [cursor=pointer]: "16"
            - generic [ref=e75]:
              - generic [ref=e76] [cursor=pointer]:
                - checkbox "Uppercase (A-Z)" [checked] [ref=e77]
                - text: Uppercase (A-Z)
              - generic [ref=e78] [cursor=pointer]:
                - checkbox "Lowercase (a-z)" [checked] [ref=e79]
                - text: Lowercase (a-z)
              - generic [ref=e80] [cursor=pointer]:
                - checkbox "Numbers (0-9)" [checked] [ref=e81]
                - text: Numbers (0-9)
              - generic [ref=e82] [cursor=pointer]:
                - checkbox "Symbols (!@#$)" [checked] [ref=e83]
                - text: Symbols (!@#$)
              - generic [ref=e84] [cursor=pointer]:
                - checkbox "Pronounceable mode" [ref=e85]
                - text: Pronounceable mode
            - generic [ref=e86]:
              - generic [ref=e87]:
                - generic [ref=e88]: Generate Count
                - combobox [ref=e89]:
                  - option "1" [selected]
                  - option "5"
                  - option "10"
                  - option "25"
              - button "Regenerate" [ref=e90] [cursor=pointer]
        - generic [ref=e91]:
          - generic [ref=e92]:
            - heading "History" [level=3] [ref=e93]
            - button "Clear History" [ref=e94] [cursor=pointer]
          - generic [ref=e97]: "=5=tCm{fp>PQ'HCx"
        - generic [ref=e99]: ad · horizontal · 100% × 90px
      - generic [ref=e100]:
        - region "How it works" [ref=e101]:
          - paragraph [ref=e102]: How it works
          - list [ref=e103]:
            - listitem [ref=e104]:
              - generic [ref=e105]: "1"
              - generic [ref=e106]:
                - strong [ref=e107]: Configure your options
                - paragraph [ref=e108]: "Choose the password length (4–128 characters), and toggle character sets: uppercase, lowercase, numbers, and symbols."
            - listitem [ref=e109]:
              - generic [ref=e110]: "2"
              - generic [ref=e111]:
                - strong [ref=e112]: Generate instantly
                - paragraph [ref=e113]: The generator uses crypto.getRandomValues() — the browser's cryptographically secure random number generator — to produce the password.
            - listitem [ref=e114]:
              - generic [ref=e115]: "3"
              - generic [ref=e116]:
                - strong [ref=e117]: Copy and use
                - paragraph [ref=e118]: Click the copy button to copy the password to your clipboard. The entropy in bits is displayed alongside.
        - region "About this tool" [ref=e119]:
          - paragraph [ref=e120]: About this tool
          - generic [ref=e121]:
            - paragraph [ref=e122]: EverydayTools Hub Password Generator creates cryptographically secure random passwords using your browser's built-in crypto.getRandomValues() API — no server involved, no data stored, completely free and private.
            - paragraph [ref=e123]: Weak passwords are the most common cause of account compromises. A strong password should be at least 16 characters long, use a mix of uppercase letters, lowercase letters, numbers, and symbols, and be unique for each account. The Password Generator creates passwords meeting these criteria instantly.
            - paragraph [ref=e124]: "The tool displays the entropy of each generated password in bits. Entropy measures the unpredictability of the password: a password with 80 bits of entropy is roughly 1 trillion trillion times harder to guess than one with 40 bits. Security experts recommend at least 80 bits of entropy for general passwords and 128+ bits for high-security accounts."
            - paragraph [ref=e125]: Passwords are generated entirely in your browser and never transmitted anywhere. For storing passwords securely, use a password manager. EverydayTools Hub is free, browser-based, and no signup is required.
        - region "Frequently asked questions" [ref=e126]:
          - paragraph [ref=e127]: Frequently asked questions
          - generic [ref=e128]:
            - group [ref=e129]:
              - generic "How do I generate a secure password for free?" [ref=e130] [cursor=pointer]
            - group [ref=e131]:
              - generic "How long should a password be?" [ref=e132] [cursor=pointer]
            - group [ref=e133]:
              - generic "What is password entropy?" [ref=e134] [cursor=pointer]
            - group [ref=e135]:
              - generic "Is the generated password stored anywhere?" [ref=e136] [cursor=pointer]
            - group [ref=e137]:
              - generic "What character sets should I include?" [ref=e138] [cursor=pointer]
            - group [ref=e139]:
              - generic "Is the Password Generator free?" [ref=e140] [cursor=pointer]
        - navigation "Related tools" [ref=e141]:
          - paragraph [ref=e142]: Related tools
          - generic [ref=e143]:
            - link "Protect PDF with Password - Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly." [ref=e144] [cursor=pointer]:
              - /url: /en/protect-pdf
              - generic [ref=e145]:
                - paragraph [ref=e146]: Protect PDF with Password
                - paragraph [ref=e147]: Add password protection to a PDF in your browser. No upload, no account, free. Secure your PDF files instantly.
            - link "Metadata Cleaner - Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info." [ref=e148] [cursor=pointer]:
              - /url: /en/clean-file-metadata
              - generic [ref=e149]:
                - paragraph [ref=e150]: Metadata Cleaner
                - paragraph [ref=e151]: Strip EXIF, XMP, and document metadata from photos and PDFs in your browser. Free, no upload, no account. Remove GPS, camera data, and author info.
            - link "Percentage Calculator - Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click." [ref=e152] [cursor=pointer]:
              - /url: /en/percentage-calculator
              - generic [ref=e153]:
                - paragraph [ref=e154]: Percentage Calculator
                - paragraph [ref=e155]: Calculate percentages, discounts, tips, and markup instantly in your browser. Free, no account. Solve any percentage problem in one click.
    - contentinfo [ref=e156]:
      - generic [ref=e157]:
        - generic [ref=e158]:
          - link "EverydayTools" [ref=e159] [cursor=pointer]:
            - /url: /
            - img [ref=e160]
            - generic [ref=e165]: EverydayTools
          - paragraph [ref=e166]: A collection of browser-based tools for everyday file tasks. Fast, private, and free.
        - generic [ref=e167]:
          - heading "PDF Tools" [level=3] [ref=e168]
          - list [ref=e169]:
            - listitem [ref=e170]:
              - link "PDF to Word" [ref=e171] [cursor=pointer]:
                - /url: /pdf-to-word
            - listitem [ref=e172]:
              - link "PDF to Text" [ref=e173] [cursor=pointer]:
                - /url: /pdf-to-text
            - listitem [ref=e174]:
              - link "Compress PDF" [ref=e175] [cursor=pointer]:
                - /url: /pdf-compress
            - listitem [ref=e176]:
              - link "Merge PDFs" [ref=e177] [cursor=pointer]:
                - /url: /pdf-merge
            - listitem [ref=e178]:
              - link "Split PDF" [ref=e179] [cursor=pointer]:
                - /url: /pdf-split
            - listitem [ref=e180]:
              - link "Protect PDF" [ref=e181] [cursor=pointer]:
                - /url: /pdf-protect
        - generic [ref=e182]:
          - heading "Image Tools" [level=3] [ref=e183]
          - list [ref=e184]:
            - listitem [ref=e185]:
              - link "Image Converter" [ref=e186] [cursor=pointer]:
                - /url: /image-converter
            - listitem [ref=e187]:
              - link "Background Remover" [ref=e188] [cursor=pointer]:
                - /url: /background-remover
            - listitem [ref=e189]:
              - link "Compress Image" [ref=e190] [cursor=pointer]:
                - /url: /image-compress
            - listitem [ref=e191]:
              - link "Resize Image" [ref=e192] [cursor=pointer]:
                - /url: /image-resize
            - listitem [ref=e193]:
              - link "HEIC to JPG" [ref=e194] [cursor=pointer]:
                - /url: /heic-to-jpg
            - listitem [ref=e195]:
              - link "Image to PDF" [ref=e196] [cursor=pointer]:
                - /url: /image-to-pdf
        - generic [ref=e197]:
          - heading "Utilities" [level=3] [ref=e198]
          - list [ref=e199]:
            - listitem [ref=e200]:
              - link "Metadata Cleaner" [ref=e201] [cursor=pointer]:
                - /url: /metadata-cleaner
            - listitem [ref=e202]:
              - link "AI Text Scrubber" [ref=e203] [cursor=pointer]:
                - /url: /ai-text-scrubber
            - listitem [ref=e204]:
              - link "Password Generator" [ref=e205] [cursor=pointer]:
                - /url: /password-generator
            - listitem [ref=e206]:
              - link "Currency Converter" [ref=e207] [cursor=pointer]:
                - /url: /currency-converter
            - listitem [ref=e208]:
              - link "Unit Converter" [ref=e209] [cursor=pointer]:
                - /url: /unit-converter
            - listitem [ref=e210]:
              - link "Percentage Calculator" [ref=e211] [cursor=pointer]:
                - /url: /percentage-calc
      - generic [ref=e212]:
        - generic [ref=e213]: © 2026 EverydayTools Hub. All rights reserved.
        - navigation [ref=e214]:
          - link "Privacy Policy" [ref=e215] [cursor=pointer]:
            - /url: /privacy
          - link "Terms of Service" [ref=e216] [cursor=pointer]:
            - /url: /terms
          - button "Cookie Preferences" [ref=e217] [cursor=pointer]
    - dialog "Cookie preferences" [ref=e218]:
      - paragraph [ref=e219]:
        - text: We use privacy-first analytics (no cookies, no personal data) and, with your consent, ads that help keep all tools free. Your files are
        - strong [ref=e220]: never uploaded
        - text: —
        - link "Privacy policy" [ref=e221] [cursor=pointer]:
          - /url: /privacy
      - generic [ref=e222]:
        - button "Essential only" [ref=e223] [cursor=pointer]
        - button "Accept all" [ref=e224] [cursor=pointer]
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