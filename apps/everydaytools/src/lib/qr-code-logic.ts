import QRCode from 'qrcode';

export type InputMode = 'url' | 'text' | 'wifi' | 'vcard';
export type ErrorLevel = 'L' | 'M' | 'Q' | 'H';
export type WifiEnc = 'WPA' | 'WEP' | 'nopass';
export type DotStyle = 'square' | 'dots' | 'rounded';
export type EyeStyle = 'square' | 'circle' | 'rounded';

export interface ColorPreset {
  name: string;
  nameEn: string;
  fg: string;
  bg: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  { name: 'Noir', nameEn: 'Black', fg: '#09090b', bg: '#ffffff' },
  { name: 'Inversé', nameEn: 'Inverted', fg: '#ffffff', bg: '#09090b' },
  { name: 'Studio', nameEn: 'Studio', fg: '#FF6B35', bg: '#ffffff' },
  { name: 'Nuit', nameEn: 'Midnight', fg: '#0f172a', bg: '#f8fafc' },
  { name: 'Forêt', nameEn: 'Forest', fg: '#064e3b', bg: '#f0fdf4' },
];

export function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace('#', '');
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  const num = parseInt(c, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function luminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  try {
    const [r1, g1, b1] = hexToRgb(hex1);
    const [r2, g2, b2] = hexToRgb(hex2);
    const l1 = luminance(r1, g1, b1);
    const l2 = luminance(r2, g2, b2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  } catch {
    return 21;
  }
}

export function getContrastAssessment(ratio: number, isFr: boolean) {
  if (ratio >= 7) {
    return {
      label: isFr ? 'Contraste optimal' : 'Optimal contrast',
      color: 'text-emerald-600 dark:text-emerald-400',
    };
  }
  if (ratio >= 4.5) {
    return {
      label: isFr ? 'Contraste acceptable' : 'Acceptable contrast',
      color: 'text-amber-600 dark:text-amber-400',
    };
  }
  return {
    label: isFr ? 'Contraste insuffisant' : 'Low contrast',
    color: 'text-red-500 dark:text-red-400',
  };
}

export interface QrPayloadParams {
  url: string;
  rawText: string;
  wifiSsid: string;
  wifiPass: string;
  wifiEnc: WifiEnc;
  vcardName: string;
  vcardOrg: string;
  vcardEmail: string;
  vcardPhone: string;
  vcardUrl: string;
}

export function buildQrPayload(mode: InputMode, params: QrPayloadParams): string {
  switch (mode) {
    case 'url':
      return params.url.trim();
    case 'text':
      return params.rawText.trim();
    case 'wifi': {
      const ssid = params.wifiSsid.trim();
      if (!ssid) return '';
      const enc = params.wifiEnc === 'nopass' ? 'nopass' : params.wifiEnc;
      return `WIFI:T:${enc};S:${ssid};P:${params.wifiPass};;`;
    }
    case 'vcard': {
      const lines = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        params.vcardName.trim() ? `FN:${params.vcardName.trim()}` : '',
        params.vcardOrg.trim() ? `ORG:${params.vcardOrg.trim()}` : '',
        params.vcardEmail.trim() ? `EMAIL:${params.vcardEmail.trim()}` : '',
        params.vcardPhone.trim() ? `TEL:${params.vcardPhone.trim()}` : '',
        params.vcardUrl.trim() ? `URL:${params.vcardUrl.trim()}` : '',
        'END:VCARD',
      ].filter(Boolean);
      return lines.length > 2 ? lines.join('\n') : '';
    }
  }
}

export function isPayloadEmpty(content: string, mode: InputMode): boolean {
  const trimmed = content.trim();
  if (!trimmed) return true;
  if (mode === 'url' && (trimmed === 'https://' || trimmed === 'http://')) return true;
  return false;
}

export function isCornerEye(r: number, c: number, moduleCount: number): boolean {
  if (r < 7 && c < 7) return true; // Top-Left
  if (r < 7 && c >= moduleCount - 7) return true; // Top-Right
  if (r >= moduleCount - 7 && c < 7) return true; // Bottom-Left
  return false;
}

export interface QrSvgOptions {
  content: string;
  errLevel: ErrorLevel;
  size: number;
  margin: number;
  fgColor: string;
  bgColor: string;
  dotStyle: DotStyle;
  eyeStyle: EyeStyle;
  logoUrl: string | null;
  logoScale: number;
}

