import { hslToRgb, rgbToHex, parseHex, rgbToHsl, HSL, RGB } from './color-converter-logic';

export type HarmonyMode =
  | 'trending'
  | 'monochromatic'
  | 'analogous'
  | 'complementary'
  | 'triadic'
  | 'pastel'
  | 'dark-ui';

export interface PaletteColor {
  id: string;
  hex: string;
  hsl: HSL;
  rgb: RGB;
  isLocked: boolean;
}

export function generateHarmonyPalette(
  mode: HarmonyMode,
  current: PaletteColor[] = [],
  count: number = 5
): PaletteColor[] {
  const baseHue = Math.floor(Math.random() * 360);
  const newHslList: HSL[] = [];

  switch (mode) {
    case 'monochromatic': {
      const step = 60 / Math.max(1, count - 1);
      for (let i = 0; i < count; i++) {
        newHslList.push({
          h: baseHue,
          s: Math.max(30, Math.min(95, 50 + (i % 2 === 0 ? 20 : -10))),
          l: Math.round(20 + i * step),
        });
      }
      break;
    }
    case 'analogous': {
      for (let i = 0; i < count; i++) {
        newHslList.push({
          h: (baseHue + (i - Math.floor(count / 2)) * 25 + 360) % 360,
          s: 70 + (i % 2) * 15,
          l: 45 + (i % 3) * 10,
        });
      }
      break;
    }
    case 'complementary': {
      const compHue = (baseHue + 180) % 360;
      newHslList.push({ h: baseHue, s: 80, l: 35 });
      newHslList.push({ h: baseHue, s: 75, l: 55 });
      newHslList.push({ h: (baseHue + 20) % 360, s: 65, l: 75 });
      newHslList.push({ h: compHue, s: 85, l: 45 });
      newHslList.push({ h: compHue, s: 70, l: 65 });
      break;
    }
    case 'triadic': {
      newHslList.push({ h: baseHue, s: 75, l: 50 });
      newHslList.push({ h: (baseHue + 120) % 360, s: 70, l: 55 });
      newHslList.push({ h: (baseHue + 240) % 360, s: 80, l: 45 });
      newHslList.push({ h: (baseHue + 15) % 360, s: 60, l: 70 });
      newHslList.push({ h: (baseHue + 135) % 360, s: 65, l: 40 });
      break;
    }
    case 'pastel': {
      for (let i = 0; i < count; i++) {
        newHslList.push({
          h: (baseHue + i * (360 / count)) % 360,
          s: 55 + (i % 2) * 15,
          l: 78 + (i % 3) * 5,
        });
      }
      break;
    }
    case 'dark-ui': {
      newHslList.push({ h: baseHue, s: 25, l: 10 }); // background
      newHslList.push({ h: baseHue, s: 20, l: 18 }); // surface
      newHslList.push({ h: (baseHue + 40) % 360, s: 85, l: 60 }); // accent primary
      newHslList.push({ h: (baseHue + 180) % 360, s: 75, l: 65 }); // accent secondary
      newHslList.push({ h: baseHue, s: 15, l: 92 }); // text
      break;
    }
    case 'trending':
    default: {
      newHslList.push({ h: baseHue, s: 75, l: 52 });
      newHslList.push({ h: (baseHue + 35) % 360, s: 68, l: 60 });
      newHslList.push({ h: (baseHue + 75) % 360, s: 82, l: 48 });
      newHslList.push({ h: (baseHue + 180) % 360, s: 70, l: 55 });
      newHslList.push({ h: (baseHue + 215) % 360, s: 60, l: 42 });
      break;
    }
  }

  return Array.from({ length: count }, (_, idx) => {
    const existing = current[idx];
    if (existing && existing.isLocked) {
      return existing;
    }
    const hsl = newHslList[idx % newHslList.length];
    const rgb = hslToRgb(hsl);
    const hex = rgbToHex(rgb);
    return {
      id: existing?.id || crypto.randomUUID(),
      hex,
      hsl,
      rgb,
      isLocked: false,
    };
  });
}

/**
 * Calculates WCAG relative luminance of a HEX color.
 */
