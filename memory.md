# Memory — EverydayTools Hub Architecture & Deep Tool-by-Tool Roadmap

Last updated: 2026-10-21 00:38 UTC

## 1. Vision & Cadre Stratégique (Verrouillé)
- **Le vrai travail** : Refonte de l'architecture plateforme la plus solide (WebWorkers client off-main-thread, ProcessPool serveur avec workspaces éphémères `/tmp/everydaytools/<uuid>`, hook réactif unifié `useToolWorkflow`) puis refonte outil par outil avec recherche d'état de l'art (WASM vs Serveur dédié).
- **Sanctuaire Absolu** : **Zéro dégradation visuelle**. L'interface Awwwards (4 scènes `ConversionDropzone`, `ConversionStaging`, `ConversionConduit`, `ConversionResult`, `ReciprocalTitle`, double-bezel, palette Radix) est 100% sanctuarisée. On ne touche pas au design, on branche le moteur dessus via `ToolEngineContract`.
- **Anti-Superficiel** : Interdiction formelle de faire du refactoring cosmétique passif ou des micro-nettoyages de styles. Chaque étape doit apporter un vrai moteur haute-fidélité validé par TDD et benchmarks.

---

## 2. État d'Avancement Exact

### Phase 1 : Le Socle d'Architecture Global (100% TERMINÉ & COMMITTÉ)
- **Task 1.1** (`5b5d8ae`) : Contrat universel `ToolEngineContract` ([`tool-contract.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/engine/tool-contract.ts)) et hook unifié réactif ([`use-tool-workflow.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/engine/use-tool-workflow.ts)). 10/10 tests unitaires GREEN.
- **Task 1.2** (`304262c`) : Pipeline WebWorker client universel ([`worker-engine-host.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/engine/worker-engine-host.ts)) avec Transferables et fallback. 14/14 tests GREEN.
- **Task 1.3** (`7036416`) : Pipeline serveur haute performance et isolation ([`process-pool.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/lib/process-pool.ts)) avec limitation de concurrence, timeout dur et workspaces éphémères `/tmp/everydaytools/<uuid>` auto-nettoyés. 7/7 tests GREEN.

### Phase 2 : Outil Pilote — `pdf-to-word` (#1) (100% TERMINÉ, CERTIFIÉ & COMMITTÉ `13339c1`)
- **Recherche d'état de l'art** : Abandon de l'extraction naïve `pdfplumber` / `docx.js`. Choix du moteur serveur haute-fidélité Python `pdf2docx` + `PyMuPDF`.
- **Implémentation Moteur** :
  - Worker Python : [`apps/api-server/src/python/pdf_to_word.py`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/python/pdf_to_word.py) (48 LOC).
  - Handler serveur : [`apps/api-server/src/routes/convert/pdf-to-word-handler.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/routes/convert/pdf-to-word-handler.ts) (118 LOC).
  - Allègement routeur : [`apps/api-server/src/routes/convert/convert-doc.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/routes/convert/convert-doc.ts) réduit à 160 LOC.
- **Branchage UI (Design Inchangé)** :
  - Adaptateur moteur : [`apps/everydaytools/src/engine/engines/pdf-to-word-engine.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/engine/engines/pdf-to-word-engine.ts) (39 LOC).
  - Page UI : [`apps/everydaytools/src/pages/pdf-to-word.tsx`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/pages/pdf-to-word.tsx) (197 LOC) branchée sur `useToolWorkflow` avec préservation intégrale des 4 scènes.
- **Vérification TDD** :
  - [`apps/api-server/src/routes/convert/pdf-to-word.test.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/routes/convert/pdf-to-word.test.ts) (178 LOC) : validation des tableaux `<w:tbl>`, extraction et zéro fuite temporaire.
  - Review indépendante : **APPROVED ✅** par le sous-agent `code-reviewer`.
  - Tests monorepo : 312 tests GREEN côté API server, tests Vitest GREEN côté everydaytools.

---

## 3. Plan Directeur & Prochaine Action Immédiate
- **Plan Actif sur Disque** : [`docs/superpowers/plans/2026-10-20-deep-engine-architecture-and-tool-by-tool-roadmap.md`](file:///home/lonewolf/WebstormProjects/Asset-Manager/docs/superpowers/plans/2026-10-20-deep-engine-architecture-and-tool-by-tool-roadmap.md)
- **Ledger SDD sur Disque** : [`.superpowers/sdd/engine-architecture-and-deep-tools/progress.md`](file:///home/lonewolf/WebstormProjects/Asset-Manager/.superpowers/sdd/engine-architecture-and-deep-tools/progress.md)
- **Prochain Outil à traiter** : **`pdf-to-excel` (#2)**.
  - Étape 1 : Recherche d'état de l'art (benchmark des moteurs d'extraction tabulaire PDF : `pdfplumber` vs `tabula-py` vs WASM / `pymupdf` tables / `pdf2docx` table matrix).
  - Étape 2 : TDD RED sur `apps/api-server/src/routes/convert/pdf-to-excel.test.ts`.
  - Étape 3 : Implémentation du worker haute-fidélité (`pdf_to_excel.py` + `pdf-to-excel-handler.ts`).
  - Étape 4 : Branchage sur `apps/everydaytools/src/pages/pdf-to-excel.tsx` avec `useToolWorkflow` (Design 100% sanctuarisé).
  - Étape 5 : Double revue indépendante et verrouillage.
