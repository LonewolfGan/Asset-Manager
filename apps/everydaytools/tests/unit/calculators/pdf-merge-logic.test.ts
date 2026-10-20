import { describe, it, expect } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  moveItem,
  reorderItem,
  sortAZFiles,
  reverseFiles,
  sanitizeOutputFilename,
  mergePdfFiles,
  type StagedFile,
} from '@/lib/pdf-merge-logic';

describe('pdf-merge-logic (TDD Phase RED)', () => {
  const makeFile = (name: string, size = 1000): StagedFile => ({
    id: `id-${name}`,
    file: new File([''], name, { type: 'application/pdf' }),
  });

  describe('moveItem', () => {
    it('moves item to prev index within bounds', () => {
      const list = ['A', 'B', 'C'];
      const moved = moveItem(list, 1, 'prev');
      expect(moved).toEqual(['B', 'A', 'C']);
    });

    it('does not move item before 0', () => {
      const list = ['A', 'B', 'C'];
      const moved = moveItem(list, 0, 'prev');
      expect(moved).toEqual(['A', 'B', 'C']);
    });

    it('moves item to next index within bounds', () => {
      const list = ['A', 'B', 'C'];
      const moved = moveItem(list, 1, 'next');
      expect(moved).toEqual(['A', 'C', 'B']);
    });

    it('does not move item beyond length - 1', () => {
      const list = ['A', 'B', 'C'];
      const moved = moveItem(list, 2, 'next');
      expect(moved).toEqual(['A', 'B', 'C']);
    });
  });

  describe('reorderItem', () => {
    it('reorders item from source to target index', () => {
      const list = ['A', 'B', 'C', 'D'];
      const reordered = reorderItem(list, 0, 2);
      expect(reordered).toEqual(['B', 'C', 'A', 'D']);
    });

    it('returns unchanged list if source equals target', () => {
      const list = ['A', 'B'];
      expect(reorderItem(list, 1, 1)).toEqual(['A', 'B']);
    });
  });

  describe('sortAZFiles', () => {
    it('sorts files alphabetically with natural number collation', () => {
      const files = [
        makeFile('file10.pdf'),
        makeFile('file2.pdf'),
        makeFile('file1.pdf'),
        makeFile('file20.pdf'),
      ];
      const sorted = sortAZFiles(files);
      expect(sorted.map((f) => f.file.name)).toEqual([
        'file1.pdf',
        'file2.pdf',
        'file10.pdf',
        'file20.pdf',
      ]);
    });
  });

  describe('reverseFiles', () => {
    it('reverses the file order', () => {
      const files = [makeFile('A.pdf'), makeFile('B.pdf'), makeFile('C.pdf')];
      expect(reverseFiles(files).map((f) => f.file.name)).toEqual(['C.pdf', 'B.pdf', 'A.pdf']);
    });
  });

  describe('sanitizeOutputFilename', () => {
    it('appends .pdf if missing', () => {
      expect(sanitizeOutputFilename('mon_doc', 'fallback.pdf')).toBe('mon_doc.pdf');
    });

    it('preserves existing .pdf extension', () => {
      expect(sanitizeOutputFilename('document.pdf', 'fallback.pdf')).toBe('document.pdf');
    });

    it('returns fallback if empty', () => {
      expect(sanitizeOutputFilename('   ', 'default.pdf')).toBe('default.pdf');
    });
  });

  describe('mergePdfFiles (In-Browser TDD RED)', () => {
    it('throws an error if less than 2 files provided', async () => {
      await expect(mergePdfFiles([])).rejects.toThrow();
      const dummy = new File([''], 'one.pdf', { type: 'application/pdf' });
      await expect(mergePdfFiles([dummy])).rejects.toThrow();
    });

    it('merges 2 valid PDFs into a single valid PDF Blob', async () => {
      const doc1 = await PDFDocument.create();
      doc1.addPage([200, 200]);
      const bytes1 = await doc1.save();
      const file1 = new File([bytes1], 'doc1.pdf', { type: 'application/pdf' });

      const doc2 = await PDFDocument.create();
      doc2.addPage([300, 300]);
      doc2.addPage([300, 300]);
      const bytes2 = await doc2.save();
      const file2 = new File([bytes2], 'doc2.pdf', { type: 'application/pdf' });

      const mergedBlob = await mergePdfFiles([file1, file2]);
      expect(mergedBlob).toBeInstanceOf(Blob);
      expect(mergedBlob.type).toBe('application/pdf');

      const mergedDoc = await PDFDocument.load(await mergedBlob.arrayBuffer());
      expect(mergedDoc.getPageCount()).toBe(3);
    });
  });
});

