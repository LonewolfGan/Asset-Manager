export interface CssToken {
  type: 'comment' | 'string' | 'delim' | 'text';
  value: string;
}

export interface CssNode {
  type: 'comment' | 'declaration' | 'block';
  value?: string;
  selector?: string;
  children?: CssNode[];
}

/**
 * Tokenizer CSS robuste respectant les commentaires multi-lignes,
 * les chaînes entre guillemets doubles et simples, et la structure de blocs.
 */
export function tokenizeCss(css: string, stripComments = false): CssToken[] {
  const tokens: CssToken[] = [];
  let i = 0;
  const n = css.length;

  while (i < n) {
    const char = css[i];

    // Commentaires /* ... */
    if (char === '/' && css[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < n && !(css[i] === '*' && css[i + 1] === '/')) {
        i++;
      }
      i += 2; // skip */
      const comment = css.slice(start, i);
      if (!stripComments) {
        tokens.push({ type: 'comment', value: comment });
      }
      continue;
    }

    // Chaînes "..." ou '...'
    if (char === '"' || char === "'") {
      const quote = char;
      const start = i;
      i++;
      while (i < n && css[i] !== quote) {
        if (css[i] === '\\') i++; // échappement
        i++;
      }
      i++; // guillemet fermant
      tokens.push({ type: 'string', value: css.slice(start, i) });
      continue;
    }

    // Délimiteurs { } ;
    if (char === '{' || char === '}' || char === ';') {
      tokens.push({ type: 'delim', value: char });
      i++;
      continue;
    }

    // Texte brut (sélecteurs, propriétés, valeurs...)
    const start = i;
    while (
      i < n &&
      css[i] !== '{' &&
      css[i] !== '}' &&
      css[i] !== ';' &&
      !(css[i] === '/' && css[i + 1] === '*') &&
      css[i] !== '"' &&
      css[i] !== "'"
    ) {
      i++;
    }
    const val = css.slice(start, i);
    tokens.push({ type: 'text', value: val });
  }

  return tokens;
}

/**
 * Parse la liste de tokens en un arbre structuré (blocs, déclarations, commentaires)
 */
export function parseCssTree(tokenList: CssToken[]): CssNode[] {
  const nodes: CssNode[] = [];
  let currentStatement = '';

  let idx = 0;
  while (idx < tokenList.length) {
    const t = tokenList[idx];

    if (t.type === 'comment') {
      nodes.push({ type: 'comment', value: t.value });
      idx++;
      continue;
    }

    if (t.type === 'delim' && t.value === '{') {
      const selector = currentStatement.trim().replace(/\s+/g, ' ');
      currentStatement = '';
      idx++;

      let depth = 1;
      const innerTokens: CssToken[] = [];
      while (idx < tokenList.length && depth > 0) {
        if (tokenList[idx].type === 'delim' && tokenList[idx].value === '{') depth++;
        if (tokenList[idx].type === 'delim' && tokenList[idx].value === '}') depth--;
        if (depth > 0) {
          innerTokens.push(tokenList[idx]);
        }
        idx++;
      }

      const childNodes = parseCssTree(innerTokens);
      nodes.push({
        type: 'block',
        selector,
        children: childNodes,
      });
      continue;
    }

    if (t.type === 'delim' && t.value === ';') {
      const stmt = currentStatement.trim().replace(/\s+/g, ' ');
      if (stmt) {
        nodes.push({ type: 'declaration', value: stmt });
      }
      currentStatement = '';
      idx++;
      continue;
    }

    currentStatement += t.value;
    idx++;
  }

  const trailing = currentStatement.trim().replace(/\s+/g, ' ');
  if (trailing) {
    nodes.push({ type: 'declaration', value: trailing });
  }

  return nodes;
}

/**
 * Formate un sélecteur complexe avec retour à la ligne propre par virgule
 */
export function formatCssSelector(sel: string, indent: string): string {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const c of sel) {
    if (c === '(') depth++;
    if (c === ')') depth--;
    if (c === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += c;
    }
  }
  if (current.trim()) parts.push(current.trim());

  if (parts.length > 1) {
    return parts.join(`,\n${indent}`);
  }
  return sel.trim();
}

/**
 * Sérialisation arborescente du CSS avec indentation calibrée et tri alphabétique optionnel
 */
export function serializeCss(
  nodes: CssNode[],
  indentStr: string,
  sortProps = false,
  level = 0
): string {
  let output = '';
  const currentIndent = indentStr.repeat(level);

  let items = nodes;
  if (sortProps) {
    const newItems: CssNode[] = [];
    let declGroup: CssNode[] = [];

    for (const node of nodes) {
      if (node.type === 'declaration') {
        declGroup.push(node);
      } else {
        if (declGroup.length > 0) {
          declGroup.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
          newItems.push(...declGroup);
          declGroup = [];
        }
        newItems.push(node);
      }
    }
    if (declGroup.length > 0) {
      declGroup.sort((a, b) => (a.value || '').localeCompare(b.value || ''));
      newItems.push(...declGroup);
    }
    items = newItems;
  }

  for (let j = 0; j < items.length; j++) {
    const node = items[j];

    if (node.type === 'comment' && node.value) {
      const commentLines = node.value.split('\n').map((l) => l.trim());
      output += `\n${currentIndent}${commentLines.join('\n' + currentIndent)}\n`;
    } else if (node.type === 'declaration' && node.value) {
      const colonIdx = node.value.indexOf(':');
      let declStr = node.value;
      if (colonIdx !== -1) {
        const prop = node.value.slice(0, colonIdx).trim();
        const val = node.value.slice(colonIdx + 1).trim();
        declStr = `${prop}: ${val}`;
      }
      output += `${currentIndent}${declStr};\n`;
    } else if (node.type === 'block' && node.selector && node.children) {
      const formattedSelector = formatCssSelector(node.selector, currentIndent);
      output += `\n${currentIndent}${formattedSelector} {\n`;
      output += serializeCss(node.children, indentStr, sortProps, level + 1);
      output += `${currentIndent}}\n`;
    }
  }

  return output;
}
