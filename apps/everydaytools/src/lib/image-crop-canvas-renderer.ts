import type { CropRect } from './image-crop-logic';
import type { HandleType } from './image-crop-geometry';

export interface CanvasMetrics {
  displayW: number;
  displayH: number;
  scale: number;
}

export type HitTarget =
  | { type: 'handle'; handle: HandleType }
  | { type: 'move' }
  | { type: 'outside' };

export function computeCanvasMetrics(
  imgW: number,
  imgH: number,
  stageWidth: number,
  maxH: number
): CanvasMetrics | null {
  if (imgW <= 0 || imgH <= 0 || stageWidth <= 0 || maxH <= 0) return null;

  let displayW = stageWidth;
  let displayH = (stageWidth * imgH) / imgW;

  if (displayH > maxH) {
    displayH = maxH;
    displayW = (maxH * imgW) / imgH;
  }

  const scale = displayW / imgW;
  return { displayW, displayH, scale };
}

export function getHitTarget(
  px: number,
  py: number,
  crop: CropRect,
  scale: number,
  threshold = 16
): HitTarget {
  const cx = crop.x * scale;
  const cy = crop.y * scale;
  const cw = crop.w * scale;
  const ch = crop.h * scale;

  const dist = (x1: number, y1: number, x2: number, y2: number) =>
    Math.hypot(x1 - x2, y1 - y2);

  // Corners
  if (dist(px, py, cx, cy) <= threshold) return { type: 'handle', handle: 'nw' };
  if (dist(px, py, cx + cw, cy) <= threshold) return { type: 'handle', handle: 'ne' };
  if (dist(px, py, cx + cw, cy + ch) <= threshold) return { type: 'handle', handle: 'se' };
  if (dist(px, py, cx, cy + ch) <= threshold) return { type: 'handle', handle: 'sw' };

  // Edges
  if (Math.abs(py - cy) <= threshold && px >= cx && px <= cx + cw) return { type: 'handle', handle: 'n' };
  if (Math.abs(py - (cy + ch)) <= threshold && px >= cx && px <= cx + cw) return { type: 'handle', handle: 's' };
  if (Math.abs(px - cx) <= threshold && py >= cy && py <= cy + ch) return { type: 'handle', handle: 'w' };
  if (Math.abs(px - (cx + cw)) <= threshold && py >= cy && py <= cy + ch) return { type: 'handle', handle: 'e' };

  // Inside
  if (px >= cx && px <= cx + cw && py >= cy && py <= cy + ch) {
    return { type: 'move' };
  }

  return { type: 'outside' };
}

export function getCursorForHit(hit: HitTarget | null): string {
  if (!hit) return 'default';
  if (hit.type === 'handle') {
    if (hit.handle === 'nw' || hit.handle === 'se') return 'nwse-resize';
    if (hit.handle === 'ne' || hit.handle === 'sw') return 'nesw-resize';
    if (hit.handle === 'n' || hit.handle === 's') return 'ns-resize';
    if (hit.handle === 'e' || hit.handle === 'w') return 'ew-resize';
  }
  if (hit.type === 'move') return 'move';
  return 'crosshair';
}

export function drawCropCanvas(
  ctx: CanvasRenderingContext2D,
  imgObj: HTMLImageElement,
  crop: CropRect,
  displayW: number,
  displayH: number,
  scale: number,
  dpr: number
): void {
  ctx.save();
  ctx.scale(dpr, dpr);

  // 1. Draw scaled background photograph
  ctx.drawImage(imgObj, 0, 0, displayW, displayH);

  // 2. Soft Dimmed Mask (45% scrim on unselected photo area)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(0, 0, displayW, displayH);

  // 3. Clear crop area and redraw vibrant slice
  const cx = crop.x * scale;
  const cy = crop.y * scale;
  const cw = crop.w * scale;
  const ch = crop.h * scale;

  if (cw > 0 && ch > 0) {
    ctx.clearRect(cx, cy, cw, ch);
    ctx.drawImage(imgObj, crop.x, crop.y, crop.w, crop.h, cx, cy, cw, ch);

    // 4. Razor-sharp Accent Border
    ctx.strokeStyle = '#FF6B35';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy, cw, ch);

    // 5. Golden-Ratio / Rule-of-Thirds Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.40)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx + cw / 3, cy);
    ctx.lineTo(cx + cw / 3, cy + ch);
    ctx.moveTo(cx + (2 * cw) / 3, cy);
    ctx.lineTo(cx + (2 * cw) / 3, cy + ch);
    ctx.moveTo(cx, cy + ch / 3);
    ctx.lineTo(cx + cw, cy + ch / 3);
    ctx.moveTo(cx, cy + (2 * ch) / 3);
    ctx.lineTo(cx + cw, cy + (2 * ch) / 3);
    ctx.stroke();

    // 6. Professional White L-Corner Brackets
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'square';
    ctx.lineJoin = 'miter';
    const bl = Math.min(18, cw / 4, ch / 4);

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(cx, cy + bl);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + bl, cy);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(cx + cw - bl, cy);
    ctx.lineTo(cx + cw, cy);
    ctx.lineTo(cx + cw, cy + bl);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(cx + cw, cy + ch - bl);
    ctx.lineTo(cx + cw, cy + ch);
    ctx.lineTo(cx + cw - bl, cy + ch);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(cx + bl, cy + ch);
    ctx.lineTo(cx, cy + ch);
    ctx.lineTo(cx, cy + ch - bl);
    ctx.stroke();

    // 7. Edge Center Tactile Bars
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    if (cw > 50) {
      ctx.beginPath();
      ctx.moveTo(cx + cw / 2 - 10, cy);
      ctx.lineTo(cx + cw / 2 + 10, cy);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + cw / 2 - 10, cy + ch);
      ctx.lineTo(cx + cw / 2 + 10, cy + ch);
      ctx.stroke();
    }
    if (ch > 50) {
      ctx.beginPath();
      ctx.moveTo(cx, cy + ch / 2 - 10);
      ctx.lineTo(cx, cy + ch / 2 + 10);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + cw, cy + ch / 2 - 10);
      ctx.lineTo(cx + cw, cy + ch / 2 + 10);
      ctx.stroke();
    }
  }

  ctx.restore();
}
