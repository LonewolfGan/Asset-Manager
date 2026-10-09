import { describe, it, expect } from 'vitest';
import {
  getSourceDropzoneFormat,
  getFileTargetFormat,
  filterInspectionTags,
  computeTelemetryDetails,
  buildResultMetadataText,
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
