import type { CropRect } from './image-crop-logic';
import { clampCropRect } from './image-crop-logic';

export type HandleType = 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w';

export interface DragState {
  mode: 'move' | 'resize' | 'create';
  handle?: HandleType;
  startX: number;
  startY: number;
  initialCrop: CropRect;
}

export function computeResizedCrop(
  initialCrop: CropRect,
  handle: HandleType,
  currentN: { x: number; y: number },
  origW: number,
  origH: number,
  aspectRatio: number | null
): CropRect {
  const { x, y, w, h } = initialCrop;
  const right = x + w;
  const bottom = y + h;
  const curX = Math.max(0, Math.min(origW, currentN.x));
  const curY = Math.max(0, Math.min(origH, currentN.y));
  const minSize = 20;

  if (!aspectRatio) {
    switch (handle) {
      case 'nw': {
        const newX = Math.min(curX, right - minSize);
        const newY = Math.min(curY, bottom - minSize);
        return { x: newX, y: newY, w: right - newX, h: bottom - newY };
      }
      case 'ne': {
        const newRight = Math.max(curX, x + minSize);
        const newY = Math.min(curY, bottom - minSize);
        return { x, y: newY, w: newRight - x, h: bottom - newY };
      }
      case 'se': {
        const newRight = Math.max(curX, x + minSize);
        const newBottom = Math.max(curY, y + minSize);
        return { x, y, w: newRight - x, h: newBottom - y };
      }
      case 'sw': {
        const newX = Math.min(curX, right - minSize);
        const newBottom = Math.max(curY, y + minSize);
        return { x: newX, y, w: right - newX, h: newBottom - y };
      }
      case 'n': {
        const newY = Math.min(curY, bottom - minSize);
        return { x, y: newY, w, h: bottom - newY };
      }
      case 's': {
        const newBottom = Math.max(curY, y + minSize);
        return { x, y, w, h: newBottom - y };
      }
      case 'w': {
        const newX = Math.min(curX, right - minSize);
        return { x: newX, y, w: right - newX, h };
      }
      case 'e': {
        const newRight = Math.max(curX, x + minSize);
        return { x, y, w: newRight - x, h };
      }
    }
  }

  const ratio = aspectRatio;
  switch (handle) {
    case 'se': {
      let newW = Math.max(minSize, curX - x);
      let newH = newW / ratio;
      if (x + newW > origW) {
        newW = origW - x;
        newH = newW / ratio;
      }
      if (y + newH > origH) {
        newH = origH - y;
        newW = newH * ratio;
      }
      return { x, y, w: Math.round(newW), h: Math.round(newH) };
    }
    case 'nw': {
      let newW = Math.max(minSize, right - curX);
      let newH = newW / ratio;
      if (right - newW < 0) {
        newW = right;
        newH = newW / ratio;
      }
      if (bottom - newH < 0) {
        newH = bottom;
        newW = newH * ratio;
      }
      return {
        x: Math.round(right - newW),
        y: Math.round(bottom - newH),
        w: Math.round(newW),
        h: Math.round(newH),
      };
    }
    case 'ne': {
      let newW = Math.max(minSize, curX - x);
      let newH = newW / ratio;
      if (x + newW > origW) {
        newW = origW - x;
        newH = newW / ratio;
      }
      if (bottom - newH < 0) {
        newH = bottom;
        newW = newH * ratio;
      }
      return {
        x,
        y: Math.round(bottom - newH),
        w: Math.round(newW),
        h: Math.round(newH),
      };
    }
    case 'sw': {
      let newW = Math.max(minSize, right - curX);
      let newH = newW / ratio;
      if (right - newW < 0) {
        newW = right;
        newH = newW / ratio;
      }
      if (y + newH > origH) {
        newH = origH - y;
        newW = newH * ratio;
      }
      return {
        x: Math.round(right - newW),
        y,
        w: Math.round(newW),
        h: Math.round(newH),
      };
    }
    case 'e':
    case 'w': {
      const newW = handle === 'e' ? Math.max(minSize, curX - x) : Math.max(minSize, right - curX);
      let computedH = newW / ratio;
      let finalW = newW;
      if (computedH > origH) {
        computedH = origH;
        finalW = computedH * ratio;
      }
      let newX = handle === 'e' ? x : right - finalW;
      let newY = y + (h - computedH) / 2;
      newX = Math.max(0, Math.min(newX, origW - finalW));
      newY = Math.max(0, Math.min(newY, origH - computedH));
      return {
        x: Math.round(newX),
        y: Math.round(newY),
        w: Math.round(finalW),
        h: Math.round(computedH),
      };
    }
    case 'n':
    case 's': {
      const newH = handle === 's' ? Math.max(minSize, curY - y) : Math.max(minSize, bottom - curY);
      let computedW = newH * ratio;
      let finalH = newH;
      if (computedW > origW) {
        computedW = origW;
        finalH = computedW / ratio;
      }
      let newY = handle === 's' ? y : bottom - finalH;
      let newX = x + (w - computedW) / 2;
      newX = Math.max(0, Math.min(newX, origW - computedW));
      newY = Math.max(0, Math.min(newY, origH - finalH));
      return {
        x: Math.round(newX),
        y: Math.round(newY),
        w: Math.round(computedW),
        h: Math.round(finalH),
      };
    }
  }

  return initialCrop;
}

export function computeCreatedCrop(
  startX: number,
  startY: number,
  currentX: number,
  currentY: number,
  aspectRatio: number | null,
  origW: number,
  origH: number
): CropRect {
  let w = currentX - startX;
  let h = currentY - startY;

  if (aspectRatio) {
    const signW = Math.sign(w) || 1;
    const signH = Math.sign(h) || 1;
    if (Math.abs(w) / aspectRatio > Math.abs(h)) {
      h = (Math.abs(w) / aspectRatio) * signH;
    } else {
      w = Math.abs(h) * aspectRatio * signW;
    }
  }

  const boxX = w < 0 ? startX + w : startX;
  const boxY = h < 0 ? startY + h : startY;
  const boxW = Math.max(20, Math.abs(w));
  const boxH = Math.max(20, Math.abs(h));

  return clampCropRect(
    {
      x: Math.round(boxX),
      y: Math.round(boxY),
      w: Math.round(boxW),
      h: Math.round(boxH),
    },
    origW,
    origH
  );
}
