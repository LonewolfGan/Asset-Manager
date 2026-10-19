import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { toast } from 'sonner';
import { consumeHandoffFile, consumeHandoffText } from '@/lib/file-handoff';
import {
  analyzeText,
  transformTextCase,
  type DetailedTextStats,
} from '@/lib/word-counter-logic';
import {
  buildStatisticalReport,
  buildJsonStatisticsPayload,
  downloadTextFile,
} from '@/lib/word-counter-export-logic';
import { WORD_COUNTER_SAMPLES } from '@/lib/word-counter-samples';

export function useWordCounterWorkflow(isFr: boolean) {
  const [text, setText] = useState<string>('');
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [loadedFile, setLoadedFile] = useState<{ name: string; size: number } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lastHistoryPushRef = useRef<number>(0);
  const textRef = useRef<string>(text);
  textRef.current = text;

  const stats: DetailedTextStats = useMemo(() => {
    return analyzeText(text);
  }, [text]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (text.trim().length <= 10) return () => {};
    const timer = setTimeout(() => {
      trackToolUsed('word-counter', 'analyzed');
    }, 2000);
    return () => clearTimeout(timer);
  }, [text]);

  const handleTextChange = (newVal: string) => {
    const now = Date.now();
    if (now - lastHistoryPushRef.current > 1000) {
      setUndoStack((prev) => [...prev.slice(-30), text]);
      setRedoStack([]);
      lastHistoryPushRef.current = now;
    }
    setText(newVal);
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setRedoStack((prev) => [...prev.slice(-30), text]);
    setUndoStack((prev) => prev.slice(0, -1));
    setText(previous);
    lastHistoryPushRef.current = 0;
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [undoStack, text, isFr]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setUndoStack((prev) => [...prev.slice(-30), text]);
    setRedoStack((prev) => prev.slice(0, -1));
    setText(next);
    lastHistoryPushRef.current = 0;
    toast.info(isFr ? 'Action rétablie' : 'Action redone');
  }, [redoStack, text, isFr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA');

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInputFocused || activeEl === textareaRef.current) {
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInputFocused || activeEl === textareaRef.current) {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleClear = () => {
    if (!text) return;
    setUndoStack((prev) => [...prev.slice(-30), text]);
    setRedoStack([]);
    lastHistoryPushRef.current = 0;
    setText('');
    setLoadedFile(null);
    toast.info(isFr ? 'Texte effacé (Ctrl+Z pour restaurer)' : 'Text cleared (Ctrl+Z to restore)');
  };

  const processFile = useCallback((file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (typeof content === 'string') {
        setUndoStack((prev) => [...prev.slice(-30), textRef.current]);
        setRedoStack([]);
        lastHistoryPushRef.current = 0;
        setText(content);
        setLoadedFile({ name: file.name, size: file.size });
        toast.success(isFr ? `Document ${file.name} chargé` : `Document ${file.name} loaded`);
        trackToolUsed('word-counter', 'file-imported');
      }
    };
    reader.readAsText(file);
  }, [isFr]);

  useEffect(() => {
    const stagedFile = consumeHandoffFile();
    if (stagedFile) {
      processFile(stagedFile);
      return;
    }
    const stagedText = consumeHandoffText();
    if (stagedText && typeof stagedText === 'string') {
      setText(stagedText);
      toast.info(isFr ? 'Texte importé depuis le handoff' : 'Text imported from handoff');
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    e.target.value = '';
  };

  const handleDetachFile = () => {
    setLoadedFile(null);
    toast.info(isFr ? 'Document détaché' : 'Document detached');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDraggingOver) setIsDraggingOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleTransformCase = (
    mode: 'upper' | 'lower' | 'title' | 'sentence' | 'slug' | 'camel' | 'snake' | 'kebab'
  ) => {
    if (!text) return;
    const transformed = transformTextCase(text, mode);
    setUndoStack((prev) => [...prev.slice(-30), text]);
    setRedoStack([]);
    lastHistoryPushRef.current = 0;
    setText(transformed);
    toast.success(isFr ? 'Casse modifiée' : 'Case modified');
    trackToolUsed('word-counter', `case-${mode}`);
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = WORD_COUNTER_SAMPLES.find((s) => s.id === sampleId) ?? WORD_COUNTER_SAMPLES[0];
    if (!sample) return;
    setUndoStack((prev) => [...prev.slice(-30), text]);
    setRedoStack([]);
    lastHistoryPushRef.current = 0;
    setText(sample.content);
    setLoadedFile(null);
    toast.success(isFr ? `Exemple « ${sample.labelFr} » chargé` : `Sample "${sample.labelEn}" loaded`);
  };

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(isFr ? 'Texte copié dans le presse-papier' : 'Text copied to clipboard');
    } catch {
      toast.error(isFr ? 'Impossible d’accéder au presse-papier' : 'Unable to access clipboard');
    }
  };

  const handleDownloadTxt = () => {
    if (!text) return;
    downloadTextFile(text, 'document.txt');
    toast.success(isFr ? 'Fichier texte téléchargé' : 'Text file downloaded');
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const handleCopyReport = async () => {
    if (!text) return;
    const report = buildStatisticalReport(stats, isFr);
    try {
      await navigator.clipboard.writeText(report);
      toast.success(isFr ? 'Rapport statistique copié' : 'Statistical report copied');
      trackToolUsed('word-counter', 'copy-report');
    } catch {
      toast.error(isFr ? 'Impossible de copier le rapport' : 'Failed to copy report');
    }
  };

  const handleExportJson = async () => {
    if (!text) return;
    const jsonStr = buildJsonStatisticsPayload(stats);
    try {
      await navigator.clipboard.writeText(jsonStr);
      toast.success(isFr ? 'Statistiques JSON copiées' : 'JSON statistics copied');
      trackToolUsed('word-counter', 'export-json');
    } catch {
      toast.error(isFr ? 'Impossible de copier le JSON' : 'Failed to copy JSON');
    }
  };

  return {
    text,
    undoStack,
    redoStack,
    loadedFile,
    isDraggingOver,
    isNextActionOpen,
    stats,
    fileInputRef,
    textareaRef,
    setIsNextActionOpen,
    handleTextChange,
    handleUndo,
    handleRedo,
    handleClear,
    handleFileUpload,
    handleDetachFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleTransformCase,
    handleLoadSample,
    handleCopyText,
    handleDownloadTxt,
    handleCopyReport,
    handleExportJson,
  };
}

export type WordCounterWorkflow = ReturnType<typeof useWordCounterWorkflow>;
