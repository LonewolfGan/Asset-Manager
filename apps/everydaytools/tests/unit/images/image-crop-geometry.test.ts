import { describe, it, expect } from 'vitest';
import {
  computeResizedCrop,
  computeCreatedCrop,
  type HandleType,
} from '../../../src/lib/image-crop-geometry';
import type { CropRect } from '../../../src/lib/image-crop-logic';

describe('image-crop-geometry', () => {
  const origW = 800;
  const origH = 600;
  const baseCrop: CropRect = { x: 100, y: 100, w: 200, h: 200 };

  it('resizes freely with se handle', () => {
    const resized = computeResizedCrop(
      baseCrop,
      'se',
      { x: 350, y: 350 },
      origW,
      origH,
      null
    );
    expect(resized.x).toBe(100);
    expect(resized.y).toBe(100);
    expect(resized.w).toBe(250);
    expect(resized.h).toBe(250);
  });

  it('resizes freely with nw handle', () => {
    const resized = computeResizedCrop(
      baseCrop,
      'nw',
      { x: 50, y: 50 },
      origW,
      origH,
      null
    );
    expect(resized.x).toBe(50);
    expect(resized.y).toBe(50);
    expect(resized.w).toBe(250);
    expect(resized.h).toBe(250);
  });

  it('enforces minSize limit on resize', () => {
    const resized = computeResizedCrop(
      baseCrop,
      'se',
      { x: 105, y: 105 },
      origW,
      origH,
      null
    );
    expect(resized.w).toBeGreaterThanOrEqual(20);
    expect(resized.h).toBeGreaterThanOrEqual(20);
  });

  it('maintains aspect ratio with se handle', () => {
    const resized = computeResizedCrop(
      baseCrop,
      'se',
      { x: 400, y: 250 },
      origW,
      origH,
      16 / 9
    );
    expect(resized.x).toBe(100);
    expect(resized.y).toBe(100);
    expect(Math.abs(resized.w / resized.h - 16 / 9)).toBeLessThan(0.05);
  });

  it('clamps resizing to boundaries with aspect ratio', () => {
    const resized = computeResizedCrop(
      baseCrop,
      'se',
      { x: 1200, y: 900 },
      origW,
      origH,
      1
    );
    expect(resized.x + resized.w).toBeLessThanOrEqual(origW);
    expect(resized.y + resized.h).toBeLessThanOrEqual(origH);
  });

  it('creates a new crop box with ratio constraint', () => {
    const created = computeCreatedCrop(
      100,
      100,
      300,
      250,
      16 / 9,
      origW,
      origH
    );
    expect(created.x).toBe(100);
    expect(created.y).toBe(100);
    expect(Math.abs(created.w / created.h - 16 / 9)).toBeLessThan(0.05);
    expect(created.w).toBeGreaterThanOrEqual(20);
  });
});
