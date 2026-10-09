import { describe, it, expect } from 'vitest';
import {
  formatPagesToRangeString,
  parseRangeStringToPages,
  selectOddPages,
  selectEvenPages,
  generateBatchSlices,
} from '@/lib/pdf-split-logic';

describe('PDF Split Logic (TDD Phase RED)', () => {
  describe('formatPagesToRangeString', () => {
    it('formats single pages into comma-separated list', () => {
      expect(formatPagesToRangeString([1, 3, 5])).toBe('1, 3, 5');
    });

    it('formats consecutive pages into ranges', () => {
      expect(formatPagesToRangeString([1, 2, 3, 5, 6, 8])).toBe('1-3, 5-6, 8');
      expect(formatPagesToRangeString([1, 2, 3, 4, 5])).toBe('1-5');
    });

    it('handles empty input and duplicates gracefully', () => {
      expect(formatPagesToRangeString([])).toBe('');
      expect(formatPagesToRangeString([2, 2, 3, 1, 3])).toBe('1-3');
    });
  });

  describe('parseRangeStringToPages', () => {
    it('parses comma, space, and hyphen syntax correctly', () => {
      expect(parseRangeStringToPages('1-3, 5', 10)).toEqual([1, 2, 3, 5]);
      expect(parseRangeStringToPages('1, 2, 4-6', 10)).toEqual([1, 2, 4, 5, 6]);
      expect(parseRangeStringToPages('5-2', 10)).toEqual([2, 3, 4, 5]);
    });

    it('clamps parsed pages to maxPages range', () => {
      expect(parseRangeStringToPages('1-20', 5)).toEqual([1, 2, 3, 4, 5]);
      expect(parseRangeStringToPages('0, 10, 15', 8)).toEqual([]);
    });

    it('returns empty array for invalid input', () => {
      expect(parseRangeStringToPages('invalid text', 10)).toEqual([]);
      expect(parseRangeStringToPages('', 10)).toEqual([]);
    });
  });

  describe('Odd / Even Selection Helpers', () => {
    it('selects odd pages up to total', () => {
      expect(selectOddPages(5)).toEqual([1, 3, 5]);
      expect(selectOddPages(6)).toEqual([1, 3, 5]);
      expect(selectOddPages(0)).toEqual([]);
    });

    it('selects even pages up to total', () => {
      expect(selectEvenPages(5)).toEqual([2, 4]);
      expect(selectEvenPages(6)).toEqual([2, 4, 6]);
      expect(selectEvenPages(1)).toEqual([]);
    });
  });

  describe('generateBatchSlices', () => {
    it('generates uniform chunk tranches across total pages', () => {
      const slices = generateBatchSlices(7, 2);
      expect(slices.length).toBe(4);
      expect(slices[0]).toMatchObject({ from: 1, to: 2 });
      expect(slices[1]).toMatchObject({ from: 3, to: 4 });
      expect(slices[2]).toMatchObject({ from: 5, to: 6 });
      expect(slices[3]).toMatchObject({ from: 7, to: 7 });
    });

    it('handles chunk size larger than total pages', () => {
      const slices = generateBatchSlices(3, 5);
      expect(slices.length).toBe(1);
      expect(slices[0]).toMatchObject({ from: 1, to: 3 });
    });
  });
});
