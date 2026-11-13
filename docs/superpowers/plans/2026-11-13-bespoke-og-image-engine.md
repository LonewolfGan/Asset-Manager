# Plan: Bespoke Dark-Hardware OpenGraph Image Generation Engine

## 1. Executive Summary
Provide bespoke, ultra-high-definition 1200x630 OpenGraph and Twitter social preview cards for all EverydayTools entities (85 tools x 2 locales = 170 cards, 116 blog posts x 2 locales = 232 cards, 2 home cards = 404 total images).
- **Strict Prohibition**: ABSOLUTELY ZERO EMOJIS in templates, text, or metadata.
- **Design Alignment**: Double-bezel machined plate (`#121215` over `#09090b`), Radix zinc borders (`#27272a`), Radix orange accents (`#FF6B35`), precision dot matrix, and monospace telemetry badges.
- **Visual Centerpiece**: Physical conversion bus (`[ IN_FORMAT ] ────────► [ OUT_FORMAT ]`) with glowing optical bus lines for conversion tools, and clean editorial titles for blog posts.
- **Performance**: Pre-compiled during build step in ~1.5s via Rust-powered `@resvg/resvg-js`. Zero runtime latency or server overhead.

---

## 2. Architecture & Modular Boundaries (< 300 LOC per file)
1. `apps/everydaytools/src/lib/og/og-types.ts` (< 50 LOC):
   - Contract definition for card metadata (title, category, subtitle, formats, telemetry badges, locale).
2. `apps/everydaytools/src/lib/og/og-svg-template.ts` (< 250 LOC):
   - Pure functional SVG template renderer creating a 1200x630 SVG string with double-bezel, dot matrix, format connectors, and telemetry footer.
3. `apps/everydaytools/src/lib/og/og-data-resolver.ts` (< 150 LOC):
   - Extracts semantic metadata and format tokens from tools and blog posts.
4. `apps/everydaytools/scripts/generate-og-images.ts` (< 200 LOC):
   - Build-time generator that writes `.png` assets to `dist/public/og/tools/{locale}/{slug}.png`, `dist/public/og/blog/{locale}/{slug}.png`, and `dist/public/og/home-{locale}.png`.
5. SSR & Metadata Integration:
   - Wire dynamic `og:image` and `twitter:image` tags in `seo-ssr.ts` and `seo-blog-ssr.ts`.

---

## 3. TDD Plan
- Write `apps/everydaytools/tests/unit/seo/og-svg-template.test.ts`:
  - Assert 1200x630 dimensions.
  - Assert strictly ZERO emojis (regex check against unicode emoji ranges).
  - Assert presence of double-bezel rects, Radix colors (`#09090b`, `#121215`, `#FF6B35`).
  - Assert PNG conversion renders valid non-empty PNG buffer with PNG signature `89 50 4E 47`.

---

## 4. Verification Gate
- `pnpm run clean:codebase`
- `pnpm run check:rules`
- `pnpm run typecheck`
- `pnpm test`
- Visual proof via generated PNG cards inspection.
