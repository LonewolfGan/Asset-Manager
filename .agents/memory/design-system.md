---
name: EverydayTools Design System
description: Premium utility dark-theme design system — consult before every UI change to maintain consistency
---

# EverydayTools — Design System

## Reference Aesthetic
linear.app, vercel.com/design, stripe.com/docs, rauno.me, clerk.com
Result: expensive, well-engineered product. Not a landing page. Not a tools aggregator.

## Typography

Fonts (Google Fonts):
- Display H1/H2: "Fraunces" — opsz variable, wght 300–500, opsz 144 for large headings
- UI/body: "Geist"
- Mono (passwords, metadata, sizes): "Geist Mono"

DO NOT USE: Inter, Roboto, Plus Jakarta Sans, Nunito, Outfit, Poppins, Space Grotesk, DM Serif Display, IBM Plex Sans, IBM Plex Mono

Font scale (CSS vars):
--text-xs: 0.75rem / 1.0rem
--text-sm: 0.875rem / 1.25rem
--text-base: 1rem / 1.625rem
--text-lg: 1.125rem / 1.75rem
--text-xl: 1.25rem / 1.75rem
--text-2xl: 1.5rem / 2rem
--text-3xl: 2rem / 2.5rem
--text-4xl: 2.75rem / 3.25rem  ← H1 tool pages
--text-5xl: 3.75rem / 1.1      ← H1 homepage only

Letter spacing: Headings -0.03em, UI all-caps labels 0.08em, Body 0

## Color System

DARK (default — :root):
--bg-base: #0A0A0A
--bg-surface: #111111
--bg-elevated: #1A1A1A
--bg-subtle: #222222
--border: #2A2A2A
--border-strong: #3A3A3A
--text-primary: #EDEDED
--text-secondary: #888888
--text-tertiary: #555555
--accent: #E8FF47  ← ONE accent: sharp yellow-green
--accent-text: #0A0A0A  ← text ON accent bg
--danger: #FF4444
--success: #22C55E
--warning: #F59E0B

LIGHT ([data-theme="light"]):
--bg-base: #FAFAFA
--bg-surface: #FFFFFF
--bg-elevated: #F4F4F4
--bg-subtle: #EEEEEE
--border: #E4E4E4
--border-strong: #CCCCCC
--text-primary: #0A0A0A
--text-secondary: #666666
--text-tertiary: #999999
--accent: #1A1A1A  ← inverts to near-black in light
--accent-text: #FFFFFF

ACCENT USAGE RULES (critical):
✗ Never as text color on dark bg
✗ Never on more than ONE element per viewport
✗ Never on borders, dividers, decorative elements
✓ Primary button background ONLY
✓ Progress bar fill ONLY
✓ Current nav item indicator: 2px bottom border ONLY
✓ Focus ring: outline 2px solid var(--accent)

## Spacing & Layout
Base unit: 4px. All spacing multiples of 4.
--content-narrow: 640px (tool area, forms)
--content-mid: 800px (article, FAQ)
--content-wide: 1100px (homepage grid, nav)
--content-full: 1400px (max page width)

Section vertical rhythm: 80px major sections desktop, 48px mobile.
NO decorative horizontal rules.

Homepage ToolGrid:
- Desktop: 3 columns, 1px solid var(--border) grid lines (gap:0, borders on cells) — table not floating cards
- Tablet: 2 columns
- Mobile: 1 column

## Component Rules

Tool cards:
- NO box-shadow
- NO border-radius > 4px anywhere in the UI
- NO floating/raised card effect
- Border: 1px solid var(--border) all sides
- Hover: bg var(--bg-subtle), border var(--border-strong)
- Transition: bg 120ms ease, border-color 120ms ease — NOTHING ELSE

Buttons:
- Primary: bg var(--accent), color var(--accent-text), no border, border-radius 4px, padding 10px 20px, font-weight 500, font-size 0.875rem. Hover: opacity 0.88. Active: scale(0.98). NO other effects.
- Secondary: bg transparent, border 1px solid var(--border-strong), color var(--text-primary). Hover: bg var(--bg-subtle)
- Danger: border 1px solid var(--danger), color var(--danger), bg transparent
- NO gradients, NO shadows, NO arrow icons inside buttons

Inputs:
- bg var(--bg-surface), border 1px solid var(--border), border-radius 4px, padding 10px 14px
- Focus: border-color var(--accent), outline 2px solid var(--accent) at 30% opacity
- NO inner shadow, NO floating labels

File drop zone:
- border: 2px dashed var(--border-strong), bg var(--bg-surface)
- Drag-over: border-color var(--accent), bg var(--bg-subtle)
- NO colored background, NO icon animations
- Text: "Drop file here or click to browse"

Progress bar:
- Height: 2px (hairline)
- bg var(--bg-subtle), fill var(--accent)
- Transition: width 80ms linear

Sliders:
- track bg var(--bg-subtle), fill var(--accent), thumb 16px circle bg var(--accent) no shadow
- NO browser default appearance

Nav dropdown panel:
- bg var(--bg-elevated), border var(--border), border-radius 4px, padding 8px
- Two-column grid, each item 32px tall
- NO shadows, NO blur, opacity 0→1 100ms only

Scrollbar: width 6px, track transparent, thumb var(--border-strong), border-radius 3px

## Motion — Exhaustive Allowed List
- bg/border-color: 120ms ease
- opacity show/hide: 100ms ease
- transform scale (active): 80ms ease
- width (progress): 80ms linear
- max-height (accordion): 200ms ease

HARD BANS:
✗ keyframes on non-spinner elements
✗ translateY/X entrance animations
✗ Staggered list delays
✗ Hover float (translateY)
✗ Pulse/glow/shimmer on non-skeleton
✗ Page transition animations
✗ Scroll-triggered animations
✗ CSS animation on layout elements
✗ One-side accent borders (border-left: 3px solid accent)
✗ Gradient backgrounds
✗ Text gradients (background-clip: text)

Loading: skeleton screens only. bg var(--bg-subtle), border-radius 2px. opacity 0.4→0.7 pulse 1.2s ease infinite.

## What "Premium" Means Here
- Every spacing value intentional and consistent
- Typography scale has clear hierarchy at a glance
- Quiet — decoration loses to content
- Interactions instant and predictable
- Error states as well-designed as success states
- Tool works before user reads instructions
- Homepage grid = publication table, not card deck

**Why:** User explicitly provided this as mandatory design reference. Must be followed for every UI change to maintain consistency.
**How to apply:** Before any UI edit, re-read this file. Apply dark theme tokens. Use Fraunces/Geist/Geist Mono. Never exceed 4px border-radius. Never use accent on more than one element per viewport.
