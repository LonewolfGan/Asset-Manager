---
name: ecc-status
description: "Vérifie et affiche le statut exhaustif du cockpit d'ingénierie ECC : sécurité AgentShield, proxy RTK, TDD forcé, anti-monolithes, anti-code mort, mémoire et verrous actifs."
---

# Commande /ecc-status : Cockpit de Contrôle ECC

Quand l'utilisateur invoque `/ecc-status` ou demande l'état du système ECC :

1. **Exécution du diagnostic en direct** :
   Exécuter immédiatement le banc de test des verrous :
   ```bash
   node /home/lonewolf/.local/share/ecc/tests/ecc-hooks.test.js
   ```

2. **Affichage du Cockpit Exhaustif (Toutes les fonctionnalités)** :
   Présenter le rapport sous forme de tableau de bord structuré avec les 12 points de contrôle :

   ### 🛡️ SÉCURITÉ & INFRASTRUCTURE
   - **AgentShield Secrets** : `✔ ACTIF` (Blocage matériel des tokens `sk-`, `ghp_`, `AKIA`).
   - **GateGuard Destructif** : `✔ ACTIF` (Blocage `rm -rf /`, `git reset --hard` sous confirmation).
   - **PreDeploy-Gate** : `✔ VERROUILLÉ` (Déploiement / git push main bloqué sans audit global validé `/ecc-deploy-check`).
   - **Protection Anti-Falsification** : `✔ ACTIF` (L'agent a l'interdiction de modifier ses propres verrous).

   ### ⚡ PERFORMANCE & ENVIRONNEMENT
   - **RTK Universal Proxy** : `✔ ACTIF` (Réécriture automatique de `pnpm`, `npm`, `git`, `docker`, `find`, `grep`).
   - **Mémoire & ADRs (.ecc/memory)** : `✔ ACTIF` (Historique des décisions réinjecté à chaque tour).
   - **Tripwire (Anti-Biais)** : `✔ ACTIF` (Surveillance des boucles ouvertes et sur-ingénierie).

   ### 🏗️ RIGUEUR ARCHITECTURALE & CODAGE
   - **TDD Mécanique (Phase RED)** : `✔ VERROUILLÉ` (Interdiction d'écrire du code source sans test préalable).
   - **Anti-Monolithe (SRP)** : `✔ VERROUILLÉ` (Plafond strict de 300 lignes par fichier source).
   - **Anti-Code Mort (Zero Zombie)** : `✔ VERROUILLÉ` (Interdiction de commenter du code mort sans tag `// [TEMP]`).
   - **Modularité & Réutilisation** : `✔ ACTIF` (Inspection préalable obligatoire pour zéro duplication).
   - **Éradication en Cascade** : `✔ ACTIF` (Suppression des routes, middlewares et packages orphelins).
   - **Zéro Hypothèse (Ask First)** : `✔ ACTIF` (Interdiction de deviner sur besoin ambigu, modale `ask_question` obligatoire).
   - **Validation Humaine (Human Gate)** : `✔ ACTIF` (Seul un message explicite dans le chat autorise l'action).
   - **Quality Gate Stop (Phase GREEN)** : `✔ VERROUILLÉ` (0 erreur TypeScript, 0 test en échec pour terminer).

3. Conclure par une seule question claire sur la prochaine action à mener.
