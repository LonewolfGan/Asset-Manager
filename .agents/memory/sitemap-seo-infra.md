---
name: Sitemap & SEO infra
description: How the sitemap is generated, tools coverage, and analytics wiring details.
---

# Sitemap & SEO Infrastructure

**Rule:** Never edit sitemap.xml by hand. Always run the generation script.

**Why:** The sitemap is auto-generated from tools-seo-data.ts slugs. Manual edits get overwritten.

**How to apply:** `pnpm --filter @workspace/everydaytools run sitemap` or `node artifacts/everydaytools/scripts/generate-sitemap.mjs`.

## Coverage
- 34 tools have bilingual EN/FR slugs in `tools-seo-data.ts`
- Sitemap produces 70 URLs (34 tools × 2 locales + 2 homepage)
- Slug pairs live in `tools-seo-data.ts` as `slugs: { en: "...", fr: "..." }`
- High-priority tools (0.9): compress-pdf, merge-pdf, convert-heic-to-jpg, compress-image, remove-image-background, password-generator, currency-converter, unit-converter, percentage-calculator, convert-image-format, convert-pdf-to-word

## Analytics
- `src/lib/analytics.ts` exports `trackToolUsed(slug, category)`, `trackToolError(slug, errorType)`, `trackLanguageChanged(lang)`
- All 87 tool pages wired via 6 batch subagents (204 tracking calls total)
- TopNav language switcher fires `trackLanguageChanged` on click
- Events fire via `window.plausible()` — requires Plausible script in index.html

## SEO components
- `ToolPageSEO.tsx` — JSON-LD (WebApplication/CalculatorApplication + FAQPage + BreadcrumbList + HowTo), og:image, RelatedToolsSection
- `index.tsx` homepage — WebSite schema with SearchAction JSON-LD
- All 87 pages use `<ToolPageSEO internalSlug="..." />`
