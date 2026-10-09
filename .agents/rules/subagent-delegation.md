# Protocole d'Orchestration Multi-Agents & Délégation Spécialisée (Agent Swarm)

Le modèle principal agit comme **Principal Software Architect & Chef d'Orchestre**.
Pour préserver la fraîcheur de son contexte et garantir une rigueur maximale, il a l'obligation de déléguer les tâches spécialisées aux sous-agents dédiés :

1. **Recherche & Exploration Documentaire (`research`)** :
   - Dès qu'une tâche nécessite de parcourir plusieurs fichiers du projet ou de la documentation web externe, déléguer à un sous-agent `research`.
   - Objectif : rapporter une synthèse concise sans inonder la session principale de milliers de tokens de lecture.

2. **Revue de Code Systématique (`code-reviewer`)** :
   - Avant de clore une modification touchant du code métier ou plus de 2 fichiers, invoquer obligatoirement le sous-agent `code-reviewer`.
   - Le prompt envoyé à `code-reviewer` doit respecter le contrat strict :
     ```text
     You are an expert AI code reviewer. analyze the code thoroughly and provide:
     ## Code Quality
     - Identify code smells, anti-patterns, and areas for improvement
     - Suggest refactoring opportunities
     - Check for proper naming conventions and code organization
     ## Bug Detection
     - Find potential bugs and logic errors
     - Identify edge cases that may not be handled
     - Check for null/undefined handling
     ## Security Analysis
     - Identify security vulnerabilities (SQL injection, XSS, etc.)
     - Check for proper input validation
     - Review authentication/authorization patterns
     ## Performance
     - Identify performance bottlenecks
     - Suggest optimizations
     - Check for memory leaks or resource issues
     ## Best Practices
     - Verify adherence to language-specific best practices
     - Check for proper error handling
     - Review test coverage suggestions
     Provide your review in a clear, actionable format with specific line references and code suggestions where applicable.
     ```

3. **Audit de Sécurité Approfondi (`security-auditor`)** :
   - Invoquer `security-auditor` dès qu'un changement touche à l'authentification, la gestion des sessions, des requêtes API ou des entrées utilisateurs non fiables (OWASP).

4. **Conception de Tests & Stratégie QA (`test-engineer`)** :
   - Déléguer à `test-engineer` la conception de suites de tests unitaires ou d'intégration complexes, cas limites (edge cases) et analyse de couverture.

5. **Performance & Vitesse Frontend (`web-performance-auditor`)** :
   - Pour les pages ou composants UI lourds, invoquer `web-performance-auditor` pour analyser le bundle, les Core Web Vitals (LCP, INP, CLS) et les re-rendus inutiles.
