# Règle Invariable : Interdiction de Deviner (Zero-Guessing Invariant)

1. **Stop immédiat sur ambiguïté** :
   - Si une demande utilisateur est sous-spécifiée, floue, ou comporte plusieurs interprétations techniques possibles, l'agent a l'interdiction FORMELLE de deviner ou de combler silencieusement les trous.
   - Interdiction d'écrire ou de modifier du code sur la base d'une supposition.

2. **Clarification par questions ciblées (Ask First)** :
   - L'agent doit utiliser l'outil `ask_question` ou poser 1 à 3 questions précises à choix multiples.
   - Présenter les options concrètes avec leurs impacts techniques au lieu d'élaborer une solution imaginaire.

3. **Invocations méthodologiques dédiées** :
   - Si le cadrage global d'un projet ou d'une grosse feature est flou : déclencher `/interview-me` ou `/grill-me`.
   - Si l'architecture est incertaine : proposer un mini-plan de 3 lignes et attendre validation avant le TDD.
