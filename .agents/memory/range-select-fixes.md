---
name: Range slider & select dropdown fixes
description: Rules for fixing range input vertical alignment and select custom arrow that are easy to break
---

## Range slider thumb not centered

**Rule:** The webkit thumb MUST have `margin-top: -7px` (for 18px thumb on 4px track: -(18-4)/2 = -7). Missing this causes the thumb to float above or below the track.

Also required on the `input[type="range"]` element itself:
- `vertical-align: middle`
- `margin: 0; padding: 0`

**Why:** WebKit renders the track container taller than the track `height` value. Without the negative margin-top on the thumb, it sits at the default track-container top edge.

**How to apply:** These rules live in `index.css` under `/* ─── CUSTOM RANGE SLIDER ─── */`. Do not add `accentColor` inline styles to range inputs — it reverts to native rendering which ignores `-webkit-appearance: none` custom CSS in some browsers.

## Range fill (left of thumb)

**Rule:** WebKit does not support `::-webkit-slider-progress`. Fill must be driven by JS setting `input.style.background` to a `linear-gradient`.

**How to apply:** A MutationObserver + `input` event listener in `App.tsx` handles all pages globally:
```ts
input.style.background = `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)`;
```
The observer re-initializes fills when lazy-loaded page components mount new range inputs.

## Select custom arrow (SVG chevron)

**Rule:** Global CSS sets `appearance: none` and `background-image` (SVG arrow) on `select`. Inline React styles that use the `background` SHORTHAND wipe out `background-image`, removing the arrow.

**Fix:** Use `backgroundColor` (React property = CSS `background-color`) NOT `background` (shorthand) in any inline style on a `<select>` element. Pages fixed: password-generator, pdf-watermark, pdf-page-numbers.

**Why:** CSS shorthand `background: value` resets all background sub-properties including `background-image`. Inline styles always win over stylesheet rules, so there's no workaround other than avoiding the shorthand.
