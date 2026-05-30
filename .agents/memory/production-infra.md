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

## Build config (vite.config.ts)
- `PORT` and `BASE_PATH` env vars have defaults (`"5000"` / `"/"`) — safe to run `pnpm run build` without them set; vercel.json injects them via buildCommand
- `worker: { format: "es" }` is required — `@jsquash/avif` ships an IIFE worker; without this, Vite code-splitting mode crashes with "UMD and IIFE formats not supported"
- `sourcemap: false` and `chunkSizeWarningLimit: 1500` set for production builds
- **No manualChunks** — attempting Rollup manualChunks reintroduces the IIFE worker conflict

## TypeScript fixes (TS 5.9 changes)
- `Uint8Array<ArrayBufferLike>` is no longer assignable to `BlobPart` — cast with `bytes as unknown as BlobPart` for all pdf-lib `save()` outputs
- `pdf-lib SaveOptions` no longer exposes `userPassword`/`ownerPassword` in types — use `as any` cast
- `pdf-lib LoadOptions` no longer exposes `password` — use `as any` cast
- `pdfjs-dist RenderParameters` changed — use `{ canvasContext: ctx, viewport } as any` for page.render() calls
- `epub-gen-memory` default export has no constructor signature — cast with `as any`
- `piexifjs` has no declaration file — created `src/types/piexifjs.d.ts` with manual declarations

## vercel.json outputDirectory
- Must be `artifacts/everydaytools/dist/public` — this matches vite.config.ts `outDir: path.resolve(import.meta.dirname, "dist/public")`; a value of `"public"` causes 404 on every page

## Known non-blocking warnings in build
- `ejs` node module externalizes `fs`/`path` — from `mammoth` transitive dep, not our code
- Chunk size warnings for `heic2any`, `ort.bundle.min`, `pdf.js` — expected for a rich client-side app
