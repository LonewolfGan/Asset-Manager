# EverydayTools Project & Startup Guidelines

## How to run the site in local
Whenever asked to run or restart the project locally:
```bash
pnpm dev
```
Or start both separately in background tasks:
1. `PORT=3001 pnpm --filter @workspace/api-server run dev` (Port 3001)
2. `pnpm --filter @workspace/everydaytools run dev` (Port 5000)

## System URLs
- **Web App**: http://localhost:5000
- **API Server**: http://localhost:3001
- **Python Daemon**: http://localhost:5005 (auto-managed by API server)

---

# Mandatory Design Protocol & Refactoring Lock

## RÈGLE FONDAMENTALE : LE VERROU ("LOCK")
Toute intervention sur l'interface graphique d'un outil d'EverydayTools est soumise à un **verrouillage strict** :
1. **Un seul outil à la fois** : Interdiction formelle de modifier plusieurs pages ou outils en parallèle. Tant que l'outil en cours n'a pas reçu la validation explicite de l'utilisateur, aucun autre outil n'est touché.
2. **Obligation de lecture des skills ("Skill Lock")** : Avant chaque étape (audit, cadrage, implémentation), l'agent **DOIT impérativement** consulter les instructions des skills désignés dans `.agents/skills/`.
3. **Zéro régression fonctionnelle** : La logique métier existante, les types TypeScript et les appels API doivent être préservés à 100%.
4. **Design Unique & Ergonomie Dédiée par Famille d'Outil** : Interdiction formelle de copier-coller aveuglément le design d'un outil sur un autre. Chaque outil répond à une intention utilisateur et à une physique d'interaction propre (un outil de manipulation géométrique visuelle comme Resize ou Crop exige un canvas/workbench visuel et l'inspection de l'image, JAMAIS une jauge aveugle ou une aperture de compression).
5. **Composants Réutilisables & Priorité Stricte à shadcn/ui** : Interdiction de réinventer la roue ou d'accumuler des blocs de code monolithiques redondants. Privilégier systématiquement les composants de `@workspace/ui/components` (Tabs, Slider, ToggleGroup, Tooltip, Select, Dialog...) et factoriser des composants réutilisables dès qu'un pattern est partagé.
6. **Recherche d'Inspiration Réelle en Ligne Obligatoire** : En cas de doute ou pour tout nouvel outil d'une famille distincte, faire des recherches sur les meilleurs standards web existants (Squoosh, Figma, Linear, etc.) pour concevoir une UX de classe mondiale avant de coder.


---

## Les 5 Étapes du Protocole Obligatoire

```
┌─────────────────────────────────────────────────────────────┐
│ 1. AUDIT & DIAGNOSTIC (redesign-existing-projects, product-design)│
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 2. CADRAGE VISUEL & STITCH (stitch-design-taste, etc.)      │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 3. FINITIONS & MICRO-INTERACTIONS (emil-design-eng)         │
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 4. IMPLÉMENTATION COMPLÈTE (full-output-enforcement, shadcn)│
└──────────────────────────────┬──────────────────────────────┘
                               ▼
┌─────────────────────────────────────────────────────────────┐
│ 5. VÉRIFICATION VISUELLE & VALIDATION DIRECTE UTILISATEUR   │
└─────────────────────────────────────────────────────────────┘
```

---

### Étape 1 : Diagnostic & Analyse de l'outil existant
> **Skills obligatoires à charger** : `.agents/skills/redesign-existing-projects` + `.agents/skills/product-design`

Avant de modifier une seule ligne :
- **Analyser la page actuelle** (`apps/everydaytools/src/pages/<tool>.tsx`) :
  - Quels sont les états de la page (Initial/Dropzone, En cours/Processing, Succès/Téléchargement, Erreur) ?
  - Quels sont les paramètres/options disponibles pour l'utilisateur ?
  - Quels sont les endpoints backend ou modules frontend appelés ?
