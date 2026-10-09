import { describe, it, expect } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateWordFile,
  buildEpubFilename,
} from '@/lib/word-to-epub-logic';

describe('word-to-epub-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const frSource = getSourceFormat(true);
      expect(frSource.name).toBe('Word');
      expect(frSource.extension).toBe('docx');
      expect(frSource.subLabel).toBe('Format Word (.docx)');

      const enSource = getSourceFormat(false);
      expect(enSource.subLabel).toBe('Word Format (.docx)');
    });

    it('returns correct target format metadata', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('EPUB');
      expect(frTarget.extension).toBe('epub');
      expect(frTarget.subLabel).toBe('eBook universel');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Universal eBook');
    });
  });

  describe('validateWordFile', () => {
    it('accepts valid docx and doc files under 50MB', () => {
      const docxFile = new File(['PK'], 'manuscript.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      expect(validateWordFile(docxFile, false)).toEqual({ isValid: true });

      const docFile = new File(['DOC'], 'novel.doc', {
        type: 'application/msword',
      });
      expect(validateWordFile(docFile, true)).toEqual({ isValid: true });

      const nameOnlyFile = new File(['PK'], 'book.docx', { type: '' });
      expect(validateWordFile(nameOnlyFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'book.pdf', { type: 'application/pdf' });
      const result = validateWordFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Word (.docx ou .doc)');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.docx', {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validateWordFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });

  describe('buildEpubFilename', () => {
    it('replaces word extensions with epub', () => {
      expect(buildEpubFilename('novel.docx')).toBe('novel.epub');
      expect(buildEpubFilename('draft.doc')).toBe('draft.epub');
      expect(buildEpubFilename('my.story.docx')).toBe('my.story.epub');
    });
  });
});
