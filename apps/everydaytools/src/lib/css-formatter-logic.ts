import {
  tokenizeCss,
  parseCssTree,
  serializeCss,
  type CssToken,
  type CssNode,
} from './css-formatter-parser';
import {
  generateCssSandboxHtml,
  type ViewOutput,
  type DeviceWidth,
} from './css-formatter-sandbox';

export * from './css-formatter-parser';
export * from './css-formatter-sandbox';

export type Mode = 'format' | 'minify';
export type IndentSize = 2 | 4 | 'tab';

export interface CssMetrics {
  inputChars: number;
  inputBytes: number;
  outputChars: number;
  outputBytes: number;
  totalRules: number;
  totalDeclarations: number;
  savingsBytes: number;
  savingsPercent: number;
}

/**
 * Formatage CSS de haute précision
 */
export function formatCssAdvanced(
  css: string,
  indentSize: IndentSize,
  stripComments = false,
  sortProps = false
): string {
  if (!css.trim()) return '';
  const indentStr = indentSize === 'tab' ? '\t' : ' '.repeat(indentSize);
  const tokens = tokenizeCss(css, stripComments);
  const tree = parseCssTree(tokens);
  const serialized = serializeCss(tree, indentStr, sortProps, 0);
  return serialized.replace(/\n{3,}/g, '\n\n').trim();
}

/**
 * Minification CSS compacte préservant les chaînes et les règles calc()
 */
export function minifyCssAdvanced(css: string, stripComments = true): string {
  if (!css.trim()) return '';
  let res = css;

  // Préservation des chaînes de caractères littérales
  const strings: string[] = [];
  res = res.replace(/(['"])(?:(?!\1|\\).|\\.)*\1/g, (match) => {
    strings.push(match);
    return `___CSS_STR_${strings.length - 1}___`;
  });

  // Suppression des commentaires si demandée
  if (stripComments) {
    res = res.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // Suppression des espaces autour des délimiteurs structurels
  res = res.replace(/\s*([{}:;,>+~])\s*/g, '$1');

  // Préservation des espaces requis autour des opérateurs dans calc()
  res = res.replace(/calc\(([^)]+)\)/g, (match) => {
    return match.replace(/([0-9a-zA-Z%]+)([-+])([0-9a-zA-Z%]+)/g, '$1 $2 $3');
  });

  // Suppression du point-virgule superflu avant l'accolade fermante
  res = res.replace(/;}/g, '}');

  // Remplacement des séquences d'espaces multiples par un espace unique
  res = res.replace(/\s+/g, ' ');

  // Restauration des chaînes littérales
  res = res.replace(/___CSS_STR_(\d+)___/g, (_, id) => strings[Number(id)]);

  return res.trim();
}

export function calculateCssMetrics(input: string, output: string): CssMetrics {
  const inputChars = input.length;
  const inputBytes = new Blob([input]).size;
  const outputChars = output.length;
  const outputBytes = new Blob([output]).size;

  const ruleMatches = input.match(/{/g) || [];
  const totalRules = ruleMatches.length;

  const declMatches = input.match(/;/g) || [];
  const totalDeclarations = declMatches.length;

  const savingsBytes = Math.max(0, inputBytes - outputBytes);
  const savingsPercent = inputBytes > 0 ? Math.round((savingsBytes / inputBytes) * 100) : 0;

  return {
    inputChars,
    inputBytes,
    outputChars,
    outputBytes,
    totalRules,
    totalDeclarations,
    savingsBytes,
    savingsPercent,
  };
}

export interface CssIssue {
  type: 'unclosed-block' | 'unexpected-close' | 'unclosed-comment' | 'unclosed-string';
  message: string;
}

export function detectCssIssues(css: string): CssIssue[] {
  if (!css.trim()) return [];
  const issues: CssIssue[] = [];

  let braceDepth = 0;
  let inComment = false;
  let inString = false;
  let quoteChar = '';

  for (let i = 0; i < css.length; i++) {
    const char = css[i];

    if (inComment) {
      if (char === '*' && css[i + 1] === '/') {
        inComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (char === '\\') {
        i++;
      } else if (char === quoteChar) {
        inString = false;
      }
      continue;
    }

    if (char === '/' && css[i + 1] === '*') {
      inComment = true;
      i++;
      continue;
    }

    if (char === '"' || char === "'") {
      inString = true;
      quoteChar = char;
      continue;
    }

    if (char === '{') {
      braceDepth++;
    } else if (char === '}') {
      if (braceDepth === 0) {
        issues.push({
          type: 'unexpected-close',
          message: 'Accolade fermante inattendue "}" sans bloc ouvert correspondant.',
        });
      } else {
        braceDepth--;
      }
    }
  }

  if (inComment) {
    issues.push({
      type: 'unclosed-comment',
      message: 'Commentaire multi-lignes "/*" non fermé dans la feuille de style.',
    });
  }

  if (inString) {
    issues.push({
      type: 'unclosed-string',
      message: `Chaîne de caractères ${quoteChar} non refermée.`,
    });
  }

  if (braceDepth > 0) {
    issues.push({
      type: 'unclosed-block',
      message: `${braceDepth} bloc(s) CSS non fermé(s) (accolade "{" manquante).`,
    });
  }

  return issues;
}

export const CSS_SAMPLES = {
  modernCard: `/* Modern Interactive Card */
.card {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  background-color: var(--card-bg, #ffffff);
  border: 1px solid var(--border-color, #e4e4e7);
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-heading, #18181b);
  margin-bottom: 0.5rem;
}`,
  glassmorphism: `/* Frosted Glass Container */
.glass-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 1rem;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
}`,
  responsiveGrid: `/* Responsive Auto-Fit Grid */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 640px) {
  .grid-layout {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}`,
};
