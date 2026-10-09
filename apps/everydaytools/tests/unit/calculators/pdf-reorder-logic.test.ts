import { describe, it, expect } from 'vitest';
import {
  getOriginalPageNumber,
  reorderArray,
  removePageAtIndex,
  reversePages,
  isOrderModified,
  buildReorderedPdfFilename,
  PageThumb,
} from '@/lib/pdf-reorder-logic';

describe('PDF Reorder Logic', () => {
  it('resolves original page numbers across different properties', () => {
    expect(getOriginalPageNumber({ pageNumber: 5 }, 0)).toBe(5);
    expect(getOriginalPageNumber({ originalPageNumber: 8 }, 0)).toBe(8);
    expect(getOriginalPageNumber({ index: 2 }, 0)).toBe(3);
    expect(getOriginalPageNumber(null, 4)).toBe(5);
    expect(getOriginalPageNumber({}, 6)).toBe(7);
  });

  it('reorders elements in array correctly', () => {
    const list = ['A', 'B', 'C', 'D'];
    const moved = reorderArray(list, 0, 2);
    expect(moved).toEqual(['B', 'C', 'A', 'D']);

    const movedBack = reorderArray(list, 3, 1);
    expect(movedBack).toEqual(['A', 'D', 'B', 'C']);

    // Out of bounds
    expect(reorderArray(list, -1, 2)).toEqual(list);
    expect(reorderArray(list, 1, 10)).toEqual(list);
  });

  it('removes page at specified index', () => {
    const list: PageThumb[] = [
      { pageNumber: 1, dataUrl: 'data1' },
      { pageNumber: 2, dataUrl: 'data2' },
      { pageNumber: 3, dataUrl: 'data3' },
    ];
    const updated = removePageAtIndex(list, 1);
    expect(updated.length).toBe(2);
    expect(updated.map((p) => p.pageNumber)).toEqual([1, 3]);
  });

  it('reverses pages correctly', () => {
    const list: PageThumb[] = [
      { pageNumber: 1, dataUrl: 'data1' },
      { pageNumber: 2, dataUrl: 'data2' },
      { pageNumber: 3, dataUrl: 'data3' },
    ];
    const reversed = reversePages(list);
    expect(reversed.map((p) => p.pageNumber)).toEqual([3, 2, 1]);
  });

  it('detects when page order is modified or unmodified', () => {
    const original: PageThumb[] = [
      { pageNumber: 1, dataUrl: 'data1' },
      { pageNumber: 2, dataUrl: 'data2' },
      { pageNumber: 3, dataUrl: 'data3' },
    ];

    expect(isOrderModified(original, original)).toBe(false);

    const reordered: PageThumb[] = [
      { pageNumber: 2, dataUrl: 'data2' },
      { pageNumber: 1, dataUrl: 'data1' },
      { pageNumber: 3, dataUrl: 'data3' },
    ];
    expect(isOrderModified(reordered, original)).toBe(true);

    const withDeletedPage: PageThumb[] = [
      { pageNumber: 1, dataUrl: 'data1' },
      { pageNumber: 3, dataUrl: 'data3' },
    ];
    expect(isOrderModified(withDeletedPage, original)).toBe(true);
  });

  it('constructs reordered filename with _reordered suffix', () => {
    expect(buildReorderedPdfFilename('invoice.pdf')).toBe('invoice_reordered.pdf');
    expect(buildReorderedPdfFilename('my.document.2024.pdf')).toBe('my.document.2024_reordered.pdf');
    expect(buildReorderedPdfFilename('report')).toBe('report_reordered.pdf');
  });
});
