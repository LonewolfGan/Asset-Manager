import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateExcelFile,
  triggerDownload,
  openPdfPreview,
} from '@/lib/excel-to-pdf-logic';

describe('excel-to-pdf-logic', () => {
  describe('Format descriptors', () => {
    it('returns valid source format metadata', () => {
      const source = getSourceFormat(true);
      expect(source.name).toBe('Excel');
      expect(source.extension).toBe('xlsx');
      expect(source.icon).toBe('/icons/excel.svg');
      expect(source.color).toBe('#107C41');
      expect(source.subLabel).toBe('Microsoft Excel');
    });

    it('returns valid target format metadata', () => {
      const target = getTargetFormat(false);
      expect(target.name).toBe('PDF');
      expect(target.extension).toBe('pdf');
      expect(target.icon).toBe('/icons/pdf.svg');
      expect(target.color).toBe('#EC1C24');
      expect(target.subLabel).toBe('Adobe Acrobat');
    });
  });

  describe('validateExcelFile', () => {
    it('accepts valid excel extensions (.xlsx, .xls, .ods, .csv)', () => {
      const xlsxFile = new File(['content'], 'table.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      expect(validateExcelFile(xlsxFile, true)).toEqual({ isValid: true });

      const xlsFile = new File(['content'], 'table.xls', {
        type: 'application/vnd.ms-excel',
      });
      expect(validateExcelFile(xlsFile, false)).toEqual({ isValid: true });

      const odsFile = new File(['content'], 'table.ods', { type: '' });
      expect(validateExcelFile(odsFile, true)).toEqual({ isValid: true });

      const csvFile = new File(['a,b,c'], 'table.csv', { type: 'text/csv' });
      expect(validateExcelFile(csvFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported extensions with localized messages', () => {
      const txtFile = new File(['text'], 'readme.txt', { type: 'text/plain' });
      const frRes = validateExcelFile(txtFile, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Format non supporté');
      expect(frRes.errorDesc).toContain('Excel');

      const enRes = validateExcelFile(txtFile, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('Unsupported format');
    });

    it('rejects files larger than 50MB', () => {
      const bigFile = new File(['content'], 'large.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      Object.defineProperty(bigFile, 'size', { value: 55 * 1024 * 1024 });

      const frRes = validateExcelFile(bigFile, true);
      expect(frRes.isValid).toBe(false);
      expect(frRes.errorTitle).toBe('Fichier trop volumineux');
      expect(frRes.errorDesc).toContain('50 Mo');

      const enRes = validateExcelFile(bigFile, false);
      expect(enRes.isValid).toBe(false);
      expect(enRes.errorTitle).toBe('File too large');
      expect(enRes.errorDesc).toContain('50 MB');
    });
  });

  describe('triggerDownload and openPdfPreview', () => {
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('creates object URL and simulates anchor click on download', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-pdf');
      const revokeObjectURLMock = vi.fn();
      globalThis.URL.createObjectURL = createObjectURLMock;
      globalThis.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildSpy = vi.spyOn(document.body, 'appendChild');
      const removeChildSpy = vi.spyOn(document.body, 'removeChild');

      const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      triggerDownload(blob, 'export.pdf');

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-pdf');
    });

    it('opens window with object URL on preview', () => {
      const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-preview');
      globalThis.URL.createObjectURL = createObjectURLMock;
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const blob = new Blob(['%PDF-1.4'], { type: 'application/pdf' });
      openPdfPreview(blob);

      expect(createObjectURLMock).toHaveBeenCalledWith(blob);
      expect(openSpy).toHaveBeenCalledWith('blob:mock-preview', '_blank');
    });
  });
});
