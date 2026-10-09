import { apiUrl } from './apiBase';
import type { ConversionFormat } from '@/components/conversion';

export interface PageThumb {
  pageNumber: number; // 1-based original page index
  dataUrl: string;
}

export const BASE_SOURCE_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Document source',
};

export const BASE_TARGET_FORMAT: ConversionFormat = {
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#FF6B35',
  subLabel: 'Document réorganisé',
};

export function getSourceFormat(isFr: boolean): ConversionFormat {
  return {
    ...BASE_SOURCE_FORMAT,
    subLabel: isFr ? 'Document source' : 'Source document',
  };
}

export function getTargetFormat(isFr: boolean): ConversionFormat {
  return {
    ...BASE_TARGET_FORMAT,
    subLabel: isFr ? 'Document réorganisé' : 'Reordered document',
  };
}

/**
 * Safely resolve the 1-based original page index of a thumbnail object
 */
export function getOriginalPageNumber(p: any, fallbackIdx: number): number {
  if (p && typeof p.pageNumber === 'number' && !isNaN(p.pageNumber) && p.pageNumber > 0) {
    return p.pageNumber;
  }
  if (
    p &&
    typeof p.originalPageNumber === 'number' &&
    !isNaN(p.originalPageNumber) &&
    p.originalPageNumber > 0
  ) {
    return p.originalPageNumber;
  }
  if (p && typeof p.index === 'number' && !isNaN(p.index)) {
    return p.index + 1;
  }
  return fallbackIdx + 1;
}

/**
 * Move element from fromIdx to toIdx returning new array
 */
export function reorderArray<T>(list: T[], fromIdx: number, toIdx: number): T[] {
  if (
    fromIdx < 0 ||
    fromIdx >= list.length ||
    toIdx < 0 ||
    toIdx >= list.length ||
    fromIdx === toIdx
  ) {
    return list;
  }
  const updated = [...list];
  const [moved] = updated.splice(fromIdx, 1);
  updated.splice(toIdx, 0, moved);
  return updated;
}

/**
 * Remove page thumbnail at specified index
 */
export function removePageAtIndex<T>(list: T[], idx: number): T[] {
  return list.filter((_, i) => i !== idx);
}

/**
 * Reverse page thumbnails order
 */
export function reversePages<T>(list: T[]): T[] {
  return [...list].reverse();
}

/**
 * Check if the active pages array differs in order or length from original pages
 */
export function isOrderModified(
  pages: PageThumb[],
  originalPages: PageThumb[]
): boolean {
  if (pages.length !== originalPages.length) return true;
  return pages.some(
    (p, i) => getOriginalPageNumber(p, i) !== getOriginalPageNumber(originalPages[i], i)
  );
}

/**
 * Generate output filename with _reordered.pdf suffix
 */
export function buildReorderedPdfFilename(originalName: string): string {
  return originalName.replace(/\.[^/.]+$/, '') + '_reordered.pdf';
}

/**
 * Client-side reordering fallback via pdf-lib
 */
export async function reorderPdfWithPdfLib(
  file: File,
  pageNumbers: number[]
): Promise<Blob> {
  const { PDFDocument } = await import('pdf-lib');
  const src = await PDFDocument.load(await file.arrayBuffer(), {
    ignoreEncryption: true,
  });
  const pageIndices = pageNumbers.map((n) => n - 1);
  const dest = await PDFDocument.create();
  const copied = await dest.copyPages(src, pageIndices);
  for (const page of copied) {
    dest.addPage(page);
  }
  const pdfBytes = await dest.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

/**
 * Reorder PDF with server-side linear optimization and resilient pdf-lib fallback
 */
export async function reorderPdfDocument(
  file: File,
  pageNumbers: number[]
): Promise<Blob> {
  let blob: Blob | null = null;

  // 1. Try server execution with linear optimization
  try {
    const fd = new FormData();
    fd.append('pages', pageNumbers.join(','));
    fd.append('file', file);

    const res = await fetch(apiUrl('/api/tools/pdf-reorder'), {
      method: 'POST',
      body: fd,
    });
    if (res.ok) {
      blob = await res.blob();
    }
  } catch {
    // Continue to resilient client fallback
  }

  // 2. Client-side fallback via pdf-lib
  if (!blob) {
    blob = await reorderPdfWithPdfLib(file, pageNumbers);
  }

  return blob;
}
