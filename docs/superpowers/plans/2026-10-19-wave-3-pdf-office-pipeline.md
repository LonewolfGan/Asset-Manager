# Plan d'Implémentation Vague 3 : Pipeline Document & PDF d'Élite (Gotenberg Chromium & Ghostscript 10)

> **Branche de travail dédiée :** `feature/pdf-office-pipeline`  
> **Date :** 19 Octobre 2026  
> **Conformité Cockpit :** 6 Hard Gates (`AGENTS.md`), Architecture & Oracle VM Contract (`docs/contracts/architecture-oracle.md`), Design System Contract (`docs/contracts/design-system-contract.md`), Subagent-Driven Development (SDD).

---

## 1. Contexte & Enjeux Techniques de la Vague 3

La **Vague 3** porte sur les outils critiques de manipulation bureautique et de transformation PDF sur le serveur dédié Oracle VM et leurs hooks frontend correspondants :
1. **`markdown-to-pdf` (Outil 23)** : Actuellement limité à un rendu PDFKit brut sans style, sans polices éditoriales, ni rendu de tableaux/code. Migration vers un rendu **Gotenberg 8 Chromium Headless** avec typographie GitHub Markdown enrichie, marges `@page` A4 et fallback PDFKit transparent.
2. **`pdf-compress` (Outil 5)** : Éradication totale du délai artificiel de **2400 ms** et du décompte simulé dans `use-pdf-compress-workflow.ts`. Durcissement de la garantie mathématique de compression Ghostscript 10 + QPDF (`compressedSize <= originalSize`).
3. **`pdf-to-pdfa` (Outil 87)** : Éradication du délai artificiel de **800 ms** dans `pdf-to-pdfa-logic.ts`. Standardisation du profil colorimétrique sRGB et conformité ISO 19005-2 PDF/A-2b avec linéarisation QPDF.
4. **`pdf-to-word` (Outil 1) & `pdf-to-excel` (Outil 14)** : Éradication des délais artificiels de **2000 ms** (`pdf-to-word.tsx`) et **800 ms** (`pdf-to-excel.tsx`). Standardisation RFC 5987 / RFC 6266 des en-têtes `Content-Disposition`.
5. **Revue de Fin de Branche & Vérification Mécanique** : Validation intégrale du pipeline mécanique (`clean:codebase`, `check:rules`, `typecheck`, `test`) et revue de code indépendante par subagent.

---

## 2. Découpage des Tâches Opérationnelles (SDD)

### Tâche 1 : `markdown-to-pdf` (Outil 23) Gotenberg Chromium Modern Print Engine

- **Verrou d'outil :** Strictly Outil 23 (`markdown-to-pdf`).
- **Fichiers concernés :**
  - Créer : `apps/api-server/src/routes/docs/markdown-to-pdf-logic.ts` (< 200 LOC)
  - Modifier : `apps/api-server/src/routes/docs/html-markdown-to-pdf.ts` (< 200 LOC)
  - Modifier : `apps/api-server/src/routes/docs/html-markdown-to-pdf.test.ts` (< 250 LOC)
  - Modifier : `apps/everydaytools/src/lib/markdown-to-pdf-logic.ts` (< 200 LOC)
  - Créer : `apps/everydaytools/tests/unit/calculators/markdown-to-pdf-logic.test.ts` (< 150 LOC)
- **Objectifs :**
  - Dans `markdown-to-pdf-logic.ts` (backend) :
    - Convertir le Markdown via `marked` et l'encapsuler dans un gabarit HTML moderne avec CSS d'impression éditorial (A4, marges 20mm 15mm, typographie système moderne, blocs de code `#f6f8fa`, tableaux bordés, blockquotes).
    - Rendre via Gotenberg Chromium (`convertHtmlWithGotenberg`) si actif et sain (`isGotenbergHealthy()`), avec repli de secours vers `htmlToPdfBuffer`.
  - Dans `html-markdown-to-pdf.ts` :
    - Déléguer la route `POST /tools/markdown-to-pdf` à la fonction `renderMarkdownToPdfBuffer`.
    - Garantir `Content-Disposition` standardisée avec `buildContentDisposition`.
  - Dans `apps/everydaytools/src/lib/markdown-to-pdf-logic.ts` :
    - Vérifier l'absence de délai artificiel lors de la conversion.
  - TDD :
    - Tests unitaires backend testant la conversion Markdown en PDF via Gotenberg et fallback PDFKit, validation des en-têtes et de la structure du PDF (`%PDF-`).
    - Tests unitaires frontend validant `convertMarkdownToPdf` sans délai artificiel.

### Tâche 2 : `pdf-compress` (Outil 5) Éradication Délai Artificiel & Garantie de Compression

- **Verrou d'outil :** Strictly Outil 5 (`pdf-compress`).
- **Fichiers concernés :**
  - Modifier : `apps/api-server/src/routes/pdf/pdf-optimize-logic.ts` (< 280 LOC)
  - Modifier : `apps/api-server/src/routes/pdf/pdf-optimize.test.ts` (< 200 LOC)
  - Modifier : `apps/everydaytools/src/hooks/use-pdf-compress-workflow.ts` (< 200 LOC)
  - Créer : `apps/everydaytools/tests/unit/hooks/use-pdf-compress-workflow.test.ts` (< 180 LOC)
