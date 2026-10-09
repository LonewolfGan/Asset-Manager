import { describe, it, expect } from 'vitest';
import {
  calculateUpscaleDimensions,
  formatBytes,
  calculateMegapixels,
  calculatePixelGainPercent,
  getUpscaleOutputFilename,
} from '../../../src/lib/image-upscale-logic';

describe('image-upscale-logic', () => {
  it('calculates 2x and 4x upscaled dimensions accurately', () => {
    const dim2x = calculateUpscaleDimensions(800, 600, 2);
    expect(dim2x.targetW).toBe(1600);
    expect(dim2x.targetH).toBe(1200);

    const dim4x = calculateUpscaleDimensions(800, 600, 4);
    expect(dim4x.targetW).toBe(3200);
    expect(dim4x.targetH).toBe(2400);
  });

  it('caps at maxDimension limit (8000px)', () => {
    const capped = calculateUpscaleDimensions(3000, 2500, 4, 8000);
    expect(capped.targetW).toBe(8000);
    expect(capped.targetH).toBe(8000);
  });

  it('formats bytes accurately', () => {
    expect(formatBytes(2048)).toBe('2.0 KB');
    expect(formatBytes(10485760)).toBe('10.00 MB');
  });

  it('calculates megapixels accurately', () => {
    expect(calculateMegapixels(800, 600)).toBe('0.48 MP');
    expect(calculateMegapixels(3840, 2160)).toBe('8.3 MP');
    expect(calculateMegapixels(0, 0)).toBe('0 MP');
  });

  it('calculates pixel gain percentage', () => {
    expect(calculatePixelGainPercent(2)).toBe(300);
    expect(calculatePixelGainPercent(4)).toBe(1500);
  });

  it('formats output filename with scale suffix and original extension', () => {
    expect(getUpscaleOutputFilename('photo.jpg', 2)).toBe('photo_2x.jpg');
    expect(getUpscaleOutputFilename('render.png', 4)).toBe('render_4x.png');
    expect(getUpscaleOutputFilename('wallpaper.webp', 2)).toBe('wallpaper_2x.webp');
    expect(getUpscaleOutputFilename('noextension', 2)).toBe('noextension_2x.png');
  });
});
