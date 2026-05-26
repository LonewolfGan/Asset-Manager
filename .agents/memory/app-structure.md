---
name: App structure
description: Key structural facts about the EverydayTools monorepo and app wiring
---

- Monorepo root, artifact lives at `artifacts/everydaytools/`
- Workflow: `EverydayTools Frontend` — `PORT=25203 BASE_PATH=/ pnpm --filter @workspace/everydaytools run dev`
- Router: `wouter` with `WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}`
- All pages are lazy-loaded via `React.lazy` + `<Suspense>` in `App.tsx`
- Theme: dark default (`:root`), light via `[data-theme="light"]` on `<html>`; toggled by `use-theme.ts` hook
- html-docx-js removed (ESM incompatible); replaced with `docx` library in markdown-to-docx.tsx

**Why:** These are non-obvious wiring facts that can't be derived quickly from grep alone.
