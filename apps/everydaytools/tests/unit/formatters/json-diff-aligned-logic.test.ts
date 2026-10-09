import { describe, it, expect } from 'vitest';
import {
  computeSemanticDeltas,
  computeAlignedLineDiff,
  computeUnifiedDiff,
  DEFAULT_LEFT,
  DEFAULT_RIGHT,
} from '@/lib/json-diff-aligned-logic';

describe('JSON Diff Aligned & Semantic Logic', () => {
  it('computes semantic deltas between two objects (add, remove, modify)', () => {
    const objA = {
      name: 'Alpha',
      count: 10,
      tags: ['a', 'b'],
      nested: { keep: true, removed: 'bye' },
    };
    const objB = {
      name: 'Alpha',
      count: 20,
      tags: ['a', 'b', 'c'],
      nested: { keep: true, added: 'hello' },
    };

    const deltas = computeSemanticDeltas(objA, objB);
    const added = deltas.filter((d) => d.type === 'add');
    const removed = deltas.filter((d) => d.type === 'remove');
    const modified = deltas.filter((d) => d.type === 'modify');

    expect(added.map((d) => d.path)).toContain('nested.added');
    expect(added.map((d) => d.path)).toContain('tags[2]');
    expect(removed.map((d) => d.path)).toContain('nested.removed');
    expect(modified.map((d) => d.path)).toContain('count');
  });

  it('computes aligned lines for split view with same, add, remove, and modify', () => {
    const linesA = ['{', '  "title": "Old",', '  "stable": 1,', '}'];
    const linesB = ['{', '  "title": "New",', '  "stable": 1,', '  "extra": true,', '}'];

    const aligned = computeAlignedLineDiff(linesA, linesB);
    expect(aligned.length).toBeGreaterThan(0);
    expect(aligned[0].typeLeft).toBe('same');
    expect(aligned[0].typeRight).toBe('same');
    expect(aligned.some((l) => l.typeRight === 'add' || l.typeLeft === 'modify')).toBe(true);
  });

  it('computes unified diff lines from aligned line diff', () => {
    const linesA = ['line 1', 'line 2'];
    const linesB = ['line 1', 'line 2 modified'];

    const unified = computeUnifiedDiff(linesA, linesB);
    expect(unified.length).toBeGreaterThan(0);
    expect(unified[0].type).toBe('same');
    expect(unified.some((u) => u.type === 'remove' || u.type === 'add')).toBe(true);
  });

  it('provides default non-empty sample strings', () => {
    expect(DEFAULT_LEFT).toContain('EverydayTools');
    expect(DEFAULT_RIGHT).toContain('EverydayTools Hub');
  });
});
