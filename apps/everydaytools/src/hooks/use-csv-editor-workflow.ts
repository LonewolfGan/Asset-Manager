import { useState, useCallback, useEffect, useRef } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  parseCsvString,
  parseExcelArrayBuffer,
  generateCsvBlob,
  generateExcelBlob,
} from '@/lib/csv-editor-logic';
import { useCsvHistory } from './use-csv-history';
import { useCsvTableState } from './use-csv-table-state';

export function useCsvEditorWorkflow(isFr: boolean) {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [exportResult, setExportResult] = useState<{
    blob: Blob;
    filename: string;
    formatType: 'csv' | 'xlsx';
  } | null>(null);

  const saveSnapshotRef = useRef<() => void>(() => {});
  const triggerUndoToastRef = useRef<(msg: string) => void>(() => {});

  const table = useCsvTableState({
    isFr,
    onBeforeMutation: () => saveSnapshotRef.current(),
    onUndoToast: (msg) => triggerUndoToastRef.current(msg),
  });

  const history = useCsvHistory({
    headers: table.headers,
    rows: table.rows,
    documentName: table.documentName,
    setHeaders: table.setHeaders,
    setRows: table.setRows,
    setDocumentName: table.setDocumentName,
    isFr,
  });

  saveSnapshotRef.current = history.saveSnapshot;
  triggerUndoToastRef.current = history.triggerUndoToast;

  const processUploadedFile = useCallback((file: File) => {
    const isExcel =
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls') ||
      file.type.includes('spreadsheet') ||
      file.type.includes('excel');

    const cleanBaseName = file.name.replace(/\.[^/.]+$/, '');
    table.setDocumentName(cleanBaseName || (isFr ? 'tableau' : 'table'));

    if (isExcel) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const buffer = e.target?.result as ArrayBuffer;
          const { headers: extractedHeaders, rows: extractedRows } = parseExcelArrayBuffer(buffer, isFr);
          table.setHeaders(extractedHeaders);
          table.setRows(extractedRows);
          table.setIsReady(true);
          table.setError(null);
          trackToolUsed('csv-editor', 'excel');
        } catch (err) {
          table.setError(
            err instanceof Error
              ? err.message
              : (isFr ? 'Impossible de lire ce fichier Excel.' : 'Unable to read this Excel file.')
          );
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const { headers: extractedHeaders, rows: extractedRows } = parseCsvString(text);
          table.setHeaders(extractedHeaders);
          table.setRows(extractedRows);
          table.setIsReady(true);
          table.setError(null);
          trackToolUsed('csv-editor', 'excel');
        } catch (err) {
          table.setError(
            err instanceof Error
              ? `Erreur d’analyse du CSV : ${err.message}`
              : (isFr ? 'Le fichier CSV ne contient aucune donnée valide.' : 'The CSV file contains no valid data.')
          );
        }
      };
      reader.readAsText(file);
    }
  }, [isFr, table]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        processUploadedFile(droppedFiles[0]);
      }
    },
    [processUploadedFile]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      processUploadedFile(staged);
    }
  }, [processUploadedFile]);

  const handleReset = useCallback(() => {
    table.resetTable();
    history.clearHistory();
    setShowExportMenu(false);
  }, [table, history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
      if (e.key === 'Escape') {
        if (showExportMenu) {
          setShowExportMenu(false);
          return;
        }
        if (table.searchQuery) {
          table.setSearchQuery('');
          return;
        }
        if (!isInput && table.isReady) {
          if (
            table.rows.length === 0 ||
            window.confirm(
              isFr
                ? 'Quitter ce tableau et revenir à l’accueil ?'
                : 'Leave this table and return to home?'
            )
          ) {
            handleReset();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [table.isReady, table.searchQuery, table.rows.length, showExportMenu, handleReset, isFr, table]);

  const handleExportCsv = (delimiter: string = ',') => {
    const blob = generateCsvBlob(table.headers, table.rows, delimiter);
    const filename = `${table.documentName || (isFr ? 'donnees' : 'data')}.csv`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setShowExportMenu(false);

    setExportResult({ blob, filename, formatType: 'csv' });
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const handleExportExcel = () => {
    const blob = generateExcelBlob(table.headers, table.rows);
    const filename = `${table.documentName || (isFr ? 'donnees' : 'data')}.xlsx`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setShowExportMenu(false);

    setExportResult({ blob, filename, formatType: 'xlsx' });
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  return {
    table,
    history,
    isDragging,
    showExportMenu,
    setShowExportMenu,
    isNextActionOpen,
    setIsNextActionOpen,
    exportResult,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    processUploadedFile,
    handleReset,
    handleExportCsv,
    handleExportExcel,
  };
}
