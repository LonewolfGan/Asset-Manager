import { describe, it, expect } from 'vitest';
import {
  exportCssVariables,
  exportTailwindColors,
  exportHexList,
  exportJson,
  exportSvg,
} from '../../../src/lib/color-palette-export';
import type { PaletteColor } from '../../../src/lib/color-palette-logic';

describe('color-palette-export', () => {
  const mockPalette: PaletteColor[] = [
    {
      id: '1',
      hex: '#FF6B35',
      rgb: { r: 255, g: 107, b: 53 },
      hsl: { h: 16, s: 100, l: 60 },
      isLocked: false,
    },
    {
      id: '2',
      hex: '#09090B',
      rgb: { r: 9, g: 9, b: 11 },
      hsl: { h: 240, s: 10, l: 4 },
      isLocked: true,
    },
  ];

  it('exportHexList joins all hex colors with comma and space', () => {
    expect(exportHexList(mockPalette)).toBe('#FF6B35, #09090B');
  });

  it('exportCssVariables generates valid CSS root block', () => {
    const css = exportCssVariables(mockPalette);
    expect(css).toContain(':root {');
    expect(css).toContain('  --color-1: #FF6B35;');
    expect(css).toContain('  --color-2: #09090B;');
  });

  it('exportTailwindColors generates Tailwind config extend object with semantic names', () => {
    const tw = exportTailwindColors(mockPalette);
    expect(tw).toContain("module.exports = {");
    expect(tw).toContain("'primary': '#FF6B35'");
    expect(tw).toContain("'secondary': '#09090B'");
  });

  it('exportJson generates structured JSON with rgb and hsl strings', () => {
    const jsonStr = exportJson(mockPalette);
    const parsed = JSON.parse(jsonStr);
    expect(parsed).toHaveLength(2);
    expect(parsed[0].hex).toBe('#FF6B35');
    expect(parsed[0].rgb).toBe('rgb(255, 107, 53)');
    expect(parsed[0].hsl).toBe('hsl(16, 100%, 60%)');
  });

  it('exportSvg generates an SVG banner with swatches and hex labels', () => {
    const svg = exportSvg(mockPalette);
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('fill="#FF6B35"');
    expect(svg).toContain('fill="#09090B"');
    expect(svg).toContain('#FF6B35</text>');
  });
});
