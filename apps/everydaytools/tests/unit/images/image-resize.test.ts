import { describe, it, expect } from 'vitest';
import {
  SOCIAL_PRESETS,
  calculateLockedDimensions,
  calculatePercentageDimensions,
  calculateGcd,
  getAspectRatioLabel,
  calculateVisualScaleFactor,
  validateImageFile,
  getStandardPresets,
  IMAGE_FORMAT,
} from '../../../src/lib/image-resize-logic';

describe('image-resize-logic', () => {
  it('defines comprehensive social media presets', () => {
    expect(SOCIAL_PRESETS.length).toBeGreaterThanOrEqual(8);
    expect(SOCIAL_PRESETS.some((p) => p.id === 'ig-square')).toBe(true);
    expect(SOCIAL_PRESETS.some((p) => p.id === 'yt-thumb')).toBe(true);
  });

  it('calculates locked dimensions correctly when width changes', () => {
    const res = calculateLockedDimensions('width', 1280, 1920, 1080);
    expect(res.width).toBe(1280);
    expect(res.height).toBe(720);
  });

  it('calculates locked dimensions correctly when height changes', () => {
    const res = calculateLockedDimensions('height', 540, 1920, 1080);
    expect(res.width).toBe(960);
    expect(res.height).toBe(540);
  });

  it('calculates percentage dimensions accurately', () => {
    const res = calculatePercentageDimensions(2000, 1000, 50);
    expect(res.width).toBe(1000);
    expect(res.height).toBe(500);
  });

  it('calculates greatest common divisor accurately', () => {
    expect(calculateGcd(1920, 1080)).toBe(120);
    expect(calculateGcd(1080, 1080)).toBe(1080);
    expect(calculateGcd(1200, 630)).toBe(30);
  });

  it('formats aspect ratio labels correctly', () => {
    expect(getAspectRatioLabel(1920, 1080)).toBe('16:9');
    expect(getAspectRatioLabel(1080, 1080)).toBe('1:1');
    expect(getAspectRatioLabel(1080, 1350)).toBe('4:5');
    expect(getAspectRatioLabel(1080, 1920)).toBe('9:16');
    expect(getAspectRatioLabel(0, 0)).toBe('—');
  });

  it('calculates visual scale factor smoothly within safe bounds', () => {
    expect(calculateVisualScaleFactor(1920, 1920)).toBe(1);
    // Reduction is bounded at minimum 0.45
    expect(calculateVisualScaleFactor(100, 1920)).toBeGreaterThanOrEqual(0.45);
    // Enlargement is bounded at maximum 1.12
    expect(calculateVisualScaleFactor(4000, 1920)).toBeLessThanOrEqual(1.12);
  });

  it('validates image files and sizes', () => {
    const validFile = new File(['fake-bytes'], 'test.png', { type: 'image/png' });
    expect(validateImageFile(validFile, true)).toBeNull();

    const textFile = new File(['text'], 'notes.txt', { type: 'text/plain' });
    expect(validateImageFile(textFile, true)).toContain('fichier image valide');
    expect(validateImageFile(textFile, false)).toContain('valid image file');
  });

  it('returns standard presets in both locales', () => {
    const frPresets = getStandardPresets(true);
    expect(frPresets.length).toBeGreaterThanOrEqual(8);
    expect(frPresets[0].category).toBe('Écran');

    const enPresets = getStandardPresets(false);
    expect(enPresets[0].category).toBe('Screen');
  });

  it('exposes IMAGE_FORMAT configuration', () => {
    expect(IMAGE_FORMAT.extension).toBe('jpg');
    expect(IMAGE_FORMAT.color).toBe('#FF6B35');
  });
});
