/**
 * Logic for JSON repair, recursive key sorting, and error parsing.
 */

export type ViewTab = 'code' | 'tree' | 'table';
export type IndentSize = 2 | 4 | 'tab';

export interface JsonErrorInfo {
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
}

/**
 * Correction automatique des erreurs de syntaxe JSON courantes
 */
export function autoRepairJsonString(str: string): { repaired: string; modified: boolean } {
  let s = str.trim();
  const original = s;

  // 1. Supprimer les commentaires JavaScript (// et /* */) SANS toucher aux chaînes littérales
  s = s.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\/\*[\s\S]*?\*\/|\/\/[^\r\n]*)/g,
    (match, strLiteral) => (strLiteral ? match : '')
  );

  // 2. Remplacer les booléens et constantes Python UNIQUEMENT hors chaînes de texte
  s = s.replace(
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(\bTrue\b|\bFalse\b|\bNone\b)/g,
    (match, strLiteral, pyLiteral) => {
      if (strLiteral) return match;
      if (pyLiteral === 'True') return 'true';
      if (pyLiteral === 'False') return 'false';
      if (pyLiteral === 'None') return 'null';
      return match;
    }
  );

  // 3. Remplacer les guillemets simples par des doubles pour les chaînes
  s = s.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_match, group) => {
    return `"${group.replace(/"/g, '\\"')}"`;
  });

  // 4. Quotation des clés d'objets non quotées
  s = s.replace(/([{,]\s*)([a-zA-Z0-9_$-]+)\s*:/g, '$1"$2":');

  // 5. Suppression des virgules traînantes (trailing commas) hors chaînes
  s = s.replace(
    /("(?:\\.|[^"\\])*")|(,\s*([}\]]))/g,
    (match, strLiteral, _commaGroup, closing) => (strLiteral ? match : closing)
  );

  return { repaired: s, modified: s !== original };
}

/**
 * Tri alphabétique récursif des clés
 */
export function sortObjectKeysRecursively(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sortObjectKeysRecursively);
  }
  if (obj !== null && typeof obj === 'object') {
    const keys = Object.keys(obj).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    const sorted: Record<string, any> = {};
    for (const k of keys) {
      sorted[k] = sortObjectKeysRecursively(obj[k]);
    }
    return sorted;
  }
  return obj;
}

/**
 * Diagnostic précis de la SyntaxError JSON
 */
export function parseJsonError(err: Error, text: string, isFr: boolean): JsonErrorInfo {
  const msg = err.message;
  let line: number | undefined;
  let column: number | undefined;

  const lineColMatch = msg.match(/line (\d+)(?:,\s*|\s+)column (\d+)/i);
  if (lineColMatch) {
    line = parseInt(lineColMatch[1], 10);
    column = parseInt(lineColMatch[2], 10);
  }

  const posMatch = msg.match(/at position (\d+)/i);
  if (posMatch) {
    const pos = parseInt(posMatch[1], 10);
    const lines = text.slice(0, pos).split('\n');
    line = lines.length;
    column = lines[lines.length - 1].length + 1;
  }

  let snippet = '';
  if (line !== undefined) {
    const allLines = text.split('\n');
    const targetIdx = line - 1;
    if (targetIdx >= 0 && targetIdx < allLines.length) {
      snippet = allLines[targetIdx];
    }
  }

  return {
    message: isFr
      ? msg
          .replace('Unexpected token', 'Symbole inattendu')
          .replace('Unexpected end of JSON input', 'Fin inattendue des données JSON')
      : msg,
    line,
    column,
    snippet: snippet.trim(),
  };
}
