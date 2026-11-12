import { describe, it, expect } from 'vitest';
import {
  getReciprocalTool,
  getReciprocalPath,
  RECIPROCAL_TOOLS,
} from '@/lib/reciprocal-tools';

describe('Reciprocal Tools Registry & Mapping (TDD Phase)', () => {
  it('returns reciprocal tool info for known reciprocal pairs', () => {
    const csvToJsonMirror = getReciprocalTool('csv-to-json');
    expect(csvToJsonMirror).not.toBeNull();
    expect(csvToJsonMirror?.mirrorSlug).toBe('json-to-csv');

    const jsonToCsvMirror = getReciprocalTool('json-to-csv');
    expect(jsonToCsvMirror).not.toBeNull();
    expect(jsonToCsvMirror?.mirrorSlug).toBe('csv-to-json');

    const wordToPdfMirror = getReciprocalTool('word-to-pdf');
    expect(wordToPdfMirror?.mirrorSlug).toBe('pdf-to-word');

    const pdfToWordMirror = getReciprocalTool('pdf-to-word');
    expect(pdfToWordMirror?.mirrorSlug).toBe('word-to-pdf');
  });

  it('includes newly connected pairs in RECIPROCAL_TOOLS (Text/Word, PNG/SVG, AVIF, Image/PDF)', () => {
    // Text to Word <-> Word to Text
    expect(getReciprocalTool('txt-to-docx')?.mirrorSlug).toBe('word-to-text');
    expect(getReciprocalTool('word-to-text')?.mirrorSlug).toBe('txt-to-docx');

    // PNG to SVG <-> SVG to PNG
    expect(getReciprocalTool('png-to-svg')?.mirrorSlug).toBe('svg-to-png');
    expect(getReciprocalTool('svg-to-png')?.mirrorSlug).toBe('png-to-svg');

    // JPG to AVIF <-> AVIF to JPG
    expect(getReciprocalTool('jpg-to-avif')?.mirrorSlug).toBe('avif-to-jpg');
    expect(getReciprocalTool('avif-to-jpg')?.mirrorSlug).toBe('jpg-to-avif');

    // PNG to AVIF <-> AVIF to PNG
    expect(getReciprocalTool('png-to-avif')?.mirrorSlug).toBe('avif-to-png');
    expect(getReciprocalTool('avif-to-png')?.mirrorSlug).toBe('png-to-avif');

    // Canonical Image to PDF <-> PDF to Image
    expect(getReciprocalTool('image-to-pdf')?.mirrorSlug).toBe('pdf-to-image');
    expect(getReciprocalTool('pdf-to-image')?.mirrorSlug).toBe('image-to-pdf');

    // Format-specific Image to PDF variants pointing to PDF to Image
    expect(getReciprocalTool('png-to-pdf')?.mirrorSlug).toBe('pdf-to-image');
    expect(getReciprocalTool('jpg-to-pdf')?.mirrorSlug).toBe('pdf-to-image');
    expect(getReciprocalTool('webp-to-pdf')?.mirrorSlug).toBe('pdf-to-image');
    expect(getReciprocalTool('heic-to-pdf')?.mirrorSlug).toBe('pdf-to-image');
  });

  it('maintains perfect mathematical symmetry across all registered canonical reciprocal tools', () => {
    for (const [slug, info] of Object.entries(RECIPROCAL_TOOLS)) {
      if (info.unidirectional) continue;
      const mirror = RECIPROCAL_TOOLS[info.mirrorSlug!];
      expect(mirror, `Expected mirror for ${info.mirrorSlug} to exist`).toBeDefined();
      if (!info.isVariant) {
        expect(mirror.mirrorSlug, `Expected reciprocal symmetry for ${slug}`).toBe(slug);
      }
    }
  });

  it('correctly marks unidirectional conversion tools without deceptive mirror slugs', () => {
    expect(getReciprocalTool('heic-to-png')?.unidirectional).toBe(true);
    expect(getReciprocalTool('heic-to-png')?.mirrorSlug).toBeUndefined();
    expect(getReciprocalTool('pptx-to-images')?.unidirectional).toBe(true);
    expect(getReciprocalTool('pdf-to-pdfa')?.unidirectional).toBe(true);
  });

  it('returns null for one-way tools without reciprocal operations', () => {
    expect(getReciprocalTool('pdf-compress')).toBeNull();
    expect(getReciprocalTool('metadata-cleaner')).toBeNull();
    expect(getReciprocalTool('non-existent-tool')).toBeNull();
  });

  it('computes reciprocal path preserving language prefixes properly', () => {
    expect(getReciprocalPath('/csv-to-json', 'json-to-csv')).toBe('/json-to-csv');
    expect(getReciprocalPath('/fr/csv-to-json', 'json-to-csv')).toBe('/fr/json-to-csv');
    expect(getReciprocalPath('/en/word-to-pdf', 'pdf-to-word')).toBe('/en/pdf-to-word');
  });

  it('exposes sourceFormat on reciprocal tools', () => {
    expect(RECIPROCAL_TOOLS['csv-to-json']?.sourceFormat).toBe('csv');
    expect(RECIPROCAL_TOOLS['json-to-csv']?.sourceFormat).toBe('json');
    expect(RECIPROCAL_TOOLS['word-to-pdf']?.sourceFormat).toBe('word');
    expect(RECIPROCAL_TOOLS['pdf-to-word']?.sourceFormat).toBe('pdf');
    expect(RECIPROCAL_TOOLS['excel-to-pdf']?.sourceFormat).toBe('excel');
  });

  it('ensures every reciprocal tool defines a sourceFormat', () => {
    for (const [slug, info] of Object.entries(RECIPROCAL_TOOLS)) {
      expect(info.sourceFormat, `Missing sourceFormat for ${slug}`).toBeDefined();
    }
  });
});
