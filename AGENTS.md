# EverydayTools Hub — Agent Operational Governance

<topology>
- Web App (Vite + React 19): http://localhost:5000 (`pnpm --filter @workspace/everydaytools run dev`)
- API Server (Express 5): http://localhost:3001 (`PORT=3001 pnpm --filter @workspace/api-server run dev`)
- Python Daemon (rembg ONNX): http://localhost:5005 (managed by API server)
- Production Backend: Dedicated Oracle Cloud VM (Ubuntu 24.04 ARM64)
- Run All Locally: `pnpm dev`
</topology>

<hard-gates>
1. ACTIVE ROADMAP LOCK: The ONLY active plan is `docs/superpowers/plans/2026-10-20-deep-engine-architecture-and-tool-by-tool-roadmap.md`. Forbidden to create new plans or do cosmetic tweaks.
2. SINGLE TOOL LOCK: Strictly 1 tool modified at a time. No multi-tool parallel edits. Next tool in queue: `pdf-to-html` (#4).
3. SANCTUARIZED UI DESIGN: Zero modification to existing visual designs (Awwwards 4 scenes, double-bezel, Radix colors). UI connects to engines strictly via `useToolWorkflow`.
4. TDD RED-GREEN DISCIPLINE: Every logic change requires a failing test before implementation.
5. ANTI-MONOLITH RULE: Every file must strictly contain < 300 lines of code (SRP).
6. CODEBASE SANITATION: Zero obsolete platform configs (Replit), zero zombie directories, zero temp dumps.
7. ZERO REGRESSION: 100% preservation of TypeScript types, routes, and backend contracts.
8. AWWWARDS HONESTY GATE: UI must pass the 3-question excellence check before completion.
</hard-gates>

<awwwards-jury-gate>
## Le Test Honnête du Jury Awwwards & Intégrité UX/UI Réelle (Obligation Pré-Livraison)
Après toute conception ou refonte, et AVANT de présenter son travail, l'agent DOIT se poser explicitement et avec une honnêteté sans compromis les 3 questions fondamentales d'un comité d'excellence :
1. « Si j'étais membre du jury Awwwards, est-ce que je voterais pour nominer cette interface ? » (L'exécution visuelle rivalise-t-elle avec des références mondiales comme Linear, Apple, VSCO ou Figma, ou trahit-elle un réflexe générique d'IA / card-slop / box-slop ?)
2. « Le design est-il réellement intuitif au premier regard ? » (L'utilisateur comprend-il instantanément et sans confusion mentale l'intention, le fonctionnement et chaque contrôle de l'outil ?)
3. « L'ergonomie est-elle 100% UI/UX friendly et sans friction ? » (Transitions ciblées sans accroc, zéro flash visuel, états aux limites disabled/invisible physiquement inattaquables, alignement optique au pixel près).
Si la réponse à l'une de ces 3 questions n'est pas un « OUI » franc et évident, le travail n'est pas prêt et doit être déconstruit et perfectionné via le Sequential Thinking.
</awwwards-jury-gate>

<authority-contracts>
Detailed domain rules are modularized in dedicated contract files. Agents MUST consult the relevant contract before acting:

- Architecture & Oracle VM Contract: `docs/contracts/architecture-oracle.md`
  Fullstack FSM, Oracle system binaries (LibreOffice, Ghostscript, qpdf, potrace, rembg, Tesseract), ephemeral workspaces (/tmp/everydaytools/<uuid>), automated 15-min temp eviction.

- Design System Contract: `docs/contracts/design-system-contract.md`
  Anti-Slop baseline, Absolute Zero prohibitions (Zero Emoji, Zero Gradient, Zero Halo/Glow, Zero Pure Black #000000, Zero Card-Slop, Zero Italic), Radix 12-step scale, Double-Bezel radii, 2-Scene layout (Canon Dropzone max-w-5xl -> Full-width Studio Workbench w-full), 2D Format Matrices.

- Delivery Protocol Contract: `docs/contracts/delivery-protocol.md`
  5-step delivery cycle (Audit -> Cadrage -> Polish -> TDD Implementation -> Verification), Subagent Review Gate (`code-reviewer`), Full Output Enforcement.
</authority-contracts>

<verification-pipeline>
Before reporting any task completion, execute the strict mechanical verification pipeline:
1. `pnpm run clean:codebase` — Verify zero zombie or temporary files.
2. `pnpm run check:rules`    — Verify design system contracts & AST anti-slop rules.
3. `pnpm run typecheck`      — Verify zero TypeScript compilation errors.
4. `pnpm test`               — Verify all unit test suites pass GREEN.
5. If multiple files touched: delegate final independent audit to `code-reviewer` subagent.
</verification-pipeline>
