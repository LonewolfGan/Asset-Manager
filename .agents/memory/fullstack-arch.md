---
name: Fullstack architecture
description: How the fullstack Express + React setup works, key port/proxy wiring, and the gotcha that pages bypass service files.
---

## API Server port
The artifact system always injects PORT=8080 for the api-server artifact, regardless of the dev script default. The server runs on **local port 8080** (mapped to external 8080). The Vite proxy must target `http://localhost:8080`.

## Vite proxy
`artifacts/everydaytools/vite.config.ts` has `server.proxy["/api"] → target: "http://localhost:8080"`. All `/api/*` requests from the frontend are forwarded to the api-server in dev.

## Pages bypass service files
Most tool pages have **inline implementations** that do not import from `src/services/`. Updating service files alone has no effect on those pages. Always grep for direct client-side logic in the page file itself when migrating a tool server-side.

Pages updated to use backend routes directly (not via service files):
- `background-remover.tsx` → POST `/api/remove-background`
- `metadata-cleaner.tsx` → POST `/api/metadata/read` and `/api/metadata/clean`
- `ai-text-scrubber.tsx` → POST `/api/text/scrub`
- `currency-converter.tsx` → GET `/api/rates`

Pages that DO use service layer (already correct):
- `document-converter.tsx` → imports from `documentConversionService`
- `image-converter.tsx` → imports from `imageConversionService`

## Native modules
`sharp` and `onnxruntime-node` require postinstall scripts. They must be in `onlyBuiltDependencies` in `pnpm-workspace.yaml`, and `pnpm install` must run after adding them.

## Background removal
Background removal uses **only** the Python script (`artifacts/api-server/src/python/bg_remove.py` + rembg). The `@imgly/background-removal-node` npm package has been removed — it was unused and its transitive dep `onnxruntime-node@1.17.3` required `tar` which is blocked by the Replit package firewall. Do not re-add it.

**Why:** `onnxruntime-node` uses `prebuild-install` → `tar` at install time. Replit's package firewall blocks ALL versions of `tar` with 403. This breaks the entire monorepo pnpm install.

## esbuild externals
Add to `build.mjs` externals list: `pdfjs-dist`, `mammoth` — all have dynamic imports or native dependencies that break bundling.

**Why:** These packages use runtime asset loading or native bindings that esbuild cannot statically bundle.

## New backend routes (architectural overhaul)
Added in this session: `POST /convert/heic`, `POST /tools/pdf-to-images`, `POST /tools/pdf-reorder`, `POST /tools/pdf-to-html`, `POST /tools/pdf-to-pptx`, `POST /extract/ocr`, `POST /convert/txt-to-docx`, `POST /convert/markdown-to-docx`, `POST /convert/word-to-markdown`. Rate limiting middleware at `src/middlewares/rateLimit.ts`. Extract tools router at `src/routes/extract-tools.ts`.

Frontend pages migrated to call these new routes: `heic-to-jpg.tsx`, `pdf-to-image.tsx`, `ocr.tsx`, `pdf-to-html.tsx`, `pdf-to-pptx.tsx`, `reorder-pdf.tsx`, `txt-to-docx.tsx`, `markdown-to-docx.tsx`, `word-to-markdown.tsx`.
