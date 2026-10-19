import { describe, it, expect } from 'vitest';
import {
  parseHex,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  rgbToCmyk,
  getContrastRatio,
  generateTintsAndShades,
  generateHarmonies,
} from '../../../src/lib/color-converter-logic';

describe('color-converter-logic', () => {
  it('parses valid 3-digit and 6-digit hex strings', () => {
    expect(parseHex('#FFF')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseHex('000')).toEqual({ r: 0, g: 0, b: 0 });
    expect(parseHex('#1A6BFF')).toEqual({ r: 26, g: 107, b: 255 });
    expect(parseHex('invalid')).toBeNull();
  });

  it('converts RGB to HEX correctly', () => {
    expect(rgbToHex({ r: 255, g: 0, b: 0 })).toBe('#FF0000');
    expect(rgbToHex({ r: 26, g: 107, b: 255 })).toBe('#1A6BFF');
  });

  it('converts RGB to HSL and back with minimal rounding loss', () => {
    const hsl = rgbToHsl({ r: 255, g: 0, b: 0 });
    expect(hsl).toEqual({ h: 0, s: 100, l: 50 });
    const back = hslToRgb(hsl);
    expect(back).toEqual({ r: 255, g: 0, b: 0 });
  });

  it('converts RGB to CMYK accurately', () => {
    expect(rgbToCmyk({ r: 0, g: 0, b: 0 })).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    expect(rgbToCmyk({ r: 255, g: 255, b: 255 })).toEqual({ c: 0, m: 0, y: 0, k: 0 });
  });

  it('computes WCAG contrast ratio accurately (21:1 for black vs white)', () => {
    const ratio = getContrastRatio({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 });
    expect(ratio).toBeCloseTo(21, 0);
  });

  it('generates tints, shades and harmonies', () => {
    const { tints, shades } = generateTintsAndShades({ r: 26, g: 107, b: 255 }, 5);
    expect(tints.length).toBe(5);
    expect(shades.length).toBe(5);

    const harmonies = generateHarmonies({ h: 0, s: 100, l: 50 });
    expect(harmonies.complementary).toBe('#00FFFF');
  });

  it('disambiguates functional prefixes in parseAnyColor correctly', async () => {
    const { parseAnyColor, parseRgb } = await import('../../../src/lib/color-converter-logic');
    
    // RGB parsing without degree artifact
    expect(parseRgb('rgb(25, 50, 75)')).toEqual({ r: 25, g: 50, b: 75 });

    // Functional prefix routing
    const cmykResult = parseAnyColor('cmyk(0, 50, 100, 0)');
    expect(cmykResult).toEqual({ r: 255, g: 128, b: 0 });

    const hsvResult = parseAnyColor('hsv(0, 100, 100)');
    expect(hsvResult).toEqual({ r: 255, g: 0, b: 0 });

    const hslResult = parseAnyColor('hsl(120, 100%, 50%)');
    expect(hslResult).toEqual({ r: 0, g: 255, b: 0 });

    // CSS variable syntax
    const cssVarResult = parseAnyColor('--brand-color: #1A6BFF;');
    expect(cssVarResult).toEqual({ r: 26, g: 107, b: 255 });
  });
});
