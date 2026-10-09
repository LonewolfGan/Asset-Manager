---
name: ecc-deploy-check
description: "Exécute un audit complet de la base de code avant déploiement (sécurité, qualité, performance) via essaim multi-agents et déverrouille le PreDeploy-Gate"
risk: safe
source: ecc
date_added: "2026-10-09"
---

## Description
Cette compétence exécute l'audit complet obligatoire avant tout déploiement ou push en production (`main`, `master`, `production`, `pnpm deploy`, `vercel --prod`, `docker push`).
Le PreDeploy-Gate ECC bloque mécaniquement toute tentative de release tant que cet audit n'a pas produit un certificat valide `PASS` dans `.ecc/memory/last-deploy-audit.json`.

## Protocole d'Exécution (Swarm Map-Reduce)

1. **Vérification Déterministe Préalable** :
   - Exécuter la suite de tests automatisés : `rtk pnpm test` (ou `npm test`).
   - Exécuter la vérification des types : `rtk pnpm typecheck` (ou `npx tsc --noEmit`).
   - Si une seule vérification échoue, stopper immédiatement et corriger les erreurs.

2. **Délégation Parallèle aux Sous-Agents** :
   Invoquer simultanément les 3 sous-agents d'audit spécialisés :
   - **`security-auditor`** : Scanner l'authentification, les API, la validation des entrées et l'absence de secrets.
   - **`code-reviewer`** : Scanner la qualité du code, l'absence de dead code / zombie code, et la détection de bugs sur le contrat 5 axes.
   - **`web-performance-auditor`** : Analyser les bundles, les routes lazy-loadées et les métriques de performance.

3. **Consolidation & Décision** :
   - Si des vulnérabilités critiques ou régressions majeures sont détectées : fixer le statut à `FAILED` et résoudre les anomalies.
   - Si l'ensemble des contrôles est vert : générer le certificat d'audit valide 1 heure dans `.ecc/memory/last-deploy-audit.json` :
     ```json
     {
       "status": "PASS",
       "timestamp": "ISO_DATE",
       "expiresAt": TIMESTAMP_NOW_PLUS_1_HOUR,
       "auditors": ["security-auditor", "code-reviewer", "web-performance-auditor"],
       "summary": "Full codebase audit passed with 0 critical issues."
     }
     ```

4. **Déverrouillage du Déploiement** :
   Une fois le fichier généré avec `status: PASS`, le PreDeploy-Gate déverrouille les commandes de déploiement.
