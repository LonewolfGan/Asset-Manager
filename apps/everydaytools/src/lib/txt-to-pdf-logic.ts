import { PDFDocument, StandardFonts, rgb, PageSizes } from 'pdf-lib';
import type { ConversionFormat } from '@/components/conversion';

export type TxtToPdfMode = 'upload' | 'paste';

export interface TxtToPdfOptions {
  mode: TxtToPdfMode;
  file?: File | null;
  textInput?: string;
  errorFallback?: string;
  isFr?: boolean;
  fontSize?: number;
  lineSpacing?: number;
  margin?: number;
  orientation?: 'portrait' | 'landscape';
  fontFamily?: 'Helvetica' | 'TimesRoman' | 'Courier';
}

export interface TxtToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const FONT_MAP = {
  Helvetica: StandardFonts.Helvetica,
  TimesRoman: StandardFonts.TimesRoman,
  Courier: StandardFonts.Courier,
} as const;

const WIN_ANSI_EXTRA_POINTS = new Set([
  338, 339, 352, 353, 376, 381, 382, 402, 710, 732,
  8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225,
  8226, 8230, 8240, 8249, 8250, 8364, 8482,
]);

export function sanitizeWinAnsi(text: string): string {
  let result = '';
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  for (const char of normalized) {
    if (char === '\n') {
      result += '\n';
      continue;
    }
    if (char === '\t') {
      result += '    ';
      continue;
    }
    const code = char.codePointAt(0) ?? 0;
    if ((code >= 32 && code <= 126) || (code >= 160 && code <= 255) || WIN_ANSI_EXTRA_POINTS.has(code)) {
      result += char;
    } else {
      result += '?';
    }
  }
  return result;
}

export const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: isFr ? 'Texte' : 'Text',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: '#4B5563',
  subLabel: isFr ? 'Texte Brut UTF-8' : 'Plain Text UTF-8',
});

export const getTargetFormat = (_isFr?: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

export const TXT_SAMPLE_FR = `RAPPORT D'ACTIVITÉ MENSUEL
EverydayTools Studio — Octobre 2026

1. OBJET ET CONTEXTE
Ce document présente le récapitulatif des opérations techniques.
`;

export const TXT_SAMPLE_EN = `MONTHLY ACTIVITY REPORT
EverydayTools Studio — October 2026

1. PURPOSE AND CONTEXT
This document summarizes technical operations.
`;

export function validateTxtFile(selectedFile: File, isFr = false): FileValidationResult {
  const isTxt =
    selectedFile.name.toLowerCase().endsWith('.txt') ||
    selectedFile.type === 'text/plain' ||
    selectedFile.type === '';

  if (!isTxt) {
    return {
      isValid: false,
      error: isFr
        ? 'Veuillez sélectionner un fichier texte (.txt) valide.'
        : 'Please select a valid text file (.txt).',
    };
  }

  if (selectedFile.size > 20 * 1024 * 1024) {
    return {
      isValid: false,
      error: isFr
        ? 'Le fichier dépasse la taille maximale autorisée de 20 Mo.'
        : 'File exceeds the maximum allowed size of 20 MB.',
    };
  }

  return { isValid: true };
}

export function buildPdfFilename(
  mode: TxtToPdfMode,
  file?: File | null,
  isFr = false
): string {
  if (mode === 'upload' && file) {
    return file.name.replace(/\.txt$/i, '.pdf');
  }
  return isFr ? 'texte-converti.pdf' : 'converted-text.pdf';
}

function wrapParagraph(
  text: string,
  font: { widthOfTextAtSize: (t: string, size: number) => number },
  fontSize: number,
  maxWidth: number
): string[] {
  if (!text) return [''];
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      currentLine = candidate;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = '';
      }
      if (font.widthOfTextAtSize(word, fontSize) > maxWidth) {
        let chunk = '';
        for (const char of word) {
          if (font.widthOfTextAtSize(chunk + char, fontSize) <= maxWidth) {
            chunk += char;
          } else {
            if (chunk) lines.push(chunk);
            chunk = char;
          }
        }
        currentLine = chunk;
      } else {
        currentLine = word;
      }
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }
  return lines;
}

export async function convertTxtToPdf(options: TxtToPdfOptions): Promise<TxtToPdfResult> {
  const {
    mode,
    file,
    textInput = '',
    isFr = false,
    fontSize = 11,
    lineSpacing = 1.45,
    margin = 48,
    orientation = 'portrait',
    fontFamily = 'Helvetica',
  } = options;

  let rawText = '';
  const filename = buildPdfFilename(mode, file, isFr);
  let sizeBefore = 0;

  if (mode === 'upload' && file) {
    rawText = await file.text();
    sizeBefore = file.size;
  } else {
    rawText = textInput;
    sizeBefore = new TextEncoder().encode(textInput).length;
  }

  const cleanText = sanitizeWinAnsi(rawText);
  const pdfDoc = await PDFDocument.create();
  const fontName = FONT_MAP[fontFamily] ?? StandardFonts.Helvetica;
  const font = await pdfDoc.embedFont(fontName);

  const [rawWidth, rawHeight] = PageSizes.A4;
  const pageWidth = orientation === 'landscape' ? rawHeight : rawWidth;
  const pageHeight = orientation === 'landscape' ? rawWidth : rawHeight;

  const contentWidth = pageWidth - margin * 2;
  const lineHeight = fontSize * lineSpacing;

  const paragraphs = cleanText.split('\n');
  const lines: string[] = [];
  for (const para of paragraphs) {
    if (!para.trim()) {
      lines.push('');
    } else {
      lines.push(...wrapParagraph(para, font, fontSize, contentWidth));
    }
  }

  let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let y = pageHeight - margin - fontSize;

  for (const line of lines) {
    if (y - lineHeight < margin) {
      currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      y = pageHeight - margin - fontSize;
    }
    if (line.length > 0) {
      currentPage.drawText(line, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.12, 0.12, 0.14),
      });
    }
    y -= lineHeight;
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });

  return {
    blob,
    filename,
    sizeAfter: blob.size,
    sizeBefore,
  };
}

export function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export function openPdfPreview(blob: Blob): void {
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}
