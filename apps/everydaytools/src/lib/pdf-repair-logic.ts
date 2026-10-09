import { PDFDocument } from 'pdf-lib';
import type { ConversionFormat } from '@/components/conversion';

export const PDF_REPAIR_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export function getPdfRepairSourceFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#EC1C24',
    subLabel: isFr ? 'Document à réparer' : 'Document to repair',
  };
}

export function getPdfRepairTargetFormat(isFr: boolean): ConversionFormat {
  return {
    name: 'PDF',
    extension: 'pdf',
    icon: '/icons/pdf.svg',
    color: '#FF6B35',
    subLabel: isFr ? 'Structure XREF reconstruite' : 'Reconstructed XREF structure',
  };
}

export function validatePdfRepairFile(
  file: File
): { valid: boolean; error?: 'unsupported_format' | 'file_too_large' } {
  const isPdf =
    file.type === 'application/pdf' ||
    file.name.toLowerCase().endsWith('.pdf');

  if (!isPdf) {
    return { valid: false, error: 'unsupported_format' };
  }

  if (file.size > PDF_REPAIR_MAX_FILE_SIZE) {
    return { valid: false, error: 'file_too_large' };
  }

  return { valid: true };
}

export function buildRepairedPdfFilename(originalName: string): string {
  return originalName.replace(/\.[^/.]+$/, '') + '_repaired.pdf';
}

export async function repairPdfClientSide(
  file: File
): Promise<{ blob: Blob; pageCount: number }> {
  const arrayBuf = await file.arrayBuffer();
  const doc = await PDFDocument.load(arrayBuf, {
    ignoreEncryption: true,
    parseSpeed: 1,
  });
  const pageCount = doc.getPageCount();
  const bytes = await doc.save({ useObjectStreams: false });
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  return { blob, pageCount };
}

export async function repairPdfDocument(
  file: File,
  endpointUrl?: string
): Promise<{ blob: Blob; pageCount?: number }> {
  let repairedBlob: Blob | null = null;
  let pageCount: number | undefined;

  // 1. Tentative primaire : Serveur QPDF & Ghostscript
  if (endpointUrl) {
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch(endpointUrl, {
        method: 'POST',
        body: fd,
      });

      if (res.ok) {
        repairedBlob = await res.blob();
      }
    } catch {
      // Bascule automatique vers le moteur client
    }
  }

  // 2. Repli client via pdf-lib
  if (!repairedBlob) {
    const clientResult = await repairPdfClientSide(file);
    repairedBlob = clientResult.blob;
    pageCount = clientResult.pageCount;
  }

  if (!repairedBlob || repairedBlob.size === 0) {
    throw new Error('La réparation du document a échoué.');
  }

  return { blob: repairedBlob, pageCount };
}
