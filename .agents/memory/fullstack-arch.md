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

## Background removal (@imgly/background-removal-node)
Node package max version is **1.4.5** (not 1.7.0 like the browser version). Uses onnxruntime-node, so that must also be externalized in `build.mjs`.

## esbuild externals
Add to `build.mjs` externals list: `pdfjs-dist`, `@imgly/background-removal-node`, `mammoth` — all have dynamic imports or native dependencies that break bundling.

**Why:** These packages use runtime asset loading, workers, or native bindings that esbuild cannot statically bundle.
