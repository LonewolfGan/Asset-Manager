import {
  Info,
  Lightbulb,
  Bookmark,
  AlertTriangle,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react';

export interface HeadingPreset {
  lvl: number;
  labelFr: string;
  labelEn: string;
  tag: string;
}

export const HEADING_PRESETS: HeadingPreset[] = [
  { lvl: 1, labelFr: 'Titre 1', labelEn: 'Heading 1', tag: 'H1' },
  { lvl: 2, labelFr: 'Titre 2', labelEn: 'Heading 2', tag: 'H2' },
  { lvl: 3, labelFr: 'Titre 3', labelEn: 'Heading 3', tag: 'H3' },
  { lvl: 4, labelFr: 'Titre 4', labelEn: 'Heading 4', tag: 'H4' },
  { lvl: 5, labelFr: 'Titre 5', labelEn: 'Heading 5', tag: 'H5' },
  { lvl: 6, labelFr: 'Titre 6', labelEn: 'Heading 6', tag: 'H6' },
];

export interface AlertPreset {
  id: string;
  icon: LucideIcon;
  color: string;
  labelFr: string;
  labelEn: string;
}

export const ALERT_PRESETS: AlertPreset[] = [
  { id: 'NOTE', icon: Info, color: 'text-sky-500', labelFr: 'Note', labelEn: 'Note' },
  { id: 'TIP', icon: Lightbulb, color: 'text-emerald-500', labelFr: 'Astuce', labelEn: 'Tip' },
  { id: 'IMPORTANT', icon: Bookmark, color: 'text-purple-500', labelFr: 'Important', labelEn: 'Important' },
  { id: 'WARNING', icon: AlertTriangle, color: 'text-amber-500', labelFr: 'Attention', labelEn: 'Warning' },
  { id: 'CAUTION', icon: ShieldAlert, color: 'text-red-500', labelFr: 'Danger', labelEn: 'Caution' },
];

export interface CodeLanguagePreset {
  id: string;
  label: string;
  tag: string;
}

export const CODE_LANGUAGE_PRESETS: CodeLanguagePreset[] = [
  { id: 'typescript', label: 'TypeScript', tag: 'ts' },
  { id: 'javascript', label: 'JavaScript', tag: 'js' },
  { id: 'python', label: 'Python', tag: 'py' },
  { id: 'bash', label: 'Bash / Shell', tag: 'sh' },
  { id: 'html', label: 'HTML', tag: 'html' },
  { id: 'css', label: 'CSS', tag: 'css' },
  { id: 'json', label: 'JSON', tag: 'json' },
  { id: 'sql', label: 'SQL', tag: 'sql' },
  { id: 'yaml', label: 'YAML', tag: 'yaml' },
  { id: 'markdown', label: 'Markdown', tag: 'md' },
];

export function applyMarkdownFormat(
  currentVal: string,
  start: number,
  end: number,
  formatType: string,
  isFr: boolean,
  extraArg?: string
): { updated: string; newPos: number } {
  const selected = currentVal.substring(start, end);
  let replacement = '';
  let cursorOffset = 0;

  const beforeText = currentVal.substring(0, start);
  const needLeadingNewline = start > 0 && !beforeText.endsWith('\n');
  const prefix = needLeadingNewline ? '\n' : '';

  switch (formatType) {
    case 'heading': {
      const level = extraArg || '1';
      const hashes = '#'.repeat(parseInt(level, 10));
      replacement = `${prefix}${hashes} ${selected || (isFr ? `Titre de niveau ${level}` : `Heading level ${level}`)}\n`;
      cursorOffset = replacement.length;
      break;
    }
    case 'bold':
      replacement = `**${selected || (isFr ? 'texte en gras' : 'bold text')}**`;
      cursorOffset = selected ? replacement.length : 2;
      break;
    case 'italic':
      replacement = `*${selected || (isFr ? 'texte en italique' : 'italic text')}*`;
      cursorOffset = selected ? replacement.length : 1;
      break;
    case 'strike':
      replacement = `~~${selected || (isFr ? 'texte barré' : 'strikethrough text')}~~`;
      cursorOffset = selected ? replacement.length : 2;
      break;
    case 'highlight':
      replacement = `==${selected || (isFr ? 'texte surligné' : 'highlighted text')}==`;
      cursorOffset = selected ? replacement.length : 2;
      break;
    case 'code':
      replacement = `\`${selected || 'code'}\``;
      cursorOffset = selected ? replacement.length : 1;
      break;
    case 'kbd':
      replacement = `<kbd>${selected || 'Ctrl'}</kbd>`;
      cursorOffset = selected ? replacement.length : 5;
      break;
    case 'sup':
      replacement = `<sup>${selected || (isFr ? 'exposant' : 'superscript')}</sup>`;
      cursorOffset = selected ? replacement.length : 5;
      break;
    case 'sub':
      replacement = `<sub>${selected || (isFr ? 'indice' : 'subscript')}</sub>`;
      cursorOffset = selected ? replacement.length : 5;
      break;
    case 'ul':
      replacement = `${prefix}- ${selected || (isFr ? 'Élément de liste à puces' : 'Bullet list item')}\n`;
      cursorOffset = replacement.length;
      break;
    case 'ol':
      replacement = `${prefix}1. ${selected || (isFr ? 'Premier élément ordonné' : 'First numbered item')}\n`;
      cursorOffset = replacement.length;
      break;
    case 'task':
      replacement = `${prefix}- [ ] ${selected || (isFr ? 'Tâche à accomplir' : 'Task to complete')}\n`;
      cursorOffset = replacement.length;
      break;
    case 'quote':
      replacement = `${prefix}> ${selected || (isFr ? 'Citation textuelle' : 'Quote text')}\n`;
      cursorOffset = replacement.length;
      break;
    case 'alert': {
      const alertType = (extraArg || 'NOTE').toUpperCase();
      replacement = `${prefix}> [!${alertType}]\n> ${selected || (isFr ? `Contenu de l'encart ${alertType.toLowerCase()}` : `${alertType} callout content`)}\n`;
      cursorOffset = replacement.length;
      break;
    }
    case 'codeblock': {
      const lang = extraArg || 'typescript';
      replacement = `${prefix}\`\`\`${lang}\n${selected || (isFr ? '// Votre code source ici' : '// Your code here')}\n\`\`\`\n`;
      cursorOffset = replacement.length;
      break;
    }
    case 'details':
      replacement = `${prefix}<details>\n<summary>${selected || (isFr ? 'Cliquez pour afficher les détails' : 'Click to show details')}</summary>\n\n${isFr ? 'Contenu masqué à dévoiler ici...' : 'Hidden content to reveal here...'}\n</details>\n`;
      cursorOffset = replacement.length;
      break;
    case 'hr':
      replacement = `${prefix}---\n\n`;
      cursorOffset = replacement.length;
      break;
    case 'link':
      replacement = `[${selected || (isFr ? 'Titre du lien hypertexte' : 'Link title')}](https://example.com)`;
      cursorOffset = replacement.length;
      break;
    case 'image':
      replacement = `![${selected || (isFr ? "Description alternative de l'image" : 'Image alt description')}](https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000)`;
      cursorOffset = replacement.length;
      break;
    case 'table':
      replacement = `${prefix}| ${isFr ? 'En-tête 1' : 'Header 1'} | ${isFr ? 'En-tête 2' : 'Header 2'} | ${isFr ? 'En-tête 3' : 'Header 3'} |\n| :--- | :---: | ---: |\n| ${isFr ? 'Donnée A1' : 'Data A1'} | ${isFr ? 'Centré B1' : 'Centered B1'} | ${isFr ? 'Droite C1' : 'Right C1'} |\n| ${isFr ? 'Donnée A2' : 'Data A2'} | ${isFr ? 'Centré B2' : 'Centered B2'} | ${isFr ? 'Droite C2' : 'Right C2'} |\n`;
      cursorOffset = replacement.length;
      break;
    case 'math':
      replacement = `${prefix}$$\n${selected || 'f(x) = \\int_{-\\infty}^{\\infty} \\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi'}\n$$\n`;
      cursorOffset = replacement.length;
      break;
    case 'footnote':
      replacement = `[^1]\n\n[^1]: ${selected || (isFr ? 'Note de bas de page explicative.' : 'Explanatory footnote.')}\n`;
      cursorOffset = replacement.length;
      break;
    default:
      return { updated: currentVal, newPos: start };
  }

  const updated = currentVal.substring(0, start) + replacement + currentVal.substring(end);
  const newPos = start + cursorOffset;

  return { updated, newPos };
}
