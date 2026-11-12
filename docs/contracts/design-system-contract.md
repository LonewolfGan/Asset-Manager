# Design System Contract — EverydayTools Hub

---

## 1. Philosophical Baseline & Aesthetic Standard

EverydayTools Hub embodies an **anti-slop, architectural Swiss-minimalist aesthetic** inspired by Linear, Vercel (Geist), Apple HIG, and Raycast/Figma. It is an exacting utility studio:
- **Surfaces over borders**: Structural whitespace and subtle tonal separation over nested boxes.
- **Micro-hairlines over heavy shadows**: 1px crisp boundaries (`border-white/8` or `border-zinc-200/80`).
- **Zero decorative fluff**: Every visual element serves an ergonomic purpose.

---

## 2. Core Visual Invariants & The 2-Surface Architecture

1. ❌ **Zero Emoji**: Prohibited in titles, buttons, tags, and helper texts. Use sharp Lucide SVG icons.
2. ❌ **Zero Garish AI-Glows & Neon Meshes**: No `bg-gradient-to-*` or artificial blurs (`blur-2xl`, `blur-3xl`). Use matte, tactile surfaces accented with the solid brand color `#FF6B35` and subtle physical edge highlights (`shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`).
3. ❌ **Zero Pure Black (`#000000`)**: Canvas sits on Zinc-950 (`#09090b`), Off-black (`#111111`), or Charcoal (`#18181b`).
4. 🏛️ **The 2-Surface & Masterpiece Rule (Anti-Box-Slop)**:
   - **Surface 0 (Canvas)**: Global page backdrop (`bg-base`) with open Swiss typography. Never box plain reading text, prose, or isolated summaries into bordered rectangles.
   - **Surface 1 (The Masterpiece Console)**: For interactive tools, workbenches, and forms, build **one primary sculpted workpiece** (`bg-surface`, crisp 1px hairline `border-border/60`, concentric radii, tactile depth).
   - **Max Depth = 2 Levels**: Strictly prohibit nesting bordered containers inside bordered containers (*card-in-card slop*). Controls and inputs sit directly on Surface 1.
5. ❌ **Zero White-on-White Controls**: In light mode, secondary buttons and navigation items must never use `bg-white` on a light background. Use toned Zinc-100 surfaces (`bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10`).
6. ❌ **Zero Italic Typography**: No `italic` in labels, metadata, or status badges.
7. ❌ **Zero AI Buzzwords, Zero Lies & Zero Infra Exposure**: Banned: *"game-changer"*, *"seamless"*, *"elevate your"*, *"next-gen"*, or fake claims. Copy must be simple, human, and truthful. Strictly forbidden to force technical infrastructure jargon (cloud provider, server zones, fake SLAs, hardware specs) into public UI or contact pages.
8. ❌ **Zero `transition: all`**: Always specify explicitly animated properties (`transition-transform`, `transition-opacity`, `transition-colors`).
9. ❌ **Zero Oversized Buttons**: Primary buttons adhere to ergonomic proportions (`h-10` to `h-11`, `px-5`, `text-sm font-medium`).
10. ❌ **Zero Double Rings & Zero Ring-Offset**: Prohibit `ring-offset-2` or `ring-offset` combined with borders on active, selected, or focused controls. Active states must strictly use single clean precision borders (`border-zinc-900 dark:border-zinc-100 bg-white dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold`).
11. ❌ **Zero Gratuitous Section Divider Lines**: Prohibit divider line spam every 20px. Structural hairlines (`border-b border-border/40`) are permitted only to delimit major macro-zones when structurally necessary.
12. ❌ **Zero AI Pill Badges Above Titles**: Never place decorative pill tags/badges (`border bg-surface px-3 py-1 text-accent rounded-full/sm`) above page titles (e.g., "Cadre Légal", "HTTP 404", "Contact"). Real editorial masterworks open directly with pristine display typography.
13. ❌ **Zero Decorative Accent Dots**: Never place floating colored circular dots (e.g., 8px orange dots) next to headings or inside summaries.

---

## 3. Tonal Hierarchy & 12-Step Radix Semantic Mapping

