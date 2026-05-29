---
name: Accessibility baseline
description: What accessibility infrastructure is already in place globally and per-component.
---

# Accessibility Baseline

**Rule:** Before adding component-level ARIA, check this baseline — most global patterns are already covered.

**Why:** Large spec was implemented; future work should build on these foundations, not duplicate them.

## Global CSS (index.css) — already done
- `.sr-only` — visually hidden, screen-reader accessible
- `.skip-link` — "Skip to main content" visible on keyboard focus
- `:focus-visible` — 2px solid var(--accent) ring on all focusable elements
- `touch-action: manipulation` on buttons, links, inputs, selects
- `user-select: none` on buttons and role="button" elements
- `@media (prefers-reduced-motion: reduce)` — kills all animation/transition
- Firefox scrollbar: `scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent`
- `.scrollable-area` — overflow-y auto + overscroll-behavior: contain
- Mobile input font-size 16px fix (prevents iOS auto-zoom) at max-width: 480px

## App.tsx — already done
- `<a href="#main-content" className="skip-link">Skip to main content</a>` at top of Router
- `<main id="main-content">` — skip link target
- `<div id="status-announcer" aria-live="polite" aria-atomic="true" className="sr-only" />` — global live region

## Shared components — already done
- **FileUpload.tsx**: `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space opens picker), `aria-label` with accept/maxSize info, `role="alert"` on errors, 44px touch targets on remove buttons, `aria-hidden` on decorative icons
- **ProgressBar.tsx**: `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`
- **TopNav.tsx**: `aria-label` on theme toggle and search clear button
- **ResultPanel.tsx**: `aria-label` on download/copy buttons, `aria-hidden` on SVGs
- **ImageConvertPage.tsx**: `role="status"` on processing states, `role="alert"` on errors, descriptive aria-labels on download/remove buttons
- **ToolPageSEO.tsx**: RelatedToolsSection wrapped in `<nav aria-label="Related tools">`
- **ToolCard.tsx**: `aria-label` on Link containing title + description, `aria-hidden` on format badges

## Validation
- Typecheck registered as a validation command: `pnpm --filter @workspace/everydaytools run typecheck`
