import { describe, it, expect } from 'vitest';
import {
  calculateWatermarkCoordinates,
  WATERMARK_TEXT_PRESETS,
} from '../../../src/lib/watermark-logic';

describe('watermark-logic', () => {
  it('defines essential watermark text presets', () => {
    expect(WATERMARK_TEXT_PRESETS.length).toBeGreaterThanOrEqual(4);
    expect(WATERMARK_TEXT_PRESETS).toContain('© Copyright');
    expect(WATERMARK_TEXT_PRESETS).toContain('CONFIDENTIEL');
  });

  it('calculates top-left coordinates with padding', () => {
    const coords = calculateWatermarkCoordinates(1000, 800, 200, 40, 'top-left', 20);
    expect(coords.x).toBe(20);
    expect(coords.y).toBe(60);
  });

  it('calculates center coordinates accurately', () => {
    const coords = calculateWatermarkCoordinates(1000, 800, 200, 40, 'center');
    expect(coords.x).toBe(400);
    expect(coords.y).toBe(420);
  });

  it('calculates bottom-right coordinates within canvas boundaries', () => {
    const coords = calculateWatermarkCoordinates(1000, 800, 200, 40, 'bottom-right', 20);
    expect(coords.x).toBe(780);
    expect(coords.y).toBe(780);
  });
});