| Radix Steps | Semantic Role | Dark Theme | Light Theme | Usage in EverydayTools |
| :--- | :--- | :--- | :--- | :--- |
| **Steps 1–2** | Canvas / Background | `#09090b` | `#F7F7F5` | Global page backdrop, canvas perimeter |
| **Steps 3–5** | Interactive Surfaces | `#18181b` / `#222225` | `#F0F0EE` / `#EBEBEA` | Secondary controls, pill toggles, hover states |
| **Steps 6–8** | Hairlines & Focus | `rgba(255,255,255,0.08)` | `rgba(0,0,0,0.08)` | 1px precision dividers, card contours |
| **Steps 9–10** | Solid Brand Accent | `#FF6B35` / `#E85A24` | `#FF6B35` / `#E85A24` | Primary export CTAs, active indicators, sliders |
| **Steps 11–12** | High-Contrast Typography | Zinc-400 / Zinc-100 | Zinc-600 / Zinc-950 | Labels (11), Headings & telemetry numbers (12) |

---

## 4. Mathematical Double-Bezel Concentric Radii

When nesting controls or canvas preview surfaces within a parent container:

$$\mathbf{R}_{\text{internal}} = \max\Big(0\text{px},\; \mathbf{R}_{\text{external}} - \mathbf{Padding} - \mathbf{BorderWidth}\Big)$$

Eliminates awkward "pinched corners" between outer shells and inner viewports.

---

## 5. Canonical Two-Scene Tool Architecture

Every conversion and manipulation tool strictly separates user interaction into **two distinct scenes**:

```
Scene 1: Canon Dropzone (w-full max-w-5xl mx-auto)
└─ Deep, open drop area with responsive drag feedback

               │ (File accepted)
               ▼

Scene 2: Studio Workbench (w-full full-width)
├─ Top Toolbar: Format options (PNG/JPG/WebP), geometry dials, telemetry
├─ Central Direct Canvas: 1:1 preview, direct manipulation handle
└─ Bottom Command Bar: [Annuler] [Rétablir] ───> [Vider] [Exporter]
```

### Critical Scene 2 Rules:
- **Format Options Location**: ALWAYS integrated into the top workbench toolbar, NEVER relegated to the bottom.
- **Bottom Command Bar**: Strictly reserved for undo/redo and final confirmation: `[Vider]` immediately preceding `[Exporter]` at the far right.
- **Full Width**: The workbench breaks free of `max-w-5xl` to provide an immersive `w-full` work area.

---

## 6. Popovers, Dropdowns & Command Bar Ergonomics

1. **Max 7–8 Items Without Search**: Menus exceeding 8 items must provide an instant filter/search input.
2. **Height Bounding**: Popovers must never exceed `max-height: min(380px, 45vh)`.
3. **2D Format Matrices**: Present 20+ export formats as a compact 2D chip matrix (`grid grid-cols-4 sm:grid-cols-6 gap-1.5`), never as a single-column 17-item phonebook list.
4. **Keycap Affordance**: Display universal keyboard shortcuts with discrete `<kbd>` elements (`Esc`, `Enter`).

---

## 7. The Awwwards 3-Question Honesty Gate

Before completing any design implementation, the agent must pass this 3-question evaluation:
1. *Would an Awwwards jury member consider nominating this interface alongside Linear and Raycast?*
2. *Is the user flow 100% intuitive at first glance without reading documentation?*
3. *Is the ergonomic execution frictionless (no jumps, zero white-on-white, instant keyboard response)?*

---

## 8. The Anti-Slop Component-Driven Workflow (21st.dev / Magic UI / Emil Kowalski)

Every page and UI layout must strictly follow the modern component registry methodology:

1. **Mandatory Skills Pre-Flight**:
   Before proposing or writing UI code, consult:
   - `emil-design-eng`: physics-based springs, targeted transitions, active scale(0.98), zero `transition: all`.
   - `gpt-taste`: wide typography containers, zero AI meta labels ("SECTION 01"), breathing space (`py-28`/`py-32`).
   - `high-end-visual-design`: Swiss typography, double-bezel concentric radii, matte surfaces.
   - `anti-ui-slop`: open canvas over box cages, honest copy without buzzwords, asymmetry.

2. **Registry-Grade Component Primitives**:
   Never generate arbitrary `border bg-surface` cards. Implement proven visual engineering primitives:
   - **`AnimatedBeam`**: SVG particle flows to illustrate technical architectures.
   - **`NumberTicker`**: Motion-driven numeric spring counters for live stats.
   - **`DotPattern` / `GridPattern`**: Subtle radial-masked vector textures for canvas depth.
   - **Physical Buttons**: Concentric double-bezel buttons with `#FF6B35` accent.

3. **Swiss Editorial Rules for Content**:
   - Zero boxed text: prose and metrics breathe openly on the canvas.
   - Hairline dividers (1px) used only for structural tabular boundaries.
   - Honest product copy: Zero buzzwords, zero marketing fluff, zero lies. Copy must be simple, clear, human, and truthful without forcing technical infrastructure jargon.
