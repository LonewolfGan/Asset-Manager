import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import hljs from 'highlight.js/lib/core';
import xmlLang from 'highlight.js/lib/languages/xml';
import { trackToolUsed } from '@/lib/analytics';
import { useLocale } from '@/hooks/use-locale';
import { toast } from 'sonner';
import {
  formatHtml,
  minifyHtml,
  calculateHtmlMetrics,
  type Mode,
  type IndentSize,
  type ViewOutput,
  type DeviceWidth,
} from '@/lib/html-formatter-logic';

hljs.registerLanguage('xml', xmlLang);

export function useHtmlFormatterWorkflow() {
  const { isFr } = useLocale();

  // Entrée et historique pour Undo (Ctrl+Z)
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  // Configuration
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [stripComments, setStripComments] = useState<boolean>(false);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [outputView, setOutputView] = useState<ViewOutput>('code');
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('desktop');

  // Hauteur synchronisée des deux éditeurs
  const [editorHeight, setEditorHeight] = useState<number>(440);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(440);

  // Drag & drop de fichier .html
  const [isDragOver, setIsDragOver] = useState(false);

  // Mise à jour de l'input avec enregistrement de l'historique
  const handleInputChange = useCallback(
    (val: string) => {
      setHistory((prev) => [...prev.slice(-30), input]);
      setInput(val);
    },
    [input]
  );

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setInput(last);
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [history, isFr]);

  // Raccourci clavier Ctrl+Z
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

  // Gestion du redimensionnement vertical synchronisé
  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      startYRef.current = e.clientY;
      startHeightRef.current = editorHeight;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const deltaY = moveEvent.clientY - startYRef.current;
        const newHeight = Math.max(
          220,
          Math.min(900, startHeightRef.current + deltaY)
        );
        setEditorHeight(newHeight);
      };

      const handleMouseUp = () => {
        isDraggingRef.current = false;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    },
    [editorHeight]
  );

  // Calcul réactif du résultat formaté ou minifié
  const output = useMemo(() => {
    if (!input.trim()) return '';
    if (mode === 'format') {
      return formatHtml(input, indent, stripComments);
    }
    return minifyHtml(input, stripComments);
  }, [input, mode, indent, stripComments]);

  // Coloration syntaxique HTML
  const highlightedOutput = useMemo(() => {
    if (!output) return '';
    try {
      return hljs.highlight(output, { language: 'xml', ignoreIllegals: true })
        .value;
    } catch {
      return output;
    }
  }, [output]);

  // Télémétrie et métriques du balisage
  const metrics = useMemo(() => {
    return calculateHtmlMetrics(input, output);
  }, [input, output]);

  // Téléchargement
  const handleDownload = useCallback(() => {
    if (!output) return;
    trackToolUsed('html-formatter', 'download');
    const blob = new Blob([output], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'minify' ? 'index.min.html' : 'formatted.html';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isFr ? 'Fichier HTML téléchargé' : 'HTML file downloaded');
  }, [output, mode, isFr]);

  const handleClear = useCallback(() => {
    setHistory((prev) => [...prev.slice(-30), input]);
    setInput('');
    toast.info(isFr ? 'Atelier vidé' : 'Workspace cleared');
  }, [input, isFr]);

  const handleFileUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        if (text) {
          setHistory((prev) => [...prev.slice(-30), input]);
          setInput(text);
          toast.success(
            isFr
              ? `Fichier « ${file.name} » chargé`
              : `File "${file.name}" loaded`
          );
        }
      };
      reader.readAsText(file);
    },
    [input, isFr]
  );

  const hasContent = Boolean(input.trim());

  return {
    input,
    history,
    mode,
    setMode,
    indent,
    setIndent,
    stripComments,
    setStripComments,
    wordWrap,
    setWordWrap,
    outputView,
    setOutputView,
    deviceWidth,
    setDeviceWidth,
    editorHeight,
    isDragOver,
    setIsDragOver,
    output,
    highlightedOutput,
    metrics,
    hasContent,
    handleInputChange,
    handleUndo,
    handleMouseDownResize,
    handleDownload,
    handleClear,
    handleFileUpload,
  };
}
