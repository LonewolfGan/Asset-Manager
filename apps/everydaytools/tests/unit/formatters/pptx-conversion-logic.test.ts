import { describe, it, expect } from 'vitest';
import {
  getSourceFormat,
  getTargetFormats,
  validatePptxFile,
  buildSlideFilename,
  buildSlideZipFilename,
} from '@/lib/pptx-conversion-logic';

describe('pptx-conversion-logic', () => {
  it('returns valid source format metadata for FR and EN', () => {
    const frSource = getSourceFormat(true);
    expect(frSource.extension).toBe('pptx');
    expect(frSource.name).toBe('PowerPoint');
    expect(frSource.subLabel).toContain('Présentation');

    const enSource = getSourceFormat(false);
    expect(enSource.subLabel).toContain('Presentation');
  });

  it('returns target formats for png, jpg, and webp', () => {
    const targets = getTargetFormats(true);
    expect(targets.png.extension).toBe('zip');
    expect(targets.png.color).toBe('#0066FF');
    expect(targets.jpg.extension).toBe('zip');
    expect(targets.webp.extension).toBe('zip');
  });

  it('validates PPTX files and catches invalid formats or sizes', () => {
    const validFile = new File(['dummy content'], 'deck.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    expect(validatePptxFile(validFile)).toEqual({ valid: true });

    const legacyFile = new File(['dummy content'], 'slides.ppt', {
      type: 'application/vnd.ms-powerpoint',
    });
    expect(validatePptxFile(legacyFile)).toEqual({ valid: true });

    const invalidFile = new File(['dummy content'], 'doc.pdf', {
      type: 'application/pdf',
    });
    const invalidRes = validatePptxFile(invalidFile);
    expect(invalidRes.valid).toBe(false);
    expect(invalidRes.error).toBe('unsupported_format');

    const largeFile = new File([new ArrayBuffer(10)], 'huge.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    Object.defineProperty(largeFile, 'size', { value: 60 * 1024 * 1024 });
    const largeRes = validatePptxFile(largeFile);
    expect(largeRes.valid).toBe(false);
    expect(largeRes.error).toBe('file_too_large');
  });

  it('builds proper slide filenames and zip archive names', () => {
    expect(buildSlideFilename('pitch_deck', 1, 'png')).toBe('pitch_deck_slide_1.png');
    expect(buildSlideFilename('pitch_deck', 5, 'webp')).toBe('pitch_deck_slide_5.webp');
    expect(buildSlideZipFilename('pitch_deck', 'jpg')).toBe('pitch_deck_slides_jpg.zip');
  });
});
