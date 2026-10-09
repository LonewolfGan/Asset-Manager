import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { generateQrSvgString, QrSvgOptions } from './qr-code-logic';

export function exportQrPng(canvas: HTMLCanvasElement | null, mode: string): void {
  trackToolUsed('qr-code-generator', 'utilities');
  if (!canvas) return;

  const link = document.createElement('a');
  link.download = `qrcode-${mode}-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

export function exportQrSvg(options: QrSvgOptions, mode: string): void {
  trackToolUsed('qr-code-generator', 'utilities');
  try {
    const svgString = generateQrSvgString(options);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const objUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `qrcode-${mode}-${Date.now()}.svg`;
    link.href = objUrl;
    link.click();
    URL.revokeObjectURL(objUrl);
  } catch {
    trackToolError('qr-code-generator', 'svg-export-error');
  }
}

export async function copyQrImageToClipboard(
  canvas: HTMLCanvasElement | null,
  isEmpty: boolean
): Promise<void> {
  if (!canvas || isEmpty) return;

  return new Promise<void>((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        reject(new Error('Canvas to blob failed'));
        return;
      }
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        resolve();
      } catch (err) {
        reject(err);
      }
    });
  });
}
