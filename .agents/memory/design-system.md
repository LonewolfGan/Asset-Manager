---
name: EverydayTools Design System
description: Actual CSS variables and design tokens — consult before every UI change
---

# EverydayTools — Design System (actual as of 2026)

## Fonts (CSS vars)
- `--font-display: 'Space Grotesk'`
- `--font-ui: 'Inter'`
- `--font-mono: 'Geist Mono'`

**Why:** replit.md lists DM Serif Display / IBM Plex Sans but index.css actually uses Space Grotesk / Inter / Geist Mono.
**How to apply:** Always use `var(--font-display)`, `var(--font-ui)`, `var(--font-mono)` — never hardcode font names.

## Font Scale
- `--text-xs: 0.75rem`
- `--text-sm: 0.875rem`
- `--text-base: 1rem`
- `--text-lg: 1.125rem`

## Color tokens (light / dark via CSS vars)

### Light (:root)
- `--bg-base: #F7F7F5`
- `--bg-surface: #FFFFFF`
- `--bg-elevated: #F0F0EE`
- `--bg-hover: #EBEBEA`
- `--bg-subtle: var(--bg-hover)`
- `--border: #E7E7E7`
- `--border-strong: #CFCFCF`
- `--text-primary: #111111`
- `--text-secondary: #666666`
- `--text-tertiary: #999999`
- `--accent: #FF6B35` (orange)
- `--accent-hover: #E85A24`
- `--accent-subtle: rgba(255,107,53,0.10)`
- `--accent-text: #FFFFFF`

### Dark ([data-theme="dark"])
- `--bg-base: #08090a`
- `--bg-surface: #111116`
- `--bg-elevated: #1a1a20`
- `--bg-hover: #222228`
- `--border: rgba(255,255,255,0.10)`
- `--border-strong: rgba(255,255,255,0.18)`
- `--text-primary: #f4f4f5`
- `--text-secondary: #a1a1aa`
- `--text-tertiary: #71717a`
- `--accent: #FF6B35` (same orange)

## Border Radius
- `--radius-sm: 4px`
- `--radius-md: 6px`
- `--radius-lg: 10px`
- `--radius-xl: 12px`
- `--radius-btn: 8px`
- `--radius-card: 10px`
- `--radius-input: 8px`

## Layout
- `--content-wide: 1200px` — all page containers and nav use this

## Rules
- Never hardcode hex colors — always use CSS vars
- Never hardcode font names — always use `var(--font-*)` 
- Accent (#FF6B35 orange) on primary buttons and active nav indicator only
- Format badges use `var(--font-mono)` at 9-10px
- Section labels / ALL CAPS labels: `var(--font-mono)`, `letter-spacing: 0.08em`, `var(--text-tertiary)`

**Why:** Stale memory referenced old dark theme + Fraunces/Geist. Corrected from actual index.css in 2026.
