# Rapport d'Audit Design — EverydayTools Hub

**Date**: 2026-06-24
**Périmètre**: Audit et correction complète des couleurs codées en dur, mode sombre, et micro-interactions sur l'ensemble du frontend React.

---

## Composants modifiés (19 fichiers)

### Composants partagés
| Fichier | Correctifs |
|---------|-----------|
| `src/components/FormatIcon.tsx` | Accent bleu `#1A6BFF` → `var(--accent)` orange. Fond `rgba(26,107,255,0.10)` → `var(--accent-subtle)`. Texte `#fff` → `var(--accent-text)` |
| `src/components/TopNav.tsx` | Couleurs SVG standardisées. 9 éléments interactifs avec transition `120ms` ajoutée |
| `src/components/SearchModal.tsx` | Ombre modale `rgba(0,0,0,0.18)` → `var(--shadow-hover)` |
| `src/components/CookieBanner.tsx` | Ombre bannière → `var(--shadow-hover)` |
| `src/components/Footer.tsx` | SVG icône: `#FF6B35` → `var(--accent)` |
| `src/components/ResultPanel.tsx` | 2 fonds rgba → `color-mix(in srgb, var(--success|warning) X%, transparent)` |
| `src/components/ToolLoadingState.tsx` | 5 fonds rgba → `color-mix(in srgb, var(--success|danger) X%, transparent)` |
| `src/components/ToolContent.tsx` | 8 fonds rgba ToolBadge → `color-mix()` ; couleurs de points → `var(--success|danger|warning|text-secondary)` |
| `src/App.tsx` | Texte bouton BackToTop `#fff` → `var(--accent-text)` |

### Pages outils
| Fichier | Correctifs |
|---------|-----------|
| `src/pages/index.tsx` | Accent `rgba(255,107,53,0.08)` → `var(--accent-subtle)`, bordure → `var(--accent)`. Bouton "All" `#fff` → `var(--accent-text)`. Ombres cartes → `var(--shadow-sm)`, `var(--shadow-hover)` |
| `src/pages/blog-index.tsx` | Ombre cartes blog → `var(--shadow-hover)` |
| `src/pages/blog-post.tsx` | 2 boutons CTA `color: "#fff"` → `var(--accent-text)` |
| `src/pages/image-converter.tsx` | `text-green-500` → `text-[var(--success)]` |
| `src/pages/image-crop.tsx` | 5 boutons ratio `#fff` → `var(--accent-text)` |
| `src/pages/background-remover.tsx` | 2 fonds erreur → `color-mix(in srgb, var(--danger) ..., transparent)`. Bordure bouton retry → `color-mix(in srgb, var(--danger) 40%, transparent)` |
| `src/pages/qr-code-generator.tsx` | Bouton download `#fff` → `var(--accent-text)` |
| `src/pages/base64.tsx` | Fallback hex `#fff4ef` nettoyé des `var()` |
| `src/pages/json-formatter.tsx` | Fallback hex `#fff4ef` nettoyé des `var()` |
| `src/pages/checksum.tsx` | Fallback hex nettoyé des `var()` |

---

## Valeurs codées en dur nettoyées

### ~18 valeurs hexadécimales → variables CSS sémantiques
- `#1A6BFF` → `var(--accent)` (bleu → orange du thème)
- `#fff` → `var(--accent-text)` (10 occurrences)
- `#FF6B35` → `var(--accent)` (2 occurrences)
- `#E7E7E7` → `var(--bg-elevated)`
- `#111111` → `var(--text-primary)`

### ~18 valeurs rgba → color-mix() sémantique
- `rgba(34,197,94, X%)` → `color-mix(in srgb, var(--success) X%, transparent)` (7 occurrences)
- `rgba(239,68,68, X%)` → `color-mix(in srgb, var(--danger) X%, transparent)` (5 occurrences)
- `rgba(245,158,11, X%)` → `color-mix(in srgb, var(--warning) X%, transparent)` (3 occurrences)
- `rgba(59,130,246, X%)` → `var(--text-secondary)` (3 occurrences)

### ~5 ombres → variables shadow CSS
- Ombres de cartes, modale, bannière → `var(--shadow-sm)`, `var(--shadow-hover)`

### ~180 fallback hex nettoyés par sed global
- `var(--accent-subtle,#fff4ef)` → `var(--accent-subtle)` (~45 fichiers)
- `var(--danger,#dc2626)` → `var(--danger)` (~45 fichiers)
- `var(--success,#16a34a)` → `var(--success)` (~45 fichiers)

---

## Correctifs spécifiques pour l'étanchéité du mode sombre

1. **FormatIcon**: L'accent bleu `#1A6BFF` ne changeait pas en mode sombre. Remplacé par `var(--accent)` qui pointe vers `#FF6B35` dans les deux thèmes.

2. **image-converter.tsx**: `text-green-500` (Tailwind fixe) → `text-[var(--success)]` (variable sémantique). `text-green-500` est toujours `#22c55e` même en mode sombre — la variable CSS `--success` s'adapte.

3. **color-mix()**: rgba() avec des valeurs RGB fixes ne s'adaptent pas au thème. `color-mix(in srgb, var(--X) Y%, transparent)` utilise la couleur sémantique du thème actif.

4. **Ombres**: Les ombres dures `rgba(0,0,0,0.18)` en mode clair deviennent trop intenses en mode sombre. Remplacées par `var(--shadow-hover)` qui est `0 4px 16px rgba(0,0,0,0.4)` en sombre (CSS variable définie dans `[data-theme="dark"]`).

5. **Transitions**: 9 éléments interactifs du TopNav reçoivent désormais `transition: "color 120ms ease"` ou `transition: "color 120ms ease, border-color 120ms ease"` pour des micro-interactions fluides au survol.

---

## Tokens CSS disponibles (non modifiés, déjà corrects)

Le design system défini dans `index.css` est complet et correct. Les variables suivantes sont disponibles pour toute utilisation future:
- `--bg-base`, `--bg-surface`, `--bg-elevated` (fonds)
- `--border`, `--border-strong` (bordures)
- `--text-primary`, `--text-secondary`, `--text-tertiary` (textes)
- `--accent`, `--accent-subtle`, `--accent-text` (accent orange)
- `--success`, `--danger`, `--warning` (feedback)
- `--shadow-sm`, `--shadow-hover` (ombres)
- `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-card` (coins arrondis)
- `--font-ui`, `--font-display`, `--font-mono` (typographie)
