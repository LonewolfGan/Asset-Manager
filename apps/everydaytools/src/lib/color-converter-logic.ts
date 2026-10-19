export * from './color-spaces';
import {
  type RGB,
  type HSL,
  type HSV,
  type CMYK,
  hslToRgb,
  hsvToRgb,
  cmykToRgb,
} from './color-spaces';

export function parseHex(input: string): RGB | null {
  const clean = input.trim().replace(/^#/, '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return null;

  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }

  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

export function parseRgb(input: string): RGB | null {
  const match = input.match(
    /(?:rgba?\(?\s*)?(\d{1,3})\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/i
  );
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

export function parseHsl(input: string): HSL | null {
  const match = input.match(
    /(?:hsla?\(?\s*)?(\d{1,3})(?:deg)?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?/i
  );
  if (!match) return null;
  const h = parseInt(match[1], 10) % 360;
  const s = Math.min(100, parseInt(match[2], 10));
  const l = Math.min(100, parseInt(match[3], 10));
  return { h, s, l };
}

export function parseHsv(input: string): HSV | null {
  const match = input.match(
    /(?:hsva?\(?\s*)?(\d{1,3})(?:deg)?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?/i
  );
  if (!match) return null;
  const h = parseInt(match[1], 10) % 360;
  const s = Math.min(100, parseInt(match[2], 10));
  const v = Math.min(100, parseInt(match[3], 10));
  return { h, s, v };
}

export function parseCmyk(input: string): CMYK | null {
  const match = input.match(
    /(?:cmyk\(?\s*)?(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?/i
  );
  if (!match) return null;
  const c = Math.min(100, parseInt(match[1], 10));
  const m = Math.min(100, parseInt(match[2], 10));
  const y = Math.min(100, parseInt(match[3], 10));
  const k = Math.min(100, parseInt(match[4], 10));
  return { c, m, y, k };
}

export function parseAnyColor(input: string): RGB | null {
  let clean = input.trim();
  // Strip CSS variable / property prefix: e.g. "--color: #1A6BFF;" or "color: #1a6bff;"
  if (clean.includes(':')) {
    clean = clean.split(':')[1].replace(';', '').trim();
  }
  // Strip trailing semicolon
  clean = clean.replace(/;$/, '').trim();

  const lower = clean.toLowerCase();

  // 1. Explicit functional prefix disambiguation (prioritize matching prefix if present)
  if (lower.startsWith('cmyk')) {
    const cmykRes = parseCmyk(clean);
    if (cmykRes) return cmykToRgb(cmykRes);
  }
  if (lower.startsWith('hsv') || lower.startsWith('hsb')) {
    const hsvRes = parseHsv(clean);
    if (hsvRes) return hsvToRgb(hsvRes);
  }
  if (lower.startsWith('hsl')) {
    const hslRes = parseHsl(clean);
    if (hslRes) return hslToRgb(hslRes);
  }
  if (lower.startsWith('rgb')) {
    const rgbRes = parseRgb(clean);
    if (rgbRes) return rgbRes;
  }

  // 2. Generic fallback order
  // Try HEX
  const hexRes = parseHex(clean);
  if (hexRes) return hexRes;
  // Try RGB
  const rgbRes = parseRgb(clean);
  if (rgbRes) return rgbRes;
  // Try HSL
  const hslRes = parseHsl(clean);
  if (hslRes) return hslToRgb(hslRes);
  // Try HSV
  const hsvRes = parseHsv(clean);
  if (hsvRes) return hsvToRgb(hsvRes);
  // Try CMYK
  const cmykRes = parseCmyk(clean);
  if (cmykRes) return cmykToRgb(cmykRes);

  // Common CSS named colors
  const namedColors: Record<string, RGB> = {
    black: { r: 0, g: 0, b: 0 },
    white: { r: 255, g: 255, b: 255 },
    red: { r: 255, g: 0, b: 0 },
    green: { r: 0, g: 128, b: 0 },
    blue: { r: 0, g: 0, b: 255 },
    yellow: { r: 255, g: 255, b: 0 },
    cyan: { r: 0, g: 255, b: 255 },
    magenta: { r: 255, g: 0, b: 255 },
    gray: { r: 128, g: 128, b: 128 },
    grey: { r: 128, g: 128, b: 128 },
    orange: { r: 255, g: 165, b: 0 },
    purple: { r: 128, g: 0, b: 128 },
    pink: { r: 255, g: 192, b: 203 },
    teal: { r: 0, g: 128, b: 128 },
    navy: { r: 0, g: 0, b: 128 },
    coral: { r: 255, g: 127, b: 80 },
    tomato: { r: 255, g: 99, b: 71 },
    gold: { r: 255, g: 215, b: 0 },
    indigo: { r: 75, g: 0, b: 130 },
    violet: { r: 238, g: 130, b: 238 },
  };
  if (namedColors[lower]) return namedColors[lower];

  return null;
}
