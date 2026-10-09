export interface Tranche {
  id: string;
  from: number;
  to: number;
  label?: string;
}

/**
 * Format sorted array of pages [1, 2, 3, 5] -> "1-3, 5"
 */
export function formatPagesToRangeString(pages: number[]): string {
  if (pages.length === 0) return '';
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges: string[] = [];
  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    if (current === prev + 1) {
      prev = current;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = current;
      prev = current;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
  return ranges.join(', ');
}

/**
 * Parse range string: "1-3, 5" -> [1, 2, 3, 5]
 */
export function parseRangeStringToPages(str: string, maxPages: number): number[] {
  const result = new Set<number>();
  const parts = str.split(/[,;\s]+/).filter(Boolean);
  for (const part of parts) {
    if (part.includes('-')) {
      const [fromStr, toStr] = part.split('-');
      const from = parseInt(fromStr, 10);
      const to = parseInt(toStr, 10);
      if (!isNaN(from) && !isNaN(to)) {
        const start = Math.max(1, Math.min(from, to));
        const end = Math.min(maxPages, Math.max(from, to));
        for (let p = start; p <= end; p++) {
          result.add(p);
        }
      }
    } else {
      const p = parseInt(part, 10);
      if (!isNaN(p) && p >= 1 && p <= maxPages) {
        result.add(p);
      }
    }
  }
  return Array.from(result).sort((a, b) => a - b);
}

/**
 * Returns array of odd page numbers up to total
 */
export function selectOddPages(total: number): number[] {
  const list: number[] = [];
  for (let i = 1; i <= total; i += 2) {
    list.push(i);
  }
  return list;
}

/**
 * Returns array of even page numbers up to total
 */
export function selectEvenPages(total: number): number[] {
  const list: number[] = [];
  for (let i = 2; i <= total; i += 2) {
    list.push(i);
  }
  return list;
}

/**
 * Generates batch slices of fixed page chunk size
 */
export function generateBatchSlices(totalPages: number, chunkSize: number): Tranche[] {
  const slices: Tranche[] = [];
  const safeChunk = Math.max(1, chunkSize);
  let currentFrom = 1;

  while (currentFrom <= totalPages) {
    const currentTo = Math.min(totalPages, currentFrom + safeChunk - 1);
    slices.push({
      id: `slice-${currentFrom}-${currentTo}`,
      from: currentFrom,
      to: currentTo,
    });
    currentFrom = currentTo + 1;
  }

  return slices;
}
