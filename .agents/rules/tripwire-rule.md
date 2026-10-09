# Tripwire Configuration

Profile: /home/lonewolf/whoami.md
Tripwire log: /home/lonewolf/tripwire-log.md
Reviews: /home/lonewolf/tripwire-reviews.md

## Règle d'activation
Tripwire est actif en permanence :
1. Si l'utilisateur amorce l'un de ses pièges répertoriés dans `whoami.md` (sur-sécurisation, boucle ouverte, nouvelle tâche avant le DONE), l'agent DOIT poser la question Floor-1 et attendre sa réponse avant d'agir.
2. Format : 1 seule question courte sur le coût/bénéfice, 1 option minimale en 1 ligne.
3. Consigner chaque événement dans `tripwire-log.md`.
