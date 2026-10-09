import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import {
  encodeUrlLines,
  decodeUrlLines,
  parseUrlDetails,
  removeQueryParam,
  UrlEncodeMode,
  UrlDetails,
} from '@/lib/url-logic';
import {
  getUrlByteStats,
  triggerUrlFileDownload,
  UrlByteStats,
} from '@/lib/url-export-logic';

export type UrlMode = 'encode' | 'decode';

export function useUrlEncoderWorkflow(isFr: boolean) {
  const [input, setInput] = useState<string>('');
  const [mode, setMode] = useState<UrlMode>('encode');
  const [encodeMode, setEncodeMode] = useState<UrlEncodeMode>('component');
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [history, setHistory] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Analytics tracking on change
  useEffect(() => {
    if (input.trim()) {
      trackToolUsed('url-encoder', 'utilities');
    }
  }, [input, mode]);

  // Reactive line-by-line conversion
  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: null };
    try {
      if (mode === 'encode') {
        return {
          output: encodeUrlLines(input, encodeMode, true),
          error: null,
        };
      }
      return {
        output: decodeUrlLines(input, true),
        error: null,
      };
    } catch {
      return {
        output: '',
        error: isFr
          ? 'Séquence d’échappement URI non valide ou malformée.'
          : 'Invalid or malformed URI escape sequence.',
      };
    }
  }, [input, mode, encodeMode, isFr]);

  // Structural URL and query parameter inspection
  const urlInspection: UrlDetails = useMemo(() => {
    const candidate = mode === 'decode' ? output : input;
    return parseUrlDetails(candidate);
  }, [input, output, mode]);

  // Update input with history stack
  const handleUpdateInput = useCallback((newVal: string) => {
    setHistory((prev) => [...prev.slice(-25), input]);
    setInput(newVal);
  }, [input]);

  // Undo action
  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setInput(last);
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [history, isFr]);

  // Global Ctrl+Z keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, history.length]);

  // Reset workspace
  const handleClear = useCallback(() => {
    handleUpdateInput('');
    toast.info(isFr ? 'Atelier réinitialisé' : 'Workspace reset');
  }, [handleUpdateInput, isFr]);

  // Remove individual query parameter
  const handleRemoveParam = useCallback((paramKey: string) => {
    const target = mode === 'decode' ? output : input;
    const cleaned = removeQueryParam(target, paramKey);
    if (cleaned !== target) {
      handleUpdateInput(cleaned);
      toast.success(
        isFr ? `Paramètre "${paramKey}" supprimé` : `Parameter "${paramKey}" removed`
      );
    }
  }, [mode, output, input, handleUpdateInput, isFr]);

  // File upload reader (.txt or .url)
  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === 'string') {
        handleUpdateInput(content);
        toast.success(isFr ? `Fichier ${file.name} chargé` : `File ${file.name} loaded`);
      }
    };
    reader.readAsText(file);
  }, [handleUpdateInput, isFr]);

  // Download helper
  const handleDownload = useCallback((content: string, filename: string, mimeType: string) => {
    triggerUrlFileDownload(content, filename, mimeType);
    toast.success(isFr ? `${filename} téléchargé` : `${filename} downloaded`);
  }, [isFr]);

  const hasInput = input.trim().length > 0;
  const hasOutput = output.trim().length > 0;
  const hasParams = urlInspection.isValid && urlInspection.params.length > 0;
  const inputStats: UrlByteStats = useMemo(() => getUrlByteStats(input), [input]);
  const outputStats: UrlByteStats = useMemo(() => getUrlByteStats(output), [output]);

  return {
    input,
    output,
    error,
    mode,
    setMode,
    encodeMode,
    setEncodeMode,
    wordWrap,
    setWordWrap,
    history,
    isDragging,
    setIsDragging,
    urlInspection,
    hasInput,
    hasOutput,
    hasParams,
    inputStats,
    outputStats,
    handleUpdateInput,
    handleUndo,
    handleClear,
    handleRemoveParam,
    handleFileUpload,
    handleDownload,
  };
}

export type UrlEncoderWorkflow = ReturnType<typeof useUrlEncoderWorkflow>;
