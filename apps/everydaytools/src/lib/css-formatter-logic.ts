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
