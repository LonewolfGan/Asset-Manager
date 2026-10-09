import { useState, useRef, useCallback, useEffect } from 'react';
import type { TableSnapshot } from '@/lib/csv-editor-logic';

interface UseCsvHistoryProps {
  headers: string[];
  rows: string[][];
  documentName: string;
  setHeaders: (headers: string[]) => void;
  setRows: (rows: string[][]) => void;
  setDocumentName: (name: string) => void;
  isFr: boolean;
}

export function useCsvHistory({
  headers,
  rows,
  documentName,
  setHeaders,
  setRows,
  setDocumentName,
  isFr,
}: UseCsvHistoryProps) {
  const [history, setHistory] = useState<TableSnapshot[]>([]);
  const [future, setFuture] = useState<TableSnapshot[]>([]);
  const [undoNotification, setUndoNotification] = useState<{ id: number; message: string } | null>(null);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const triggerUndoToast = useCallback((message: string) => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    const id = Date.now();
    setUndoNotification({ id, message });
    undoTimeoutRef.current = setTimeout(() => {
      setUndoNotification((curr) => (curr?.id === id ? null : curr));
    }, 6000);
  }, []);

  const saveSnapshot = useCallback(() => {
    setHistory((prev) => [
      ...prev.slice(-30),
      {
        headers: [...headers],
        rows: rows.map((r) => [...r]),
        documentName,
      },
    ]);
    setFuture([]);
  }, [headers, rows, documentName]);

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      setFuture((f) => [
        {
          headers: [...headers],
          rows: rows.map((r) => [...r]),
          documentName,
        },
        ...f,
      ]);
      setHeaders(previous.headers);
      setRows(previous.rows);
      setDocumentName(previous.documentName);
      return prev.slice(0, prev.length - 1);
    });
    setUndoNotification(null);
  }, [headers, rows, documentName, setHeaders, setRows, setDocumentName]);

  const handleRedo = useCallback(() => {
    setFuture((prev) => {
      if (prev.length === 0) return prev;
      const next = prev[0];
      setHistory((h) => [
        ...h,
        {
          headers: [...headers],
          rows: rows.map((r) => [...r]),
          documentName,
        },
      ]);
      setHeaders(next.headers);
      setRows(next.rows);
      setDocumentName(next.documentName);
      return prev.slice(1);
    });
  }, [headers, rows, documentName, setHeaders, setRows, setDocumentName]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isInputActive =
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          handleRedo();
        } else if (!isInputActive) {
          e.preventDefault();
          handleUndo();
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'y') {
        if (!isInputActive) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setFuture([]);
    setUndoNotification(null);
  }, []);

  return {
    history,
    future,
    undoNotification,
    triggerUndoToast,
    saveSnapshot,
    handleUndo,
    handleRedo,
    clearHistory,
  };
}
