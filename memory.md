# Memory — EverydayTools Hub Architecture & Excellence Reboot

Last updated: 2026-10-19 01:30 UTC

## Strategic Realignment: Excellence & Performance Over Routine Standardisation

- **Audit Forensic & Diagnostic Réel** :
  - **Outils 1 à 57 (Clusters 1 à 7)** : Authentiques et conformes à l'exigence d'excellence (vraie ingénierie d'algorithmes backend pour Images/PDFs, et architecture 100% Client-side browser pour Dev, Text, Color, Spreadsheets et Privacy).
  - **Outils 58 à 71 (Cluster 8 Document Studio)** : Déraillement identifié dès l'Outil 59 (`word-to-text`). Abandon de la doctrine "Browser-First" (envoi injustifié de fichiers Word au backend alors que `mammoth.js` est présent dans le navigateur), régression de vitesse masquée par des `setTimeout(800)` artificiels, et absence d'utilisation de Chromium headless pour `html-to-pdf` ou des filtres d'exportation de haute fidélité.
- **Décision Produit** :
  - Le design unifié en 4 scènes (`ConversionDropzone` ➔ `ConversionStaging` ➔ `ConversionConduit` ➔ `ConversionResult`) est un **choix délibéré et validé**.
  - En revanche, **l'architecture technique, la vitesse brute (< 20ms client / < 400ms serveur) et la qualité/fidélité maximale doivent être restaurées.**

## Master Implementation Plan

Le plan complet d'exécution est formalisé dans :
`docs/superpowers/plans/2026-10-19-document-studio-excellence.md`

### Directives Absolues pour la Nouvelle Session :
1. **Élimination immédiate de tout délai artificiel** : Banning et suppression de tout `setTimeout(...)` dans la logique métier.
2. **Rapatriement 100% Browser-First** :
   - `word-to-text` (Outil 59) : `mammoth.extractRawText` client-side (< 5ms, zéro réseau, 100% vie privée).
   - `word-to-html` (Outil 60) : `mammoth.convertToHtml` client-side avec images inline base64 (< 10ms).
   - `word-to-markdown` (Outil 61) : `mammoth` + `turndown` GFM client-side (< 15ms).
   - `txt-to-pdf` : `pdf-lib` client-side (< 20ms).
3. **Moteur d'Élite pour le Serveur** :
   - `html-to-pdf` (Outil 69) : Gotenberg Chromium Headless (`/forms/chromium/convert/html`) avec CSS3 Print, Flexbox, Grid, web fonts et `@page`.
   - Conversions Office (`word-to-pdf`, `odt-to-pdf`, `rtf-to-pdf`) : Gotenberg warm pool (`/forms/libreoffice/convert`) avec `pdfa=PDF/A-2b` et filtres `writer_pdf_Export`.
4. **Méthode d'Exécution Superpowers** :
   - Utiliser `superpowers:subagent-driven-development` tâche par tâche.
   - Utiliser le sous-agent `research` pour mener des recherches en ligne approfondies sur chaque configuration binaire/moteur avant implémentation.

## Current State

- **Web App** : `http://localhost:5000` (Opérationnel, réactif).
- **API Server** : `http://localhost:3001` (Opérationnel).
- **Cluster Actif** : Cluster 8 (Document & Office Studio).
- **Prochaine Action Immédiate** : Démarrer la nouvelle session propre et exécuter la Task 1 du plan d'excellence (`docs/superpowers/plans/2026-10-19-document-studio-excellence.md`).
