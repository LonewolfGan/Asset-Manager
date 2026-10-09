# Règle d'Éradication Chirurgicale (Zero Zombie Code / Ruthless Deletion)

1. **Suppression réelle, jamais de masquage** :
   - Quand l'utilisateur demande de supprimer une fonctionnalité ou un design, interdiction formelle de commenter le code (`//`, `/* */`), de masquer l'UI (`display: none`, bouton retiré) ou d'ajouter une condition de contournement (`if (false)`, early return).
   - Supprimer physiquement les lignes de code, du JSX/HTML jusqu'aux fonctions backend.

2. **Protocole de Suppression en Cascade (Cascade Deletion)** :
   Quand une fonctionnalité, un service ou une dépendance est retiré (ex: Prometheus, Sentry, Redis) :
   - **Recherche inversée (`grep`)** : Scanner tout le projet pour identifier chaque fichier qui l'importe ou l'initialise.
   - **Désarmement des pipelines & middlewares** : Supprimer les middlewares express/koa/fastify, interceptors et workers en arrière-plan qui tournent dans le vide et bouffent du CPU.
   - **Purge de l'infrastructure** : Supprimer immédiatement les dossiers de configuration orphelins (ex: `monitoring/`, `docker-compose.monitoring.yml`, `prometheus.yml`).
   - **Désinstallation de la dépendance** : Retirer le package de `package.json` (`npm uninstall` / `pnpm remove`).
   - **Nettoyage des imports/types orphelins** : Supprimer les types, hooks et helpers associés.

3. **Validation Anti-Orphelins (Outils)** :
   - Invoquer `/ponytail-audit` ou `npx knip` pour détecter automatiquement les fichiers inutilisés, exports morts et dépendances résiduelles.

4. **Confiance absolue dans Git** :
   - Zéro peur d'effacer : Git conserve l'intégralité du passé. Le code en production ne doit contenir que le strict nécessaire actuellement exécuté.
