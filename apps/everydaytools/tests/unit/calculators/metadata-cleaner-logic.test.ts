import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceDropzoneFormat,
  getFileTargetFormat,
  filterInspectionTags,
  computeTelemetryDetails,
  buildResultMetadataText,
  cleanImageMetadata,
  cleanPdfMetadata,
} from '@/lib/metadata-cleaner-logic';
import type { MetadataTag } from '@/lib/metadata-inspector';

describe('metadata-cleaner-logic', () => {
  describe('getSourceDropzoneFormat', () => {
    it('returns French format definition when isFr is true', () => {
      const fmt = getSourceDropzoneFormat(true);
      expect(fmt.name).toBe('Fichier');
      expect(fmt.subLabel).toBe('Photo, Image ou PDF');
      expect(fmt.extension).toBe('pdf');
      expect(fmt.icon).toBe('/icons/file.svg');
    });

    it('returns English format definition when isFr is false', () => {
      const fmt = getSourceDropzoneFormat(false);
      expect(fmt.name).toBe('File');
      expect(fmt.subLabel).toBe('Photo, Image or PDF');
    });
  });

  describe('getFileTargetFormat', () => {
    it('returns PDF target format for PDF files', () => {
      const file = new File([''], 'contract.pdf', { type: 'application/pdf' });
      const fmt = getFileTargetFormat(file, true);
      expect(fmt.name).toBe('PDF');
      expect(fmt.extension).toBe('pdf');
      expect(fmt.icon).toBe('/icons/pdf.svg');
      expect(fmt.subLabel).toBe('Document PDF Anonymisé');
    });

    it('returns Image target format for image files', () => {
      const file = new File([''], 'photo.jpg', { type: 'image/jpeg' });
      const fmt = getFileTargetFormat(file, false);
      expect(fmt.name).toBe('JPG');
      expect(fmt.extension).toBe('jpg');
      expect(fmt.icon).toBe('/icons/image.svg');
      expect(fmt.subLabel).toBe('Anonymized Image');
    });
  });

  describe('filterInspectionTags', () => {
    const tags: MetadataTag[] = [
      { key: 'make', label: 'Make', value: 'Apple', isSensitive: false },
      { key: 'gps', label: 'GPS Coordinates', value: '48.8566 N, 2.3522 E', isSensitive: true },
      { key: 'author', label: 'Author', value: 'John Doe', isSensitive: true },
    ];

    it('returns all tags when activeFilter is all', () => {
      expect(filterInspectionTags(tags, 'all')).toHaveLength(3);
    });

    it('returns only sensitive tags when activeFilter is sensitive', () => {
      const filtered = filterInspectionTags(tags, 'sensitive');
      expect(filtered).toHaveLength(2);
      expect(filtered.every((t) => t.isSensitive)).toBe(true);
    });
  });

  describe('computeTelemetryDetails', () => {
    it('returns empty string if file is null', () => {
      expect(computeTelemetryDetails(null, null, undefined)).toBe('');
    });

    it('prioritizes pixel dimensions if available', () => {
      const file = new File([''], 'img.png');
      expect(computeTelemetryDetails(file, { w: 1920, h: 1080 }, undefined)).toBe('1920 × 1080 px');
    });

    it('returns page count for documents without image dimensions', () => {
      const file = new File([''], 'doc.pdf');
      expect(computeTelemetryDetails(file, null, 1)).toBe('1 page');
      expect(computeTelemetryDetails(file, null, 4)).toBe('4 pages');
    });
  });

  describe('cleanPdfMetadata', () => {
    it('creates cleaned PDF blob and removes metadata', async () => {
      const { PDFDocument } = await import('pdf-lib');
      const doc = await PDFDocument.create();
      doc.addPage([100, 100]);
      doc.setTitle('Secret Document');
      doc.setAuthor('Secret Author');
      const pdfBytes = await doc.save();
      const file = new File([pdfBytes], 'test.pdf', { type: 'application/pdf' });

      const cleanedBlob = await cleanPdfMetadata(file);
      expect(cleanedBlob).toBeInstanceOf(Blob);
      expect(cleanedBlob.type).toBe('application/pdf');

      const arrayBuf = await cleanedBlob.arrayBuffer();
      const reloadedDoc = await PDFDocument.load(arrayBuf);
      expect(reloadedDoc.getTitle()).toBeFalsy();
      expect(reloadedDoc.getAuthor()).toBeFalsy();
    });
  });

  describe('cleanImageMetadata', () => {
    let origImage: typeof Image;
    let origCreateObjectURL: typeof URL.createObjectURL;
    let origRevokeObjectURL: typeof URL.revokeObjectURL;

    beforeEach(() => {
      vi.restoreAllMocks();
      origImage = globalThis.Image;
      origCreateObjectURL = URL.createObjectURL;
      origRevokeObjectURL = URL.revokeObjectURL;

      URL.createObjectURL = vi.fn(() => 'blob:mock-preview-url');
      URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      globalThis.Image = origImage;
      URL.createObjectURL = origCreateObjectURL;
      URL.revokeObjectURL = origRevokeObjectURL;
    });

    function setupCanvasMock(capturedMimes?: string[]) {
      class MockImage {
        naturalWidth = 800;
        naturalHeight = 600;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_v: string) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      }
      globalThis.Image = MockImage as unknown as typeof Image;

      const origCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: vi.fn(() => ({
              drawImage: vi.fn(),
            })),
            toBlob: (cb: (b: Blob | null) => void, mime?: string) => {
              if (capturedMimes && mime) capturedMimes.push(mime);
              cb(new Blob(['cleaned-canvas-bytes'], { type: mime || 'image/jpeg' }));
            },
          } as unknown as HTMLCanvasElement;
        }
        return origCreateElement(tagName);
      });
    }

    it('cleans image client-side via canvas without any network request', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      setupCanvasMock();

      const file = new File(['raw-image-bytes'], 'photo.jpg', { type: 'image/jpeg' });
      const result = await cleanImageMetadata(file, true);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(result).toBeInstanceOf(Blob);
      expect(result.type).toBe('image/jpeg');
    });

    it('preserves image/png mime type during canvas stripping', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const capturedMimes: string[] = [];
      setupCanvasMock(capturedMimes);

      const file = new File(['png-data'], 'screenshot.png', { type: 'image/png' });
      const result = await cleanImageMetadata(file, true);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(capturedMimes).toContain('image/png');
      expect(result.type).toBe('image/png');
    });

    it('preserves image/webp mime type during canvas stripping', async () => {
      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const capturedMimes: string[] = [];
      setupCanvasMock(capturedMimes);

      const file = new File(['webp-data'], 'graphic.webp', { type: 'image/webp' });
      const result = await cleanImageMetadata(file, false);

      expect(fetchSpy).not.toHaveBeenCalled();
      expect(capturedMimes).toContain('image/webp');
      expect(result.type).toBe('image/webp');
    });

    it('rejects with localized error when image reading fails', async () => {
      class FailingImage {
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_v: string) {
          setTimeout(() => this.onerror && this.onerror(), 0);
        }
      }
      globalThis.Image = FailingImage as unknown as typeof Image;

      const file = new File(['corrupt-data'], 'corrupt.jpg', { type: 'image/jpeg' });
      await expect(cleanImageMetadata(file, true)).rejects.toThrow("Erreur lors de la lecture de l'image");
      await expect(cleanImageMetadata(file, false)).rejects.toThrow("Error reading image");
      expect(URL.revokeObjectURL).toHaveBeenCalled();
    });

    it('rejects when canvas 2d context cannot be acquired', async () => {
      class MockImage {
        naturalWidth = 100;
        naturalHeight = 100;
        onload: (() => void) | null = null;
        set src(_v: string) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      }
      globalThis.Image = MockImage as unknown as typeof Image;

      const origCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: () => null,
          } as unknown as HTMLCanvasElement;
        }
        return origCreateElement(tagName);
      });

      const file = new File(['data'], 'test.png', { type: 'image/png' });
      await expect(cleanImageMetadata(file, true)).rejects.toThrow("Impossible de nettoyer l'image");
      await expect(cleanImageMetadata(file, false)).rejects.toThrow("Unable to clean image");
    });
  });

  describe('buildResultMetadataText', () => {
    it('formats metadata cleanup summary in French', () => {
      const summary = buildResultMetadataText(1000, 800, true);
      expect(summary).toContain('0 métadonnée résiduelle');
      expect(summary).toContain('800 B');
      expect(summary).toContain('(-200 B)');
    });

    it('formats metadata cleanup summary in English', () => {
      const summary = buildResultMetadataText(500, 500, false);
      expect(summary).toContain('0 remaining metadata');
      expect(summary).toContain('500 B');
      expect(summary).not.toContain('(-');
    });
  });
});

