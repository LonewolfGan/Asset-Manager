---
name: anti-slop
description: "Exécute un audit Anti-Slop complet sur la codebase via l'essaim des 5 agents spécialisés (UI, Copy, Accessibilité, Mobile, Code Clean)."
risk: safe
source: ecc
date_added: "2026-10-16"
---

# Commande /anti-slop : Audit d'Hygiène & Éradication des Clichés d'IA

Quand l'utilisateur invoque `/anti-slop` (ou demande un audit anti-slop sur la codebase ou un fichier) :

## 1. Cartographie des Cibles
- Si un fichier ou dossier est spécifié (ex: `/anti-slop apps/everydaytools/src/pages/pdf-split.tsx`), cibler ce composant.
- Sinon, cartographier l'ensemble des fichiers UI (`src/**/*.tsx`), contenus (`locales/`, pages) et styles (`src/**/*.css`).

## 2. Déploiement de l'Essaim Parallèle (Swarm)
Invoquer simultanément les 5 sous-agents dédiés via `invoke_subagent` :
1. **`anti-slop-ui`** : Audit des sparkles, faux badges 'AI 2.0', halos violets et hiérarchie visuelle.
2. **`anti-slop-copywriting`** : Audit du jargon IA (*'seamless'*, *'delve'*), fausses statistiques et emojis superflus.
3. **`anti-slop-human`** : Audit WCAG (contraste réel non arrondi >= 4.5:1, `:focus-visible`, cibles tactiles >= 44px).
4. **`anti-slop-layoutmobile`** : Audit responsive (zéro scroll horizontal, conteneurs adaptatifs 320px–480px).
5. **`anti-slop-code`** : Audit du bruit mental (bannières ASCII `// ===`, commentaires redondants).

## 3. Rapport d'Audit Consolidé (Delivery Gate)
Présenter le résultat en 5 blocs factuels :
- **UI & Clichés Visuels** : `PASS` / `FAIL` (artefacts et composants ciblés).
- **Textes & Authenticité** : `PASS` / `FAIL` (phrases artificielles et propositions de réécriture).
- **Accessibilité Humaine** : `PASS` / `FAIL` (écarts de contraste et focus manquants).
- **Responsive & Mobile** : `PASS` / `FAIL` (débordements et ergonomie tactile).
- **Propreté du Code** : `PASS` / `FAIL` (bannières ou commentaires à supprimer).

## 4. Persistance & Certification
Enregistrer la synthèse d'audit dans `.ecc/memory/last-antislop-audit.md` pour traçabilité et conformité avec le PreDeploy-Gate.
