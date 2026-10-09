import type { IconShape } from './favicon-logic';

export interface CenteredFitResult {
  scale: number;
  drawW: number;
  drawH: number;
  dx: number;
  dy: number;
}

export function calculateCenteredFit(
  naturalWidth: number,
  naturalHeight: number,
  targetSize: number,
  padPercent: number
): CenteredFitResult {
  const padPx = targetSize * (padPercent / 100);
  const innerSize = Math.max(1, targetSize - padPx * 2);
  const safeW = naturalWidth || 1;
  const safeH = naturalHeight || 1;
  const scale = Math.min(innerSize / safeW, innerSize / safeH);
  const drawW = safeW * scale;
  const drawH = safeH * scale;
  const dx = padPx + (innerSize - drawW) / 2;
  const dy = padPx + (innerSize - drawH) / 2;

  return { scale, drawW, drawH, dx, dy };
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
}

export async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        resolve(new Uint8Array());
        return;
      }
      blob.arrayBuffer().then((buf) => resolve(new Uint8Array(buf)));
    }, 'image/png');
  });
}

export function applySharpenFilter(ctx: CanvasRenderingContext2D, targetSize: number): void {
  try {
    const imgData = ctx.getImageData(0, 0, targetSize, targetSize);
    const d = imgData.data;
    const w = targetSize;
    const h = targetSize;
    const copy = new Uint8ClampedArray(d);
    const amount = targetSize <= 16 ? 0.35 : 0.2;

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        const idx = (y * w + x) * 4;
        if (copy[idx + 3] === 0) continue; // Skip transparent pixels

        for (let c = 0; c < 3; c++) {
          const center = copy[idx + c];
          const up = copy[((y - 1) * w + x) * 4 + c];
          const down = copy[((y + 1) * w + x) * 4 + c];
          const left = copy[(y * w + (x - 1)) * 4 + c];
          const right = copy[(y * w + (x + 1)) * 4 + c];
          const laplacian = 4 * center - up - down - left - right;
          d[idx + c] = Math.min(255, Math.max(0, center + laplacian * amount));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Ignore if canvas is tainted or context does not support getImageData in env
  }
}

export function renderCompositedCanvas(
  sourceImg: HTMLImageElement,
  padPercent: number,
  background: string,
  shape: IconShape,
  targetSize: number = 512,
  applySharpen: boolean = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = targetSize;
  canvas.height = targetSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Real Vector Clipping Mask
  ctx.save();
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(targetSize / 2, targetSize / 2, targetSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
  } else if (shape === 'squircle') {
    const r = targetSize * 0.22;
    drawRoundRect(ctx, 0, 0, targetSize, targetSize, r);
    ctx.closePath();
    ctx.clip();
  } else if (shape === 'rounded') {
    const r = targetSize * 0.1;
    drawRoundRect(ctx, 0, 0, targetSize, targetSize, r);
    ctx.closePath();
    ctx.clip();
  } // 'square' has no clip (full canvas)

  // 2. Fill background inside clipped boundary
  if (background !== 'transparent') {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, targetSize, targetSize);
  }

  // 3. Safe area & aspect ratio centered rendering
  const { drawW, drawH, dx, dy } = calculateCenteredFit(
    sourceImg.naturalWidth,
    sourceImg.naturalHeight,
    targetSize,
    padPercent
  );

  ctx.drawImage(sourceImg, dx, dy, drawW, drawH);
  ctx.restore();

  // 4. Micro-resolution Pixel Sharpening (for 16px and 32px to ensure razor-sharp edges)
  if (applySharpen && targetSize <= 48 && targetSize >= 16) {
    applySharpenFilter(ctx, targetSize);
  }

  return canvas;
}
