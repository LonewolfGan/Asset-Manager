import { useState, useMemo, useCallback } from 'react';
import { apiUrl } from '@/lib/apiBase';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  calculateModifiedPagesCount,
  applyRotationToPage,
  applyRotationToAll,
  applyRotationToSelected,
  togglePageSelection,
} from '@/lib/pdf-rotate-logic';
import type { PageThumb } from '@/hooks/use-pdf-thumbnails';

export interface RotateResultData {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore: number;
  rotatedCount: number;
  totalPages: number;
}

export function usePdfRotateWorkflow(
  file: File | undefined,
  pages: PageThumb[],
  defaultErrorText?: string
) {
  const [pageRotations, setPageRotations] = useState<Record<number, number>>({});
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [result, setResult] = useState<RotateResultData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const modifiedPagesCount = useMemo(() => {
    return calculateModifiedPagesCount(pageRotations);
  }, [pageRotations]);

  const rotateSinglePage = useCallback((pageNumber: number, delta: number = 90) => {
    setPageRotations((prev) => applyRotationToPage(prev, pageNumber, delta));
  }, []);

  const rotateAllPages = useCallback(
    (delta: number) => {
      setPageRotations((prev) => applyRotationToAll(prev, pages.length, delta));
    },
    [pages.length]
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
    setSelectedPages(pages.map((p) => p.pageNumber));
  }, [pages]);

  const clearSelection = useCallback(() => {
    setSelectedPages([]);
  }, []);

  const selectOddPages = useCallback(() => {
    setSelectedPages(pages.filter((p) => p.pageNumber % 2 !== 0).map((p) => p.pageNumber));
  }, [pages]);

  const selectEvenPages = useCallback(() => {
    setSelectedPages(pages.filter((p) => p.pageNumber % 2 === 0).map((p) => p.pageNumber));
  }, [pages]);

  const resetWorkflow = useCallback(() => {
    setPageRotations({});
    setSelectedPages([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  const handleApplyRotation = useCallback(async () => {
    if (!file) return false;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-rotate', 'pdf');
      const fd = new FormData();
      fd.append('file', file);

      if (Object.keys(pageRotations).length > 0) {
        fd.append('rotations', JSON.stringify(pageRotations));
      } else {
        fd.append('rotation', '90');
        fd.append('pages', 'all');
      }

      const res = await fetch(apiUrl('/api/tools/pdf-rotate'), {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(err.message ?? err.error ?? defaultErrorText ?? 'Échec de la rotation.');
      }

      const blob = await res.blob();
      const baseName = file.name.replace(/\.pdf$/i, '');
      const count = modifiedPagesCount > 0 ? modifiedPagesCount : pages.length;

      setResult({
        blob,
        filename: `${baseName}_rotated.pdf`,
        sizeAfter: blob.size,
        sizeBefore: file.size,
        rotatedCount: count,
        totalPages: pages.length,
      });
      return true;
    } catch (e) {
      trackToolError('pdf-rotate', 'general-error');
      setError(
        e instanceof Error ? e.message : defaultErrorText ?? 'Échec de la rotation du document.'
      );
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [file, pageRotations, modifiedPagesCount, pages.length, defaultErrorText]);

  return {
    pageRotations,
    setPageRotations,
    selectedPages,
    setSelectedPages,
    result,
    setResult,
    error,
    setError,
    isProcessing,
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
    resetWorkflow,
    handleApplyRotation,
  };
}
