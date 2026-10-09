import { describe, it, expect } from 'vitest';
import {
  moveItem,
  reorderItem,
  sortAZFiles,
  reverseFiles,
  sanitizeOutputFilename,
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
});
