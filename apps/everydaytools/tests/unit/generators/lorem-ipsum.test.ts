import { describe, it, expect } from 'vitest';
import {
  generateLoremText,
  generateLoremBlocks,
  generateSentence,
  generateParagraph,
  calculateLoremStats,
  clampLoremCount,
} from '../../../src/lib/lorem-ipsum-logic';

describe('lorem-ipsum-logic', () => {
  it('generates paragraphs starting with classic text when requested', () => {
    const text = generateLoremText({
      flavor: 'classic',
      unit: 'paragraphs',
      count: 2,
      startWithClassic: true,
    });
    expect(text).toContain('Lorem ipsum dolor sit amet');
    const paras = text.split('\n\n');
    expect(paras).toHaveLength(2);
  });

  it('generates HTML tags when wrapWithHtml is enabled', () => {
    const text = generateLoremText({
      flavor: 'classic',
      unit: 'paragraphs',
      count: 2,
      wrapWithHtml: true,
    });
    expect(text).toContain('<p>');
    expect(text).toContain('</p>');
  });

  it('generates list items in bullet or HTML format', () => {
    const bullets = generateLoremText({
      flavor: 'classic',
      unit: 'lists',
      count: 3,
      wrapWithHtml: false,
    });
    expect(bullets.split('\n')).toHaveLength(3);
    expect(bullets).toContain('• ');

    const htmlList = generateLoremText({
      flavor: 'tech',
      unit: 'lists',
      count: 3,
      wrapWithHtml: true,
    });
    expect(htmlList).toContain('<ul>');
    expect(htmlList).toContain('<li>');
  });

  it('supports tech flavor vocabulary', () => {
    const techText = generateLoremText({
      flavor: 'tech',
      unit: 'words',
      count: 10,
      startWithClassic: false,
    });
    expect(techText.split(' ')).toHaveLength(10);
  });

  it('generates discrete sentences in HTML and Markdown formats', () => {
    const htmlSentences = generateLoremText({
      flavor: 'classic',
      unit: 'sentences',
      count: 3,
      format: 'html',
    });
    const htmlMatches = htmlSentences.match(/<p>/g);
    expect(htmlMatches).toHaveLength(3);

    const mdSentences = generateLoremText({
      flavor: 'classic',
      unit: 'sentences',
      count: 3,
      format: 'markdown',
    });
    const mdBlocks = mdSentences.split('\n\n');
    expect(mdBlocks).toHaveLength(3);
  });

  it('generates valid JSON array of blocks', () => {
    const jsonOutput = generateLoremText({
      flavor: 'classic',
      unit: 'paragraphs',
      count: 3,
      format: 'json',
    });
    const parsed = JSON.parse(jsonOutput);
    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed).toHaveLength(3);
  });

  it('generates individual blocks via generateLoremBlocks', () => {
    const blocks = generateLoremBlocks({
      flavor: 'classic',
      unit: 'sentences',
      count: 4,
    });
    expect(blocks).toHaveLength(4);
    blocks.forEach((s) => expect(s.endsWith('.')).toBe(true));
  });

  it('calculates accurate word and character statistics', () => {
    const stats = calculateLoremStats('Lorem ipsum dolor sit amet.');
    expect(stats.words).toBe(5);
    expect(stats.chars).toBe(27);

    const emptyStats = calculateLoremStats('');
    expect(emptyStats.words).toBe(0);
    expect(emptyStats.chars).toBe(0);

    const bulletStats = calculateLoremStats('• Un\n• Deux\n• Trois');
    expect(bulletStats.words).toBe(3);
  });

  it('clamps unit counts according to unit limits', () => {
    expect(clampLoremCount(0, 'paragraphs')).toBe(1);
    expect(clampLoremCount(25, 'paragraphs')).toBe(20);
    expect(clampLoremCount(500, 'words')).toBe(300);
    expect(clampLoremCount(5, 'sentences')).toBe(5);
  });
});
