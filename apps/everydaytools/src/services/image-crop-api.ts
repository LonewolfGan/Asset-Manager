import { apiUrl } from '@/lib/apiBase';
import type { CropRect } from '../lib/image-crop-logic';

export interface CropResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  finalW: number;
  finalH: number;
}

export async function cropImageOnServer(
  file: File,
  crop: CropRect,
  isFr: boolean
): Promise<CropResult> {
  const fd = new FormData();
  fd.append('file', file);
  fd.append('left', String(crop.x));
  fd.append('top', String(crop.y));
  fd.append('width', String(crop.w));
  fd.append('height', String(crop.h));

  const res = await fetch(apiUrl('/api/tools/image-crop'), {
    method: 'POST',
    body: fd,
  });

  if (!res.ok) {
    const errJson = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(errJson.error ?? (isFr ? "Échec du recadrage de l'image." : 'Image crop failed.'));
  }

  const blob = await res.blob();
  const objectUrl = URL.createObjectURL(blob);

  return new Promise<CropResult>((resolve) => {
    const testImg = new Image();
    const cleanup = () => URL.revokeObjectURL(objectUrl);

    testImg.onload = () => {
      const result: CropResult = {
        blob,
        filename: file.name.replace(/\.(png|jpe?g|webp|avif)$/i, '_cropped.$1'),
        sizeBefore: file.size,
        sizeAfter: blob.size,
        finalW: testImg.naturalWidth || crop.w,
        finalH: testImg.naturalHeight || crop.h,
      };
      cleanup();
      resolve(result);
    };

    testImg.onerror = () => {
      const result: CropResult = {
        blob,
        filename: file.name.replace(/\.(png|jpe?g|webp|avif)$/i, '_cropped.$1'),
        sizeBefore: file.size,
        sizeAfter: blob.size,
        finalW: crop.w,
        finalH: crop.h,
      };
      cleanup();
      resolve(result);
    };

    testImg.src = objectUrl;
  });
}

export function downloadCropResult(result: CropResult): void {
  const url = URL.createObjectURL(result.blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = result.filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
