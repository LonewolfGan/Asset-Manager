export function normalizeRotation(angle: number): number {
  const mod = angle % 360;
  return mod < 0 ? mod + 360 : mod;
}

export function getTransformCss(rotation: number, flipH: boolean, flipV: boolean): string {
  const parts: string[] = [];
  if (rotation !== 0) {
    parts.push(`rotate(${rotation}deg)`);
  }
  const scaleX = flipH ? -1 : 1;
  const scaleY = flipV ? -1 : 1;
  if (scaleX !== 1 || scaleY !== 1) {
    parts.push(`scale(${scaleX}, ${scaleY})`);
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export interface TransformState {
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  format: 'image/png' | 'image/jpeg' | 'image/webp';
}

export const INITIAL_TRANSFORM_STATE: TransformState = {
  rotation: 0,
  flipH: false,
  flipV: false,
  format: 'image/png',
};

export function getSwappedDimensions(
  w: number,
  h: number,
  rotation: number
): { w: number; h: number; isSwapped: boolean } {
  const norm = normalizeRotation(rotation);
  if (norm === 0 || norm === 180) {
    return { w, h, isSwapped: false };
  }
  if (norm === 90 || norm === 270) {
    return { w: h, h: w, isSwapped: true };
  }
  // Arbitrary free rotation bounding box
  const rad = (norm * Math.PI) / 180;
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newW = Math.round(w * cos + h * sin);
  const newH = Math.round(w * sin + h * cos);
  return { w: newW, h: newH, isSwapped: false };
}

export function getOutputFilename(originalName: string, ext: string): string {
  const base = originalName.replace(/\.[^.]+$/, '');
  return `${base}_oriented.${ext}`;
}

export async function flipRotateImageInBrowser(
  file: File,
  rotation: number,
  flipH: boolean,
  flipV: boolean,
  mimeType: string = 'image/png',
  quality: number = 0.92
): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas 2D context not available');
    }

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = file.name && !url.includes(file.name) ? `${url}#${file.name}` : url;
    });

    const norm = normalizeRotation(rotation);
    const { w: newW, h: newH } = getSwappedDimensions(img.naturalWidth, img.naturalHeight, norm);

    canvas.width = newW;
    canvas.height = newH;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.translate(newW / 2, newH / 2);
    ctx.rotate((norm * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) {
            resolve(b);
          } else {
            reject(new Error('Canvas export to blob failed'));
          }
        },
        mimeType || 'image/png',
        quality
      );
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}


