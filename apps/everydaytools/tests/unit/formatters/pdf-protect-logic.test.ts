import { describe, it, expect, vi } from 'vitest';
import {
  validatePdfFile,
  generateRandomPassword,
  getPasswordStrength,
  SOURCE_FORMAT,
  TARGET_FORMAT,
} from '@/lib/pdf-protect-logic';

describe('PDF Protect Logic (Phase RED -> GREEN)', () => {
  describe('validatePdfFile', () => {
    it('accepts valid PDF file', () => {
      const file = new File(['%PDF-1.4 mock content'], 'document.pdf', {
        type: 'application/pdf',
      });
      const res = validatePdfFile(file, false);
      expect(res.isValid).toBe(true);
      expect(res.error).toBeNull();
    });

    it('rejects non-PDF file format', () => {
      const file = new File(['text content'], 'notes.txt', {
        type: 'text/plain',
      });
      const resEn = validatePdfFile(file, false);
      expect(resEn.isValid).toBe(false);
      expect(resEn.error).toBe('Please select a valid PDF document.');

      const resFr = validatePdfFile(file, true);
      expect(resFr.isValid).toBe(false);
      expect(resFr.error).toBe('Veuillez sélectionner un document au format PDF valide.');
    });

    it('rejects PDF file exceeding 50MB', () => {
      const largeFile = new File([''], 'huge.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 55 * 1024 * 1024 });

      const resEn = validatePdfFile(largeFile, false);
      expect(resEn.isValid).toBe(false);
      expect(resEn.error).toContain('50 MB');

      const resFr = validatePdfFile(largeFile, true);
      expect(resFr.isValid).toBe(false);
      expect(resFr.error).toContain('50 Mo');
    });
  });

  describe('generateRandomPassword', () => {
    it('generates a random string of requested length using crypto', () => {
      const pwd = generateRandomPassword(14);
      expect(typeof pwd).toBe('string');
      expect(pwd.length).toBe(14);
    });

    it('generates non-empty string with default length 14', () => {
      const pwd = generateRandomPassword();
      expect(pwd.length).toBe(14);
    });
  });

  describe('getPasswordStrength', () => {
    it('returns null for empty password', () => {
      expect(getPasswordStrength('')).toBeNull();
    });

    it('evaluates weak password score correctly', () => {
      const res = getPasswordStrength('abc');
      expect(res).not.toBeNull();
      expect(res?.width).toBe('33%');
      expect(res?.color).toBe('bg-red-500');
    });

    it('evaluates medium password score correctly', () => {
      const res = getPasswordStrength('Password123');
      expect(res).not.toBeNull();
      expect(res?.width).toBe('66%');
      expect(res?.color).toBe('bg-amber-500');
    });

    it('evaluates strong password score correctly with custom labels', () => {
      const res = getPasswordStrength('P@ssw0rd!Long2026', {
        strong: 'Super Safe',
      });
      expect(res).not.toBeNull();
      expect(res?.width).toBe('100%');
      expect(res?.color).toBe('bg-emerald-500');
      expect(res?.label).toBe('Super Safe');
    });
  });

  describe('Formats definition', () => {
    it('exports proper SOURCE_FORMAT and TARGET_FORMAT', () => {
      expect(SOURCE_FORMAT.extension).toBe('pdf');
      expect(TARGET_FORMAT.extension).toBe('pdf');
      expect(TARGET_FORMAT.color).toBe('#FF6B35');
    });
  });
});
