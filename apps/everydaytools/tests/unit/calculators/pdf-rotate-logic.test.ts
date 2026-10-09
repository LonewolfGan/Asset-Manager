import { describe, it, expect } from 'vitest';
import {
  rotatePageDeg,
  calculateModifiedPagesCount,
  applyRotationToPage,
  applyRotationToAll,
  applyRotationToSelected,
  togglePageSelection,
} from '@/lib/pdf-rotate-logic';

describe('pdf-rotate-logic (TDD Phase RED)', () => {
  describe('rotatePageDeg', () => {
    it('rotates by +90 degrees and wraps modulo 360', () => {
      expect(rotatePageDeg(0, 90)).toBe(90);
      expect(rotatePageDeg(90, 90)).toBe(180);
      expect(rotatePageDeg(270, 90)).toBe(0);
    });

    it('rotates by -90 degrees and handles negative wrap', () => {
      expect(rotatePageDeg(0, -90)).toBe(270);
      expect(rotatePageDeg(90, -90)).toBe(0);
    });
  });

  describe('calculateModifiedPagesCount', () => {
    it('returns count of pages with non-zero rotation modulo 360', () => {
      const rotations = { 0: 90, 1: 360, 2: 180, 3: 0 };
      expect(calculateModifiedPagesCount(rotations)).toBe(2);
    });
  });

  describe('applyRotationToPage', () => {
    it('applies rotation and deletes key if rotation becomes 0', () => {
      const initial = { 0: 90 };
      const after = applyRotationToPage(initial, 1, -90);
      expect(after[0]).toBeUndefined();
    });

    it('sets new rotation for 1-based pageNumber', () => {
      const initial = {};
      const after = applyRotationToPage(initial, 2, 90);
      expect(after[1]).toBe(90);
    });
  });

  describe('applyRotationToAll', () => {
    it('applies rotation delta to all pages', () => {
      const initial = { 0: 90 };
      const after = applyRotationToAll(initial, 3, 90);
      expect(after[0]).toBe(180);
      expect(after[1]).toBe(90);
      expect(after[2]).toBe(90);
    });
  });

  describe('applyRotationToSelected', () => {
    it('applies delta only to selected pages', () => {
      const initial = {};
      const after = applyRotationToSelected(initial, [1, 3], 90);
      expect(after[0]).toBe(90);
      expect(after[1]).toBeUndefined();
      expect(after[2]).toBe(90);
    });
  });

  describe('togglePageSelection', () => {
    it('adds unselected page and keeps sorted', () => {
      expect(togglePageSelection([1, 4], 2)).toEqual([1, 2, 4]);
    });

    it('removes already selected page', () => {
      expect(togglePageSelection([1, 2, 4], 2)).toEqual([1, 4]);
    });
  });
});
