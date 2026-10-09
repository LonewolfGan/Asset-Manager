import { describe, it, expect } from 'vitest';
import {
  autoRepairJsonString,
  sortObjectKeysRecursively,
  parseJsonError,
} from '@/lib/json-repair-logic';

describe('JSON Repair and Advanced Parsing Logic', () => {
  describe('autoRepairJsonString', () => {
    it('removes single-line and multi-line JS comments', () => {
      const input = `// Commentaire initial\n{\n  /* bloc */ "key": "value" // fin\n}`;
      const { repaired, modified } = autoRepairJsonString(input);
      expect(modified).toBe(true);
      expect(JSON.parse(repaired)).toEqual({ key: 'value' });
    });

    it('converts Python literals (True, False, None) to JSON equivalents', () => {
      const input = `{"active": True, "archived": False, "deletedAt": None}`;
      const { repaired, modified } = autoRepairJsonString(input);
      expect(modified).toBe(true);
      expect(JSON.parse(repaired)).toEqual({
        active: true,
        archived: false,
        deletedAt: null,
      });
    });

    it('replaces single quotes with double quotes', () => {
      const input = `{'message': 'hello world'}`;
      const { repaired, modified } = autoRepairJsonString(input);
      expect(modified).toBe(true);
      expect(JSON.parse(repaired)).toEqual({ message: 'hello world' });
    });

    it('quotes unquoted object keys', () => {
      const input = `{ name: "Alice", age: 30 }`;
      const { repaired, modified } = autoRepairJsonString(input);
      expect(modified).toBe(true);
      expect(JSON.parse(repaired)).toEqual({ name: 'Alice', age: 30 });
    });

    it('removes trailing commas in objects and arrays', () => {
      const input = `{\n  "items": [1, 2, 3, ],\n  "ok": true,\n}`;
      const { repaired, modified } = autoRepairJsonString(input);
      expect(modified).toBe(true);
      expect(JSON.parse(repaired)).toEqual({ items: [1, 2, 3], ok: true });
    });

    it('returns modified=false when json is already clean', () => {
      const input = `{"clean": true}`;
      const { modified, repaired } = autoRepairJsonString(input);
      expect(modified).toBe(false);
      expect(repaired).toBe(input);
    });
  });

  describe('sortObjectKeysRecursively', () => {
    it('recursively sorts keys of nested objects and arrays of objects', () => {
      const input = {
        z: 1,
        a: {
          y: 'second',
          b: 'first',
        },
        arr: [
          { d: 4, c: 3 },
          { f: 6, e: 5 },
        ],
      };
      const sorted = sortObjectKeysRecursively(input);
      expect(Object.keys(sorted)).toEqual(['a', 'arr', 'z']);
      expect(Object.keys(sorted.a)).toEqual(['b', 'y']);
      expect(Object.keys(sorted.arr[0])).toEqual(['c', 'd']);
      expect(Object.keys(sorted.arr[1])).toEqual(['e', 'f']);
    });

    it('handles primitives and null values safely', () => {
      expect(sortObjectKeysRecursively(null)).toBeNull();
      expect(sortObjectKeysRecursively(42)).toBe(42);
      expect(sortObjectKeysRecursively('text')).toBe('text');
    });
  });

  describe('parseJsonError', () => {
    it('extracts line, column, and snippet from error message in French and English', () => {
      const badJson = '{\n  "name": "test",\n  invalid\n}';
      try {
        JSON.parse(badJson);
      } catch (err) {
        const errorInfoFr = parseJsonError(err as Error, badJson, true);
        expect(errorInfoFr.line).toBe(3);
        expect(errorInfoFr.snippet).toBe('invalid');

        const errorInfoEn = parseJsonError(err as Error, badJson, false);
        expect(errorInfoEn.line).toBe(3);
        expect(errorInfoEn.snippet).toBe('invalid');
      }
    });
  });
});
