import { describe, it, expect } from 'vitest';
import {
  createMarkdownRenderer,
  renderSafeHtml,
  highlightHtml,
  generateStandaloneHtml,
} from '@/lib/markdown-preview-parser';
import { applyMarkdownFormat } from '@/lib/markdown-format-helpers';

describe('Markdown Preview Parser & Format Helpers', () => {
  const renderer = createMarkdownRenderer(true);

  it('renders standard markdown to sanitized HTML', () => {
    const md = '# Grand Titre\n\nVoici du texte avec **gras** et *italique*.';
    const html = renderSafeHtml(md, renderer);
    expect(html).toContain('<h1>Grand Titre</h1>');
    expect(html).toContain('<strong>gras</strong>');
    expect(html).toContain('<em>italique</em>');
  });

  it('renders GitHub style alert callouts [!NOTE] and [!TIP]', () => {
    const md = '> [!NOTE]\n> Ceci est une note importante.';
    const html = renderSafeHtml(md, renderer);
    expect(html).toContain('Note');
    expect(html).toContain('border-sky-500');
    expect(html).toContain('Ceci est une note importante.');
  });

  it('highlights code blocks with highlight.js', () => {
    const md = '```javascript\nconst a = 42;\n```';
    const html = renderSafeHtml(md, renderer);
    expect(html).toContain('hljs');
    expect(html).toContain('javascript');
  });

  it('generates a complete standalone HTML document with doctype and styles', () => {
    const partialHtml = '<p>Contenu</p>';
    const standalone = generateStandaloneHtml(partialHtml, true);
    expect(standalone).toContain('<!DOCTYPE html>');
    expect(standalone).toContain('<html lang="fr">');
    expect(standalone).toContain('<p>Contenu</p>');
  });

  it('applies headings formatting with selected level', () => {
    const res = applyMarkdownFormat('mon titre', 0, 9, 'heading', true, '2');
    expect(res.updated).toBe('## mon titre\n');
    expect(res.newPos).toBe(res.updated.length);
  });

  it('applies bold and strike formatting', () => {
    const boldRes = applyMarkdownFormat('texte', 0, 5, 'bold', true);
    expect(boldRes.updated).toBe('**texte**');

    const strikeRes = applyMarkdownFormat('barre', 0, 5, 'strike', true);
    expect(strikeRes.updated).toBe('~~barre~~');
  });

  it('applies table and codeblock templates', () => {
    const tableRes = applyMarkdownFormat('', 0, 0, 'table', true);
    expect(tableRes.updated).toContain('| En-tête 1 |');

    const codeRes = applyMarkdownFormat('console.log(1);', 0, 15, 'codeblock', true, 'typescript');
    expect(codeRes.updated).toContain('```typescript\nconsole.log(1);\n```');
  });
});
