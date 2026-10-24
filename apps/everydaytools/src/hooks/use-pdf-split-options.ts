import { useState, useMemo, useCallback } from 'react';
import { type Tranche, formatPagesToRangeString } from '@/lib/pdf-split-logic';

export interface OverlappingTranchesInfo {
  rangesText: string;
  count: number;
}

export function usePdfSplitOptions(totalPages: number) {
  const [activeMode, setActiveMode] = useState<'extract' | 'split'>('extract');

  // Mode 1: Extract
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [extractRangeFrom, setExtractRangeFrom] = useState<number>(1);
  const [extractRangeTo, setExtractRangeTo] = useState<number>(1);
  const [isEditingCustomSyntax, setIsEditingCustomSyntax] = useState<boolean>(false);
  const [rawSyntaxText, setRawSyntaxText] = useState<string>('');
  const [extractAsSinglePdf, setExtractAsSinglePdf] = useState<boolean>(true);

  // Mode 2: Split
  const [tranches, setTranches] = useState<Tranche[]>([]);
  const [batchChunkSize, setBatchChunkSize] = useState<number>(2);
  const [splitViewMode, setSplitViewMode] = useState<'list' | 'pages'>('list');

  const overlappingTranchesInfo = useMemo<OverlappingTranchesInfo | null>(() => {
    if (tranches.length <= 1) return null;
    const pageToFiles = new Map<number, number[]>();
    tranches.forEach((tr, idx) => {
      for (let p = tr.from; p <= tr.to; p++) {
        const list = pageToFiles.get(p) || [];
        list.push(idx + 1);
        pageToFiles.set(p, list);
      }
    });

    const overlappedPages: number[] = [];
    pageToFiles.forEach((fileIndices, page) => {
      if (fileIndices.length > 1) overlappedPages.push(page);
    });

    if (overlappedPages.length === 0) return null;
    overlappedPages.sort((a, b) => a - b);
    return {
      rangesText: formatPagesToRangeString(overlappedPages),
      count: overlappedPages.length,
    };
  }, [tranches]);

  const handleAddRange = useCallback(() => {
    const from = Math.min(extractRangeFrom, extractRangeTo);
    const to = Math.max(extractRangeFrom, extractRangeTo);
    const newPages: number[] = [];
    for (let p = from; p <= to; p++) newPages.push(p);
    setSelectedPages((prev) => Array.from(new Set([...prev, ...newPages])).sort((a, b) => a - b));
  }, [extractRangeFrom, extractRangeTo]);

  const resetOptions = useCallback(() => {
    setSelectedPages([]);
    setTranches([]);
    setExtractRangeFrom(1);
    setExtractRangeTo(1);
    setIsEditingCustomSyntax(false);
    setRawSyntaxText('');
    setExtractAsSinglePdf(true);
  }, []);

  const canConvert =
    (activeMode === 'extract' && selectedPages.length > 0) ||
    (activeMode === 'split' && tranches.length > 0);

  return {
    activeMode,
    setActiveMode,
    selectedPages,
    setSelectedPages,
    extractRangeFrom,
    setExtractRangeFrom,
    extractRangeTo,
    setExtractRangeTo,
    isEditingCustomSyntax,
    setIsEditingCustomSyntax,
    rawSyntaxText,
    setRawSyntaxText,
    extractAsSinglePdf,
    setExtractAsSinglePdf,
    tranches,
    setTranches,
    batchChunkSize,
    setBatchChunkSize,
    splitViewMode,
    setSplitViewMode,
    overlappingTranchesInfo,
    handleAddRange,
    resetOptions,
    canConvert,
  };
}
