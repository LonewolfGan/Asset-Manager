import { describe, it, expect } from 'vitest';
import {
  extForMime,
  getFormatInfo,
} from '@/lib/image-convert-logic';

describe('image-convert-logic pure helpers', () => {
  describe('extForMime', () => {
    it('maps standard image and document mime types to file extensions', () => {
      expect(extForMime('image/webp')).toBe('webp');
      expect(extForMime('image/jpeg')).toBe('jpg');
      expect(extForMime('image/png')).toBe('png');
      expect(extForMime('image/avif')).toBe('avif');
      expect(extForMime('image/gif')).toBe('gif');
      expect(extForMime('image/svg+xml')).toBe('svg');
      expect(extForMime('application/pdf')).toBe('pdf');
      expect(extForMime('unknown/mime')).toBe('img');
    });
  });

  describe('getFormatInfo', () => {
    it('returns structured ConversionFormat metadata for WEBP', () => {
      const fr = getFormatInfo('webp', 'WEBP', true);
      expect(fr.extension).toBe('webp');
      expect(fr.color).toBe('#009688');
      expect(fr.subLabel).toBe('Format Web Moderne');

      const en = getFormatInfo('image/webp', 'WEBP', false);
      expect(en.subLabel).toBe('Modern Web Format');
    });

    it('returns structured ConversionFormat metadata for PNG', () => {
      const fr = getFormatInfo('png', 'PNG', true);
      expect(fr.extension).toBe('png');
      expect(fr.color).toBe('#0066FF');
      expect(fr.subLabel).toBe('Format Sans Perte');
    });

    it('returns structured ConversionFormat metadata for JPG/JPEG', () => {
      const fr = getFormatInfo('image/jpeg', 'JPG', true);
      expect(fr.extension).toBe('jpg');
      expect(fr.color).toBe('#22A654');
      expect(fr.subLabel).toBe('Format Compressé');
    });

    it('returns structured ConversionFormat metadata for PDF', () => {
      const fr = getFormatInfo('application/pdf', 'PDF', true);
      expect(fr.extension).toBe('pdf');
      expect(fr.color).toBe('#EC1C24');
      expect(fr.subLabel).toBe('Document PDF');
    });

    it('handles fallback for custom or generic extensions', () => {
      const custom = getFormatInfo('xyz', 'XYZ', true);
      expect(custom.extension).toBe('xyz');
      expect(custom.name).toBe('XYZ');
      expect(custom.subLabel).toBe('Image');
    });
  });
});