- **Identifier les défauts visuels et ergonomiques** :
  - Espacements étouffés ou trop tassés.
  - Cartes et conteneurs génériques style "template IA".
  - Absence de hiérarchie typographique ou textes secondaires peu lisibles.
  - Absence de feedback tactile au clic ou au survol.

---

### Étape 2 : Cadrage Visuel & Direction Artistique Anti-Slop
> **Skills obligatoires à charger** : 
> - `.agents/skills/stitch-design-taste` *(Liaison MCP Stitch)*
> - `.agents/skills/design-taste-frontend` *(Dials: Variance, Motion, Density)*
> - `.agents/skills/high-end-visual-design` *(Qualité agence, double-bezel, ombres fines)*
> - `.agents/skills/minimalist-ui` *(Palette monochrome chaude, rigueur suisse)*

#### Les Interdictions Absolues ("Absolute Zero") :
1. ❌ **Zéro Emoji** : Bannis des titres, boutons, textes et labels. Utiliser des icônes SVG précises et légères.
2. ❌ **Zéro Dégradé & Zéro Halo / Glow** : Bannir strictement TOUS les dégradés (`linear-gradient`, `radial-gradient`, dégradés d'arrière-plan, mesh, gradients sur le texte ou sur les conteneurs) ainsi que les auras lumineuses, halos flous artificiels (`blur-2xl`, `blur-3xl`, lueur diffuse) et fausses lumières de fond. Privilégier des surfaces planes, mates, nettes, architecturales et une rigueur suisse/technique absolue avec des aplats nets et l'accent solide `#FF6B35`.
3. ❌ **Zéro Noir Pur (`#000000`)** : Utiliser Zinc-950 (`#09090b`), Off-black (`#111111`) ou Charcoal (`#18181b`).
4. ❌ **Zéro Bordure Grise Lourde & Lignes Multiples** : Pas de surabondance de séparateurs (`border-t`, `border-b`) qui saucissonnent l'interface. Structurer par le whitespace et la hiérarchie. Bordures extérieures ultra-légères (`border-white/10`, `border-black/5` ou `border-zinc-200/50`).
5. ❌ **Zéro Badge / Pill Décoratif Inutile** : Bannir les pilules d'état factices, les rangées de badges superflus sous les uploaders (ex: "Format PDF", "50 Mo", "Sécurisé") et les pills de confirmation évidents.
6. ❌ **Zéro Texte de Réassurance ou de Remplissage IA** : Bannir les phrases clichés d'IA ("Document prêt pour la conversion", "Vos fichiers sont chiffrés et immédiatement supprimés", blabla anxiogène ou verbeux dont l'utilisateur se moque).
7. ❌ **Zéro Icône Sparkles / Baguette Magique** : Bannir `Sparkles` sur les boutons de conversion ou d'action. Un outil utilitaire se doit d'être précis et sobre.
8. ❌ **Zéro Bouton Surdimensionné** : Bannir les boutons géants disproportionnés (`px-8 py-4`). Utiliser une échelle ergonomique et raffinée (`h-10` à `h-11`, `px-5`, `text-sm font-medium`).
9. ❌ **Zéro Check-list Mécanique au Processing** : Bannir les listes robotiques d'étapes vertes qui se cochent pendant le chargement. Privilégier une visualisation vivante (scan d'onde, illustration dynamique) et une jauge fluide.
10. ❌ **Zéro Boîte Enfermée Systématique** : Éviter de figer tous les états dans un même rectangle d'upload étriqué. Adapter la respiration spatiale selon l'état (Dropzone libre, Staging noble, Visualisation en pleine largeur de travail).
11. ❌ **Zéro Carte à 3 colonnes égales** : Casser la symétrie générique avec des bento grids équilibrées ou des dispositions asymétriques fluides.
12. ❌ **Zéro `transition: all`** : Cibler explicitement les propriétés animées (`transition-transform`, `transition-opacity`).
13. ❌ **Zéro `h-screen`** : Utiliser `min-h-[100dvh]` pour éviter les sauts d'affichage sur mobiles.
14. ❌ **Zéro texte invisible ou bas contraste** : Vérifier le contraste WCAG (minimum 4.5:1 sur texte).
15. ❌ **Zéro formulations clichés IA** : Bannir "Elevate", "Seamless", "Next-Gen", "Game-changer". Préférer un langage clair et direct.
16. ❌ **Zéro container étriqué pour les titres** : Les titres doivent respirer sur 1 à 2 lignes maximum (`max-w-4xl`, tracking négatif).
17. ❌ **Zéro "Box Slop" / "Card Slop" (Boîtes dans les boîtes)** : Interdiction formelle d'enfermer chaque petit groupe d'informations, de texte ou de contrôles dans une sous-boîte avec bordure et fond (`border`, `bg-black/5`, `rounded-xl` imbriqués). L'interface doit respirer de manière architecturale, plate et ouverte. Structurer par l'alignement, la hiérarchie typographique et le whitespace, jamais par un empilement de boîtes dans des boîtes.
18. ❌ **Zéro Italique** : Bannir strictement la typographie en italique (`italic`) dans les libellés, sous-textes, statuts ou aides. Préférer une typographie droite, sobre et nette.
19. ❌ **Zéro Animation de Conversion Hors-Sujet (`ConversionConduit`)** : Le composant `ConversionConduit` (transfert animé format A → format B) est strictement réservé aux vraies conversions inter-formats (ex: Word → PDF, PDF → Excel). Interdiction formelle de l'utiliser sur les outils de sécurité, chiffrement, signature ou compression (ex: Protect PDF). Pour ces outils, conserver l'atelier affiché et utiliser un retour d'état inline réactif (spinner sur le bouton principal, filet de télémétrie fin sans boîte).
20. ❌ **Zéro Démontage Brutal ou Écran Vide au Processing** : Ne jamais conditionner le montage de l'atelier à `!isProcessing` sans vue de remplacement dédiée. L'atelier de staging reste affiché en continu (`file && !result`) avec verrouillage gracieux des contrôles (`opacity-40 pointer-events-none`) et passage au résultat dès réception.
21. ❌ **Zéro Planche Contact / Vignettes de Pages Inutiles** : Ne jamais afficher de grille de vignettes de pages PDF sur des outils globaux (Protect, Compress, Encrypt). Les vignettes de pages sont réservées exclusivement aux outils de manipulation de structure de pages (Split, Merge, Rotate, Organize, Delete Pages).
22. ❌ **Respect du Workflow de Test de l'Utilisateur** : Si l'utilisateur choisit de faire lui-même la vérification visuelle, ne pas forcer d'appels Chrome DevTools inutiles. Assurer la compilation TypeScript rigoureuse et laisser la main visuelle à l'utilisateur.
23. ❌ **Taille et Cadrage Standardisé de la Dropzone (`max-w-5xl mx-auto`)** : Le conteneur de la dropzone initiale (`ConversionDropzone`) doit TOUJOURS avoir la largeur canonique stricte `w-full max-w-5xl mx-auto`. Interdiction formelle de réduire la dropzone à des largeurs étriquées (`max-w-2xl`, `max-w-md`, etc.) qui cassent l'uniformité spatiale entre les outils.
24. ❌ **Utilisation Directe de l'Icône Vectorielle Authentique (`SOURCE_FORMAT.icon`)** : Dans l'en-tête de travail (Scène 2), afficher DIRECTEMENT le vrai fichier SVG vectoriel (`<img src={SOURCE_FORMAT.icon} className="w-16 h-16 sm:w-20 sm:h-20 object-contain shrink-0 drop-shadow-sm" />`). INTERDICTION FORMELLE d'encapsuler l'icône dans une sous-boîte carrée (`rounded-xl bg-emerald-500/10 border...`) ou d'utiliser une icône Lucide arbitraire dans une fausse carte. L'icône doit être grande, nette et posée directement à plat.
25. ❌ **Hiérarchie & Ordre Strict de la Barre de Commande (`... -> Vider -> Exporter`)** :
    - L'action principale d'exportation (`[Exporter]`) doit TOUJOURS être le **dernier élément à droite** sur la ligne.
    - Si un bouton destructif (`[Vider]`) existe, il doit immédiatement précéder `[Exporter]`.
    - Les boutons d'historique (`[Annuler]`, `[Rétablir]`) doivent être symétriques : si l'un a un libellé textuel, l'autre DOIT également avoir un libellé textuel identique.
