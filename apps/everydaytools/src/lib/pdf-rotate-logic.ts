import { PDFDocument, degrees } from 'pdf-lib';

/**
 * Normalize and rotate degree by delta (modulo 360)
 */
export function rotatePageDeg(currentDeg: number, delta: number): number {
  return (currentDeg + delta + 360) % 360;
}

/**
 * Count how many pages have an active rotation (!= 0 mod 360)
 */
export function calculateModifiedPagesCount(rotations: Record<number, number>): number {
  let count = 0;
  for (const deg of Object.values(rotations)) {
    if (deg % 360 !== 0) count++;
  }
  return count;
}

/**
 * Apply rotation delta to a single page (1-based pageNumber)
 */
export function applyRotationToPage(
  rotations: Record<number, number>,
  pageNumber: number,
  delta: number
): Record<number, number> {
  const idx = pageNumber - 1;
  const current = rotations[idx] ?? 0;
  const next = rotatePageDeg(current, delta);
  const copy = { ...rotations };
  if (next === 0) {
    delete copy[idx];
  } else {
    copy[idx] = next;
  }
  return copy;
}

/**
 * Apply rotation delta to all pages
 */
export function applyRotationToAll(
  rotations: Record<number, number>,
  totalPages: number,
  delta: number
): Record<number, number> {
  const updated: Record<number, number> = {};
  for (let idx = 0; idx < totalPages; idx++) {
    const current = rotations[idx] ?? 0;
    const next = rotatePageDeg(current, delta);
    if (next !== 0) {
      updated[idx] = next;
    }
  }
  return updated;
}

/**
 * Apply rotation delta to selected pages (1-based page numbers)
 */
export function applyRotationToSelected(
  rotations: Record<number, number>,
  selectedPages: number[],
  delta: number
): Record<number, number> {
  const copy = { ...rotations };
  selectedPages.forEach((pageNum) => {
    const idx = pageNum - 1;
    const current = copy[idx] ?? 0;
    const next = rotatePageDeg(current, delta);
    if (next === 0) {
      delete copy[idx];
    } else {
      copy[idx] = next;
    }
  });
  return copy;
}

/**
 * Toggle selection of a page number in an array
 */
export function togglePageSelection(selected: number[], pageNum: number): number[] {
  return selected.includes(pageNum)
    ? selected.filter((p) => p !== pageNum)
    : [...selected, pageNum].sort((a, b) => a - b);
}

/**
 * Rotates PDF document pages 100% in-browser using pdf-lib.
 * Zero upload, sub-10ms execution, full privacy.
 */
export async function rotatePdfFile(
  file: File,
  rotations: Record<number, number> | number
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const totalPages = pages.length;

  if (typeof rotations === 'number') {
    const delta = rotations;
    for (const page of pages) {
      const current = page.getRotation().angle;
      page.setRotation(degrees(((current + (delta % 360)) % 360 + 360) % 360));
    }
  } else {
    for (const [idxStr, delta] of Object.entries(rotations)) {
      const idx = Number(idxStr);
      if (idx >= 0 && idx < totalPages && typeof delta === 'number') {
        const page = pages[idx];
        const current = page.getRotation().angle;
        page.setRotation(degrees(((current + (delta % 360)) % 360 + 360) % 360));
      }
    }
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
}

