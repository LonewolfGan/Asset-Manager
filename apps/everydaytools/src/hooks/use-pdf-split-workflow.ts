import { useState, useMemo, useCallback } from 'react';
import { apiUrl } from '@/lib/apiBase';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  type Tranche,
  formatPagesToRangeString,
  generateBatchSlices,
} from '@/lib/pdf-split-logic';
import type { SplitResultData } from '@/components/pdf-split/PdfSplitResultView';

export function usePdfSplitWorkflow(file: File | undefined, totalPages: number, isFr: boolean) {
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

  // Processing & Results
  const [result, setResult] = useState<SplitResultData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const overlappingTranchesInfo = useMemo(() => {
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

  const resetWorkflow = useCallback(() => {
    setSelectedPages([]);
    setTranches([]);
    setResult(null);
    setError(null);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file) return;
    if (activeMode === 'extract' && selectedPages.length === 0) {
      setError(isFr ? 'Veuillez sélectionner au moins une page à extraire.' : 'Please select at least one page to extract.');
      return;
    }
    if (activeMode === 'split' && tranches.length === 0) {
      setError(isFr ? 'Veuillez définir au moins une tranche de découpe.' : 'Please define at least one split range.');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-split', 'pdf');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('mode', 'range');

      if (activeMode === 'extract') {
        fd.append('ranges', formatPagesToRangeString(selectedPages));
        fd.append('merge', extractAsSinglePdf ? 'true' : 'false');
      } else {
        fd.append('ranges', tranches.map((t) => `${t.from}-${t.to}`).join(', '));
        fd.append('merge', 'false');
      }

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-split'), { method: 'POST', body: fd }),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string; message?: string };
        throw new Error(err.message ?? err.error ?? (isFr ? 'Échec de la découpe.' : 'Failed to split.'));
      }

      const blob = await res.blob();
      const ct = res.headers.get('Content-Type') ?? '';
      const isZip = ct.includes('zip') || (activeMode === 'extract' && !extractAsSinglePdf) || activeMode === 'split';
      const filename = file.name.replace(/\.pdf$/i, isZip ? '_split.zip' : isFr ? '_extraits.pdf' : '_extracted.pdf');

      const details =
        activeMode === 'extract'
          ? extractAsSinglePdf
            ? `${selectedPages.length} pages (${formatPagesToRangeString(selectedPages)})`
            : `${selectedPages.length} PDF (${formatPagesToRangeString(selectedPages)})`
          : `${tranches.length} PDF générés`;

      setResult({
        blob,
        filename,
        isZip,
        sizeAfter: blob.size,
        sizeBefore: file.size,
        title: isZip ? (isFr ? 'Archive ZIP' : 'ZIP Archive') : (isFr ? 'Document extrait' : 'Extracted PDF'),
        details,
      });
      return true;
    } catch (e) {
      trackToolError('pdf-split', 'general-error');
      setError(e instanceof Error ? e.message : (isFr ? 'La découpe a échoué.' : 'Splitting failed.'));
      return false;
    } finally {
      setIsProcessing(false);
    }
  }, [file, activeMode, selectedPages, tranches, extractAsSinglePdf, isFr]);

  const canConvert =
    (activeMode === 'extract' && selectedPages.length > 0) || (activeMode === 'split' && tranches.length > 0);

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
    result,
    setResult,
    isProcessing,
    error,
    setError,
    overlappingTranchesInfo,
    handleAddRange,
    handleConvert,
    resetWorkflow,
    canConvert,
  };
}
