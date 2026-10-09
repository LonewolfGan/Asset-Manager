import { describe, it, expect } from 'vitest';
import {
  computeJsonSemanticDiff,
  compareJsonStrings,
  sortJsonKeys,
  formatValue,
} from '../../../src/lib/json-diff-logic';

describe('json-diff-logic', () => {
  it('detects identical objects with zero differences', () => {
    const objA = { name: 'EverydayTools', version: '1.0.0', active: true };
    const objB = { name: 'EverydayTools', version: '1.0.0', active: true };

    const result = computeJsonSemanticDiff(objA, objB);
    expect(result.hasChanges).toBe(false);
    expect(result.entries).toHaveLength(0);
    expect(result.stats.total).toBe(0);
  });

  it('detects added and removed properties in nested objects', () => {
    const objA = {
      user: { name: 'Alice', age: 30, role: 'admin' },
      theme: 'light',
    };
    const objB = {
      user: { name: 'Alice', age: 31, avatar: 'avatar.png' },
      theme: 'light',
      debug: true,
    };

    const result = computeJsonSemanticDiff(objA, objB);
    expect(result.hasChanges).toBe(true);

    const added = result.entries.filter((e) => e.type === 'added');
    const removed = result.entries.filter((e) => e.type === 'removed');
    const changed = result.entries.filter((e) => e.type === 'changed');

    expect(added.map((e) => e.path)).toContain('$.debug');
    expect(added.map((e) => e.path)).toContain('$.user.avatar');
    expect(removed.map((e) => e.path)).toContain('$.user.role');
    expect(changed.map((e) => e.path)).toContain('$.user.age');
  });

  it('detects array item additions, deletions, and item edits', () => {
    const objA = { tags: ['apple', 'banana', 'cherry'] };
    const objB = { tags: ['apple', 'blueberry', 'cherry', 'date'] };

    const result = computeJsonSemanticDiff(objA, objB);
    expect(result.hasChanges).toBe(true);

    const changed = result.entries.find((e) => e.path === '$.tags[1]');
    expect(changed?.type).toBe('changed');
    expect(changed?.oldValue).toBe('banana');
    expect(changed?.newValue).toBe('blueberry');

    const added = result.entries.find((e) => e.path === '$.tags[3]');
    expect(added?.type).toBe('added');
    expect(added?.newValue).toBe('date');
  });

  it('sortJsonKeys normalizes key order recursively', () => {
    const unordered = { z: 1, a: { y: 2, b: 3 }, m: [3, 2, 1] };
    const sorted = sortJsonKeys(unordered) as Record<string, unknown>;

    expect(Object.keys(sorted)).toEqual(['a', 'm', 'z']);
    expect(Object.keys(sorted.a as Record<string, unknown>)).toEqual(['b', 'y']);
  });

  it('compareJsonStrings produces semantic diff and Myers line diff', () => {
    const jsonA = JSON.stringify({ a: 1, b: 2 });
    const jsonB = JSON.stringify({ a: 1, b: 3, c: 4 });

    const res = compareJsonStrings(jsonA, jsonB);
    expect(res.semantic.hasChanges).toBe(true);
    expect(res.semantic.stats.added).toBe(1);
    expect(res.semantic.stats.changed).toBe(1);
    expect(res.textDiff.lines.length).toBeGreaterThan(0);
  });
});
