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
    beforeEach(() => {
      vi.restoreAllMocks();
    });

    it('successfully calls backend /api/metadata/clean when reachable', async () => {
      const mockBlob = new Blob(['cleaned-image-binary'], { type: 'image/jpeg' });
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob),
      } as unknown as Response);

      const file = new File(['raw-image'], 'photo.jpg', { type: 'image/jpeg' });
      const result = await cleanImageMetadata(file, true);

      expect(fetchSpy).toHaveBeenCalledTimes(1);
      const calledUrl = fetchSpy.mock.calls[0]?.[0] as string;
      expect(calledUrl).toContain('/api/metadata/clean');
      expect(result).toBe(mockBlob);
    });

    it('falls back to canvas when backend fetch fails', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(new Error('Network error'));

      // Mock URL.createObjectURL and URL.revokeObjectURL
      const origCreate = URL.createObjectURL;
      const origRevoke = URL.revokeObjectURL;
      URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      URL.revokeObjectURL = vi.fn();

      // Mock Image and canvas in jsdom
      const origImage = globalThis.Image;
      class MockImage {
        naturalWidth = 100;
        naturalHeight = 100;
        onload: (() => void) | null = null;
        onerror: (() => void) | null = null;
        set src(_v: string) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      }
      globalThis.Image = MockImage as unknown as typeof Image;

      const origCreateElement = document.createElement.bind(document);
      const mockBlob = new Blob(['canvas-fallback'], { type: 'image/png' });
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: () => ({
              drawImage: vi.fn(),
            }),
            toBlob: (cb: (b: Blob | null) => void, mime?: string) => {
              cb(mockBlob);
            },
          } as unknown as HTMLCanvasElement;
        }
        return origCreateElement(tagName);
      });

      const file = new File(['png-data'], 'screenshot.png', { type: 'image/png' });
      const result = await cleanImageMetadata(file, true);

      expect(result).toBe(mockBlob);

      // Restore
      URL.createObjectURL = origCreate;
      URL.revokeObjectURL = origRevoke;
      globalThis.Image = origImage;
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

