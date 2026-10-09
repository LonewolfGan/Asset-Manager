import { describe, it, expect, vi } from 'vitest';
import {
  calculateCenteredFit,
  drawRoundRect,
  canvasToPngBytes,
  renderCompositedCanvas,
} from '../../../src/lib/favicon-canvas-renderer';

describe('favicon-canvas-renderer', () => {
  it('calculateCenteredFit calculates centered dimensions with padding correctly', () => {
    // 100x100 source, target 512, padPercent 10%
    // padPx = 512 * 0.1 = 51.2
    // innerSize = 512 - 102.4 = 409.6
    // scale = 409.6 / 100 = 4.096
    // drawW = 409.6, drawH = 409.6
    // dx = 51.2, dy = 51.2
    const fit = calculateCenteredFit(100, 100, 512, 10);
    expect(fit.drawW).toBeCloseTo(409.6, 1);
    expect(fit.drawH).toBeCloseTo(409.6, 1);
    expect(fit.dx).toBeCloseTo(51.2, 1);
    expect(fit.dy).toBeCloseTo(51.2, 1);
  });

  it('calculateCenteredFit handles non-square aspect ratios preserving proportion', () => {
    // 200x100 source (2:1), target 100, padPercent 0%
    // innerSize = 100
    // scale = min(100/200, 100/100) = 0.5
    // drawW = 100, drawH = 50
    // dx = 0, dy = (100 - 50) / 2 = 25
    const fit = calculateCenteredFit(200, 100, 100, 0);
    expect(fit.drawW).toBe(100);
    expect(fit.drawH).toBe(50);
    expect(fit.dx).toBe(0);
    expect(fit.dy).toBe(25);
  });

  it('drawRoundRect calls ctx.roundRect when available or falls back to quadratic curves', () => {
    const mockCtx = {
      roundRect: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawRoundRect(mockCtx, 0, 0, 100, 100, 10);
    expect(mockCtx.roundRect).toHaveBeenCalledWith(0, 0, 100, 100, 10);

    // Fallback test
    const mockCtxFallback = {
      roundRect: undefined,
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      quadraticCurveTo: vi.fn(),
    } as unknown as CanvasRenderingContext2D;

    drawRoundRect(mockCtxFallback, 0, 0, 100, 100, 10);
    expect(mockCtxFallback.moveTo).toHaveBeenCalled();
    expect(mockCtxFallback.lineTo).toHaveBeenCalled();
    expect(mockCtxFallback.quadraticCurveTo).toHaveBeenCalled();
  });

  it('canvasToPngBytes returns Uint8Array from canvas toBlob', async () => {
    const mockCanvas = {
      toBlob: vi.fn((cb: (blob: Blob | null) => void) => {
        const dummyBlob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
        cb(dummyBlob);
      }),
    } as unknown as HTMLCanvasElement;

    const bytes = await canvasToPngBytes(mockCanvas);
    expect(bytes).toBeInstanceOf(Uint8Array);
    expect(bytes.length).toBe(3);
    expect(Array.from(bytes)).toEqual([1, 2, 3]);
  });

  it('renderCompositedCanvas creates canvas with correct target dimensions', () => {
    const mockImg = {
      naturalWidth: 200,
      naturalHeight: 200,
    } as HTMLImageElement;

    const canvas = renderCompositedCanvas(mockImg, 10, '#ffffff', 'squircle', 128, false);
    expect(canvas.width).toBe(128);
    expect(canvas.height).toBe(128);
  });
});
