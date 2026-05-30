---
name: Responsive pattern
description: How to add mobile responsiveness — the app uses inline styles, so CSS media queries don't work; use the useIsMobile hook instead.
---

## Rule

The app uses inline styles throughout (no Tailwind responsive utilities). The only way to add breakpoints is via JavaScript.

**Use `useIsMobile()` from `@/hooks/use-mobile`** — returns `boolean`, breakpoint is 768px.

```tsx
import { useIsMobile } from '@/hooks/use-mobile';
// inside component:
const isMobile = useIsMobile();
// usage:
gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr'
```

**Why:** Inline styles have no media query support. CSS classes in index.css with @media would work but require className changes throughout; the hook is more consistent with the existing codebase style.

## Fixed pages (as of 2026-05-30)

All `gridTemplateColumns: '1fr 1fr'` grids have been made responsive via `isMobile`:
- base64, csv-to-json, json-formatter, html-formatter, html-to-markdown, image-resize
- tip-calculator, unit-converter, currency-converter, password-generator, percentage-calc
- ImageConvertPage (original/converted row: `flexDirection: isMobile ? 'column' : 'row'`)
- Homepage (index.tsx): `isMobile ? "repeat(2, 1fr)" : "repeat(auto-fill, minmax(260px, 1fr))"`

## unit-converter / currency-converter selector row

The from/to selector + swap button row uses:
```tsx
flexDirection: isMobile ? 'column' : 'row'
// swap button:
marginTop: isMobile ? 0 : 26, alignSelf: isMobile ? 'center' : 'auto'
```
