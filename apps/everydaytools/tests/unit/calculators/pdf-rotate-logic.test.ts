import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  rotatePageDeg,
  calculateModifiedPagesCount,
  applyRotationToPage,
  applyRotationToAll,
  applyRotationToSelected,
  togglePageSelection,
  rotatePdfFile,
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

  describe('rotatePdfFile (In-Browser TDD RED)', () => {
    async function createTestPdf(pageCount: number): Promise<File> {
      const doc = await PDFDocument.create();
      for (let i = 0; i < pageCount; i++) {
        doc.addPage([200, 200]);
      }
      const bytes = await doc.save();
      return new File([bytes], 'doc.pdf', { type: 'application/pdf' });
    }

    it('applies per-page rotations in-browser and returns valid Blob', async () => {
      const file = await createTestPdf(2);
      const blob = await rotatePdfFile(file, { 0: 90, 1: 180 });

      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');

      const rotatedDoc = await PDFDocument.load(await blob.arrayBuffer());
      expect(rotatedDoc.getPage(0).getRotation().angle).toBe(90);
      expect(rotatedDoc.getPage(1).getRotation().angle).toBe(180);
    });

    it('applies uniform rotation to all pages', async () => {
      const file = await createTestPdf(2);
      const blob = await rotatePdfFile(file, 270);

      expect(blob).toBeInstanceOf(Blob);
      const rotatedDoc = await PDFDocument.load(await blob.arrayBuffer());
      expect(rotatedDoc.getPage(0).getRotation().angle).toBe(270);
      expect(rotatedDoc.getPage(1).getRotation().angle).toBe(270);
    });
  });
});

