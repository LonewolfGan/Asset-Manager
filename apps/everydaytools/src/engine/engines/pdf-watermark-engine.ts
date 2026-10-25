import { PDFDocument, rgb, StandardFonts, degrees, type RGB } from 'pdf-lib';
import { sanitizeWinAnsi } from '@/lib/txt-to-pdf-logic';
import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';

export interface PdfWatermarkExecuteOptions extends ToolExecuteOptions {
  text?: string;
  imageFile?: File | Blob;
  fontSize?: number;
  opacity?: number;
  angle?: number;
  color?: string;
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | string;
  pattern?: 'single' | 'repeat' | string;
  pages?: 'all' | 'first' | string;
  baseName?: string;
  isFr?: boolean;
}

export interface PdfWatermarkMetadata extends Record<string, unknown> {
  watermarkType: 'text' | 'image';
  pageCount: number;
  watermarkedCount: number;
  originalSize: number;
  watermarkedSize: number;
}

function parseColor(col?: string): RGB {
  if (!col) return rgb(0.5, 0.5, 0.5);
  const s = col.toLowerCase().trim();
  if (s === 'red' || s === '#ff0000' || s === '#ec1c24') return rgb(0.92, 0.11, 0.14);
  if (s === 'blue') return rgb(0.12, 0.45, 0.9);
  if (s === 'black') return rgb(0.08, 0.08, 0.08);
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return rgb(r, g, b);
    }
  }
  return rgb(0.5, 0.5, 0.5);
}

function resolvePages(scope: string | undefined, total: number): number[] {
  if (!scope || scope === 'all') return Array.from({ length: total }, (_, i) => i);
  if (scope === 'first') return [0];
  const list = scope.split(',').flatMap((p) => {
    const s = p.trim();
    if (s.includes('-')) {
      const [a, b] = s.split('-').map((v) => parseInt(v.trim(), 10));
      if (!isNaN(a) && !isNaN(b)) {
        const start = Math.max(0, Math.min(Math.min(a, b) - 1, total - 1));
        const end = Math.max(0, Math.min(Math.max(a, b) - 1, total - 1));
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
      }
    }
    const n = parseInt(s, 10);
    return !isNaN(n) && n >= 1 && n <= total ? [n - 1] : [];
  });
  return list.length > 0 ? [...new Set(list)] : Array.from({ length: total }, (_, i) => i);
}

export function createPdfWatermarkEngine(
  defaultOptions?: Partial<PdfWatermarkExecuteOptions>
): ToolEngineContract<File, PdfWatermarkExecuteOptions, Blob> {
  return {
    id: 'pdf-watermark',
    name: 'Watermark PDF',

    async execute(file: File, options?: PdfWatermarkExecuteOptions): Promise<ToolResult<Blob>> {
      const merged = { ...defaultOptions, ...options };
      const signal = merged.signal;
      const onProgress = merged.onProgress;

      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const rawText = merged.text !== undefined ? merged.text.trim() : '';
      const hasImage = Boolean(merged.imageFile);
      if (!rawText && !hasImage) {
        throw new Error('Empty watermark: neither text nor image was provided');
      }

      onProgress?.({ percent: 10, stage: 'reading' });
      const arrayBuffer = await file.arrayBuffer();
      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pageCount = pdfDoc.getPageCount();
      const targetIndices = resolvePages(merged.pages, pageCount);

      onProgress?.({ percent: 50, stage: 'rendering' });
      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const opacity = typeof merged.opacity === 'number' && !isNaN(merged.opacity)
        ? Math.max(0.05, Math.min(1.0, merged.opacity)) : 0.3;
      const angle = typeof merged.angle === 'number' && !isNaN(merged.angle) ? merged.angle : 45;
      const watermarkType = hasImage ? 'image' : 'text';

      if (hasImage && merged.imageFile) {
        const imgBuffer = await merged.imageFile.arrayBuffer();
        const unpooled = new Uint8Array(imgBuffer);
        const isPng = merged.imageFile.type.includes('png') ||
          (unpooled.length > 4 && unpooled[0] === 0x89 && unpooled[1] === 0x50 && unpooled[2] === 0x4E && unpooled[3] === 0x47);
        const img = isPng ? await pdfDoc.embedPng(unpooled) : await pdfDoc.embedJpg(unpooled);

        for (const idx of targetIndices) {
          const page = pdfDoc.getPage(idx);
          const { width, height } = page.getSize();
          const scale = Math.min(1.0, (width * 0.5) / img.width, (height * 0.5) / img.height);
          const dims = img.scale(scale);
          let x = (width - dims.width) / 2;
          let y = (height - dims.height) / 2;
          if (merged.position === 'top-left') { x = 36; y = height - dims.height - 36; }
          else if (merged.position === 'top-right') { x = width - dims.width - 36; y = height - dims.height - 36; }
          else if (merged.position === 'bottom-left') { x = 36; y = 36; }
          else if (merged.position === 'bottom-right') { x = width - dims.width - 36; y = 36; }
          page.drawImage(img, { x, y, width: dims.width, height: dims.height, opacity });
        }
      } else {
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = typeof merged.fontSize === 'number' && !isNaN(merged.fontSize) ? merged.fontSize : 48;
        const pattern = merged.pattern ?? 'single';
        const rad = (angle * Math.PI) / 180;
        const sanitizedText = sanitizeWinAnsi(rawText).trim();
        const textToDraw = sanitizedText || 'WATERMARK';
        const textWidth = font.widthOfTextAtSize(textToDraw, fontSize);
        const col = parseColor(merged.color);

        for (const idx of targetIndices) {
          const page = pdfDoc.getPage(idx);
          const { width, height } = page.getSize();
          if (pattern === 'repeat') {
            const stepX = Math.max(textWidth + 60, 140);
            const stepY = Math.max(fontSize * 3.2, 110);
            let row = 0;
            for (let py = -stepY; py <= height + stepY; py += stepY) {
              const xOffset = row % 2 === 0 ? 0 : stepX / 2;
              for (let px = -stepX + xOffset; px <= width + stepX; px += stepX) {
                page.drawText(textToDraw, { x: px, y: py, size: fontSize, font, color: col, opacity, rotate: degrees(angle) });
              }
              row++;
            }
          } else {
            const cx = width / 2;
            const cy = height / 2;
            const x = cx - (textWidth / 2) * Math.cos(rad) + (fontSize / 2) * Math.sin(rad);
            const y = cy - (textWidth / 2) * Math.sin(rad) - (fontSize / 2) * Math.cos(rad);
            page.drawText(textToDraw, { x, y, size: fontSize, font, color: col, opacity, rotate: degrees(angle) });
          }
        }
      }

      onProgress?.({ percent: 85, stage: 'serializing' });
      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      onProgress?.({ percent: 100, stage: 'complete' });

      const baseName = merged.baseName ?? file.name.replace(/\.pdf$/i, '');
      const filename = `${baseName}_watermarked.pdf`;

      return {
        data: blob,
        filename,
        mimeType: 'application/pdf',
        originalSize: file.size,
        resultSize: blob.size,
        metadata: {
          watermarkType,
          pageCount,
          watermarkedCount: targetIndices.length,
          originalSize: file.size,
          watermarkedSize: blob.size,
        },
      };
    },
  };
}

export const pdfWatermarkEngine = createPdfWatermarkEngine();
