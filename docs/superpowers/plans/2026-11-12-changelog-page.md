# Changelog & Product Updates Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a world-class, Linear/Raycast-inspired Changelog page (`/changelog`, `/fr/changelog`, `/en/changelog`) showcasing product momentum, conversion engine upgrades, and performance speedups with full TDD and bilingual support.

---

## Architecture & Decomposition

Strict adherence to Single Responsibility Principle (SRP < 300 LOC per file) and Design System Rules (Double-Bezel, Radix Palette, Zero Card-Slop, Swiss Typography):

```
apps/everydaytools/src/
├── config/
│   └── changelog-data.ts             # [NEW] Declarative release registry & types (< 250 LOC)
├── components/
│   └── changelog/
│       └── ChangelogItem.tsx         # [NEW] High-end timeline entry card with tags & badges (< 180 LOC)
├── pages/
│   └── changelog.tsx                 # [NEW] Main page with monumental header (< 150 LOC)
├── i18n/
│   └── translations.ts               # [MODIFIED] Add changelog labels
├── components/
│   └── Footer.tsx                    # [MODIFIED] Add Changelog link in footer nav
└── routes/
    ├── tool-components.ts            # [MODIFIED] Lazy load Changelog
    └── AppRoutes.tsx                 # [MODIFIED] Map /changelog, /fr/changelog, /en/changelog
```

---

## Detailed Task Breakdown

### Task 1: Create Declarative Changelog Registry (`config/changelog-data.ts`)
- [ ] Define `ChangelogRelease` interface with `id`, `version`, `dateFr`, `dateEn`, `titleFr`, `titleEn`, `badge`, `summaryFr`, `summaryEn`, `changesFr`, `changesEn`, `tools`, `metrics`.
- [ ] Populate with verified historical milestones:
  - `v2.4.0` (November 2026): Refonte Haute Fidélité, Architecture Resend, Mentions Légales LCEN & Transparence Cookies.
  - `v2.3.0` (October 2026): Moteurs PDF natifs Sprint 3 (pdf-protect, pdf-unlock, pdf-watermark, pdf-page-numbers).
  - `v2.2.0` (October 2026): Moteurs PDF natifs Sprint 2 (pdf-compress, pdf-merge, pdf-split, pdf-rotate) avec Ghostscript & isolation temporaire 15 min.
  - `v2.1.0` (October 2026): Moteurs Documents Sprint 1 (pdf-to-epub, pdf-to-image, pdf-to-pdfa, pdf-metadata) avec LibreOffice headless.
  - `v2.0.0` (September 2026): Moteur IA détourage ONNX local rembg (zéro cloud externe), nettoyeur de métadonnées client-side.
- [ ] Verify line count < 300 LOC.

### Task 2: Write TDD Test Suite (PHASE RED)
- [ ] Create `apps/everydaytools/tests/unit/ui/changelog-page.test.tsx`.
- [ ] Test 1: Renders page heading, subtitle, and list of releases in French.
- [ ] Test 2: Renders page heading, subtitle, and list of releases in English.
- [ ] Test 3: Displays version badges, dates, and tool tags properly.
- [ ] Test 4: Follows single-column timeline layout without breadcrumb slop.
- [ ] Run test to verify it fails (PHASE RED).

### Task 3: Build `ChangelogItem.tsx` Component
- [ ] Create `apps/everydaytools/src/components/changelog/ChangelogItem.tsx`.
- [ ] Left column on desktop: Version badge (`font-mono text-xs px-2.5 py-1 rounded-full`), formatted date, release badge.
- [ ] Right column: Space Grotesk release title, narrative summary, bullet points with checkmark or dot accents, tool pills linked to `/slug`.
- [ ] Responsive stack for mobile (`flex-col sm:flex-row`).
- [ ] Verify line count < 200 LOC.

### Task 4: Build `changelog.tsx` Page Component
- [ ] Create `apps/everydaytools/src/pages/changelog.tsx`.
- [ ] Helmet SEO meta (title, canonical `/changelog` and `/fr/changelog`, description).
- [ ] Monumental header: "Mises à jour & Nouveautés" / "Changelog & Product Updates".
- [ ] Tag filter / stats summary bar (e.g. Total releases, engines deployed, 100% private).
- [ ] Render timeline items.
- [ ] Verify line count < 200 LOC.

### Task 5: Routing, Footer Navigation & i18n
- [ ] Update `apps/everydaytools/src/i18n/translations.ts` (add `changelog: string` to footer).
- [ ] Update `apps/everydaytools/src/components/Footer.tsx` (add link to footer nav).
- [ ] Update `apps/everydaytools/src/routes/tool-components.ts` (lazy load `Changelog`).
- [ ] Update `apps/everydaytools/src/routes/AppRoutes.tsx` (routes `/changelog`, `/fr/changelog`, `/en/changelog`).

### Task 6: Mechanical Verification & Visual Confirmation
- [ ] Run unit tests: `pnpm --filter @workspace/everydaytools test tests/unit/ui/changelog-page.test.tsx` -> GREEN.
- [ ] Run codebase sanitation: `pnpm run clean:codebase`.
- [ ] Run design rules check: `pnpm run check:rules`.
- [ ] Run monorepo typecheck: `pnpm run typecheck`.
- [ ] Navigate to `http://localhost:5000/changelog` & `http://localhost:5000/fr/changelog` via `chrome-devtools-mcp` and take screenshots.
