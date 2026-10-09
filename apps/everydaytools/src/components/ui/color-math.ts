export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export function hexToRgb(hex: string): RgbColor {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return { r: 128, g: 128, b: 128 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  return (
    '#' +
    [clampR, clampG, clampB]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  ).toUpperCase();
}

export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  r /= 255;
  g /= 255;
  b /= 255;
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

  return { h: h * 360, s, v };
}

export function hsvToRgb(h: number, s: number, v: number): RgbColor {
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor((h / 60) % 6);
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export const DEFAULT_COLOR_PICKER_PRESETS = [
  { label: 'Blanc pur', hex: '#FFFFFF' },
  { label: 'Gris clair', hex: '#F4F4F5' },
  { label: 'Gris moyen', hex: '#71717A' },
  { label: 'Noir dense', hex: '#18181B' },
  { label: 'Orange Accent', hex: '#FF6B35' },
  { label: 'Rouge alerte', hex: '#EF4444' },
  { label: 'Bleu cobalt', hex: '#2563EB' },
  { label: 'Vert émeraude', hex: '#16A34A' },
  { label: 'Ambre doré', hex: '#F59E0B' },
  { label: 'Violet royal', hex: '#7C3AED' },
];
