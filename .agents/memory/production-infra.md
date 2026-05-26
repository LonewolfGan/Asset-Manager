---
name: Production infra
description: Vercel deployment config, consent system, AdSense wiring, analytics, legal pages — all added for production launch.
---

## Vercel deployment
- `vercel.json` at repo root; build command: `PORT=3000 BASE_PATH=/ pnpm --filter @workspace/everydaytools run build`
- Output dir: `artifacts/everydaytools/dist/public`
- SPA rewrite: `/(.*) → /index.html` (static files like sitemap.xml/robots.txt are served directly before the rewrite fires)
- Node version: 22 (`.node-version` file at root)

## AdSense
- Publisher ID sourced from `VITE_ADSENSE_PUBLISHER_ID` environment variable
- Set in Vercel → Project → Settings → Environment Variables before deploying
- `src/lib/consent.ts` exports `loadAdSense()`, `getAdSenseClient()`, consent store
- `AdSlot.tsx` uses IntersectionObserver for lazy loading, consent-gated — renders real `<ins>` tags in prod, styled placeholder in dev
- Slots render nothing (not even a placeholder) in prod if `VITE_ADSENSE_PUBLISHER_ID` is not set

## Consent system
- `src/lib/consent.ts` — localStorage key `et_consent`, 1-year TTL, dispatches `et:consent` CustomEvent
- `CookieBanner.tsx` — fixed bottom bar, "Essential only" / "Accept all"; listens for `et:show-consent` to re-show
- Footer "Manage cookies" button dispatches `et:show-consent`

## Analytics
- Plausible added to `index.html` as `defer` script — no cookies, no consent needed
- Domain configured as `everydaytoolshub.com`; must match Plausible account domain

## Legal pages
- `/privacy` → `src/pages/privacy.tsx`
- `/terms` → `src/pages/terms.tsx`
- Both lazy-loaded, registered in App.tsx Switch

## Known non-blocking warnings in build
- `ejs` node module externalizes `fs`/`path` — from `mammoth` transitive dep, not our code
- Chunk size warnings for `heic2any`, `ort.bundle.min`, `pdf.js` — expected for a rich client-side app
