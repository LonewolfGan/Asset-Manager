---
name: App structure
description: Key structural facts about the EverydayTools monorepo and app wiring
---

- Monorepo root with pnpm workspaces:
  - Frontend: `apps/everydaytools/` (Port 5000)
  - API Server: `apps/api-server/` (Port 3001)
  - Python Daemon: Port 5005 (managed by API server)
  - Shared UI library: `lib/ui/`
  - Zod schemas: `lib/api-zod/`
- Router: `wouter` with `WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}`
- All pages are lazy-loaded via `React.lazy` + `<Suspense>` in `App.tsx`
- Theme: dark default (`:root`), light via `[data-theme="light"]` on `<html>`; toggled by `use-theme.ts` hook
