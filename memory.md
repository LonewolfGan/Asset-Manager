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

### Phase 3 : Deuxième Outil — `pdf-to-excel` (#2) (100% TERMINÉ, CERTIFIÉ & VALIDÉ)
- **Recherche d'état de l'art** : Abandon de l'extraction primitive `pdfplumber` en chaînes de texte brutes non typées. Sélection du moteur C-native PyMuPDF 2.0 `find_tables()` (10x-50x plus rapide) couplé à `openpyxl` 3.1.5.
- **Implémentation Moteur** :
  - Worker Python : [`apps/api-server/src/python/pdf_to_excel.py`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/python/pdf_to_excel.py) (237 LOC) avec conversion typée (`int`, `float`, formatage comptable négatif `(1,250.00)`, pourcentages avec `cell.number_format = '0.0%'`), préservation des cellules alphanumériques ("Item 1", "Unit 42"), auto-fit des colonnes sur cellules multilignes, styles d'en-tête Radix, volets figés `freeze_panes = "A2"`, et auto-filtre Excel.
  - Handler serveur : [`apps/api-server/src/routes/convert/pdf-to-excel-handler.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/routes/convert/pdf-to-excel-handler.ts) (122 LOC) sous `ProcessPool` avec isolation `/tmp/everydaytools/<uuid>`, gestion AbortSignal/timeout dur, et réponse HTTP 400 `INVALID_PDF` sur fichier corrompu.
  - Routeur Express : [`apps/api-server/src/routes/convert/convert-doc.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/routes/convert/convert-doc.ts) délesté à 128 LOC.
- **Branchage UI (Design Inchangé)** :
  - Adaptateur moteur : [`apps/everydaytools/src/engine/engines/pdf-to-excel-engine.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/engine/engines/pdf-to-excel-engine.ts) (38 LOC).
  - Page UI : [`apps/everydaytools/src/pages/pdf-to-excel.tsx`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/src/pages/pdf-to-excel.tsx) (197 LOC) branchée sur `useToolWorkflow` avec préservation intégrale des 4 scènes canoniques (`ConversionDropzone`, `ConversionStaging`, `ConversionConduit`, `ConversionResult`, `ReciprocalTitle`).
- **Vérification TDD & Certification** :
  - Backend : [`apps/api-server/src/routes/convert/pdf-to-excel.test.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/api-server/src/routes/convert/pdf-to-excel.test.ts) (7/7 tests GREEN).
  - Frontend : [`apps/everydaytools/tests/unit/engine/pdf-to-excel-engine.test.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/tests/unit/engine/pdf-to-excel-engine.test.ts) (3/3 tests GREEN) et [`apps/everydaytools/tests/unit/ui/pdf-to-excel.test.ts`](file:///home/lonewolf/WebstormProjects/Asset-Manager/apps/everydaytools/tests/unit/ui/pdf-to-excel.test.ts) (1/1 test GREEN sans act warning).
  - Double revue indépendante : **APPROVED ✅** par le sous-agent `re-reviewer` (tous les points Critical/Important traités, zéro régression).
  - Suite globale monorepo : 319/319 tests API Server GREEN, 399/399 suites Vitest everydaytools GREEN (2151 tests).

---

## 3. Plan Directeur & Prochaine Action Immédiate
- **Plan Actif sur Disque** : [`docs/superpowers/plans/2026-10-20-deep-engine-architecture-and-tool-by-tool-roadmap.md`](file:///home/lonewolf/WebstormProjects/Asset-Manager/docs/superpowers/plans/2026-10-20-deep-engine-architecture-and-tool-by-tool-roadmap.md)
- **Ledger SDD sur Disque** : [`.superpowers/sdd/engine-architecture-and-deep-tools/progress.md`](file:///home/lonewolf/WebstormProjects/Asset-Manager/.superpowers/sdd/engine-architecture-and-deep-tools/progress.md)
- **Prochain Outil à traiter** : Selon la roadmap active (`docs/superpowers/plans/2026-10-20-deep-engine-architecture-and-tool-by-tool-roadmap.md`).
