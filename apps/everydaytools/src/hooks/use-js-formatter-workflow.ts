import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { downloadText } from '@/lib/download';
import { toast } from 'sonner';
import hljs from 'highlight.js/lib/core';
import jsLang from 'highlight.js/lib/languages/javascript';
import tsLang from 'highlight.js/lib/languages/typescript';
import {
  type Mode,
  type Language,
  type IndentSize,
  type QuotesStyle,
  type ViewOutput,
  type ExecutionLog,
  type JsIssue,
  beautifyJs,
  minifyJs,
  computeJsMetrics,
  detectJsIssues,
  JS_SAMPLES,
} from '../lib/js-formatter-logic';
import { runJsInSandbox } from '../lib/js-formatter-sandbox';

hljs.registerLanguage('javascript', jsLang);
hljs.registerLanguage('typescript', tsLang);

export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function useJsFormatterWorkflow() {
  const { isFr } = useLocale();

  const [input, setInput] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  const [mode, setMode] = useState<Mode>('format');
  const [language, setLanguage] = useState<Language>('javascript');
  const [indent, setIndent] = useState<IndentSize>(2);
  const [semicolons, setSemicolons] = useState<boolean>(true);
  const [quotes, setQuotes] = useState<QuotesStyle>('preserve');
  const [stripComments, setStripComments] = useState<boolean>(false);
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [outputView, setOutputView] = useState<ViewOutput>('code');

  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  const [editorHeight, setEditorHeight] = useState<number>(460);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(460);

  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (
      /\b(interface|type\s+[A-Z]|:\s*(string|number|boolean|any|void)|as\s+[A-Z]|<[A-Z][a-zA-Z0-9, ]*>)\b/.test(
        input
      )
    ) {
      setLanguage('typescript');
    }
  }, [input]);

  const lastHistoryTimeRef = useRef<number>(0);
  const handleInputChange = useCallback((val: string) => {
    const now = Date.now();
    if (now - lastHistoryTimeRef.current > 1000) {
      setHistory((prev) => [...prev.slice(-30), input]);
      lastHistoryTimeRef.current = now;
    }
    setInput(val);
  }, [input]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setInput(last);
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [history, isFr]);

  const issues = useMemo(() => detectJsIssues(input), [input]);

  const handleLoadSample = useCallback(
    (key: keyof typeof JS_SAMPLES) => {
      const sample = JS_SAMPLES[key];
      if (sample) {
        setHistory((prev) => [...prev.slice(-30), input]);
        setInput(sample);
        toast.success(isFr ? 'Exemple de code chargé' : 'Code sample loaded');
      }
    },
    [input, isFr]
  );

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

  const handleMouseDownResize = useCallback((e: React.MouseEvent) => {
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
  }, [editorHeight]);

  const output = useMemo(() => {
    if (!input.trim()) return '';
    if (mode === 'format') {
      return beautifyJs(input, indent, stripComments, semicolons, quotes);
    }
    return minifyJs(input, stripComments);
  }, [input, mode, indent, stripComments, semicolons, quotes]);

  const highlightedOutput = useMemo(() => {
    if (!output) return '';
    try {
      return hljs.highlight(output, { language, ignoreIllegals: true }).value;
    } catch {
      return escapeHtml(output);
    }
  }, [output, language]);

  const metrics = useMemo(() => computeJsMetrics(input, output), [input, output]);

  const handleRunCode = useCallback(() => {
    if (!input.trim()) return;
    trackToolUsed('js-formatter', 'run');
    setOutputView('console');

    const res = runJsInSandbox(output || input, isFr);
    setExecutionLogs(res.logs);
    setExecutionTime(res.duration);

    if (res.error) {
      toast.error(isFr ? "Erreur durant l'exécution" : 'Execution error');
    } else {
      toast.success(
        isFr
          ? `Exécuté avec succès en ${res.duration} ms`
          : `Executed successfully in ${res.duration} ms`
      );
    }
  }, [input, output, isFr]);

  const handleDownload = useCallback(() => {
    if (!output) return;
    trackToolUsed('js-formatter', 'download');
    const ext = language === 'typescript' ? 'ts' : 'js';
    const filename = mode === 'minify' ? `script.min.${ext}` : `formatted.${ext}`;
    downloadText(output, filename, 'text/javascript;charset=utf-8');
    toast.success(isFr ? `Fichier .${ext} téléchargé` : `File .${ext} downloaded`);
  }, [output, language, mode, isFr]);

  const handleClear = useCallback(() => {
    setHistory((prev) => [...prev.slice(-30), input]);
    setInput('');
    setExecutionLogs([]);
    setExecutionTime(null);
    toast.info(isFr ? 'Atelier vidé' : 'Workspace cleared');
  }, [input, isFr]);

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setHistory((prev) => [...prev.slice(-30), input]);
        setInput(text);
        if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
          setLanguage('typescript');
        }
        toast.success(
          isFr ? `Fichier « ${file.name} » chargé` : `File "${file.name}" loaded`
        );
      }
    };
    reader.readAsText(file);
  }, [input, isFr]);

  const hasContent = Boolean(input.trim());

  return {
    input,
    setInput,
    history,
    mode,
    setMode,
    language,
    setLanguage,
    indent,
    setIndent,
    semicolons,
    setSemicolons,
    quotes,
    setQuotes,
    stripComments,
    setStripComments,
    wordWrap,
    setWordWrap,
    outputView,
    setOutputView,
    executionLogs,
    setExecutionLogs,
    executionTime,
    setExecutionTime,
    editorHeight,
    isDragOver,
    setIsDragOver,
    output,
    highlightedOutput,
    metrics,
    issues,
    hasContent,
    handleInputChange,
    handleLoadSample,
    handleUndo,
    handleMouseDownResize,
    handleRunCode,
    handleDownload,
    handleClear,
    handleFileUpload,
  };
}
