import { describe, it, expect } from 'vitest';
import {
  getSourceImagesFormat,
  getTargetPdfFormat,
  filterValidImageFiles,
  validateImageFiles,
  buildCombinedPdfFilename,
} from '@/lib/image-to-pdf-logic';

describe('image-to-pdf-logic', () => {
  it('provides localized format metadata descriptors', () => {
    const src = getSourceImagesFormat();
    expect(src.name).toBe('Images');
    expect(src.color).toBe('#10B981');

    const targetFr = getTargetPdfFormat(true);
    expect(targetFr.name).toBe('PDF');
    expect(targetFr.subLabel).toBe('Document PDF Unique');

    const targetEn = getTargetPdfFormat(false);
    expect(targetEn.subLabel).toBe('Single PDF Document');
  });

  it('filters valid image extensions properly', () => {
    const files = [
      new File([''], 'photo.jpg', { type: 'image/jpeg' }),
      new File([''], 'graphic.PNG', { type: 'image/png' }),
      new File([''], 'banner.webp', { type: 'image/webp' }),
      new File([''], 'document.pdf', { type: 'application/pdf' }),
      new File([''], 'notes.txt', { type: 'text/plain' }),
    ];

    const { validFiles, invalidCount } = filterValidImageFiles(files);
    expect(validFiles.length).toBe(3);
    expect(invalidCount).toBe(2);
    expect(validFiles.map((f) => f.name)).toEqual(['photo.jpg', 'graphic.PNG', 'banner.webp']);
  });

  it('validates image files and catches empty lists or oversized total sizes', () => {
    expect(validateImageFiles([])).toEqual({ valid: false, error: 'no_files' });

    const smallFile = new File(['123'], 'pic.jpg', { type: 'image/jpeg' });
    expect(validateImageFiles([smallFile])).toEqual({ valid: true });

    const hugeFile = new File([''], 'huge.jpg', { type: 'image/jpeg' });
    Object.defineProperty(hugeFile, 'size', { value: 105 * 1024 * 1024 });
    expect(validateImageFiles([hugeFile])).toEqual({ valid: false, error: 'files_too_large' });
  });

  it('builds combined PDF filename for single and multiple files', () => {
    const file1 = new File([''], 'my_scan.png');
    expect(buildCombinedPdfFilename([file1], true)).toBe('my_scan.pdf');
    expect(buildCombinedPdfFilename([file1], false)).toBe('my_scan.pdf');

    const file2 = new File([''], 'page2.jpg');
    expect(buildCombinedPdfFilename([file1, file2], true)).toBe('images_combine.pdf');
    expect(buildCombinedPdfFilename([file1, file2], false)).toBe('combined_images.pdf');
  });
});