- **Objectifs :**
  - Dans `use-pdf-compress-workflow.ts` (frontend) :
    - Supprimer `new Promise((resolve) => setTimeout(resolve, 2400))` à la ligne 144.
    - Supprimer l'intervalle de décompte simulé artificiel (lignes 48-59).
    - Mettre à jour `liveBytes` immédiatement à la taille du fichier au départ, puis à la taille finale dès réception du blob compressé.
  - Dans `pdf-optimize-logic.ts` (backend) :
    - Renforcer la garantie de réduction de taille : si la taille compressée est supérieure ou égale à l'original, tenter le stripping de métadonnées via `pdf-lib`. Si toujours plus lourd, renvoyer le buffer d'origine avec `gain = 0%`.
  - TDD :
    - Écrire des tests vérifiant que `handleCompress` n'appelle aucun `setTimeout >= 1000ms`.
    - Vérifier que la compression sur un PDF déjà optimisé ne gonfle jamais la taille du document.

### Tâche 3 : `pdf-to-pdfa` (Outil 87) Moteur ISO 19005-2 PDF/A-2b & Zéro Délai

- **Verrou d'outil :** Strictly Outil 87 (`pdf-to-pdfa`).
- **Fichiers concernés :**
  - Modifier : `apps/api-server/src/routes/pdf/pdf-conversion-logic.ts` (< 280 LOC)
  - Modifier : `apps/api-server/src/routes/pdf/pdf-conversion.test.ts` (< 200 LOC)
  - Modifier : `apps/everydaytools/src/lib/pdf-to-pdfa-logic.ts` (< 130 LOC)
  - Créer : `apps/everydaytools/tests/unit/calculators/pdf-to-pdfa-logic.test.ts` (< 150 LOC)
- **Objectifs :**
  - Dans `pdf-to-pdfa-logic.ts` (frontend) :
    - Supprimer `new Promise((resolve) => setTimeout(resolve, 800))` à la ligne 84.
    - Supprimer le timeout artificiel lors du déclenchement du download.
  - Dans `pdf-conversion-logic.ts` (backend) :
    - Vérifier les paramètres Ghostscript pour l'archivage standardisé PDF/A-2b (`-dPDFA=2`, `-sProcessColorModel=DeviceRGB`, `-sColorConversionStrategy=RGB`, `-sPDFACompatibilityPolicy=1`).
    - Linéarisation QPDF post-Ghostscript pour accès web rapide.
  - TDD :
    - Tester l'éradication du délai de 800ms avec espion sur `setTimeout`.
    - Tester la validité du flux PDF/A généré.

### Tâche 4 : `pdf-to-word` (Outil 1) & `pdf-to-excel` (Outil 14) Zéro-Délai & En-têtes RFC 5987

- **Verrou d'outil :** Outils 1 & 14 (`pdf-to-word` & `pdf-to-excel`).
- **Fichiers concernés :**
  - Modifier : `apps/api-server/src/routes/convert/convert-doc.ts` (< 240 LOC)
  - Modify/Create : `apps/api-server/src/routes/convert/convert-doc.test.ts` (< 200 LOC)
  - Modifier : `apps/everydaytools/src/pages/pdf-to-word.tsx` (< 275 LOC)
  - Modifier : `apps/everydaytools/src/pages/pdf-to-excel.tsx` (< 280 LOC)
- **Objectifs :**
  - Dans `apps/everydaytools/src/pages/pdf-to-word.tsx` :
    - Supprimer `new Promise((resolve) => setTimeout(resolve, 2000))` à la ligne 134.
  - Dans `apps/everydaytools/src/pages/pdf-to-excel.tsx` :
    - Supprimer `new Promise((resolve) => setTimeout(resolve, 800))` à la ligne 132.
  - Dans `apps/api-server/src/routes/convert/convert-doc.ts` :
    - Utiliser `buildContentDisposition` pour les téléchargements de fichiers DOCX et XLSX pour supporter les noms avec accents, espaces et caractères spéciaux RFC 5987.
  - TDD :
    - Tests unitaires vérifiant la génération des en-têtes et l'intégrité de conversion sans délai.

### Tâche 5 : Revue de Fin de Branche & Vérification Mécanique Complète

- **Objectifs :**
  - Exécuter la suite complète des vérifications mécaniques :
    1. `pnpm run clean:codebase`
    2. `pnpm run check:rules`
    3. `pnpm run typecheck`
    4. `pnpm test`
  - Assigner une revue globale à un subagent `code-reviewer` sur toute l'étendue de la branche `feature/pdf-office-pipeline`.
  - Fusionner dans `main` après validation.

---

## 3. Matrice de Risques & Mitigations

| Risque Identifié | Impact | Stratégie d'Atténuation |
|---|---|---|
| Dépassement de la limite de 300 lignes (Anti-Monolithe) | Bloquant (Gate 3) | Extraction systématique de la logique métier dans des modules dédiés (`markdown-to-pdf-logic.ts`, etc.). |
| Gotenberg indisponible en environnement local de test | Test flaky | Fallback gracieux testé et mocké vers `htmlToPdfBuffer` (PDFKit). |
| Rupture de compatibilité sur les en-têtes de réponse | Régression UI | Préservation stricte des headers attendus (`Content-Disposition`, `X-Original-Size`, `X-Compressed-Size`, `X-Compression-Gain`). |
