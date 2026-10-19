export interface JsIssue {
  type:
    | 'unclosed-brace'
    | 'unexpected-brace'
    | 'unclosed-paren'
    | 'unexpected-paren'
    | 'unclosed-bracket'
    | 'unexpected-bracket'
    | 'unclosed-string'
    | 'unclosed-comment';
  message: string;
  line?: number;
}

/**
 * Détecte les anomalies syntaxiques courantes dans du code JS/TS
 * (accolades, parenthèses, crochets non équilibrés, chaînes ou commentaires non fermés)
 */
export function detectJsIssues(code: string): JsIssue[] {
  if (!code.trim()) return [];

  const issues: JsIssue[] = [];
  let inLineComment = false;
  let inBlockComment = false;
  let inString: string | null = null;
  let isEscaped = false;

  const stack: { char: '{' | '(' | '['; line: number }[] = [];
  let currentLine = 1;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const next = code[i + 1];

    if (char === '\n') {
      currentLine++;
      inLineComment = false;
      if (inString === "'" || inString === '"') {
        // Multi-line non autorisée pour guillemets simples ou doubles sans échappement
        issues.push({
          type: 'unclosed-string',
          message: `Chaîne ${inString} non fermée avant le saut de ligne`,
          line: currentLine - 1,
        });
        inString = null;
      }
      continue;
    }

    if (inLineComment) continue;

    if (inBlockComment) {
      if (char === '*' && next === '/') {
        inBlockComment = false;
        i++;
      }
      continue;
    }

    if (inString) {
      if (isEscaped) {
        isEscaped = false;
      } else if (char === '\\') {
        isEscaped = true;
      } else if (char === inString) {
        inString = null;
      }
      continue;
    }

    // Gestion du début des commentaires
    if (char === '/' && next === '/') {
      inLineComment = true;
      i++;
      continue;
    }
    if (char === '/' && next === '*') {
      inBlockComment = true;
      i++;
      continue;
    }

    // Gestion des débuts de chaînes
    if (char === '"' || char === "'" || char === '`') {
      inString = char;
      isEscaped = false;
      continue;
    }

    // Gestion des délimiteurs
    if (char === '{' || char === '(' || char === '[') {
      stack.push({ char, line: currentLine });
    } else if (char === '}') {
      const top = stack.pop();
      if (!top || top.char !== '{') {
        issues.push({
          type: 'unexpected-brace',
          message: `Accolade fermante "}" inattendue à la ligne ${currentLine}`,
          line: currentLine,
        });
      }
    } else if (char === ')') {
      const top = stack.pop();
      if (!top || top.char !== '(') {
        issues.push({
          type: 'unexpected-paren',
          message: `Parenthèse fermante ")" inattendue à la ligne ${currentLine}`,
          line: currentLine,
        });
      }
    } else if (char === ']') {
      const top = stack.pop();
      if (!top || top.char !== '[') {
        issues.push({
          type: 'unexpected-bracket',
          message: `Crochet fermant "]" inattendu à la ligne ${currentLine}`,
          line: currentLine,
        });
      }
    }
  }

  if (inBlockComment) {
    issues.push({
      type: 'unclosed-comment',
      message: 'Commentaire multi-lignes "/*" non fermé',
    });
  }

  if (inString) {
    issues.push({
      type: 'unclosed-string',
      message: `Chaîne de caractères ${inString} non fermée`,
    });
  }

  while (stack.length > 0) {
    const unclosed = stack.pop()!;
    if (unclosed.char === '{') {
      issues.push({
        type: 'unclosed-brace',
        message: `Accolade ouvrante "{" non fermée (ouverte à la ligne ${unclosed.line})`,
        line: unclosed.line,
      });
    } else if (unclosed.char === '(') {
      issues.push({
        type: 'unclosed-paren',
        message: `Parenthèse ouvrante "(" non fermée (ouverte à la ligne ${unclosed.line})`,
        line: unclosed.line,
      });
    } else if (unclosed.char === '[') {
      issues.push({
        type: 'unclosed-bracket',
        message: `Crochet ouvrant "[" non fermé (ouvert à la ligne ${unclosed.line})`,
        line: unclosed.line,
      });
    }
  }

  return issues;
}
