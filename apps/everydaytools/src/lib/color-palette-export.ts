import { getContrastTextColor, type PaletteColor } from './color-palette-logic';

export function exportCssVariables(palette: PaletteColor[]): string {
  const lines = palette.map((c, i) => `  --color-${i + 1}: ${c.hex};`);
  return `:root {\n${lines.join('\n')}\n}`;
}

export function exportTailwindColors(palette: PaletteColor[]): string {
  const roles = ['primary', 'secondary', 'accent', 'neutral', 'surface'];
  const entries = palette.map((c, i) => `      '${roles[i] || `color-${i + 1}`}': '${c.hex}',`);
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${entries.join('\n')}\n      }\n    }\n  }\n};`;
}

export function exportHexList(palette: PaletteColor[]): string {
  return palette.map((c) => c.hex).join(', ');
}

export function exportJson(palette: PaletteColor[]): string {
  const data = palette.map((c, i) => ({
    name: `color-${i + 1}`,
    hex: c.hex,
    rgb: `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
    hsl: `hsl(${c.hsl.h}, ${c.hsl.s}%, ${c.hsl.l}%)`,
  }));
  return JSON.stringify(data, null, 2);
}

export function exportSvg(palette: PaletteColor[]): string {
  const swatchWidth = 120;
  const height = 180;
  const totalWidth = swatchWidth * palette.length;

  const rects = palette
    .map(
      (c, i) => `  <rect x="${i * swatchWidth}" y="0" width="${swatchWidth}" height="${height}" fill="${c.hex}" />
  <text x="${i * swatchWidth + 12}" y="${height - 20}" font-family="monospace" font-size="12" font-weight="bold" fill="${getContrastTextColor(c.hex)}">${c.hex}</text>`
    )
    .join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height}" width="${totalWidth}" height="${height}">\n${rects}\n</svg>`;
}
