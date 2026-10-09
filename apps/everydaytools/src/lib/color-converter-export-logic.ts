import type { RGB, HSL, HSV, CMYK } from '@/lib/color-converter-logic';

export interface ColorFormatRow {
  key: string;
  label: string;
  sub: string;
  value: string;
  onUpdate: (val: string) => void;
}

export interface BuildColorFormatRowsParams {
  hex: string;
  rgb: RGB;
  hsl: HSL;
  hsv: HSV;
  cmyk: CMYK;
  isFr: boolean;
  onHexUpdate: (val: string) => void;
  onRgbUpdate: (val: string) => void;
  onHslUpdate: (val: string) => void;
  onHsvUpdate: (val: string) => void;
  onCmykUpdate: (val: string) => void;
  onCssUpdate: (val: string) => void;
}

export function generateSpectrumStrip(
  tints: string[],
  activeHex: string,
  shades: string[]
): string[] {
  return [...[...tints].reverse(), activeHex, ...shades];
}

export function getRandomRgb(): RGB {
  return {
    r: Math.floor(Math.random() * 256),
    g: Math.floor(Math.random() * 256),
    b: Math.floor(Math.random() * 256),
  };
}

export function updateRecentColorsList(
  prev: string[],
  hexToAdd: string,
  maxItems = 8
): string[] {
  const upper = hexToAdd.toUpperCase();
  const filtered = prev.filter((c) => c.toUpperCase() !== upper);
  return [upper, ...filtered].slice(0, maxItems);
}

export function buildColorFormatRows({
  hex,
  rgb,
  hsl,
  hsv,
  cmyk,
  isFr,
  onHexUpdate,
  onRgbUpdate,
  onHslUpdate,
  onHsvUpdate,
  onCmykUpdate,
  onCssUpdate,
}: BuildColorFormatRowsParams): ColorFormatRow[] {
  return [
    {
      key: 'HEX',
      label: 'HEX',
      sub: 'WEB HEX',
      value: hex,
      onUpdate: onHexUpdate,
    },
    {
      key: 'RGB',
      label: 'RGB',
      sub: isFr ? '0 - 255 CANAUX' : '0 - 255 CHANNELS',
      value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      onUpdate: onRgbUpdate,
    },
    {
      key: 'HSL',
      label: 'HSL',
      sub: isFr ? 'TEINTE / SAT / LUM' : 'HUE / SAT / LIGHT',
      value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      onUpdate: onHslUpdate,
    },
    {
      key: 'HSV',
      label: 'HSV',
      sub: isFr ? 'TEINTE / SAT / VAL' : 'HUE / SAT / VALUE',
      value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
      onUpdate: onHsvUpdate,
    },
    {
      key: 'CMYK',
      label: 'CMYK',
      sub: 'QUADRI PRINT',
      value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`,
      onUpdate: onCmykUpdate,
    },
    {
      key: 'CSS',
      label: 'CSS VAR',
      sub: isFr ? 'CODE SOURCE' : 'SOURCE CODE',
      value: `--color: ${hex};`,
      onUpdate: onCssUpdate,
    },
  ];
}
