import { describe, it, expect } from 'vitest';
import {
  computeCanvasMetrics,
  getHitTarget,
} from '../../../src/lib/image-crop-canvas-renderer';
import type { CropRect } from '../../../src/lib/image-crop-logic';

describe('image-crop-canvas-renderer', () => {
  it('computes display dimensions and scale respecting stage constraints', () => {
    const metrics = computeCanvasMetrics(1920, 1080, 800, 540);
    expect(metrics).not.toBeNull();
    if (metrics) {
      expect(metrics.displayW).toBeLessThanOrEqual(800);
      expect(metrics.displayH).toBeLessThanOrEqual(540);
      expect(metrics.scale).toBeGreaterThan(0);
    }
  });

  it('detects corner handle hits accurately', () => {
    const crop: CropRect = { x: 100, y: 100, w: 200, h: 200 };
    const scale = 1;
    // Hit top-left corner
    const hitNW = getHitTarget(102, 102, crop, scale);
    expect(hitNW?.type).toBe('handle');
    if (hitNW?.type === 'handle') {
      expect(hitNW.handle).toBe('nw');
    }

    // Hit bottom-right corner
    const hitSE = getHitTarget(298, 298, crop, scale);
    expect(hitSE?.type).toBe('handle');
    if (hitSE?.type === 'handle') {
      expect(hitSE.handle).toBe('se');
    }
  });

  it('detects move hit inside crop box', () => {
    const crop: CropRect = { x: 100, y: 100, w: 200, h: 200 };
    const scale = 1;
    const hitMove = getHitTarget(200, 200, crop, scale);
    expect(hitMove?.type).toBe('move');
  });

  it('detects outside hit', () => {
    const crop: CropRect = { x: 100, y: 100, w: 200, h: 200 };
    const scale = 1;
    const hitOutside = getHitTarget(500, 500, crop, scale);
    expect(hitOutside?.type).toBe('outside');
  });
});
