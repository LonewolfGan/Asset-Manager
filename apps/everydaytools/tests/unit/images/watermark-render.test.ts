import { describe, it, expect } from 'vitest';
import {
  getWatermarkedFilename,
  getFontCssString,
  isColorLight,
} from '../../../src/lib/watermark-render';

describe('watermark-render', () => {
  it('generates correct filenames for different output formats', () => {
    expect(getWatermarkedFilename('photo.png', 'jpeg')).toBe('photo_watermarked.jpg');
    expect(getWatermarkedFilename('document.photo.jpg', 'png')).toBe('document.photo_watermarked.png');
    expect(getWatermarkedFilename('artwork.webp', 'webp')).toBe('artwork_watermarked.webp');
  });

  it('computes css font string according to font catalog', () => {
    const interCss = getFontCssString('inter', 32);
    expect(interCss).toContain('32px');
    expect(interCss).toContain('Inter');

    const fallbackCss = getFontCssString('unknown-font', 48);
    expect(fallbackCss).toContain('48px');
  });

  it('determines if hex color is light or dark for shadow contrast', () => {
    expect(isColorLight('#ffffff')).toBe(true);
    expect(isColorLight('#fff')).toBe(true);
    expect(isColorLight('#000000')).toBe(false);
    expect(isColorLight('#18181b')).toBe(false);
  });
});
