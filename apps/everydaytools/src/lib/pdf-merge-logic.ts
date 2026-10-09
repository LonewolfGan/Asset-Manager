export interface StagedFile {
  id: string;
  file: File;
}

/**
 * Move item in array by one position (prev/next) with bounds checking
 */
export function moveItem<T>(items: T[], index: number, direction: 'prev' | 'next'): T[] {
  const target = direction === 'prev' ? index - 1 : index + 1;
  if (target < 0 || target >= items.length) return [...items];
  const next = [...items];
  const temp = next[target];
  next[target] = next[index];
  next[index] = temp;
  return next;
}

/**
 * Reorder item from source index to target index (drag-and-drop)
 */
export function reorderItem<T>(items: T[], sourceIndex: number, targetIndex: number): T[] {
  if (sourceIndex === targetIndex || sourceIndex < 0 || sourceIndex >= items.length) {
    return [...items];
  }
  const next = [...items];
  const [moved] = next.splice(sourceIndex, 1);
  next.splice(targetIndex, 0, moved);
  return next;
}

/**
 * Sort files alphabetically by filename with natural number sorting
 */
export function sortAZFiles(files: StagedFile[]): StagedFile[] {
  return [...files].sort((a, b) =>
    a.file.name.localeCompare(b.file.name, undefined, { numeric: true, sensitivity: 'base' })
  );
}

/**
 * Reverse array of staged files
 */
export function reverseFiles(files: StagedFile[]): StagedFile[] {
  return [...files].reverse();
}

/**
 * Sanitize and ensure .pdf extension for output filename
 */
export function sanitizeOutputFilename(name: string, fallback: string): string {
  const trimmed = name.trim();
  if (!trimmed) return fallback;
  return trimmed.toLowerCase().endsWith('.pdf') ? trimmed : `${trimmed}.pdf`;
}
