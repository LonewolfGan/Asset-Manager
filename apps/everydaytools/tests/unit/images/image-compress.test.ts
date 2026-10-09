import { describe, it, expect } from 'vitest';
import {
  formatBytes,
  calculateSavings,
  calculateTotalSavings,
  calculateAspectRatioDimensions,
  COMPRESSION_PRESETS,
} from '../../../src/lib/image-compress-logic';

describe('image-compress-logic', () => {
  describe('formatBytes', () => {
    it('formats bytes, kilobytes, and megabytes accurately', () => {
      expect(formatBytes(0)).toBe('0 B');
      expect(formatBytes(500)).toBe('500 B');
      expect(formatBytes(1024)).toBe('1.0 KB');
      expect(formatBytes(204800)).toBe('200.0 KB');
      expect(formatBytes(1572864)).toBe('1.50 MB');
    });

    it('handles negative or invalid numbers safely', () => {
      expect(formatBytes(-100)).toBe('0 B');
      expect(formatBytes(NaN)).toBe('0 B');
    });
  });

  describe('calculateSavings', () => {
    it('calculates savings percentage and formatted reduction correctly', () => {
      const res = calculateSavings(1000000, 400000);
      expect(res.savedBytes).toBe(600000);
      expect(res.percentage).toBe(60);
      expect(res.isReduced).toBe(true);
      expect(res.displayPercentage).toBe('-60%');
    });

    it('handles cases where compressed is larger or equal', () => {
      const res = calculateSavings(1000, 1100);
      expect(res.isReduced).toBe(false);
      expect(res.displayPercentage).toBe('+10%');
    });

    it('handles zero original size safely', () => {
      const res = calculateSavings(0, 100);
      expect(res.savedBytes).toBe(0);
      expect(res.displayPercentage).toBe('0%');
    });
  });

  describe('calculateTotalSavings', () => {
    it('aggregates multiple completed files', () => {
      const items = [
        { originalSize: 1000000, compressedSize: 400000, status: 'done' },
        { originalSize: 500000, compressedSize: 200000, status: 'done' },
        { originalSize: 200000, status: 'processing' },
      ];
      const totals = calculateTotalSavings(items);
      expect(totals.completedCount).toBe(2);
      expect(totals.totalOriginal).toBe(1500000);
      expect(totals.totalCompressed).toBe(600000);
      expect(totals.totalSaved).toBe(900000);
      expect(totals.savingsPercentage).toBe(60);
    });
  });

  describe('calculateAspectRatioDimensions', () => {
    it('scales proportionally with both maxW and maxH constraining', () => {
      const scaled = calculateAspectRatioDimensions(1920, 1080, 800, 600);
      expect(scaled.width).toBe(800);
      expect(scaled.height).toBe(450);
    });

    it('scales proportionally with only maxW', () => {
      const scaled = calculateAspectRatioDimensions(1000, 500, 500);
      expect(scaled.width).toBe(500);
      expect(scaled.height).toBe(250);
    });

    it('scales proportionally with only maxH', () => {
      const scaled = calculateAspectRatioDimensions(1000, 500, undefined, 200);
      expect(scaled.width).toBe(400);
      expect(scaled.height).toBe(200);
    });
  });

  describe('COMPRESSION_PRESETS', () => {
    it('defines essential presets with balanced, aggressive and lossless', () => {
      expect(COMPRESSION_PRESETS.length).toBeGreaterThanOrEqual(3);
      expect(COMPRESSION_PRESETS.some((p) => p.id === 'balanced')).toBe(true);
      expect(COMPRESSION_PRESETS.find((p) => p.id === 'balanced')?.quality).toBe(80);
    });
  });
});
