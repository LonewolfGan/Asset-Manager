import { useState, useMemo, useCallback } from 'react';
import {
  type SortConfig,
  createBlankTable,
  createSampleTable,
  filterAndSortRows,
} from '@/lib/csv-editor-logic';
import { trackToolUsed } from '@/lib/analytics';

interface UseCsvTableStateProps {
  isFr: boolean;
  onBeforeMutation: () => void;
  onUndoToast: (message: string) => void;
}

export function useCsvTableState({
  isFr,
  onBeforeMutation,
  onUndoToast,
}: UseCsvTableStateProps) {
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [documentName, setDocumentName] = useState<string>('tableau');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartBlank = useCallback(() => {
    const blank = createBlankTable(isFr);
    setHeaders(blank.headers);
    setRows(blank.rows);
    setDocumentName(blank.documentName);
    setIsReady(true);
    setError(null);
    trackToolUsed('csv-editor', 'excel');
  }, [isFr]);

  const handleLoadSample = useCallback(() => {
    const sample = createSampleTable(isFr);
    setHeaders(sample.headers);
    setRows(sample.rows);
    setDocumentName(sample.documentName);
    setIsReady(true);
    setError(null);
    trackToolUsed('csv-editor', 'excel');
  }, [isFr]);

  const updateCell = useCallback((rowIndex: number, colIndex: number, val: string) => {
    setRows((prev) => {
      const next = prev.map((row) => [...row]);
      if (next[rowIndex]) {
        next[rowIndex][colIndex] = val;
      }
      return next;
    });
  }, []);

  const updateHeader = useCallback((colIndex: number, val: string) => {
    setHeaders((prev) => {
      const next = [...prev];
      next[colIndex] = val;
      return next;
    });
  }, []);

  const addRow = useCallback(() => {
    onBeforeMutation();
    setRows((prev) => [...prev, new Array(headers.length).fill('')]);
  }, [headers.length, onBeforeMutation]);

  const deleteRow = useCallback((rowIndex: number) => {
    onBeforeMutation();
    setRows((prev) => prev.filter((_, idx) => idx !== rowIndex));
    onUndoToast(isFr ? `Ligne ${rowIndex + 1} supprimée` : `Row ${rowIndex + 1} deleted`);
  }, [isFr, onBeforeMutation, onUndoToast]);

  const addCol = useCallback(() => {
    onBeforeMutation();
    setHeaders((prev) => [...prev, isFr ? `Colonne ${prev.length + 1}` : `Column ${prev.length + 1}`]);
    setRows((prev) => prev.map((r) => [...r, '']));
  }, [isFr, onBeforeMutation]);

  const deleteCol = useCallback((colIndex: number) => {
    if (headers.length <= 1) {
      setError(
        isFr
          ? 'Un tableau doit conserver au minimum une colonne.'
          : 'A table must keep at least one column.'
      );
      return;
    }
    const colName = headers[colIndex] || (isFr ? `Colonne ${colIndex + 1}` : `Column ${colIndex + 1}`);
    onBeforeMutation();
    setHeaders((prev) => prev.filter((_, idx) => idx !== colIndex));
    setRows((prev) => prev.map((r) => r.filter((_, idx) => idx !== colIndex)));
    onUndoToast(isFr ? `Colonne "${colName}" supprimée` : `Column "${colName}" deleted`);
  }, [headers, isFr, onBeforeMutation, onUndoToast]);

  const handleSort = useCallback((colIndex: number) => {
    setSortConfig((prev) => {
      if (prev && prev.colIndex === colIndex) {
        return prev.direction === 'asc' ? { colIndex, direction: 'desc' } : null;
      }
      return { colIndex, direction: 'asc' };
    });
  }, []);

  const clearAllRows = useCallback(() => {
    onBeforeMutation();
    setRows([]);
    onUndoToast(isFr ? 'Tableau vidé' : 'Table cleared');
  }, [isFr, onBeforeMutation, onUndoToast]);

  const resetTable = useCallback(() => {
    setHeaders([]);
    setRows([]);
    setIsReady(false);
    setSearchQuery('');
    setSortConfig(null);
    setError(null);
  }, []);

  const processedRows = useMemo(() => {
    return filterAndSortRows(rows, searchQuery, sortConfig);
  }, [rows, searchQuery, sortConfig]);

  return {
    headers,
    setHeaders,
    rows,
    setRows,
    documentName,
    setDocumentName,
    isReady,
    setIsReady,
    searchQuery,
    setSearchQuery,
    sortConfig,
    error,
    setError,
    processedRows,
    handleStartBlank,
    handleLoadSample,
    updateCell,
    updateHeader,
    addRow,
    deleteRow,
    addCol,
    deleteCol,
    handleSort,
    clearAllRows,
    resetTable,
  };
}
