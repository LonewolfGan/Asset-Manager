# Plan de Mise en Œuvre — Copywriting Haute Conversion & Cocon Sémantique (Maillage Interne)

> **Date** : 13 Novembre 2026  
> **Auteur** : Antigravity Orchestrator & Marketing Skills Swarm  
> **Skills Mobilisés** : `copywriting`, `seo-audit`, `ai-seo`, `programmatic-seo`, `seo`  
> **Gouvernance** : TDD Red-Green, Anti-Monolithe (< 300 LOC), Intégrité UI Awwwards Sanctuarisée.

---

## 1. Diagnostic & Enjeux Métier

### A. Constat & Lacunes Actuelles
1. **Rupture de Maillage Interne (Topic Clusters)** :
   - Les 85 pages d'outils SSG calculaient `buildRelatedSection` sans l'insérer dans le HTML final.
   - Zéro lien entre les pages d'outils et les 116 articles de blog éducatifs (`BlogPost.relatedToolSlug` existait mais n'était exploité que côté client sans maillage SSG réciproque).
   - Les 116 articles de blog n'étaient pas pré-rendus sous forme de fichiers HTML physiques dans `dist/public`, privant le site de 232 pages de contenu éditorial à haute autorité indexables instantanément.
2. **Audit Copywriting (selon le skill `copywriting`)** :
   - Les textes synthétiques actuels comportent des formulations génériques répétitives ("garantissant une confidentialité totale", "sans rien envoyer à un serveur" alors que certains outils lourds utilisent des sandboxes sécurisées éphémères).
   - Manque d'ancrage visuel concret ("Can the reader picture it?") et d'arguments différenciateurs impossibles à copier par les concurrents payants comme Smallpdf/iLovePDF ("Swap test").

---

## 2. Architecture Technique & Modularité (SRP < 300 LOC)

### A. Nouveau Module : `apps/everydaytools/src/lib/seo-linking.ts`
- **Responsabilité Unique** : Mappage sémantique bidirectionnel et résolution des liens croisés entre Outils, Guides de Blog et Hubs thématiques.
- **Fonctions Exportées** :
  - `getBlogPostsForTool(internalSlug: string): BlogPostSummary[]`
  - `getRelatedToolsForBlogPost(postSlug: string): ToolSummary[]`
  - `buildGuidesSectionHtml(tool: ToolSeoEntry, locale: Locale): string`
  - `buildRelatedSectionHtml(tool: ToolSeoEntry, locale: Locale): string`
- **Taille** : ~180 lignes de code TypeScript pur, sans dépendances UI.

### B. Intégration dans le Moteur SSR / SSG : `apps/everydaytools/src/lib/seo-ssr.ts`
- Insertion de la section **Guides & Tutoriels Détaillés** (`relatedGuidesSection`) sur chaque page d'outil.
- Insertion effective de la section **Outils Similaires** (`relatedSection`) sur chaque page d'outil.
- Refonte des blocs de synthèse et comparatifs techniques selon les règles du skill `copywriting` (arguments falsifiables, différenciation $0 / sans abonnement / sans file d'attente / sans inscription).
- Fonction `generateBlogPostHtml(slug: string, locale: Locale): string | null` pour le pré-rendu statique des 116 articles avec schéma `Article`.

### C. Extension du Prerender Statique : `apps/everydaytools/scripts/prerender-seo-pages.ts`
- Génération physique de :
  - 232 pages d'accueil et d'outils (`dist/public/[en|fr]/...`).
  - 232 pages d'articles de blog physiques (`dist/public/[en|fr]/blog/...`).
  - Total : **464 pages HTML physiques**, TTFB < 50ms, maillage interne bidirectionnel complet.

### D. Synchronisation Sitemap : `apps/everydaytools/scripts/generate-sitemap.mjs`
- Export exhaustif des 420+ URLs avec balises `<xhtml:link rel="alternate">` réciproques (EN, FR, x-default).

---

## 3. Déroulement TDD des Tâches

- [ ] **Tâche 1 : TDD RED** — Écrire les tests unitaires pour `seo-linking.ts` dans `apps/everydaytools/tests/unit/seo/seo-linking.test.ts`.
- [ ] **Tâche 2 : TDD GREEN** — Implémenter `apps/everydaytools/src/lib/seo-linking.ts`.
- [ ] **Tâche 3 : Copywriting & SSR Enrichment** — Mettre à jour `seo-ssr.ts` avec le maillage contextuel et les textes orientés conversion/preuve concrète.
- [ ] **Tâche 4 : SSG Blog & Sitemap** — Mettre à jour `prerender-seo-pages.ts` et `generate-sitemap.mjs` pour générer les 464 pages et le sitemap complet.
- [ ] **Tâche 5 : Pipeline de Vérification & Livraison** — Exécuter `clean:codebase`, `check:rules`, `typecheck`, `test`, régénérer le certificat d'audit et pousser sur `origin/main`.
