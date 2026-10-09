import { FONT_OPTIONS, getFontCssString } from './watermark-fonts';

export type NinePointPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type WatermarkMode = 'points' | 'tile';
export type OutputFormat = 'png' | 'jpeg' | 'webp';

export interface WatermarkConfig {
  text: string;
  fontSize: number;
  color: string;
  opacity: number;
  mode: WatermarkMode;
  positions: NinePointPosition[];
  rotation: number;
  fontId: string;
  hasShadow: boolean;
}

export { getFontCssString };

/** Helper to check if a hex color is perceived as light */
export function isColorLight(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16);
    const g = parseInt(clean[1] + clean[1], 16);
    const b = parseInt(clean[2] + clean[2], 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }
  if (clean.length === 6) {
    const r = parseInt(clean.slice(0, 2), 16);
    const g = parseInt(clean.slice(2, 4), 16);
    const b = parseInt(clean.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  }
  return true;
}

export function calculateWatermarkCoordinates(
  width: number,
  height: number,
  textW: number,
  textH: number,
  pos: NinePointPosition,
  padding: number = 20
): { x: number; y: number } {
  let x = padding;
  let y = padding + textH;

  switch (pos) {
    case 'top-left':
      x = padding;
      y = padding + textH;
      break;
    case 'top-center':
      x = (width - textW) / 2;
      y = padding + textH;
      break;
    case 'top-right':
      x = width - textW - padding;
      y = padding + textH;
      break;
    case 'center-left':
      x = padding;
      y = (height + textH) / 2;
      break;
    case 'center':
      x = (width - textW) / 2;
      y = (height + textH) / 2;
      break;
    case 'center-right':
      x = width - textW - padding;
      y = (height + textH) / 2;
      break;
    case 'bottom-left':
      x = padding;
      y = height - padding;
      break;
    case 'bottom-center':
      x = (width - textW) / 2;
      y = height - padding;
      break;
    case 'bottom-right':
    default:
      x = width - textW - padding;
      y = height - padding;
      break;
  }
  return { x: Math.round(x), y: Math.round(y) };
}

export function drawWatermarkOnContext(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: WatermarkConfig,
  scale: number = 1
): void {
  if (!config.text.trim()) return;

  ctx.save();

  const scaledFontSize = Math.max(10, Math.round(config.fontSize * scale));
  const fontOpt = FONT_OPTIONS.find((f) => f.id === config.fontId) || FONT_OPTIONS[0];
  const weight = fontOpt.weight || 'bold';
  ctx.font = `${weight} ${scaledFontSize}px ${fontOpt.fontFamily}`;

  // Color & Opacity
  ctx.globalAlpha = Math.max(0.05, Math.min(1, config.opacity / 100));
  ctx.fillStyle = config.color;

  // Shadow / Contrast outline
  if (config.hasShadow) {
    const isLightText = isColorLight(config.color);
    ctx.shadowColor = isLightText ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)';
    ctx.shadowBlur = Math.max(2, Math.round(4 * scale));
    ctx.shadowOffsetX = Math.max(1, Math.round(1.5 * scale));
    ctx.shadowOffsetY = Math.max(1, Math.round(1.5 * scale));
  } else {
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  }

  const metrics = ctx.measureText(config.text);
  const textW = metrics.width;
  const textH = scaledFontSize;
  const padding = Math.max(16, Math.round(Math.min(width, height) * 0.04));

  if (config.mode === 'tile') {
    // Mode Mosaïque / Trame Diagonale Antivol
    const angleRad = (config.rotation ?? 0) * (Math.PI / 180);
    const diagonal = Math.hypot(width, height);
    const stepX = textW + Math.max(60, Math.round(scaledFontSize * 2.5));
    const stepY = Math.max(80, Math.round(scaledFontSize * 3.5));

    ctx.translate(width / 2, height / 2);
    ctx.rotate(angleRad);

    const startX = -diagonal;
    const endX = diagonal;
    const startY = -diagonal;
    const endY = diagonal;

    let rowIndex = 0;
    for (let y = startY; y < endY; y += stepY) {
      const rowOffset = (rowIndex % 2) * (stepX / 2);
      for (let x = startX + rowOffset; x < endX; x += stepX) {
        ctx.fillText(config.text, x, y);
      }
      rowIndex++;
    }
  } else {
    // Mode Points Précis (Multi-sélection de points)
    const activePositions =
      config.positions && config.positions.length > 0
        ? config.positions
        : (['bottom-right'] as NinePointPosition[]);

    const angleRad = (config.rotation || 0) * (Math.PI / 180);

    for (const pos of activePositions) {
      const { x, y } = calculateWatermarkCoordinates(width, height, textW, textH, pos, padding);

      ctx.save();
      if (config.rotation !== 0) {
        const centerX = x + textW / 2;
        const centerY = y - textH / 2;
        ctx.translate(centerX, centerY);
        ctx.rotate(angleRad);
        ctx.fillText(config.text, -textW / 2, textH / 2);
      } else {
        ctx.fillText(config.text, x, y);
      }
      ctx.restore();
    }
  }

  ctx.restore();
}

/** Renders the image with watermark at full 100% native resolution to a Blob */
export async function renderWatermarkedBlob(
  file: File,
  config: WatermarkConfig,
  format: OutputFormat = 'png',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error('Impossible de créer le contexte canvas 2D'));
          return;
        }

        // Draw original full-res image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Draw watermark at 1.0 full scale
        drawWatermarkOnContext(ctx, canvas.width, canvas.height, config, 1.0);

        URL.revokeObjectURL(url);

        const mimeMap: Record<OutputFormat, string> = {
          png: 'image/png',
          jpeg: 'image/jpeg',
          webp: 'image/webp',
        };
        const targetMime = mimeMap[format] || 'image/png';

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Erreur lors de la génération du fichier image filigrané'));
            }
          },
          targetMime,
          quality
        );
      } catch (err) {
        URL.revokeObjectURL(url);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Impossible de charger l'image source"));
    };

    img.src = url;
  });
}

export function getWatermarkedFilename(originalName: string, format: OutputFormat): string {
  const baseName = originalName.replace(/\.[^.]+$/, '');
  const extMap: Record<OutputFormat, string> = {
    png: 'png',
    jpeg: 'jpg',
    webp: 'webp',
  };
  return `${baseName}_watermarked.${extMap[format] || 'png'}`;
}