26. ❌ **Uniformité Typographique & Monochrome des Menus Déroulants** : Dans les menus déroulants (notamment le menu d'exportation CSV / Excel / etc.) :
    - Interdiction formelle d'ajouter des couleurs arbitraires (ex: texte vert sur Excel alors que les autres sont gris). Tous les éléments partagent la même palette monochrome neutre zinc (`text-zinc-800 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800`).
    - Interdiction des libellés à rallonge qui reviennent à la ligne (`whitespace-nowrap`). Les libellés doivent être concis et le conteneur suffisamment large (`w-64`).
27. ❌ **Zéro Couleur Arbitraire sur les Boutons Secondaires** : Ne jamais injecter de couleurs vives disparates (`text-emerald-600`, etc.) sur les icônes de boutons secondaires (ex: "Charger des données d'exemple"). Conserver les teintes neutres sobre (`text-zinc-500 dark:text-zinc-400`).
28. ❌ **Ajout de Lignes et Colonnes Symétrique et Intégré** : Dans les outils de type tableur / données, l'ajout de lignes doit se faire directement via une ligne intégrée au tableau (`<tr>` avec `+` dans la colonne `#`), en parfaite symétrie avec l'ajout de colonnes en bout d'en-tête, sans boutons flottants ou en pointillés isolés hors tableau.
29. ❌ **Possibilité de Revenir en Arrière (Undo / Redo) sur toute Action Destructive** : Toute suppression de ligne, de colonne ou vidage de tableau DOIT proposer un retour en arrière immédiat (pile d'historique `history`, raccourcis `Ctrl+Z` / `Cmd+Z`, notification toast flottante avec bouton `Annuler`).
30. ❌ **Zéro Copier-Coller Aveugle de Design entre Familles d'Outils** : Chaque famille d'outils doit avoir une ergonomie et un agencement adaptés à sa fonction :
    - *Manipulation visuelle & géométrique (Resize, Crop, Rotate, Watermark)* : Nécessite un **workbench studio avec viewport/canvas direct**, prévisualisation réelle de l'image, repères de pixels, et panneau de contrôles précis. Interdiction absolue d'y coller des gauges ou apertures de compression aveugles.
    - *Compression de fichiers (Compress PDF, Compress Image)* : Calibrage d'intensité, télémétrie de poids, monument de gain en Ko/Mo.
    - *Conversions inter-formats (Word → PDF, PDF → Excel)* : Composant `ConversionConduit`.
    - *Éditeurs de données (CSV, Excel)* : Grille tabulaire, recherche globale, barre de commande data.
31. ❌ **Priorité Stricte aux Composants shadcn/ui & Modularité (DRY)** : Toujours privilégier les primitives et composants de `@workspace/ui/components` (`Tabs`, `Slider`, `ToggleGroup`, `Tooltip`, `Select`, `Dialog`, etc.) au lieu d'écrire des contrôles maison dupliqués ou monolithiques. Dès qu'un schéma interactif est réutilisable, créer un composant dédié propre.
32. ❌ **Zéro Improvisation sans Inspiration Réelle** : Si un outil demande un nouveau paradigme d'interaction, rechercher et s'inspirer des meilleures applications professionnelles réelles (Squoosh, Figma, Linear, etc.) avant de concevoir l'interface.
33. ❌ **Interdiction Formelle de Calquer l'Outil Précédent (Zéro Contamination Croisée) & Nuance sur les Composants Communs** : Il est formellement interdit de reproduire mécaniquement la structure, les scènes ou le workflow de l'outil précédent sur l'outil suivant. **Attention à la nuance cruciale** : cela ne signifie en aucun cas bannir les composants partagés pertinents et performants (`CompareReveal` pour la comparaison visuelle avant/après, `Tabs`, `Slider`, `ConversionDropzone`, etc.). Chaque outil doit tirer parti des meilleurs composants existants tout en concevant une physique d'interaction dédiée à son intention d'usage propre.
34. ❌ **Interdiction du Bricolage / Déconstruction Réelle et Repartir à Zéro** : Lorsqu'un design n'est pas apprécié par l'utilisateur, interdiction absolue de se contenter de "bouger des boutons" ou de faire des micro-patchs cosmétiques sur une structure bancale. L'agent doit **déconstruire entièrement le layout rejeté**, faire table rase, appliquer un raisonnement séquentiel rigoureux (*Sequential Thinking*), et ré-implémenter une solution propre, élégante et solide de fond en comble.
35. ❌ **Pleine Largeur Réelle (`Full Width`) des Ateliers Studio** :
    - La dropzone initiale (Scène 1) conserve la largeur canonique `max-w-5xl mx-auto` (Règle 23).
    - Dès qu'un fichier est chargé, l'atelier studio / workbench (Scène 2) DOIT impérativement adopter la pleine largeur `w-full` sans contrainte artificielle `max-w-5xl` qui étouffe le canvas et les contrôles.
36. ❌ **Éradication Totale du "Box Slop" / "Card Slop" dans les Barres de Contrôles** :
    - Interdiction formelle d'enfermer les barres d'outils, les groupes de contrôles ou les options de format dans des boîtes avec fond et bordure (`bg-white/zinc-900 border rounded-xl p-2.5`) imbriquant elles-mêmes des boutons à fond gris (`border bg-zinc-50`).
    - Les contrôles doivent être posés à plat de manière architecturale, avec un espacement direct, des micro-interactions haptiques soignées et une sélection typographique sobre et plate.
37. ❌ **Zéro Texte Inutile & Zéro Répétition d'Informations entre Écrans** :
    - Ne jamais répéter deux fois la même information dans un même écran ou entre deux vues (ex: ne pas répéter les degrés d'orientation à côté des boutons de rotation s'ils sont déjà inscrits sur les boutons ; ne pas afficher de libellés redondants comme "Rotation :" ou "Miroir :" quand les icônes et intitulés d'actions sont explicites ; ne pas dupliquer l'orientation dans l'en-tête et sur le canvas).
38. ❌ **Emplacement Canonique des Options de Format (Haut / Atelier, JAMAIS en bas)** :
    - Les options de format de sortie (ex: PNG, JPEG, WebP) font partie intégrante des paramètres de configuration de l'atelier : elles doivent TOUJOURS être intégrées dans la barre d'outils ou d'en-tête supérieure avec les autres réglages, et JAMAIS reléguées en bas de page.
    - La barre de commande inférieure est réservée STRICTEMENT au bouton d'action principal final (ex: `[Télécharger l'image]`), aligné à droite, sans aucun encombrement.
39. ❌ **Rotation Manuelle Directe et Ergonomie Tactile sans Sliders Encombrants** :
    - Pour les outils de géométrie nécessitant une rotation manuelle ("rotate à la main"), privilégier une poignée de rotation tactile directe au sommet de l'image sur le canvas (style Figma / Apple Photos) avec suivi à 60 FPS et info-bulle d'angle dynamique pendant le glissement.
    - Interdiction formelle de coller des curseurs / sliders horizontaux disgracieux qui encombrent la barre d'outils supérieure.
40. ❌ **Harmonisation & Contraste Tonal des Contrôles (Zéro Blanc sur Blanc)** :
    - Interdiction formelle de concevoir des boutons de commande, chevrons de navigation ou pastilles avec un fond blanc pur (`bg-white`) directement posé sur un fond de page ou de surface blanc/clair (`#ffffff` ou zinc-50). Cela produit un effet "blanc sur blanc" criard, sans relief ni hiérarchie agréable.
    - Toujours appliquer un contraste tonal calculé et reposant pour l'œil :
      - *En thème clair* : surfaces zinc adoucies (`bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-100 border border-zinc-200/80 dark:border-white/10`).
      - *En thème sombre* : surfaces zinc mates et sobres avec bordures ultra-fines (`dark:border-white/10`).
41. ❌ **Le Test Honnête du Jury Awwwards & Intégrité UX/UI Réelle** :
    - Après toute conception ou refonte, et AVANT de présenter son travail, l'agent DOIT se poser explicitement et avec une honnêteté sans compromis les 3 questions fondamentales d'un comité d'excellence :
      1. *« Si j'étais membre du jury Awwwards, est-ce que je voterais pour nominer cette interface ? »* (L'exécution visuelle rivalise-t-elle avec des références mondiales comme Linear, Apple, VSCO ou Figma, ou trahit-elle un réflexe générique d'IA ?)
      2. *« Le design est-il réellement intuitif au premier regard ? »* (L'utilisateur comprend-il instantanément et sans confusion mentale l'intention, le fonctionnement et chaque contrôle de l'outil ?)
      3. *« L'ergonomie est-elle 100% UI/UX friendly et sans friction ? »* (Transitions ciblées sans accroc, zéro flash visuel, états aux limites `disabled`/`invisible` physiquement inattaquables, alignement optique au pixel près).
      Si la réponse à l'une de ces 3 questions n'est pas un « OUI » franc et évident, le travail n'est pas prêt et doit être déconstruit et perfectionné via le *Sequential Thinking*.


#### Utilisation de Stitch MCP (si prototypage nécessaire) :
- Générer une spécification `DESIGN.md` sémantique avec `stitch-design-taste`.
- Utiliser le MCP Stitch (`generate_screen_from_text`, `edit_screens`, `list_screens`) pour générer ou comparer des références visuelles haute-fidélité.

---

### Étape 3 : Micro-Interactions & Physique des Éléments
> **Skill obligatoire à charger** : `.agents/skills/emil-design-eng`

- **Retour tactile immédiat** :
  - Boutons interactifs : `active:scale-[0.98]` au clic.
  - Hover dynamique : légère élévation d'échelle ou translation millimétrique.
- **Courbes d'animation physiques** :
  - Utiliser `ease-out` pour les entrées (réactif, feedback instantané) : `ease-[cubic-bezier(0.32,0.72,0,1)]`.
  - Pas d'animations sur les actions répétitives à haute fréquence (raccourcis clavier, saisie).
- **Architecture concentrique des rayons (Double-Bezel)** :
  - Le conteneur parent a un grand rayon (`rounded-2xl` ou `rounded-3xl`).
  - Le conteneur interne a un rayon mathématiquement réduit : $R_{interne} = R_{externe} - Padding$.
- **États transitoires soignés** :
  - Shimmer skeletons dimensionnés à la taille réelle au lieu de spinners circulaires basiques.
  - Drag & drop zone réactive avec animation de bordure ou de fond au survol de fichier.

---

### Étape 4 : Implémentation Complète & Zéro Placeholder
> **Skills obligatoires à charger** : 
> - `.agents/skills/full-output-enforcement`
> - `.agents/skills/shadcn`

- **Règle absolue d'exhaustivité** :
  - Interdiction stricte de placeholders : `// ...`, `// rest of code`, `// TODO`, `/* code here */`.
  - Toujours livrer le fichier dans son intégralité ou un bloc de remplacement complet et directement compilable.
- **Respect du Design System existant** :
  - Utiliser les composants et primitives de base du projet (`@workspace/ui`, `shadcn/ui`, `lucide-react` avec traits fins).
  - Assurer la cohérence Dark / Light mode (variables CSS `--background`, `--card`, `--foreground`, etc.).

---

### Étape 5 : Démonstration, Tableau Récapitulatif & Validation Utilisateur
Pour chaque modification livrée :
1. **Tableau synthétique Before / After** (méthode Emil Kowalski) récapitulant les décisions de design prises.
2. **Lien direct vers l'outil en local** (`http://localhost:5000/...`).
3. **Demande de feedback utilisateur** : Attendre la validation ou les retours d'ajustement du client avant de considérer l'outil terminé.
