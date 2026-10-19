export interface UpscaleDimensions {
  origW: number;
  origH: number;
  targetW: number;
  targetH: number;
  scale: 2 | 4;
}

export function calculateUpscaleDimensions(
  origW: number,
  origH: number,
  scale: 2 | 4,
  maxDimension: number = 8000
): UpscaleDimensions {
  let targetW = Math.round(origW * scale);
  let targetH = Math.round(origH * scale);

  if (targetW > maxDimension || targetH > maxDimension) {
    const ratio = Math.min(maxDimension / targetW, maxDimension / targetH);
    targetW = Math.round(targetW * ratio);
    targetH = Math.round(targetH * ratio);
  }

  return {
    origW,
    origH,
    targetW,
    targetH,
    scale,
  };
}

export function formatBytes(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function calculateMegapixels(w: number, h: number): string {
  if (w <= 0 || h <= 0) return '0 MP';
  const mp = (w * h) / 1_000_000;
  return mp < 1 ? `${mp.toFixed(2)} MP` : `${mp.toFixed(1)} MP`;
}

export function calculatePixelGainPercent(scale: 2 | 4): number {
  return (scale * scale - 1) * 100;
}

export type ViewMode = 'split' | 'side' | 'single';

export const IMAGE_FORMAT = {
  id: 'IMAGE',
  name: 'Image Haute Définition',
  extension: '.png',
  icon: '/icons/image.svg',
  color: 'emerald',
  borderHover: 'hover:border-emerald-500/50',
  glow: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
};

export function getUpscaleOutputFilename(filename: string, scale: 2 | 4): string {
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) {
    return `${filename}_${scale}x.png`;
  }
  const name = filename.slice(0, dotIndex);
  const ext = filename.slice(dotIndex);
  return `${name}_${scale}x${ext}`;
}

export async function upscaleCanvasClientSide(
  previewUrl: string,
  origW: number,
  origH: number,
  scale: 2 | 4,
  mimeType: string,
  isFr: boolean
): Promise<Blob> {
  const img = new Image();
  img.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = previewUrl;
  });

  let targetW = Math.round(origW * scale);
  let targetH = Math.round(origH * scale);
  const maxDimension = 8000;
  if (targetW > maxDimension || targetH > maxDimension) {
    const ratio = Math.min(maxDimension / targetW, maxDimension / targetH);
    targetW = Math.round(targetW * ratio);
    targetH = Math.round(targetH * ratio);
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error(isFr ? 'Canevas 2D non disponible.' : '2D canvas not available.');
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else
          reject(
            new Error(
              isFr
                ? "Erreur de génération de l'image agrandie."
                : 'Error generating upscaled image.'
            )
          );
      },
      mimeType || 'image/png',
      0.95
    );
  });
}
