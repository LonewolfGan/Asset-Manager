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
      const isDoctypeOrSpecial = token.startsWith('<!') || token.startsWith('<?');
      const tagMatch = token.match(/^<([a-zA-Z0-9:-]+)/);
      const tag = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isSelfClosing = token.endsWith('/>');
      const isVoid = isDoctypeOrSpecial || VOID_TAGS.has(tag) || isSelfClosing;

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
 * Minification HTML ultra-compacte préservant les blocs verbatim (<pre>, <script>, <style>, <textarea>)
 * et les espaces sémantiques entre éléments en ligne.
 */
export function minifyHtml(html: string, stripComments: boolean = false): string {
  if (!html.trim()) return '';
  let res = html;

  // Préservation verbatim des blocs spéciaux
  const verbatimBlocks: string[] = [];
  res = res.replace(/<(pre|script|style|textarea)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => {
    const placeholder = `___HTML_VERBATIM_${verbatimBlocks.length}___`;
    verbatimBlocks.push(match);
    return placeholder;
  });

  if (stripComments) {
    res = res.replace(/<!--[\s\S]*?-->/g, '');
  }

  // Nettoyage des espaces autour des balises de bloc
  const BLOCK_TAGS = '</?(?:html|head|body|title|meta|link|div|header|footer|nav|section|article|aside|main|p|h[1-6]|ul|ol|li|table|thead|tbody|tfoot|tr|th|td|form|fieldset|legend|figure|figcaption|details|summary|blockquote)\\b[^>]*>';
  res = res.replace(new RegExp(`(${BLOCK_TAGS})\\s+`, 'gi'), '$1');
  res = res.replace(new RegExp(`\\s+(${BLOCK_TAGS})`, 'gi'), '$1');

  // Réduction des espaces blancs consécutifs en un seul espace
  res = res.replace(/\s{2,}/g, ' ');
  res = res.replace(/\s+>/g, '>');
  res = res.replace(/<\s+/g, '<');

  // Restauration des blocs verbatim intacts
  verbatimBlocks.forEach((block, idx) => {
    res = res.replace(`___HTML_VERBATIM_${idx}___`, () => block);
  });

  return res.trim();
}

export interface HtmlIssue {
  type: 'unclosed-tag' | 'unexpected-close' | 'mismatched-tag';
  message: string;
  tag: string;
}

export function detectHtmlIssues(html: string): HtmlIssue[] {
  if (!html.trim()) return [];
  const issues: HtmlIssue[] = [];

  const cleanHtml = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '');

  const tagRegex = /<\/?([a-zA-Z0-9:-]+)[^>]*\/?>/g;
  const stack: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = tagRegex.exec(cleanHtml)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();

    if (
      fullTag.startsWith('<!') ||
      fullTag.startsWith('<?') ||
      fullTag.endsWith('/>') ||
      VOID_TAGS.has(tagName)
    ) {
      continue;
    }

    if (fullTag.startsWith('</')) {
      if (stack.length === 0) {
        issues.push({
          type: 'unexpected-close',
          message: `Balise fermante inattendue </${tagName}> sans balise ouvrante.`,
          tag: tagName,
        });
      } else {
        const lastTag = stack[stack.length - 1];
        if (lastTag === tagName) {
          stack.pop();
        } else {
          issues.push({
            type: 'mismatched-tag',
            message: `Balise fermante </${tagName}> trouvée alors que <${lastTag}> était attendue.`,
            tag: tagName,
          });
          const idx = stack.lastIndexOf(tagName);
          if (idx !== -1) {
            stack.splice(idx);
          }
        }
      }
    } else {
      stack.push(tagName);
    }
  }

  while (stack.length > 0) {
    const unclosed = stack.pop()!;
    issues.push({
      type: 'unclosed-tag',
      message: `Balise <${unclosed}> non fermée dans le document.`,
      tag: unclosed,
    });
  }

  return issues;
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

export const HTML_SAMPLES = {
  landingHero: `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>EverydayTools Hero</title>
</head>
<body>
  <header class="hero-container">
    <h1>EverydayTools Studio</h1>
    <p>Outils de développement 100% navigateur, ultra-rapides et confidentiels.</p>
    <a href="#explore" class="cta-button">Explorer</a>
  </header>
</body>
</html>`,
  article: `<article class="prose">
  <h2>Architecture Haute Disponibilité</h2>
  <p>Une infrastructure résiliente commence par la séparation des responsabilités.</p>
  <ul>
    <li>Calculs distribués</li>
    <li>Isolation éphémère</li>
    <li>Chiffrement de bout en bout</li>
  </ul>
</article>`,
};
