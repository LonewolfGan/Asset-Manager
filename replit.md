# EverydayTools Hub

A client-side multi-tool utility web app for everyday digital tasks — file conversion, image processing, AI background removal, metadata cleaning, password generation, currency conversion, and unit/tip calculators. All file operations run entirely in the browser for maximum privacy.

## Run & Operate

- `pnpm --filter @workspace/everydaytools run dev` — run the frontend (port assigned via workflow)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind CSS, wouter routing
- API: Express 5 (minimal — currency proxy only if needed)
- DB: Not used (all state is localStorage / in-memory)
- Build: Vite (frontend), esbuild (API server)

## Where things live

- `artifacts/everydaytools/src/` — frontend React app
- `artifacts/everydaytools/src/services/` — client-side tool service modules
- `artifacts/everydaytools/src/config/` — units config and format config
- `artifacts/everydaytools/src/pages/` — one page per route
- `artifacts/api-server/src/routes/` — API routes (health only currently)

## Architecture decisions

- All file processing is client-side only (Canvas API, pdfjs-dist, pdf-lib, mammoth, piexifjs, @imgly/background-removal) — no uploads to any server
- localStorage used only for user preferences and currency rate cache (1h TTL); sensitive data (passwords, metadata) never persisted
- @imgly/background-removal is dynamically imported on first use to avoid blocking initial load
- pdfjs-dist web worker is configured via `new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href` for Vite compatibility

## Product

EverydayTools Hub provides nine client-side tools:
1. Document Converter (PDF↔TXT, DOCX→HTML/TXT, TXT→PDF)
2. Image Converter (PNG/JPEG/WEBP/AVIF/BMP/GIF/TIFF/ICO/SVG, batch up to 20 files)
3. AI Background Remover (@imgly/background-removal)
4. Metadata Cleaner + AI Text Watermark Scrubber
5. Password Generator (crypto.getRandomValues, entropy bits)
6. Currency Converter (live rates cached 1h, static fallback)
7. Unit Converter (config-driven graph, 10 categories)
8. Tip & Percentage Calculator

## User preferences

- Design: DM Serif Display / IBM Plex Sans / IBM Plex Mono fonts
- Palette: warm off-white #F7F6F3, white #FFFFFF, near-black #1A1916, blue accent #1A6BFF
- Zero emojis in UI

## Gotchas

- pdfjs-dist web worker must be set via import.meta.url, not a string path
- @imgly/background-removal peer requires onnxruntime-web; version mismatch warning is expected
- DOCX→PDF and ODT→PDF are explicitly NOT IMPLEMENTED (layout-engine dependent); they return a clean error
- Currency rates use open.er-api.com (free, no API key) with localStorage TTL cache

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
