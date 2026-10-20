import { describe, it, expect } from 'vitest';
import { parseSvgDimensions, canConvertClientSide } from '@/lib/image-convert-logic';

describe('svg-convert-logic: parsing & client-side support', () => {
  describe('parseSvgDimensions', () => {
    it('extracts explicit numeric width and height without units', () => {
      const svg = '<svg width="1024" height="768" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%"/></svg>';
      const dims = parseSvgDimensions(svg);
      expect(dims).toEqual({ width: 1024, height: 768 });
    });

    it('extracts dimensions with explicit px units', () => {
      const svg = '<svg width="800px" height="600px" xmlns="http://www.w3.org/2000/svg"></svg>';
      const dims = parseSvgDimensions(svg);
      expect(dims).toEqual({ width: 800, height: 600 });
    });

    it('extracts dimensions with pt units (1pt = 1.333333px at 96 DPI)', () => {
      const svg = '<svg width="72pt" height="144pt" xmlns="http://www.w3.org/2000/svg"></svg>';
      const dims = parseSvgDimensions(svg);
      expect(dims.width).toBeCloseTo(96, 1);
      expect(dims.height).toBeCloseTo(192, 1);
    });

    it('extracts dimensions with cm units (1cm = 37.795px at 96 DPI)', () => {
      const svg = '<svg width="2.54cm" height="5.08cm" xmlns="http://www.w3.org/2000/svg"></svg>';
      const dims = parseSvgDimensions(svg);
      expect(dims.width).toBeCloseTo(96, 1);
      expect(dims.height).toBeCloseTo(192, 1);
    });

    it('extracts dimensions from viewBox="0 0 1024 768" when width/height are absent', () => {
      const svg = '<svg viewBox="0 0 1024 768" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10v10H0z"/></svg>';
      expect(parseSvgDimensions(svg)).toEqual({ width: 1024, height: 768 });
    });

    it('extracts dimensions from viewBox="0 0 800 600"', () => {
      const svg = '<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg"></svg>';
      expect(parseSvgDimensions(svg)).toEqual({ width: 800, height: 600 });
    });

    it('handles viewBox with negative min-x or min-y offsets correctly', () => {
      const svg = '<svg viewBox="-50 -50 400 300" xmlns="http://www.w3.org/2000/svg"></svg>';
      expect(parseSvgDimensions(svg)).toEqual({ width: 400, height: 300 });
    });

    it('handles comma-separated and irregularly spaced viewBox coordinates', () => {
      const svgComma = '<svg viewBox="0, 0, 1920, 1080" xmlns="http://www.w3.org/2000/svg"></svg>';
      expect(parseSvgDimensions(svgComma)).toEqual({ width: 1920, height: 1080 });

      const svgSpaces = '<svg viewBox="   0    0   1280    720   " xmlns="http://www.w3.org/2000/svg"></svg>';
      expect(parseSvgDimensions(svgSpaces)).toEqual({ width: 1280, height: 720 });
    });

    it('prioritizes explicit width/height over viewBox', () => {
      const svg = '<svg width="640" height="480" viewBox="0 0 1920 1080" xmlns="http://www.w3.org/2000/svg"></svg>';
      expect(parseSvgDimensions(svg)).toEqual({ width: 640, height: 480 });
    });

    it('falls back to viewBox when width or height are percentage strings', () => {
      const svg = '<svg width="100%" height="100%" viewBox="0 0 1200 900" xmlns="http://www.w3.org/2000/svg"></svg>';
      expect(parseSvgDimensions(svg)).toEqual({ width: 1200, height: 900 });
    });

    it('falls back to default dimensions (800x600) when neither width/height nor viewBox exist', () => {
      const svg = '<svg xmlns="http://www.w3.org/2000/svg"><circle cx="20" cy="20" r="10"/></svg>';
      expect(parseSvgDimensions(svg)).toEqual({ width: 800, height: 600 });
    });

    it('gracefully handles empty strings and malformed SVG content', () => {
      expect(parseSvgDimensions('')).toEqual({ width: 800, height: 600 });
      expect(parseSvgDimensions('invalid-svg')).toEqual({ width: 800, height: 600 });
    });
  });

  describe('canConvertClientSide for SVG to PNG', () => {
    it('returns true for image/svg+xml to image/png within size limit', () => {
      const result = canConvertClientSide('image/svg+xml', 'image/png', 1024);
      expect(result).toBe(true);
    });

    it('returns true for image/svg+xml to image/jpeg and image/webp', () => {
      expect(canConvertClientSide('image/svg+xml', 'image/jpeg', 2048)).toBe(true);
      expect(canConvertClientSide('image/svg+xml', 'image/webp', 4096)).toBe(true);
    });

    it('returns false for image/svg+xml when file exceeds 15MB MAX_CLIENT_SIZE', () => {
      const oversized = 16 * 1024 * 1024;
      expect(canConvertClientSide('image/svg+xml', 'image/png', oversized)).toBe(false);
    });

    it('returns false for image/svg+xml to image/gif because GIF is server-delegated', () => {
      expect(canConvertClientSide('image/svg+xml', 'image/gif', 1024)).toBe(false);
    });
  });
});
