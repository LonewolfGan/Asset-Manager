import { describe, it, expect } from 'vitest';
import {
  extForMime,
  getFormatInfo,
  canConvertClientSide,
  canvasToBlob,
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

  describe('canConvertClientSide', () => {
    it('returns true for WebP to PDF, JPG to WebP, and PNG to JPG under 15MB', () => {
      expect(canConvertClientSide('image/webp', 'application/pdf', 1024 * 1024)).toBe(true);
      expect(canConvertClientSide('image/jpeg', 'image/webp', 5 * 1024 * 1024)).toBe(true);
      expect(canConvertClientSide('image/png', 'image/jpeg', 14 * 1024 * 1024)).toBe(true);
    });

    it('returns false for files exceeding 15MB', () => {
      expect(canConvertClientSide('image/webp', 'application/pdf', 16 * 1024 * 1024)).toBe(false);
      expect(canConvertClientSide('image/png', 'image/webp', 15 * 1024 * 1024 + 1)).toBe(false);
    });

    it('returns false for HEIC and TIFF formats', () => {
      expect(canConvertClientSide('image/heic', 'application/pdf', 1024)).toBe(false);
      expect(canConvertClientSide('image/heif', 'image/jpeg', 1024)).toBe(false);
      expect(canConvertClientSide('image/tiff', 'image/png', 1024)).toBe(false);
      expect(canConvertClientSide('image/tif', 'image/webp', 1024)).toBe(false);
    });

    it('returns false for unsupported target formats', () => {
      expect(canConvertClientSide('image/jpeg', 'image/tiff', 1024)).toBe(false);
      expect(canConvertClientSide('image/png', 'image/avif', 1024)).toBe(false);
    });
  });

  describe('canvasToBlob with application/pdf', () => {
    it('produces a valid PDF Blob (%PDF header)', async () => {
      const mockCanvas = {
        width: 100,
        height: 100,
        toDataURL: (type: string) => {
          if (type === 'image/png') {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
          }
          return '';
        },
      } as unknown as HTMLCanvasElement;

      const blob = await canvasToBlob(mockCanvas, 'application/pdf');
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/pdf');

      const arrayBuffer = await blob.arrayBuffer();
      const header = new TextDecoder().decode(new Uint8Array(arrayBuffer.slice(0, 5)));
      expect(header).toBe('%PDF-');
    });
  });
});

