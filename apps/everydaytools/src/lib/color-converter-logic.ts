export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}

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

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export function rgbToHsv(rgb: RGB): HSV {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
  };
}

export function rgbToCmyk(rgb: RGB): CMYK {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };

  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export function getLuminance(rgb: RGB): number {
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(rgb1: RGB, rgb2: RGB): number {
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function generateTintsAndShades(rgb: RGB, steps: number = 5): { tints: string[]; shades: string[] } {
  const tints: string[] = [];
  const shades: string[] = [];

  for (let i = 1; i <= steps; i++) {
    const factor = i / (steps + 1);
    // Tint = blend with white
    tints.push(
      rgbToHex({
        r: Math.round(rgb.r + (255 - rgb.r) * factor),
        g: Math.round(rgb.g + (255 - rgb.g) * factor),
        b: Math.round(rgb.b + (255 - rgb.b) * factor),
      })
    );
    // Shade = blend with black
    shades.push(
      rgbToHex({
        r: Math.round(rgb.r * (1 - factor)),
        g: Math.round(rgb.g * (1 - factor)),
        b: Math.round(rgb.b * (1 - factor)),
      })
    );
  }

  return { tints, shades };
}

export function generateHarmonies(hsl: HSL): {
  complementary: string;
  analogous: [string, string];
  triadic: [string, string];
} {
  const comp = hslToRgb({ ...hsl, h: (hsl.h + 180) % 360 });
  const ana1 = hslToRgb({ ...hsl, h: (hsl.h + 30) % 360 });
  const ana2 = hslToRgb({ ...hsl, h: (hsl.h + 330) % 360 });
  const tri1 = hslToRgb({ ...hsl, h: (hsl.h + 120) % 360 });
  const tri2 = hslToRgb({ ...hsl, h: (hsl.h + 240) % 360 });

  return {
    complementary: rgbToHex(comp),
    analogous: [rgbToHex(ana1), rgbToHex(ana2)],
    triadic: [rgbToHex(tri1), rgbToHex(tri2)],
  };
}

export function hsvToRgb(hsv: HSV): RGB {
  const h = (((hsv.h % 360) + 360) % 360) / 360;
  const s = Math.max(0, Math.min(100, hsv.s)) / 100;
  const v = Math.max(0, Math.min(100, hsv.v)) / 100;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  let r = 0, g = 0, b = 0;
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function cmykToRgb(cmyk: CMYK): RGB {
  const c = Math.max(0, Math.min(100, cmyk.c)) / 100;
  const m = Math.max(0, Math.min(100, cmyk.m)) / 100;
  const y = Math.max(0, Math.min(100, cmyk.y)) / 100;
  const k = Math.max(0, Math.min(100, cmyk.k)) / 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return {
    r: Math.max(0, Math.min(255, r)),
    g: Math.max(0, Math.min(255, g)),
    b: Math.max(0, Math.min(255, b)),
  };
}

export function parseRgb(input: string): RGB | null {
  const match = input.match(/(?:rgba?\(?\s*)?(\d{1,3})(?:deg)?\s*[, ]\s*(\d{1,3})\s*[, ]\s*(\d{1,3})/i);
  if (!match) return null;
  const r = parseInt(match[1], 10);
  const g = parseInt(match[2], 10);
  const b = parseInt(match[3], 10);
  if (r > 255 || g > 255 || b > 255) return null;
  return { r, g, b };
}

export function parseHsl(input: string): HSL | null {
  const match = input.match(/(?:hsla?\(?\s*)?(\d{1,3})(?:deg)?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?/i);
  if (!match) return null;
  const h = parseInt(match[1], 10) % 360;
  const s = Math.min(100, parseInt(match[2], 10));
  const l = Math.min(100, parseInt(match[3], 10));
  return { h, s, l };
}

export function parseHsv(input: string): HSV | null {
  const match = input.match(/(?:hsva?\(?\s*)?(\d{1,3})(?:deg)?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?/i);
  if (!match) return null;
  const h = parseInt(match[1], 10) % 360;
  const s = Math.min(100, parseInt(match[2], 10));
  const v = Math.min(100, parseInt(match[3], 10));
  return { h, s, v };
}

export function parseCmyk(input: string): CMYK | null {
  const match = input.match(/(?:cmyk\(?\s*)?(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?\s*[, ]\s*(\d{1,3})%?/i);
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
  const lower = clean.toLowerCase();
  if (namedColors[lower]) return namedColors[lower];

  return null;
}

