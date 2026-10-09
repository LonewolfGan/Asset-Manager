import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import hljs from 'highlight.js/lib/core';
import cssLang from 'highlight.js/lib/languages/css';
import { trackToolUsed } from '@/lib/analytics';
import { downloadText } from '@/lib/download';
import {
  formatCssAdvanced,
  minifyCssAdvanced,
  calculateCssMetrics,
  generateCssSandboxHtml,
  type Mode,
  type IndentSize,
  type ViewOutput,
  type DeviceWidth,
} from '@/lib/css-formatter-logic';

hljs.registerLanguage('css', cssLang);

export interface UseCssFormatterWorkflowOptions {
  isFr: boolean;
}

export function useCssFormatterWorkflow({ isFr }: UseCssFormatterWorkflowOptions) {
  // Input and undo history
  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  // Studio configuration
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [stripComments, setStripComments] = useState<boolean>(false);
  const [sortProperties, setSortProperties] = useState<boolean>(false);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [outputView, setOutputView] = useState<ViewOutput>('code');
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('desktop');

  // Synchronized vertical height
  const [editorHeight, setEditorHeight] = useState<number>(460);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(460);

  // Drag & drop file status
  const [isDragOver, setIsDragOver] = useState(false);

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

  // Universal shortcut Ctrl+Z / Cmd+Z
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

  // Synchronized vertical resize handler
  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDraggingRef.current = true;
      startYRef.current = e.clientY;
      startHeightRef.current = editorHeight;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDraggingRef.current) return;
        const deltaY = moveEvent.clientY - startYRef.current;
        const newHeight = Math.max(220, Math.min(900, startHeightRef.current + deltaY));
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

  // Computed formatted/minified output
  const output = useMemo(() => {
    if (!input.trim()) return '';
    if (mode === 'format') {
      return formatCssAdvanced(input, indent, stripComments, sortProperties);
    }
    return minifyCssAdvanced(input, stripComments);
  }, [input, mode, indent, stripComments, sortProperties]);

  // Highlight.js syntax highlighting
  const highlightedOutput = useMemo(() => {
    if (!output) return '';
    try {
      return hljs.highlight(output, { language: 'css', ignoreIllegals: true }).value;
    } catch {
      return output;
    }
  }, [output]);

  // CSS metrics & savings
  const metrics = useMemo(() => {
    return calculateCssMetrics(input, output);
  }, [input, output]);

  // Download handler via SSOT download module
  const handleDownload = useCallback(() => {
    if (!output) return;
    trackToolUsed('css-formatter', 'download');
    const filename = mode === 'minify' ? 'styles.min.css' : 'formatted.css';
    downloadText(output, filename, 'text/css;charset=utf-8');
    toast.success(
      isFr ? 'Feuille de style CSS téléchargée' : 'CSS stylesheet downloaded'
    );
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
            isFr ? `Fichier « ${file.name} » chargé` : `File "${file.name}" loaded`
          );
        }
      };
      reader.readAsText(file);
    },
    [input, isFr]
  );

  const hasContent = Boolean(input.trim());

  // Sandbox HTML template
  const sandboxHtml = useMemo(() => {
    const appliedCss = output || input;
    return generateCssSandboxHtml(appliedCss, isFr);
  }, [output, input, isFr]);

  return {
    input,
    setInput,
    output,
    highlightedOutput,
    history,
    mode,
    setMode,
    indent,
    setIndent,
    stripComments,
    setStripComments,
    sortProperties,
    setSortProperties,
    wordWrap,
    setWordWrap,
    outputView,
    setOutputView,
    deviceWidth,
    setDeviceWidth,
    editorHeight,
    isDragOver,
    setIsDragOver,
    metrics,
    hasContent,
    sandboxHtml,
    handleInputChange,
    handleUndo,
    handleClear,
    handleFileUpload,
    handleDownload,
    handleMouseDownResize,
  };
}
