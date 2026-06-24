---
name: EverydayTools Design System
description: Actual CSS variables and design tokens — consult before every UI change
---

# EverydayTools — Design System (actual as of June 2026)

## Fonts (CSS vars)
- `--font-display: 'Space Grotesk'` — headings, titles
- `--font-ui: 'Space Grotesk'` — body, labels (same family)
- `--font-mono: 'Geist Mono'` — code, stats, monospace values
- `--font-hero: 'Outfit'` — homepage hero watermark/brand only

**Why:** replit.md mentions DM Serif Display / IBM Plex Sans — these are the original design intent, but index.css uses Space Grotesk / Geist Mono. Always reference var(--font-*), never hardcode.

## Font Scale (actual values in index.css)
- `--text-2xs: 0.6875rem` (11px)
- `--text-xs:  0.8125rem` (13px)
- `--text-sm:  0.9375rem` (15px)  ← body text baseline
- `--text-base: 1.0625rem` (17px)
- `--text-lg:  1.25rem`   (20px)
- `--text-xl:  1.4rem`    (22.4px)
- `--text-2xl: 1.65rem`   (26.4px)
- `--text-3xl: 2.25rem`   (36px)
- `--text-4xl: 3rem`      (48px)
- `--text-5xl: 4rem`      (64px)

## Page Typography Tokens (centralized in index.css)
All page/section text goes through these — edit ONLY here, never inline.

- `--page-title-size:   clamp(22px, 2vw, 28px)` — ~26px on desktop, utility scale (NOT editorial)
- `--page-title-weight: 700`
- `--page-title-lh:    1.2`
- `--page-title-ls:    -0.02em`
- `--page-title-mb:    8px`
- `--page-subtitle-size:  var(--text-base)` (17px) — description text
- `--page-subtitle-lh:    1.6`
- `--page-subtitle-maxw:  72ch`
- `--section-title-size:  var(--text-xl)` (22px)
- `--section-title-weight: 600`
- `--body-text-size:   var(--text-sm)` (15px)
- `--body-text-lh:     1.7`
- `--small-text-size:  var(--text-xs)` (13px)

**Why:** Original tokens were clamp(36-64px) for page titles — editorial/magazine scale. Recalibrated to utility-app scale (ratio title:body ≈ 1.7:1 instead of 4:1). Do NOT revert to large clamp values.

## Article/Blog Tokens
- `--article-h2-size:  clamp(20px, 3vw, 26px)`
- `--article-h2-weight: 400`
- `--article-h3-weight: 600`
- `--card-title-size:  1.125rem` (18px)
- `--card-title-weight: 400`

## UI Panel / Tool Tokens
- `--panel-label-weight: 500` — h3 inside tool panels
- `--display-value-size: 1.5rem` — monospace data display (password)
- `--stat-value-size:  1.375rem` — medium stat number
- `--stat-display-size: 1.625rem` — large stat (word-counter)
- `--stat-display-weight: 700`
- `--caption-size: 0.6875rem` (11px)
- `--micro-size:   0.625rem`  (10px)

## Homepage Hero Tokens (index.tsx only — intentionally large)
- `--hero-word-size:   clamp(44px, 10.5vw, 124px)` — "EVERYDAY" watermark
- `--hero-brand-size:  clamp(72px, 15vw, 178px)` — "Tools" display
- `--hero-sub-size:    clamp(13px, 1.1vw, 15px)` — hero paragraph

## Color Tokens

### Light (:root)
- `--bg-base: #F7F7F5`
- `--bg-surface: #FFFFFF`
- `--bg-elevated: #F0F0EE`
- `--bg-hover: #EBEBEA`
- `--border: #E7E7E7`
- `--border-strong: #CFCFCF`
- `--text-primary: #111111`
- `--text-secondary: #666666`
- `--text-tertiary: #767676`
- `--accent: #FF6B35` (orange)
- `--accent-hover: #E85A24`
- `--accent-subtle: rgba(255,107,53,0.10)`
- `--accent-text: #FFFFFF`
- `--success: #16A34A`
- `--danger: #DC2626`
- `--warning: #D97706`

### Dark ([data-theme="dark"])
- `--bg-base: #08090a`
- `--bg-surface: #111116`
- `--bg-elevated: #1a1a20`
- `--bg-hover: #222228`
- `--border: rgba(255,255,255,0.10)`
- `--text-primary: #f4f4f5`
- `--text-secondary: #a1a1aa`
- `--text-tertiary: #71717a`

## Border Radius
- `--radius: 8px`
- `--radius-sm: 4px`
- `--radius-md: 8px`
- `--radius-lg: 12px`
- `--radius-btn: 8px`
- `--radius-card: 12px`
- `--radius-input: 8px`
- `--radius-pill: 9999px`

## Typography Components (artifacts/everydaytools/src/components/Typography.tsx)
Use these — never raw h1/h2/p with inline font styles:
- `<PageTitle>` — page h1, uses --page-title-* tokens
- `<PageSubtitle>` — page description p, uses --page-subtitle-* tokens
- `<SectionTitle>` — h2 within page, uses --section-title-* tokens
- `<SectionSubtitle>` — sub-description under section title
- `<BodyText>` — standard paragraph
- `<SmallText>` — caption/label text

## Layout
- `container-wide` class — max-width 1200px, horizontal padding
- ToolPageLayout: paddingTop 28px, hero marginTop 16px, marginBottom 28px, paddingBottom 20px

## Rules
- Never hardcode hex colors — always use CSS vars
- Never hardcode font names — always use `var(--font-*)`
- Never hardcode font-size/weight inline on h1/h2/h3/p — use Typography components or CSS tokens
- Accent (#FF6B35) on primary buttons and active nav indicator only
- Page title scale: utility-app (26-28px max), NOT editorial. Do not use clamp values > 36px for tool page titles.
