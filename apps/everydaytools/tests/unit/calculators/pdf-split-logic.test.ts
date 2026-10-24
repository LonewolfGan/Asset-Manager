import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  formatPagesToRangeString,
  parseRangeStringToPages,
  selectOddPages,
  selectEvenPages,
  generateBatchSlices,
  splitPdfFile,
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
      expect(parseRangeStringToPages('1 , 4 - 6 , 8', 10)).toEqual([1, 4, 5, 6, 8]);
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

  describe('splitPdfFile (In-Browser TDD RED)', () => {
    async function createTestPdf(pageCount: number): Promise<File> {
      const doc = await PDFDocument.create();
      for (let i = 0; i < pageCount; i++) {
        doc.addPage([200, 200]);
      }
      const bytes = await doc.save();
      return new File([bytes], 'source.pdf', { type: 'application/pdf' });
    }

    it('extracts selected pages into a single PDF blob', async () => {
      const file = await createTestPdf(5);
      const res = await splitPdfFile(file, {
        mode: 'extract',
        selectedPages: [1, 3, 5],
        extractAsSinglePdf: true,
      });

      expect(res.isZip).toBe(false);
      expect(res.blob).toBeInstanceOf(Blob);
      expect(res.blob.type).toBe('application/pdf');

      const extractedDoc = await PDFDocument.load(await res.blob.arrayBuffer());
      expect(extractedDoc.getPageCount()).toBe(3);
    });

    it('splits into multiple parts as a ZIP archive when extractAsSinglePdf is false', async () => {
      const file = await createTestPdf(4);
      const res = await splitPdfFile(file, {
        mode: 'extract',
        selectedPages: [1, 2],
        extractAsSinglePdf: false,
      });

      expect(res.isZip).toBe(true);
      expect(res.blob).toBeInstanceOf(Blob);
      expect(res.segmentCount).toBe(2);
    });

    it('splits by tranches into a ZIP archive in split mode', async () => {
      const file = await createTestPdf(6);
      const res = await splitPdfFile(file, {
        mode: 'split',
        tranches: [
          { from: 1, to: 3 },
          { from: 4, to: 6 },
        ],
      });

      expect(res.isZip).toBe(true);
      expect(res.blob).toBeInstanceOf(Blob);
      expect(res.segmentCount).toBe(2);
    });
  });
});

