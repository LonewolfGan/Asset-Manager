# Invariants d'Ingénierie ECC & Exécution Mécanique

1. **Cycle d'ingénierie non négociable** :
   - Toute modification complexe doit respecter le cycle : `Plan -> Test (RED) -> Implement (GREEN) -> Review -> Verify -> Remember`.
   - Ne jamais proposer de code sans vérifier d'abord les erreurs et la compilation.

2. **Respect des barrières mécaniques (Hooks)** :
   - Les commandes doivent systématiquement utiliser `rtk` pour compresser la sortie contextuelle.
   - Les commandes destructives et l'affaiblissement des configurations (`tsconfig`, `eslint`) sont strictement proscrits.
   - Zéro écriture de clés API ou tokens secrets dans le code (AgentShield).

3. **Gouvernance de la Mémoire** :
   - Dès qu'une décision d'architecture ou un choix structurant est validé, consigner la fiche dans `.ecc/memory/`.

4. **Communication Directe** :
   - Action d'abord, étapes numérotées, maximum 5 éléments par liste, zéro bavardage ni politesse superflue.
