import { describe, it, expect } from 'vitest';
import {
  CROP_ASPECT_PRESETS,
  clampCropRect,
  getDefaultCropRect,
  adjustCropWithRatio,
  getAspectPresets,
  computeSwapOrientation,
  getAspectRatioLabel,
  centerCropRect,
  maximizeCropRect,
} from '../../../src/lib/image-crop-logic';

describe('image-crop-logic', () => {
  it('defines standard aspect ratio presets', () => {
    expect(CROP_ASPECT_PRESETS.length).toBeGreaterThanOrEqual(6);
    expect(CROP_ASPECT_PRESETS.some((p) => p.id === '1-1')).toBe(true);
    expect(CROP_ASPECT_PRESETS.some((p) => p.id === '16-9')).toBe(true);
    expect(CROP_ASPECT_PRESETS.some((p) => p.id === '9-16')).toBe(true);
  });

  it('provides localized aspect presets', () => {
    const fr = getAspectPresets(true);
    const en = getAspectPresets(false);
    expect(fr.find((p) => p.id === 'free')?.name).toBe('Libre');
    expect(en.find((p) => p.id === 'free')?.name).toBe('Free');
  });

  it('clamps crop rectangles within image boundary', () => {
    const clamped = clampCropRect({ x: -20, y: -30, w: 600, h: 500 }, 500, 400);
    expect(clamped.x).toBe(0);
    expect(clamped.y).toBe(0);
    expect(clamped.w).toBe(500);
    expect(clamped.h).toBe(400);
  });

  it('generates centered default crop rectangle adhering to ratio', () => {
    const squareCrop = getDefaultCropRect(1000, 800, 1);
    expect(squareCrop.w).toBe(squareCrop.h);
    expect(squareCrop.x).toBeGreaterThan(0);
    expect(squareCrop.y).toBeGreaterThan(0);
  });

  it('adjusts rectangle correctly when switching ratio', () => {
    const adjusted = adjustCropWithRatio({ x: 50, y: 50, w: 400, h: 400 }, 16 / 9, 800, 600);
    expect(Math.abs(adjusted.w / adjusted.h - 16 / 9)).toBeLessThan(0.05);
    expect(adjusted.x + adjusted.w).toBeLessThanOrEqual(800);
    expect(adjusted.y + adjusted.h).toBeLessThanOrEqual(600);
  });

  it('computes swapped orientation between portrait and landscape', () => {
    const swapped = computeSwapOrientation({ x: 50, y: 50, w: 400, h: 200 }, 2, 800, 600);
    expect(swapped).not.toBeNull();
    if (swapped) {
      expect(swapped.aspectRatio).toBeCloseTo(0.5);
      expect(swapped.crop.w).toBeLessThan(swapped.crop.h);
    }
  });

  it('returns aspect ratio labels properly', () => {
    expect(getAspectRatioLabel(1920, 1080)).toBe('16:9');
    expect(getAspectRatioLabel(1000, 1000)).toBe('1:1');
    expect(getAspectRatioLabel(0, 0)).toBe('—');
  });

  it('maximizes and centers crop properly', () => {
    const centered = centerCropRect({ x: 0, y: 0, w: 200, h: 200 }, 800, 600);
    expect(centered.x).toBe(300);
    expect(centered.y).toBe(200);

    const maxFree = maximizeCropRect(800, 600, null);
    expect(maxFree.w).toBe(800);
    expect(maxFree.h).toBe(600);
  });
});
