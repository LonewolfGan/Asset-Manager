export const MARKDOWN_SAMPLES = {
  welcomeDoc: `# Bienvenue dans l'Éditeur Markdown Live

Cet outil vous permet de concevoir, visualiser et exporter des documents **Markdown** en temps réel avec un rendu HTML instantané.

> [!NOTE]
> La synchronisation du défilement entre l'éditeur et l'aperçu est active par défaut pour une navigation sans friction.

## Fonctionnalités Principales

- **Formatage express** : Titres H1 à H6, gras, italique, barré, surlignage.
- **Blocs de code** : Coloration syntaxique automatique pour JavaScript, TypeScript, Python, Bash, etc.
- **Composants avancés** : Tableaux, listes de tâches interactives, notes de bas de page et blocs repliables.

### Exemple de Code

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
}

function greet(user: UserProfile): string {
  return \`Bonjour \${user.name} (\${user.role})\`;
}
\`\`\`

### Tableau Récapitulatif

| Format | Extension | Type MIME | Export |
| :--- | :--- | :--- | :--- |
| Markdown | \`.md\` | \`text/markdown\` | Source brut |
| Page Web | \`.html\` | \`text/html\` | Autonome avec CSS |

### Liste de Tâches

- [x] Rédaction du contenu initial
- [x] Coloration syntaxique et mise en page
- [ ] Exportation finale du document
`,

  readmeTemplate: `# Project Name

Un sous-titre clair et percutant décrivant la proposition de valeur de votre projet.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)]()

## Aperçu

Expliquez brièvement le problème résolu par ce projet et pourquoi il a été créé.

> [!TIP]
> Ajoutez des captures d'écran ou des animations courtes pour maximiser l'engagement des contributeurs.

## Fonctionnalités

- **Performances Pareto** : Traitements optimisés en moins de 15ms.
- **Zéro Dépendance Serveur** : Exécution 100% sécurisée côté client.
- **Accessibilité WCAG AA** : Support complet des lecteurs d'écran et navigation clavier.

## Installation

\`\`\`bash
# Cloner le dépôt
git clone https://github.com/votre-compte/votre-projet.git

# Installer les dépendances
cd votre-projet
pnpm install

# Lancer l'environnement de développement
pnpm dev
\`\`\`

## Licence

Distribué sous la licence MIT. Voir \`LICENSE\` pour plus d'informations.
`,

  technicalSpec: `# Spécification Technique : Service d'Authentification

- **Auteur** : Équipe Plateforme
- **Statut** : Approuvé
- **Date** : 2026-10-16

## 1. Contexte & Objectifs

Fournir une couche d'authentification robuste avec jetons JWT signés en Ed25519, rotation transparente des clés et révocation instantanée via cache distribué.

> [!IMPORTANT]
> Les jetons de rafraîchissement ne doivent jamais être exposés au stockage local (\`localStorage\`) et doivent impérativement résider dans un cookie \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\`.

## 2. Contrats d'API

| Méthode | Point de Terminaison | Description | Code HTTP |
| :--- | :--- | :--- | :--- |
| \`POST\` | \`/auth/login\` | Authentification par identifiants | \`200 OK\` |
| \`POST\` | \`/auth/refresh\` | Rotation du jeton de session | \`200 OK\` |
| \`POST\` | \`/auth/logout\` | Révocation immédiate de session | \`204 No Content\` |

## 3. Gestion des Erreurs

En cas d'échec d'authentification, une réponse standardisée est renvoyée :

\`\`\`json
{
  "error": "UNAUTHORIZED",
  "message": "Identifiants invalides ou session expirée",
  "timestamp": 1776326400
}
\`\`\`
`,
};
