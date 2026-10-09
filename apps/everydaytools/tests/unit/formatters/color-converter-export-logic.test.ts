import { describe, it, expect } from 'vitest';
import {
  generateSpectrumStrip,
  getRandomRgb,
  buildColorFormatRows,
  updateRecentColorsList,
} from '@/lib/color-converter-export-logic';

describe('color-converter-export-logic', () => {
  it('generates spectrum strip with reversed tints, active hex, and shades', () => {
    const tints = ['#3388ff', '#66aaff', '#99ccff'];
    const shades = ['#0044cc', '#003399', '#002266'];
    const activeHex = '#1a6bff';

    const strip = generateSpectrumStrip(tints, activeHex, shades);
    expect(strip).toEqual([
      '#99ccff',
      '#66aaff',
      '#3388ff',
      '#1a6bff',
      '#0044cc',
      '#003399',
      '#002266',
    ]);
  });

  it('generates random RGB within [0, 255] integer bounds', () => {
    for (let i = 0; i < 20; i++) {
      const rgb = getRandomRgb();
      expect(rgb.r).toBeGreaterThanOrEqual(0);
      expect(rgb.r).toBeLessThanOrEqual(255);
      expect(Number.isInteger(rgb.r)).toBe(true);

      expect(rgb.g).toBeGreaterThanOrEqual(0);
      expect(rgb.g).toBeLessThanOrEqual(255);
      expect(Number.isInteger(rgb.g)).toBe(true);

      expect(rgb.b).toBeGreaterThanOrEqual(0);
      expect(rgb.b).toBeLessThanOrEqual(255);
      expect(Number.isInteger(rgb.b)).toBe(true);
    }
  });

  it('manages recent colors list without duplicates and capped at max limit', () => {
    const initial = ['#1A6BFF', '#059669', '#DC2626'];
    const updated = updateRecentColorsList(initial, '#dc2626', 8);
    expect(updated[0]).toBe('#DC2626');
    expect(updated.length).toBe(3);

    const withNew = updateRecentColorsList(initial, '#FFFFFF', 3);
    expect(withNew).toEqual(['#FFFFFF', '#1A6BFF', '#059669']);
  });

  it('builds formatted color rows with expected keys and labels', () => {
    const rows = buildColorFormatRows({
      hex: '#1A6BFF',
      rgb: { r: 26, g: 107, b: 255 },
      hsl: { h: 219, s: 100, l: 55 },
      hsv: { h: 219, s: 90, v: 100 },
      cmyk: { c: 90, m: 58, y: 0, k: 0 },
      isFr: true,
      onHexUpdate: () => {},
      onRgbUpdate: () => {},
      onHslUpdate: () => {},
      onHsvUpdate: () => {},
      onCmykUpdate: () => {},
      onCssUpdate: () => {},
    });

    expect(rows.length).toBe(6);
    expect(rows.map((r) => r.key)).toEqual(['HEX', 'RGB', 'HSL', 'HSV', 'CMYK', 'CSS']);
    expect(rows.find((r) => r.key === 'RGB')?.value).toBe('rgb(26, 107, 255)');
    expect(rows.find((r) => r.key === 'CSS')?.value).toBe('--color: #1A6BFF;');
  });
});
