import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  downloadPatchFile,
  downloadOriginalFile,
  downloadModifiedFile,
} from '@/lib/diff-checker-downloads';
import {
  computeTextDiff,
  generateUnifiedPatch,
  DIFF_SAMPLES,
  type DiffOptions,
  type DiffViewMode,
} from '@/lib/diff-checker-logic';

export function useDiffCheckerWorkflow(isFr: boolean) {
  // Source texts: Original & Modified
  const [textA, setTextA] = useState<string>('');
  const [textB, setTextB] = useState<string>('');

  // Undo history
  const [history, setHistory] = useState<Array<{ a: string; b: string }>>([]);

  // View mode and word wrap
  const [viewMode, setViewMode] = useState<DiffViewMode>('edit');
  const [wordWrap, setWordWrap] = useState<boolean>(true);

  // Diff options
  const [ignoreWhitespace, setIgnoreWhitespace] = useState<boolean>(false);
  const [ignoreCase, setIgnoreCase] = useState<boolean>(false);

  // Change navigation
  const [activeChangeIndex, setActiveChangeIndex] = useState<number>(0);
  const changeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const diffScrollContainerRef = useRef<HTMLDivElement>(null);

  // Synchronized editor height
  const [editorHeight, setEditorHeight] = useState<number>(560);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(560);

  // Drag & drop state
  const [isDragOverOriginal, setIsDragOverOriginal] = useState(false);
  const [isDragOverModified, setIsDragOverModified] = useState(false);
  const lastHistoryPushRef = useRef<number>(0);

  const pushSnapshot = useCallback((a: string, b: string) => {
    const now = Date.now();
    if (now - lastHistoryPushRef.current > 1000) {
      setHistory((prev) => [...prev.slice(-25), { a, b }]);
      lastHistoryPushRef.current = now;
    }
  }, []);

  const handleUpdateOriginal = useCallback(
    (val: string) => {
      pushSnapshot(textA, textB);
      setTextA(val);
    },
    [textA, textB, pushSnapshot]
  );

  const handleUpdateModified = useCallback(
    (val: string) => {
      pushSnapshot(textA, textB);
      setTextB(val);
    },
    [textA, textB, pushSnapshot]
  );

  const handleUndo = useCallback(() => {
    lastHistoryPushRef.current = 0;
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      setTextA(last.a);
      setTextB(last.b);
      return prev.slice(0, -1);
    });
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [isFr]);

  // Universal keyboard shortcut Ctrl+Z / Cmd+Z
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

  // Vertical resize handle
  const handleMouseDownResize = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(300, Math.min(1200, startHeightRef.current + deltaY));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [editorHeight]);

  const handleSwap = useCallback(() => {
    setHistory((prev) => [...prev.slice(-25), { a: textA, b: textB }]);
    lastHistoryPushRef.current = 0;
    setTextA(textB);
    setTextB(textA);
    toast.success(isFr ? 'Textes intervertis' : 'Texts swapped');
  }, [textA, textB, isFr]);

  const handleClear = useCallback(() => {
    setHistory((prev) => [...prev.slice(-25), { a: textA, b: textB }]);
    lastHistoryPushRef.current = 0;
    setTextA('');
    setTextB('');
    setViewMode('edit');
    toast.info(isFr ? 'Textes effacés' : 'Texts cleared');
  }, [textA, textB, isFr]);

  const handleFileUpload = useCallback(
    (file: File, target: 'original' | 'modified') => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text !== undefined) {
          if (target === 'original') {
            handleUpdateOriginal(text);
            toast.success(
              isFr
                ? `Fichier « ${file.name} » chargé dans le texte original`
                : `File "${file.name}" loaded into original text`
            );
          } else {
            handleUpdateModified(text);
            toast.success(
              isFr
                ? `Fichier « ${file.name} » chargé dans le texte modifié`
                : `File "${file.name}" loaded into modified text`
            );
          }
        }
      };
      reader.readAsText(file);
    },
    [handleUpdateOriginal, handleUpdateModified, isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFileUpload(staged, 'original');
    }
  }, [handleFileUpload]);

  const diffOptions: DiffOptions = useMemo(
    () => ({
      ignoreWhitespace,
      ignoreCase,
    }),
    [ignoreWhitespace, ignoreCase]
  );

  const diffResult = useMemo(() => {
    trackToolUsed('diff-checker', 'textCode');
    return computeTextDiff(textA, textB, diffOptions);
  }, [textA, textB, diffOptions]);

  const changedLineIndices = useMemo(() => {
    const indices: number[] = [];
    diffResult.lines.forEach((line, idx) => {
      if (line.type !== 'equal') {
        indices.push(idx);
      }
    });
    return indices;
  }, [diffResult.lines]);

  const scrollToChange = useCallback(
    (index: number) => {
      if (changedLineIndices.length === 0) return;
      const boundedIndex =
        (index + changedLineIndices.length) % changedLineIndices.length;
      setActiveChangeIndex(boundedIndex);
      const lineIndex = changedLineIndices[boundedIndex];
      const el = changeRefs.current[lineIndex];
      if (el && diffScrollContainerRef.current) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    },
    [changedLineIndices]
  );

  const unifiedPatchText = useMemo(() => {
    return generateUnifiedPatch(textA, textB, diffResult.lines);
  }, [textA, textB, diffResult.lines]);

  const handleDownloadPatch = useCallback(() => {
    downloadPatchFile(unifiedPatchText, isFr);
  }, [unifiedPatchText, isFr]);

  const handleDownloadOriginal = useCallback(() => {
    downloadOriginalFile(textA, isFr);
  }, [textA, isFr]);

  const handleDownloadModified = useCallback(() => {
    downloadModifiedFile(textB, isFr);
  }, [textB, isFr]);

  const loadSample = useCallback(
    (sampleKey: 'text' | 'code' | 'json') => {
      const sample = DIFF_SAMPLES[sampleKey];
      if (sample) {
        handleUpdateOriginal(sample.a);
        handleUpdateModified(sample.b);
        setViewMode('split');
        toast.success(isFr ? `Exemple « ${sample.name} » chargé` : `Sample "${sample.name}" loaded`);
      }
    },
    [handleUpdateOriginal, handleUpdateModified, isFr]
  );

  const hasContent = Boolean(textA.trim() || textB.trim());
  const hasDiffs = changedLineIndices.length > 0;

  return {
    textA,
    textB,
    history,
    viewMode,
    setViewMode,
    wordWrap,
    setWordWrap,
    ignoreWhitespace,
    setIgnoreWhitespace,
    ignoreCase,
    setIgnoreCase,
    activeChangeIndex,
    changeRefs,
    diffScrollContainerRef,
    editorHeight,
    isDragOverOriginal,
    setIsDragOverOriginal,
    isDragOverModified,
    setIsDragOverModified,
    handleUpdateOriginal,
    handleUpdateModified,
    handleUndo,
    handleSwap,
    handleClear,
    handleFileUpload,
    handleMouseDownResize,
    scrollToChange,
    diffResult,
    changedLineIndices,
    unifiedPatchText,
    handleDownloadPatch,
    handleDownloadOriginal,
    handleDownloadModified,
    loadSample,
    hasContent,
    hasDiffs,
  };
}
