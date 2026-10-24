import { useState, useMemo, useCallback } from 'react';
import {
  calculateModifiedPagesCount,
  applyRotationToPage,
  applyRotationToAll,
  applyRotationToSelected,
  togglePageSelection,
} from '@/lib/pdf-rotate-logic';

export function usePdfRotateOptions(totalPages: number) {
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [selectedPages, setSelectedPages] = useState<number[]>([]);

  const modifiedPagesCount = useMemo(() => {
    return calculateModifiedPagesCount(pageRotations);
  }, [pageRotations]);

  const rotateSinglePage = useCallback((pageNumber: number, delta = 90) => {
    setPageRotations((prev) => applyRotationToPage(prev, pageNumber, delta));
  }, []);

  const rotateAllPages = useCallback(
    (delta: number) => {
      setPageRotations((prev) => applyRotationToAll(prev, totalPages, delta));
    },
    [totalPages]
  );

  const rotateSelectedPages = useCallback(
    (delta: number) => {
      if (selectedPages.length === 0) {
        rotateAllPages(delta);
        return;
      }
      setPageRotations((prev) => applyRotationToSelected(prev, selectedPages, delta));
    },
    [selectedPages, rotateAllPages]
  );

  const resetAllRotations = useCallback(() => {
    setPageRotations({});
  }, []);

  const toggleSelectPage = useCallback((pageNum: number) => {
    setSelectedPages((prev) => togglePageSelection(prev, pageNum));
  }, []);

  const selectAllPages = useCallback(() => {
    const all = Array.from({ length: totalPages }, (_, i) => i + 1);
    setSelectedPages(all);
  }, [totalPages]);

  const clearSelection = useCallback(() => {
    setSelectedPages([]);
  }, []);

  const selectOddPages = useCallback(() => {
    const odd = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 !== 0);
    setSelectedPages(odd);
  }, [totalPages]);

  const selectEvenPages = useCallback(() => {
    const even = Array.from({ length: totalPages }, (_, i) => i + 1).filter((p) => p % 2 === 0);
    setSelectedPages(even);
  }, [totalPages]);

  const resetOptions = useCallback(() => {
    setPageRotations({});
    setSelectedPages([]);
  }, []);

  return {
    pageRotations,
    setPageRotations,
    selectedPages,
    setSelectedPages,
    modifiedPagesCount,
    rotateSinglePage,
    rotateAllPages,
    rotateSelectedPages,
    resetAllRotations,
    toggleSelectPage,
    selectAllPages,
    clearSelection,
    selectOddPages,
    selectEvenPages,
    resetOptions,
  };
}
