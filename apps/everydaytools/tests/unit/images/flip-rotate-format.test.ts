import { describe, it, expect } from 'vitest';
import {
  calcManualRotationDelta,
  resolveDefaultOutputFormat,
  FORMAT_OPTIONS,
} from '@/lib/flip-rotate-format-logic';

describe('flip-rotate-format-logic', () => {
  describe('FORMAT_OPTIONS', () => {
    it('defines 3 valid image export options', () => {
      expect(FORMAT_OPTIONS).toHaveLength(3);
      expect(FORMAT_OPTIONS.map((o) => o.label)).toEqual(['PNG', 'JPEG', 'WebP']);
    });
  });

  describe('resolveDefaultOutputFormat', () => {
    it('returns JPEG for image/jpeg files', () => {
      expect(resolveDefaultOutputFormat('image/jpeg')).toBe('image/jpeg');
    });

    it('returns WebP for image/webp files', () => {
      expect(resolveDefaultOutputFormat('image/webp')).toBe('image/webp');
    });

    it('defaults to PNG for other image types', () => {
      expect(resolveDefaultOutputFormat('image/png')).toBe('image/png');
      expect(resolveDefaultOutputFormat('image/gif')).toBe('image/png');
    });
  });

  describe('calcManualRotationDelta', () => {
    it('calculates rotation with angle delta within [-180, 180]', () => {
      const res = calcManualRotationDelta(0, 0, 45, false);
      expect(res).toBe(45);
    });

    it('wraps angle exceeding 180 degrees', () => {
      const res = calcManualRotationDelta(170, 0, 30, false); // 170 + 30 = 200 -> -160
      expect(res).toBe(-160);
    });

    it('snaps to 15-degree steps when shift key is pressed', () => {
      const res = calcManualRotationDelta(0, 0, 43, true); // 43 -> 45
      expect(res).toBe(45);

      const res2 = calcManualRotationDelta(0, 0, 37, true); // 37 -> 30 or 45: 37/15=2.46 -> 30
      expect(res2).toBe(30);
    });
  });
});
