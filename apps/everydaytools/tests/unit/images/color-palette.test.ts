import { describe, it, expect } from 'vitest';
import {
  generateHarmonyPalette,
  exportCssVariables,
  exportTailwindColors,
  describeColor,
  getColorShades,
  getWcagContrastRatio,
} from '../../../src/lib/color-palette-logic';

describe('color-palette-logic', () => {
  it('generates 5 harmonious colors in trending mode', () => {
    const palette = generateHarmonyPalette('trending');
    expect(palette.length).toBe(5);
    palette.forEach((color) => {
      expect(color.hex).toMatch(/^#[0-9A-F]{6}$/i);
      expect(color.isLocked).toBe(false);
    });
  });

  it('preserves locked colors when regenerating', () => {
    const initial = generateHarmonyPalette('trending');
    initial[1].isLocked = true;
    const lockedHex = initial[1].hex;

    const next = generateHarmonyPalette('trending', initial);
    expect(next[1].hex).toBe(lockedHex);
    expect(next[1].isLocked).toBe(true);
  });

  it('exports valid CSS variables', () => {
    const palette = generateHarmonyPalette('trending');
    const css = exportCssVariables(palette);
    expect(css).toContain(':root {');
    expect(css).toContain('--color-1:');
    expect(css).toContain('--color-5:');
  });

  it('exports valid Tailwind colors config', () => {
    const palette = generateHarmonyPalette('trending');
    const tw = exportTailwindColors(palette);
    expect(tw).toContain('tailwind.config.js');
    expect(tw).toContain("'primary':");
  });

  it('describes colors accurately with human-readable French names', () => {
    expect(describeColor('#000000')).toBe("Noir d'Encre");
    expect(describeColor('#ffffff')).toBe('Blanc Albâtre');
    expect(describeColor('#2563eb')).toBe('Bleu Cobalt');
  });

  it('generates 7 stepped shades for a color', () => {
    const shades = getColorShades('#3b82f6');
    expect(shades.length).toBe(7);
    shades.forEach((s) => expect(s).toMatch(/^#[0-9A-F]{6}$/i));
  });

  it('calculates WCAG contrast ratio accurately', () => {
    const ratio = getWcagContrastRatio('#000000', '#ffffff');
    expect(ratio).toBeGreaterThan(20);
  });
});
