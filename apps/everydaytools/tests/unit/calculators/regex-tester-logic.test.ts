import { describe, it, expect } from 'vitest';
import {
  evaluateRegex,
  computeHighlightedChunks,
  getPresets,
  getFlagOptions,
  getCheatSheet,
} from '@/lib/regex-tester-logic';

describe('regex-tester-logic', () => {
  describe('evaluateRegex', () => {
    it('handles empty pattern gracefully', () => {
      const result = evaluateRegex('', 'g', 'Hello world', 'test');
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(0);
      expect(result.errorMsg).toBe('');
      expect(result.replacedText).toBe('Hello world');
    });

    it('extracts global matches correctly with position and length', () => {
      const text = 'cat, bat, mat, rat';
      const result = evaluateRegex('[cbm]at', 'g', text, 'dog');
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(3);
      expect(result.matches[0]).toEqual({
        index: 0,
        length: 3,
        value: 'cat',
        groups: [],
      });
      expect(result.matches[1]).toEqual({
        index: 5,
        length: 3,
        value: 'bat',
        groups: [],
      });
      expect(result.matches[2]).toEqual({
        index: 10,
        length: 3,
        value: 'mat',
        groups: [],
      });
      expect(result.replacedText).toBe('dog, dog, dog, rat');
    });

    it('handles non-global flags and capture groups', () => {
      const text = 'User: John Doe, Age: 30';
      const result = evaluateRegex('User: (\\w+) (\\w+)', '', text, 'Person: $2, $1');
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      expect(result.matches[0].value).toBe('User: John Doe');
      expect(result.matches[0].groups).toHaveLength(2);
      expect(result.matches[0].groups[0]).toEqual({ index: 1, value: 'John' });
      expect(result.matches[0].groups[1]).toEqual({ index: 2, value: 'Doe' });
      expect(result.replacedText).toBe('Person: Doe, John, Age: 30');
    });

    it('handles named capture groups', () => {
      const text = '2026-10-04';
      const result = evaluateRegex('(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})', 'g', text, '$<day>/$<month>/$<year>');
      expect(result.isValid).toBe(true);
      expect(result.matches).toHaveLength(1);
      const groups = result.matches[0].groups;
      expect(groups.find((g) => g.name === 'year')?.value).toBe('2026');
      expect(groups.find((g) => g.name === 'month')?.value).toBe('10');
      expect(groups.find((g) => g.name === 'day')?.value).toBe('04');
    });

    it('returns error when regex syntax is invalid', () => {
      const result = evaluateRegex('[a-z(', 'g', 'test', '');
      expect(result.isValid).toBe(false);
      expect(result.matches).toHaveLength(0);
      expect(result.errorMsg).toBeTruthy();
    });
  });

  describe('computeHighlightedChunks', () => {
    it('slices text into matched and non-matched chunks', () => {
      const text = 'foo 123 bar';
      const matches = [{ index: 4, length: 3, value: '123', groups: [] }];
      const chunks = computeHighlightedChunks(text, matches);
      expect(chunks).toEqual([
        { text: 'foo ', isMatch: false },
        { text: '123', isMatch: true, matchIndex: 1 },
        { text: ' bar', isMatch: false },
      ]);
    });

    it('returns single non-matched chunk when no matches exist', () => {
      const text = 'hello';
      const chunks = computeHighlightedChunks(text, []);
      expect(chunks).toEqual([{ text: 'hello', isMatch: false }]);
    });
  });

  describe('presets and helpers', () => {
    it('provides localized presets and flag options', () => {
      const presetsFr = getPresets(true);
      const presetsEn = getPresets(false);
      expect(presetsFr.length).toBeGreaterThan(0);
      expect(presetsEn.length).toBe(presetsFr.length);
      expect(presetsFr[0].name).not.toBe(presetsEn[0].name);

      const flagsFr = getFlagOptions(true);
      expect(flagsFr).toHaveLength(5);

      const cheatSheet = getCheatSheet(true);
      expect(cheatSheet.length).toBeGreaterThan(0);
    });
  });
});
