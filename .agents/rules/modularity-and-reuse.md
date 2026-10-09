# Règle de Modularité Stricte et de Réutilisation des Composants

1. **Inspection préalable obligatoire (Zero Duplicate)** :
   - Avant de créer un composant, une fonction utilitaire ou un hook, l'agent DOIT scanner le codebase (`components/`, `ui/`, `utils/`, `lib/`) pour identifier ce qui existe déjà.
   - Interdiction formelle de coder un composant ou un helper en doublon s'il existe déjà dans le projet ou dans le design system.

2. **Source Unique de Vérité (Single Source of Truth / DRY)** :
   - Tout composant réutilisable (bouton, modal, input, carte, formatteur de date, client API) doit résider dans un emplacement partagé unique.
   - Si un composant existant ne couvre pas 100% du cas d'usage, il doit être étendu via des props ou de la composition, jamais dupliqué.

3. **Modularité et Responsabilité Unique (SRP)** :
   - Les composants doivent rester modulaires, découplés et réutilisables.
   - Séparer strictement la logique métier (hooks/services) de l'affichage (UI components).
