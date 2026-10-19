export interface WordCounterSample {
  id: string;
  labelFr: string;
  labelEn: string;
  content: string;
}

export const WORD_COUNTER_SAMPLES: WordCounterSample[] = [
  {
    id: 'editorial',
    labelFr: 'Article éditorial',
    labelEn: 'Editorial Article',
    content: `L'essor des outils d'ingénierie légers et décentralisés marque une rupture majeure dans le développement web moderne. Au lieu de déléguer chaque opération textuelle, colorimétrique ou documentaire à des serveurs distants, les navigateurs contemporains exploitent la puissance des Web APIs pour garantir une exécution instantanée, confidentielle et éco-responsable.

Cette approche, centrée sur la vie privée dès la conception, assure que les données sensibles ne quittent jamais le terminal de l'utilisateur. En éliminant la latence réseau et les transferts superflus, les développeurs peuvent concevoir des interfaces d'une réactivité incomparable, rivalisant avec les applications natives de référence.`,
  },
  {
    id: 'tech',
    labelFr: 'Spécification technique',
    labelEn: 'Tech Specification',
    content: `Architecture Overview & Non-Functional Requirements:
1. Micro-frontends & Local Compute: All text transformations, regex evaluations, and colorimetry calculations must execute within 15 milliseconds without triggering remote REST endpoints.
2. State Management & Throttling: User input modifications must adhere to a 1000ms idle-threshold history mechanism to optimize memory allocation and ensure smooth undo/redo cycles.
3. Accessibility & Tokens: Adherence to WCAG 2.1 Level AA standards is mandatory across all components. High contrast ratios and aria-labels must be verified mechanically by the test suite before release.`,
  },
  {
    id: 'speech',
    labelFr: 'Discours / Pitch',
    labelEn: 'Speech / Keynote',
    content: `Mesdames et messieurs, bienvenue.
Aujourd'hui, nous ne célébrons pas seulement une nouvelle version de notre plateforme, mais une philosophie entière du travail bien fait. La simplicité n'est pas le point de départ, c'est l'aboutissement d'une rigueur constante.

Chaque milliseconde gagnée, chaque friction supprimée dans le parcours de nos utilisateurs représente un pas vers un web plus digne, plus rapide et plus respectueux de chacun. Merci de bâtir ce futur avec nous.`,
  },
];
