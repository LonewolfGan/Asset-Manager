import { describe, it, expect } from 'vitest';
import {
  computeTextDiff,
  computeInlineDiff,
  generateUnifiedPatch,
} from '@/lib/diff-checker-logic';

describe('Text Diff Checker Logic', () => {
  it('detects completely identical texts', () => {
    const text = 'Line 1\nLine 2\nLine 3';
    const res = computeTextDiff(text, text);
    expect(res.stats.additions).toBe(0);
    expect(res.stats.deletions).toBe(0);
    expect(res.stats.modifications).toBe(0);
    expect(res.stats.unchanged).toBe(3);
    expect(res.stats.similarityPct).toBe(100);
  });

  it('correctly identifies single line additions without throwing off subsequent lines', () => {
    const textA = 'Line 1\nLine 2\nLine 3';
    const textB = 'Inserted\nLine 1\nLine 2\nLine 3';
    const res = computeTextDiff(textA, textB);
    expect(res.stats.additions).toBe(1);
    expect(res.stats.deletions).toBe(0);
    expect(res.stats.unchanged).toBe(3);
  });

  it('correctly identifies line deletions', () => {
    const textA = 'Line 1\nLine 2\nLine 3';
    const textB = 'Line 1\nLine 3';
    const res = computeTextDiff(textA, textB);
    expect(res.stats.deletions).toBe(1);
    expect(res.stats.additions).toBe(0);
    expect(res.stats.unchanged).toBe(2);
  });

  it('pairs modified lines and computes word-level inline differences', () => {
    const textA = 'The quick brown fox';
    const textB = 'The fast brown fox';
    const res = computeTextDiff(textA, textB);
    expect(res.stats.modifications).toBe(1);
    const modLine = res.lines[0];
    expect(modLine.type).toBe('modify');
    expect(modLine.tokensA).toBeDefined();
    expect(modLine.tokensB).toBeDefined();

    const deletedToken = modLine.tokensA?.find((t) => t.type === 'delete');
    const insertedToken = modLine.tokensB?.find((t) => t.type === 'insert');
    expect(deletedToken?.text).toBe('quick');
    expect(insertedToken?.text).toBe('fast');
  });

  it('honors ignoreWhitespace option', () => {
    const textA = 'Line with   spaces';
    const textB = 'Line with spaces';
    const resWithout = computeTextDiff(textA, textB, { ignoreWhitespace: false });
    expect(resWithout.stats.unchanged).toBe(0);

    const resWith = computeTextDiff(textA, textB, { ignoreWhitespace: true });
    expect(resWith.stats.unchanged).toBe(1);
  });

  it('honors ignoreCase option', () => {
    const textA = 'HELLO WORLD';
    const textB = 'hello world';
    const resWithout = computeTextDiff(textA, textB, { ignoreCase: false });
    expect(resWithout.stats.unchanged).toBe(0);

    const resWith = computeTextDiff(textA, textB, { ignoreCase: true });
    expect(resWith.stats.unchanged).toBe(1);
  });

  it('computes inline token diff correctly', () => {
    const { tokensA, tokensB } = computeInlineDiff('apple banana cherry', 'apple orange cherry');
    expect(tokensA.some((t) => t.text === 'banana' && t.type === 'delete')).toBe(true);
    expect(tokensB.some((t) => t.text === 'orange' && t.type === 'insert')).toBe(true);
    expect(tokensA.some((t) => t.text === 'apple' && t.type === 'equal')).toBe(true);
  });

  it('generates standard unified patch format (.diff)', () => {
    const textA = 'alpha\nbeta\ngamma';
    const textB = 'alpha\nbeta delta\ngamma';
    const res = computeTextDiff(textA, textB);
    const patch = generateUnifiedPatch(textA, textB, res.lines);
    expect(patch).toContain('--- original.txt');
    expect(patch).toContain('+++ modified.txt');
    expect(patch).toContain('@@ -1,3 +1,3 @@');
    expect(patch).toContain(' alpha');
    expect(patch).toContain('-beta');
    expect(patch).toContain('+beta delta');
    expect(patch).toContain(' gamma');
  });

  it('returns empty string when generating patch with empty texts', () => {
    expect(generateUnifiedPatch('', '', [])).toBe('');
  });
});
