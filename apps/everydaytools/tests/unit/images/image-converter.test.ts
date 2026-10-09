import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_CONVERSION_FORMATS,
  getTargetFilename,
  formatBytes,
} from '../../../src/lib/image-converter-logic';

describe('image-converter-logic', () => {
  it('supports major image formats including webp, jpeg, png, avif and pdf', () => {
    expect(SUPPORTED_CONVERSION_FORMATS.length).toBeGreaterThanOrEqual(6);
    expect(SUPPORTED_CONVERSION_FORMATS.some((f) => f.id === 'webp')).toBe(true);
    expect(SUPPORTED_CONVERSION_FORMATS.some((f) => f.id === 'avif')).toBe(true);
    expect(SUPPORTED_CONVERSION_FORMATS.some((f) => f.id === 'pdf')).toBe(true);
  });

  it('correctly creates target filename with new extension', () => {
    expect(getTargetFilename('photo.png', 'jpg')).toBe('photo.jpg');
    expect(getTargetFilename('document.photo.heic', 'webp')).toBe('document.photo.webp');
  });

  it('formats bytes accurately', () => {
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(1048576)).toBe('1.00 MB');
  });
});
