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
2. SINGLE TOOL LOCK: Strictly 1 tool modified at a time. No multi-tool parallel edits. Sprint 1 completed (#7 pdf-to-epub, #8 pdf-to-image, #9 pdf-to-pdfa, #10 pdf-metadata). Sprint 2 completed (#11 pdf-compress, #12 pdf-merge, #13 pdf-split, #14 pdf-rotate). Sprint 3 completed (#15 pdf-protect, #16 pdf-unlock, #17 pdf-watermark, #18 pdf-page-numbers).
3. SANCTUARIZED UI DESIGN: Zero modification to existing visual designs (Awwwards 4 scenes, double-bezel, Radix colors). UI connects to engines strictly via `useToolWorkflow`.
4. DESIGN PRÉALABLE OBLIGATOIRE & SOURCING DE COMPOSANTS RÉELS :
   - INTERDICTION FORMELLE DE SAUTER DANS LE CODE : Pour TOUTE tâche touchant au design, à l'UI, aux layouts ou à la mise en page, il est STRICTEMENT INTERDIT d'écrire la moindre ligne de code à l'aveugle ou d'improviser des div/cards.
   - LECTURE OBLIGATOIRE DES SKILLS DE DESIGN : L'agent DOIT obligatoirement et explicitement lire et appliquer les 5 skills de design installés dans le projet (`emil-design-eng`, `gpt-taste`, `high-end-visual-design`, `anti-ui-slop`, `design-taste-frontend`).
   - SOURCING EXIGÉ DANS LES REGISTRES DE CLASSE MONDIALE : Interdiction d'inventer des maquettes génériques d'IA. L'agent DOIT s'inspirer et sourcer ses composants et primitives dans les catalogues de référence mondiaux (**21st.dev, Magic UI, Aceternity UI, shadcn**) et les standards de Linear, Stripe, Apple et Awwwards Site of the Day.
   - SEQUENTIAL THINKING OBLIGATOIRE : L'agent DOIT activer `sequentialthinking` pour mûrir la structure, l'espace négatif, les animations physiques (`motion`) et la hiérarchie typographique avant de soumettre son cadrage à l'utilisateur.
5. ARCHITECTURE VISUELLE : RÈGLE DES 2 SURFACES & ANTI-SLOP :
   - SURFACE 0 (CANEVAS) : Fond de page aéré (`bg-base`), typographie suisse dominante (`Space Grotesk`), grand espacement vertical. Zéro boîte pour enfermer de simples paragraphes de texte ou des métriques isolées.
   - SURFACE 1 (PIÈCE MAÎTRESSE SCULPTÉE) : Pour tout outil, formulaire ou console interactive, sculpter UNE surface maîtresse valorisante (`bg-surface`, bordure fine 1px `border-border/60`, reflets de tranche subtils `shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`, rayon galbé 12-16px, micro-haptique tactile).
   - PROFONDEUR MAX = 2 NIVEAUX (ANTI-BOX-SLOP STRICT) : Interdiction formelle d'emboîter des boîtes dans des boîtes (*card-in-card slop*). Un seul réceptacle principal, et les contrôles interactifs directement dedans.
   - CONTRÔLES TACTILES & HAPTIQUES : Sélecteurs de catégorie physiques, boutons avec retour tactile au clic (`scale: 0.98` en 160ms), zéro `transition: all`.
   - ZÉRO BADGE DÉCORATIF AU-DESSUS DU TITRE : Pas de faux badge pilule flottant inutile ("Cadre Légal", "HTTP 404", "Contact"). Le titre principal s'affirme de manière sobre.
   - ZÉRO AI BUZZWORD, ZÉRO MENSONGE, ZÉRO FUITE D'INFRA : Rédaction sobre, claire, humaine et véridique. Interdiction totale d'injecter du jargon de serveur, d'hébergeur, de région ou de faux SLA dans les pages publiques.
6. TDD RED-GREEN DISCIPLINE: Every logic change requires a failing test before implementation.
7. ANTI-MONOLITH & SRP RULE: Strict Single Responsibility Principle. Executable UI components and logic modules must strictly stay < 300 LOC (zero mixing of UI, business logic, and API calls). Pure declarative type registries and translation dictionaries must remain cohesive and isolated.
8. CODEBASE SANITATION: Zero obsolete platform configs (Replit), zero zombie directories, zero temp dumps.
9. ZERO REGRESSION: 100% preservation of TypeScript types, routes, and backend contracts.
10. AWWWARDS HONESTY GATE: UI must pass the 3-question excellence check before completion.
</hard-gates>

<awwwards-jury-gate>
## Le Test Honnête du Jury Awwwards & Intégrité UX/UI Réelle (Obligation Pré-Livraison)
Après toute conception ou refonte, et AVANT de présenter son travail, l'agent DOIT se poser explicitement et avec une honnêteté sans compromis les 3 questions fondamentales d'un comité d'excellence :
1. « Si j'étais membre du jury Awwwards, est-ce que je voterais pour nominer cette interface ? » (L'exécution visuelle rivalise-t-elle avec des références mondiales comme Linear, Apple, VSCO ou Figma, ou trahit-elle un réflexe générique d'IA / card-slop / box-slop ?)
2. « Le design est-il réellement intuitif au premier regard ? » (L'utilisateur comprend-il instantanément et sans confusion mentale l'intention, le fonctionnement et chaque contrôle de l'outil ?)
3. « L'ergonomie est-elle 100% UI/UX friendly et sans friction ? » (Transitions ciblées sans accroc, zéro flash visuel, états aux limites disabled/invisible physiquement inattaquables, alignement optique au pixel près).
Si la réponse à l'une de ces 3 questions n'est pas un « OUI » franc et évident, le travail n'est pas prêt et doit être déconstruit et perfectionné via le Sequential Thinking.
</awwwards-jury-gate>

<mandatory-design-workflow>
## Protocole Opérationnel UI/Design : Modularité, Sourcing Réel & Preuve Visuelle
Pour TOUTE tâche portant sur une page, un layout, une mise en page ou un composant visuel :

1. **Phase 1 — Inspiration Visuelle Réelle & Infusion Créative par les Skills** :
   - **Accès Visuel Réel Obligatoire** : Trouver des références primées récentes sur Awwwards, Godly ou Mobbin. L'agent doit obligatoirement accéder au visuel réel (navigation et capture via `chrome-devtools-mcp` analysée par la vision multimodale).
   - **Interdiction Formelle du Texte Descriptif** : Interdiction absolue de déduire ou concevoir un layout à partir de snippets Google, résumés textuels ou articles de blog.
   - **Lecture Systématique des 5 Skills de Design (Anti-Copie & Créativité Pure)** :
     L'agent DOIT obligatoirement et explicitement lire les 5 skills de design (`emil-design-eng`, `gpt-taste`, `high-end-visual-design`, `anti-ui-slop`, `design-taste-frontend`) à chaque tâche UI.
     Ces skills dictent la physique, les tensions d'espace, la hiérarchie suisse et les finitions, garantissant qu'on ne fait JAMAIS un simple copier-coller d'une page tierce, mais une création originale sculptée pour notre propre ADN.

2. **Phase 2 — Modularité & Réutilisation Prioritaire d'Abord (Zéro Doublon)** :
   - AVANT d'écrire ou d'ajouter le moindre composant, inspecter les composants déjà présents dans `apps/everydaytools/src/components/` et `src/components/ui/`.
   - OBLIGATION de réutiliser les briques éprouvées existantes (ex: `Faq05` pour les FAQ, `CopyButton` pour la copie tactile, `Button`, `Input`, `Card`, etc.). Interdiction absolue de recréer un composant qui existe déjà dans le projet, sauf demande explicite de différenciation artistique.

3. **Phase 3 — Sourcing Registres (shadcn CLI) & Composition Métier** :
   - Si une primitive ou un bloc interactif manque, l'installer via le CLI shadcn : `pnpm dlx shadcn@latest add ...` (registres `@shadcn`, `@magicui`, etc.) au lieu d'improviser des primitives bancales à la main.
   - L'assemblage et la création de composants métier de page (ex: `ContactForm.tsx`) sont encouragés en composant ces briques modulaires.

4. **Phase 4 — Rédaction Honnête (Sans Buzzword, Sans Mensonge, Sans Fuite d'Infra)** :
   - Zéro blabla marketing creux ("boostez vos flux", "solution révolutionnaire").
   - Zéro étalage de jargon d'infrastructure (hébergeur, région, serveur, faux SLA). Texte sobre, humain et direct.

5. **Phase 5 — Validation Préalable, TDD & Preuve par Screenshot (`chrome-devtools-mcp`)** :
   - Présenter le cadrage et les composants réutilisés/sourcés à l'utilisateur AVANT de coder.
   - Écriture du test unitaire préalable (TDD RED -> GREEN).
   - Composants modulaires découpés < 300 LOC (SRP).
   - Capture d'écran réelle via `chrome-devtools-mcp` sur le serveur local dev pour vérification visuelle par l'utilisateur avant validation finale.
</mandatory-design-workflow>

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
