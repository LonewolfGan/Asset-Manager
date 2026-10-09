export type Mode = 'format' | 'minify';
export type IndentSize = 2 | 4 | 'tab';
export type ViewOutput = 'code' | 'sandbox';
export type DeviceWidth = 'desktop' | 'tablet' | 'mobile';

export interface HtmlMetrics {
  inputChars: number;
  inputBytes: number;
  outputChars: number;
  outputBytes: number;
  totalTags: number;
  savingsBytes: number;
  savingsPercent: number;
}

const VOID_TAGS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
  '!doctype',
]);

/**
 * Formatage HTML robuste préservant les scripts, styles, pre, void tags et commentaires
 */
export function formatHtml(
  html: string,
  indent: IndentSize,
  stripComments: boolean = false
): string {
  if (!html.trim()) return '';
  const sp = indent === 'tab' ? '\t' : ' '.repeat(indent);

  // Découpage en jetons respectant les attributs avec guillemets
  const tokenRegex = /(<!--[\s\S]*?-->|<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>|[^<]+)/g;
  const rawTokens = html.match(tokenRegex) || [];

  let result = '';
  let level = 0;
  let inPreOrScript = false;
  let preOrScriptTag = '';

  for (let i = 0; i < rawTokens.length; i++) {
    const token = rawTokens[i];
    if (!token) continue;

    // Préservation verbatim des blocs <pre>, <script>, <style>
    if (inPreOrScript) {
      if (token.toLowerCase().startsWith(`</${preOrScriptTag}`)) {
        inPreOrScript = false;
        level = Math.max(0, level - 1);
        result += `\n${sp.repeat(level)}${token.trim()}`;
      } else {
        result += token;
      }
      continue;
    }

    if (token.startsWith('<!--')) {
      if (stripComments) continue;
      result += `\n${sp.repeat(level)}${token.trim()}`;
    } else if (token.startsWith('</')) {
      level = Math.max(0, level - 1);
      result += `\n${sp.repeat(level)}${token.trim()}`;
    } else if (token.startsWith('<')) {
      const tagMatch = token.match(/^<([a-zA-Z0-9:-]+)/);
      const tag = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>');
      const isVoid = VOID_TAGS.has(tag) || isSelfClosing || tag.startsWith('!');

      result += `\n${sp.repeat(level)}${token.trim()}`;

      if (!isVoid) {
        if (tag === 'pre' || tag === 'script' || tag === 'style') {
          inPreOrScript = true;
          preOrScriptTag = tag;
        }
        level++;
      }
    } else {
      const trimmed = token.replace(/\s+/g, ' ').trim();
      if (trimmed) {
        result += `\n${sp.repeat(level)}${trimmed}`;
      }
    }
  }

  return result.trimStart();
}

/**
 * Minification HTML ultra-compacte
 */
export function minifyHtml(html: string, stripComments: boolean = false): string {
  if (!html.trim()) return '';
  let res = html;
  if (stripComments) {
    res = res.replace(/<!--[\s\S]*?-->/g, '');
  }
  // Suppression des espaces inutiles entre les balises
  res = res.replace(/>\s+</g, '><');
  // Réduction des espaces blancs consécutifs
  res = res.replace(/\s{2,}/g, ' ');
  // Nettoyage des espaces résiduels aux extrémités des balises
  res = res.replace(/\s+>/g, '>');
  res = res.replace(/<\s+/g, '<');
  return res.trim();
}

export function calculateHtmlMetrics(input: string, output: string): HtmlMetrics {
  const inputChars = input.length;
  const inputBytes = new Blob([input]).size;
  const outputChars = output.length;
  const outputBytes = new Blob([output]).size;

  const tagMatches = input.match(/<[a-zA-Z0-9:-]+/g) || [];
  const totalTags = tagMatches.length;

  const savingsBytes = Math.max(0, inputBytes - outputBytes);
  const savingsPercent =
    inputBytes > 0 ? Math.round((savingsBytes / inputBytes) * 100) : 0;

  return {
    inputChars,
    inputBytes,
    outputChars,
    outputBytes,
    totalTags,
    savingsBytes,
    savingsPercent,
  };
}