export function generateQrSvgString(options: QrSvgOptions): string {
  const { content, errLevel, size, margin, fgColor, bgColor, dotStyle, eyeStyle, logoUrl, logoScale } = options;
  const qr = QRCode.create(content, { errorCorrectionLevel: errLevel });

  const moduleCount = qr.modules.size;
  const totalCells = moduleCount + margin * 2;
  const cellSize = size / totalCells;
  const offset = margin * cellSize;

  let centerModuleStart = -1;
  let centerModuleEnd = -1;
  if (logoUrl) {
    const center = (moduleCount - 1) / 2;
    const radiusModules = Math.floor((moduleCount * (logoScale / 100)) / 2) + 1;
    centerModuleStart = Math.max(0, Math.floor(center - radiusModules));
    centerModuleEnd = Math.min(moduleCount - 1, Math.ceil(center + radiusModules));
  }

  let shapes = '';

  for (let r = 0; r < moduleCount; r++) {
    for (let c = 0; c < moduleCount; c++) {
      if (logoUrl && r >= centerModuleStart && r <= centerModuleEnd && c >= centerModuleStart && c <= centerModuleEnd) {
        continue;
      }
      if (eyeStyle !== 'square' && isCornerEye(r, c, moduleCount)) {
        continue;
      }

      if (qr.modules.get(r, c)) {
        const x = offset + c * cellSize;
        const y = offset + r * cellSize;

        if (dotStyle === 'dots') {
          shapes += `<circle cx="${x + cellSize / 2}" cy="${y + cellSize / 2}" r="${cellSize * 0.44}" fill="${fgColor}"/>\n`;
        } else if (dotStyle === 'rounded') {
          shapes += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.35}" fill="${fgColor}"/>\n`;
        } else {
          shapes += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${fgColor}"/>\n`;
        }
      }
    }
  }

  if (eyeStyle !== 'square') {
    const eyePositions = [
      { r: 0, c: 0 },
      { r: 0, c: moduleCount - 7 },
      { r: moduleCount - 7, c: 0 },
    ];

    eyePositions.forEach(({ r, c }) => {
      const eyeX = offset + c * cellSize;
      const eyeY = offset + r * cellSize;
      const eyeW = 7 * cellSize;
      const eyeH = 7 * cellSize;
      const eyeCenterX = eyeX + eyeW / 2;
      const eyeCenterY = eyeY + eyeH / 2;

      if (eyeStyle === 'circle') {
        shapes += `<circle cx="${eyeCenterX}" cy="${eyeCenterY}" r="${2.5 * cellSize}" fill="none" stroke="${fgColor}" stroke-width="${cellSize}"/>\n`;
        shapes += `<circle cx="${eyeCenterX}" cy="${eyeCenterY}" r="${1.5 * cellSize}" fill="${fgColor}"/>\n`;
      } else if (eyeStyle === 'rounded') {
        const frameOffset = cellSize / 2;
        shapes += `<rect x="${eyeX + frameOffset}" y="${eyeY + frameOffset}" width="${6 * cellSize}" height="${6 * cellSize}" rx="${1.6 * cellSize}" fill="none" stroke="${fgColor}" stroke-width="${cellSize}"/>\n`;
        shapes += `<rect x="${eyeX + 2 * cellSize}" y="${eyeY + 2 * cellSize}" width="${3 * cellSize}" height="${3 * cellSize}" rx="${0.9 * cellSize}" fill="${fgColor}"/>\n`;
      }
    });
  }

  if (logoUrl) {
    const logoPixelSize = size * (logoScale / 100);
    const logoX = (size - logoPixelSize) / 2;
    const logoY = (size - logoPixelSize) / 2;
    const cushion = cellSize * 0.9;
    const badgeSize = logoPixelSize + 2 * cushion;
    const badgeX = logoX - cushion;
    const badgeY = logoY - cushion;
    const centerX = size / 2;
    const centerY = size / 2;
    if (eyeStyle === 'circle') {
      shapes += `<circle cx="${centerX}" cy="${centerY}" r="${badgeSize / 2}" fill="${bgColor}"/>\n`;
    } else if (eyeStyle === 'rounded') {
      const r = Math.min(14, badgeSize * 0.22);
      shapes += `<rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" rx="${r}" fill="${bgColor}"/>\n`;
    } else {
      shapes += `<rect x="${badgeX}" y="${badgeY}" width="${badgeSize}" height="${badgeSize}" fill="${bgColor}"/>\n`;
    }

    shapes += `<image href="${logoUrl}" x="${logoX}" y="${logoY}" width="${logoPixelSize}" height="${logoPixelSize}" preserveAspectRatio="xMidYMid meet"/>\n`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<rect width="100%" height="100%" fill="${bgColor}"/>
${shapes}</svg>`;
}