export function getLuminance(hex: string): number {
  const rgb = parseHex(hex);
  if (!rgb) return 0.5;
  const a = [rgb.r, rgb.g, rgb.b].map((v) => {
    const val = v / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Returns accessible contrast text color ('#09090b' or '#ffffff') for a given background HEX.
 */
export function getContrastTextColor(hex: string): '#09090b' | '#ffffff' {
  return getLuminance(hex) > 0.38 ? '#09090b' : '#ffffff';
}

/**
 * Updates color from an edited HEX string.
 */
export function updateColorFromHex(hexInput: string, existing: PaletteColor): PaletteColor {
  const parsed = parseHex(hexInput);
  if (!parsed) return existing;
  const hex = rgbToHex(parsed);
  const hsl = rgbToHsl(parsed);
  return {
    ...existing,
    hex,
    hsl,
    rgb: parsed,
  };
}

/**
 * Adjusts color lightness by a delta percentage (-100 to +100).
 */
export function adjustColorLightness(color: PaletteColor, deltaPercent: number): PaletteColor {
  const newL = Math.max(5, Math.min(95, color.hsl.l + deltaPercent));
  const newHsl: HSL = { ...color.hsl, l: newL };
  const newRgb = hslToRgb(newHsl);
  const newHex = rgbToHex(newRgb);
  return {
    ...color,
    hex: newHex,
    hsl: newHsl,
    rgb: newRgb,
  };
}

/**
 * Returns an array of 7 stepped shades/tints for a given color.
 */
export function getColorShades(hex: string): string[] {
  const parsed = parseHex(hex);
  if (!parsed) return [hex];
  const hsl = rgbToHsl(parsed);
  const lightnessLevels = [94, 82, 68, 52, 38, 24, 12];
  return lightnessLevels.map((l) => {
    const shadeRgb = hslToRgb({ ...hsl, l });
    return rgbToHex(shadeRgb);
  });
}

/**
 * Provides a poetic, descriptive human-readable color name based on HSL attributes.
 */
export function describeColor(hex: string, isFr: boolean = true): string {
  const parsed = parseHex(hex);
  if (!parsed) return isFr ? 'Couleur' : 'Color';
  const { h, s, l } = rgbToHsl(parsed);

  if (s < 12) {
    if (l < 15) return isFr ? "Noir d'Encre" : 'Ink Black';
    if (l < 35) return isFr ? 'Anthracite' : 'Charcoal';
    if (l < 65) return isFr ? 'Gris Minéral' : 'Mineral Gray';
    if (l < 88) return isFr ? 'Gris Perle' : 'Pearl Gray';
    return isFr ? 'Blanc Albâtre' : 'Alabaster White';
  }

  const isLight = l > 75;
  const isDark = l < 25;

  if (h >= 350 || h < 15) {
    if (isLight) return isFr ? 'Rose Saumon' : 'Salmon Pink';
    if (isDark) return isFr ? 'Bordeaux Grenat' : 'Garnet Maroon';
    return isFr ? 'Rouge Carmin' : 'Carmine Red';
  }
  if (h < 35) {
    if (isLight) return isFr ? 'Pêche Pastel' : 'Pastel Peach';
    if (isDark) return isFr ? 'Terre Cuite' : 'Terracotta';
    return isFr ? 'Corail' : 'Coral';
  }
  if (h < 55) {
    if (isLight) return isFr ? 'Ambre Doux' : 'Soft Amber';
    if (isDark) return isFr ? 'Ocre Brun' : 'Brown Ochre';
    return isFr ? 'Ambre Doré' : 'Golden Amber';
  }
  if (h < 75) {
    if (isLight) return isFr ? 'Citron Givré' : 'Frosted Lemon';
    if (isDark) return isFr ? 'Olive Sombre' : 'Dark Olive';
    return isFr ? 'Jaune Solaire' : 'Solar Yellow';
  }
  if (h < 115) {
    if (isLight) return isFr ? 'Vert Menthe' : 'Mint Green';
    if (isDark) return isFr ? 'Vert Forêt' : 'Forest Green';
    return isFr ? 'Chartreuse' : 'Chartreuse';
  }
  if (h < 155) {
    if (isLight) return isFr ? 'Sauge Douce' : 'Soft Sage';
    if (isDark) return isFr ? 'Vert Impérial' : 'Imperial Green';
    return isFr ? 'Émeraude' : 'Emerald';
  }
  if (h < 190) {
    if (isLight) return isFr ? 'Turquoise Clair' : 'Light Turquoise';
    if (isDark) return isFr ? 'Bleu Pétrole' : 'Petrol Blue';
    return isFr ? 'Cyan Lagon' : 'Lagoon Cyan';
  }
  if (h < 225) {
    if (isLight) return isFr ? 'Azur Boréal' : 'Boreal Azure';
    if (isDark) return isFr ? 'Bleu Abyssal' : 'Abyssal Blue';
    return isFr ? 'Bleu Cobalt' : 'Cobalt Blue';
  }
  if (h < 255) {
    if (isLight) return isFr ? 'Lavande Douce' : 'Soft Lavender';
    if (isDark) return isFr ? 'Bleu Nuit' : 'Midnight Blue';
    return isFr ? 'Indigo' : 'Indigo';
  }
  if (h < 290) {
    if (isLight) return isFr ? 'Mauve Brume' : 'Misty Mauve';
    if (isDark) return isFr ? 'Aubergine' : 'Eggplant';
    return isFr ? 'Violet Iris' : 'Iris Violet';
  }
  if (h < 325) {
    if (isLight) return isFr ? 'Orchidée Pastel' : 'Pastel Orchid';
    if (isDark) return isFr ? 'Prune Intense' : 'Deep Plum';
    return isFr ? 'Magenta Vif' : 'Vivid Magenta';
  }
  if (isLight) return isFr ? 'Rose Pivoine' : 'Peony Pink';
  if (isDark) return isFr ? 'Rubis Profond' : 'Deep Ruby';
  return isFr ? 'Rose Écarlate' : 'Scarlet Rose';
}

/**
 * Calculates WCAG 2.1 contrast ratio between two HEX colors.
 */
export function getWcagContrastRatio(hex1: string, hex2: string = '#ffffff'): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  const ratio = (brighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 10) / 10;
}

export {
  exportCssVariables,
  exportTailwindColors,
  exportHexList,
  exportJson,
  exportSvg,
} from './color-palette-export';

