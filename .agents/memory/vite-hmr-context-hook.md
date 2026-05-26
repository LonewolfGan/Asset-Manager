---
name: Vite HMR context+hook split
description: Why React context files must not export both a component and a hook in this project.
---

Vite's Fast Refresh plugin requires that a module export **only** React components or **only** hooks — not both. When `locale-context.tsx` exported both `LocaleProvider` (component) and `useLocale` (hook), HMR failed with "export is incompatible", causing stale module errors and runtime crashes.

**Fix:** Split into two files:
- `src/contexts/locale-context.tsx` — exports `LocaleContext` and `LocaleProvider` only
- `src/hooks/use-locale.ts` — exports `useLocale` hook only

**Why:** Vite plugin-react enforces consistent component exports per file. Mixed component+hook files silently break HMR.

**How to apply:** Any time a new context is added, keep the Provider component and the `useX` hook in separate files. Follow the existing pattern: context file in `src/contexts/`, hook file in `src/hooks/`.
