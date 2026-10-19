import { describe, it, expect } from 'vitest';
import {
  createMarkdownRenderer,
  renderSafeHtml,
  highlightHtml,
  generateStandaloneHtml,
  MARKDOWN_SAMPLES,
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

  it('strips unsafe iframes from rendered markdown HTML', () => {
    const md = '<iframe src="http://evil.com/phishing"></iframe>';
    const html = renderSafeHtml(md, renderer);
    expect(html).not.toContain('<iframe');
  });

  it('guarantees zero arbitrary hex #FF6B35 in renderer blockquote and standalone html', () => {
    const quoteMd = '> Citation standard';
    const html = renderSafeHtml(quoteMd, renderer);
    expect(html).not.toContain('#FF6B35');

    const standalone = generateStandaloneHtml('<p>Test</p>', true);
    expect(standalone).not.toContain('#FF6B35');
  });

  it('escapes HTML tags in unhighlighted code blocks to prevent tag consumption by DOMPurify', () => {
    const md = '```unrecognizedlang\n<MyComponent prop="value">\n```';
    const html = renderSafeHtml(md, renderer);
    expect(html).toContain('&lt;MyComponent prop="value"&gt;');
  });

  it('includes alert callout styles in standalone HTML', () => {
    const standalone = generateStandaloneHtml('<div class="border-sky-500">Alert</div>', true);
    expect(standalone).toContain('.border-sky-500');
    expect(standalone).toContain('.border-emerald-500');
  });

  describe('MARKDOWN_SAMPLES', () => {
    it('provides standard curated markdown samples', () => {
      expect(MARKDOWN_SAMPLES.welcomeDoc).toBeDefined();
      expect(MARKDOWN_SAMPLES.welcomeDoc).toContain('# ');
      expect(MARKDOWN_SAMPLES.readmeTemplate).toBeDefined();
      expect(MARKDOWN_SAMPLES.technicalSpec).toBeDefined();
    });
  });
});

