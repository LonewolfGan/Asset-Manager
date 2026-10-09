import { describe, it, expect } from 'vitest';
import {
  computeMarkdownStats,
  applyMarkdownAction,
} from '../../../src/lib/markdown-logic';

describe('markdown-logic', () => {
  it('computes word count, character count, and reading time correctly', () => {
    const text = 'Hello world! This is a simple test document for markdown previewing.';
    const stats = computeMarkdownStats(text);

    expect(stats.words).toBe(11);
    expect(stats.characters).toBe(68);
    expect(stats.lines).toBe(1);
    expect(stats.readingTimeMinutes).toBe(1);
  });

  it('handles empty text gracefully', () => {
    const stats = computeMarkdownStats('   ');
    expect(stats.words).toBe(0);
    expect(stats.characters).toBe(0);
    expect(stats.readingTimeMinutes).toBe(0);
  });

  it('wraps selected text with bold formatting', () => {
    const text = 'This is amazing software';
    // select 'amazing'
    const start = text.indexOf('amazing');
    const end = start + 'amazing'.length;

    const res = applyMarkdownAction(text, 'bold', start, end);
    expect(res.text).toBe('This is **amazing** software');
  });

  it('wraps selected text with inline code', () => {
    const text = 'Execute runCommand here';
    const start = text.indexOf('runCommand');
    const end = start + 'runCommand'.length;

    const res = applyMarkdownAction(text, 'code', start, end);
    expect(res.text).toBe('Execute `runCommand` here');
  });

  it('inserts markdown table template when no text is selected', () => {
    const text = '';
    const res = applyMarkdownAction(text, 'table', 0, 0);
    expect(res.text).toContain('| Colonne 1 | Colonne 2 | Statut |');
    expect(res.text).toContain('| :--- | :--- | :--- |');
  });
});
