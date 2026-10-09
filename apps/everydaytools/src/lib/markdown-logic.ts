/**
 * Markdown formatting, toolbar text manipulation, and reading metrics
 */

export interface MarkdownStats {
  words: number;
  characters: number;
  lines: number;
  readingTimeMinutes: number;
}

export function computeMarkdownStats(text: string): MarkdownStats {
  const clean = text.trim();
  if (!clean) {
    return { words: 0, characters: 0, lines: 0, readingTimeMinutes: 0 };
  }

  const characters = text.length;
  const lines = text.split('\n').length;
  // Match non-whitespace words
  const words = clean.split(/\s+/).filter(Boolean).length;
  // Standard reading speed ~200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    lines,
    readingTimeMinutes,
  };
}

export type MarkdownAction =
  | 'bold'
  | 'italic'
  | 'strikethrough'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'quote'
  | 'code'
  | 'codeblock'
  | 'bullet-list'
  | 'numbered-list'
  | 'task-list'
  | 'table'
  | 'link';

/**
 * Apply markdown transformation at selection
 */
export function applyMarkdownAction(
  fullText: string,
  action: MarkdownAction,
  selectionStart: number,
  selectionEnd: number
): { text: string; newCursorStart: number; newCursorEnd: number } {
  const selectedText = fullText.slice(selectionStart, selectionEnd);
  const before = fullText.slice(0, selectionStart);
  const after = fullText.slice(selectionEnd);

  let replacement = '';
  let cursorOffset = 0;

  switch (action) {
    case 'bold':
      replacement = `**${selectedText || 'texte en gras'}**`;
      cursorOffset = selectedText ? replacement.length : 2;
      break;
    case 'italic':
      replacement = `*${selectedText || 'texte en italique'}*`;
      cursorOffset = selectedText ? replacement.length : 1;
      break;
    case 'strikethrough':
      replacement = `~~${selectedText || 'texte barré'}~~`;
      cursorOffset = selectedText ? replacement.length : 2;
      break;
    case 'h1':
      replacement = `# ${selectedText || 'Titre 1'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'h2':
      replacement = `## ${selectedText || 'Titre 2'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'h3':
      replacement = `### ${selectedText || 'Titre 3'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'quote':
      replacement = `> ${selectedText || 'Citation inspirante'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'code':
      replacement = `\`${selectedText || 'const variable = true;'}\``;
      cursorOffset = selectedText ? replacement.length : 1;
      break;
    case 'codeblock':
      replacement = `\`\`\`typescript\n${selectedText || '// Votre code ici'}\n\`\`\`\n`;
      cursorOffset = replacement.length;
      break;
    case 'bullet-list':
      replacement = `- ${selectedText || 'Premier élément'}\n- Deuxième élément\n`;
      cursorOffset = replacement.length;
      break;
    case 'numbered-list':
      replacement = `1. ${selectedText || 'Première étape'}\n2. Deuxième étape\n`;
      cursorOffset = replacement.length;
      break;
    case 'task-list':
      replacement = `- [x] Tâche complétée\n- [ ] ${selectedText || 'Tâche à faire'}\n`;
      cursorOffset = replacement.length;
      break;
    case 'table':
      replacement = `| Colonne 1 | Colonne 2 | Statut |\n| :--- | :--- | :--- |\n| Valeur A | Valeur B | Actif |\n| Valeur C | Valeur D | En attente |\n`;
      cursorOffset = replacement.length;
      break;
    case 'link':
      replacement = `[${selectedText || 'Titre du lien'}](https://example.com)`;
      cursorOffset = replacement.length;
      break;
    default:
      return { text: fullText, newCursorStart: selectionStart, newCursorEnd: selectionEnd };
  }

  const newText = before + replacement + after;
  return {
    text: newText,
    newCursorStart: selectionStart + cursorOffset,
    newCursorEnd: selectionStart + cursorOffset,
  };
}
