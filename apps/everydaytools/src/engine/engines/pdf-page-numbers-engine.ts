import { PDFDocument, rgb, StandardFonts, degrees, type RGB } from 'pdf-lib';
import { sanitizeWinAnsi } from '@/lib/txt-to-pdf-logic';
import type { ToolEngineContract, ToolExecuteOptions, ToolResult } from '../tool-contract';

export interface PdfPageNumbersExecuteOptions extends ToolExecuteOptions {
  position?: 'bottom-center' | 'bottom-left' | 'bottom-right' | 'top-center' | 'top-left' | 'top-right' | string;
  format?: string;
  startFrom?: number;
  skipFirst?: boolean;
  fontSize?: number;
  margin?: number;
  color?: string;
  baseName?: string;
  isFr?: boolean;
}

export interface PdfPageNumbersMetadata extends Record<string, unknown> {
  pageCount: number;
  numberedCount: number;
  isLinearized: boolean;
  position: string;
  format: string;
  originalSize: number;
  resultSize: number;
}

const ROMAN_MAP: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
  [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
  [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
];

export function toRoman(num: number): string {
  if (num <= 0 || num > 3999 || !Number.isInteger(num)) return String(num);
  let rem = num, res = '';
  for (const [val, sym] of ROMAN_MAP) {
    while (rem >= val) { res += sym; rem -= val; }
  }
  return res;
}

function parseColor(col?: string): RGB {
  if (!col) return rgb(0, 0, 0);
  const s = col.toLowerCase().trim();
  if (s === 'black' || s === '#000000' || s === '#000') return rgb(0, 0, 0);
  if (s === 'red' || s === '#ff0000') return rgb(0.9, 0.1, 0.1);
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
  return rgb(0, 0, 0);
}

function calculateCoordinates(
  pos: string, W: number, H: number, rot: number, textWidth: number, S: number, M: number
): { x: number; y: number; drawAngle: number } {
  const isRotated = rot === 90 || rot === 270;
  const Wv = isRotated ? H : W, Hv = isRotated ? W : H;
  let Xv = (Wv - textWidth) / 2, Yv = M;

  if (pos === 'bottom-left') { Xv = M; Yv = M; }
  else if (pos === 'bottom-center') { Xv = (Wv - textWidth) / 2; Yv = M; }
  else if (pos === 'bottom-right') { Xv = Wv - M - textWidth; Yv = M; }
  else if (pos === 'top-left') { Xv = M; Yv = Hv - M - S; }
  else if (pos === 'top-center') { Xv = (Wv - textWidth) / 2; Yv = Hv - M - S; }
  else if (pos === 'top-right') { Xv = Wv - M - textWidth; Yv = Hv - M - S; }

  if (rot === 90) return { x: W - Yv, y: Xv, drawAngle: 90 };
  if (rot === 180) return { x: W - Xv, y: H - Yv, drawAngle: 180 };
  if (rot === 270) return { x: Yv, y: H - Xv, drawAngle: 270 };
  return { x: Xv, y: Yv, drawAngle: 0 };
}

export function createPdfPageNumbersEngine(
  defaultOptions?: Partial<PdfPageNumbersExecuteOptions>
): ToolEngineContract<File, PdfPageNumbersExecuteOptions, Blob> {
  return {
    id: 'pdf-page-numbers',
    name: 'Add Page Numbers',

    async execute(file: File, options?: PdfPageNumbersExecuteOptions): Promise<ToolResult<Blob>> {
      const merged = { ...defaultOptions, ...options };
      const signal = merged.signal;
      const onProgress = merged.onProgress;

      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      onProgress?.({ percent: 15, stage: 'reading' });
      const arrayBuffer = await file.arrayBuffer();
      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const pageCount = pdfDoc.getPageCount();

      onProgress?.({ percent: 40, stage: 'numbering' });
      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const position = merged.position ?? 'bottom-center';
      const format = merged.format ?? '{n} / {total}';
      const startFrom = typeof merged.startFrom === 'number' && !isNaN(merged.startFrom) ? merged.startFrom : 1;
      const skipFirst = Boolean(merged.skipFirst);
      const fontSize = typeof merged.fontSize === 'number' && merged.fontSize > 0 ? merged.fontSize : 11;
      const margin = typeof merged.margin === 'number' && !isNaN(merged.margin) ? merged.margin : 36;
      const col = parseColor(merged.color);

      let numberedCount = 0;
      for (let i = 0; i < pageCount; i++) {
        if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');
        if (skipFirst && i === 0) continue;
        const page = pdfDoc.getPage(i);
        const { width: W, height: H } = page.getSize();
        const rot = ((page.getRotation().angle % 360) + 360) % 360;
        const currentNum = startFrom + (skipFirst ? i - 1 : i);

        const rawText = format
          .replace(/\{n\}/g, String(currentNum))
          .replace(/\{total\}/g, String(pageCount))
          .replace(/\{roman\}/g, toRoman(currentNum).toLowerCase())
          .replace(/\{ROMAN\}/g, toRoman(currentNum).toUpperCase());

        const textToDraw = sanitizeWinAnsi(rawText);
        const textWidth = font.widthOfTextAtSize(textToDraw, fontSize);
        const { x, y, drawAngle } = calculateCoordinates(position, W, H, rot, textWidth, fontSize, margin);

        page.drawText(textToDraw, { x, y, size: fontSize, font, color: col, rotate: degrees(drawAngle) });
        numberedCount++;
      }

      onProgress?.({ percent: 85, stage: 'serializing' });
      if (signal?.aborted) throw new DOMException('Operation aborted', 'AbortError');

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      onProgress?.({ percent: 100, stage: 'complete' });

      const baseName = merged.baseName ?? file.name.replace(/\.pdf$/i, '');
      const filename = `${baseName}_numbered.pdf`;

      return {
        data: blob,
        filename,
        mimeType: 'application/pdf',
        originalSize: file.size,
        resultSize: blob.size,
        metadata: {
          pageCount,
          numberedCount,
          isLinearized: true,
          position,
          format,
          originalSize: file.size,
          resultSize: blob.size,
        },
      };
    },
  };
}

export const pdfPageNumbersEngine = createPdfPageNumbersEngine();
