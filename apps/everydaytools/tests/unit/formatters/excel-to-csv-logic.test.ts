import { describe, it, expect, vi } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  validateExcelFile,
  convertExcelToCsv,
} from '@/lib/excel-to-csv-logic';

describe('excel-to-csv-logic', () => {
  describe('Format descriptors', () => {
    it('returns correct source format metadata', () => {
      const source = getSourceFormat(true);
      expect(source.name).toBe('Excel');
      expect(source.extension).toBe('xlsx');
      expect(source.subLabel).toBe('Microsoft Excel');
    });

    it('returns correct target format metadata', () => {
      const frTarget = getTargetFormat(true);
      expect(frTarget.name).toBe('CSV');
      expect(frTarget.extension).toBe('csv');
      expect(frTarget.subLabel).toBe('Données délimitées');

      const enTarget = getTargetFormat(false);
      expect(enTarget.subLabel).toBe('Comma-Separated');
    });
  });

  describe('validateExcelFile', () => {
    it('accepts valid xlsx, xls, and ods files under 50MB', () => {
      const xlsxFile = new File([''], 'data.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      expect(validateExcelFile(xlsxFile, false)).toEqual({ isValid: true });

      const xlsFile = new File([''], 'data.xls', {
        type: 'application/vnd.ms-excel',
      });
      expect(validateExcelFile(xlsFile, true)).toEqual({ isValid: true });

      const odsFile = new File([''], 'data.ods', { type: '' });
      expect(validateExcelFile(odsFile, false)).toEqual({ isValid: true });
    });

    it('rejects unsupported file formats', () => {
      const pdfFile = new File(['%PDF'], 'table.pdf', { type: 'application/pdf' });
      const result = validateExcelFile(pdfFile, true);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Excel');
    });

    it('rejects files larger than 50MB', () => {
      const largeFile = new File([''], 'huge.xlsx', { type: 'application/vnd.ms-excel' });
      Object.defineProperty(largeFile, 'size', { value: 51 * 1024 * 1024 });
      const result = validateExcelFile(largeFile, false);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('50 MB');
    });
  });

  describe('convertExcelToCsv', () => {
    it('converts an excel workbook buffer to csv format', async () => {
      const XLSX = await import('xlsx');
      const ws = XLSX.utils.aoa_to_sheet([
        ['Name', 'Age'],
        ['Alice', 30],
        ['Bob', 25],
      ]);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employees');
      const wbBuf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

      const fakeFile = new File([wbBuf], 'company.xlsx', {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const res = await convertExcelToCsv({
        file: fakeFile,
        fileData: wbBuf,
        selectedSheet: 'Employees',
      });

      expect(res.filename).toBe('company.csv');
      expect(res.textOutput).toContain('Name,Age');
      expect(res.textOutput).toContain('Alice,30');
      expect(res.textOutput).toContain('Bob,25');
      expect(res.blob).toBeInstanceOf(Blob);
      expect(res.sizeAfter).toBeGreaterThan(0);
    });
  });
});
