import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  createMarkdownRenderer,
  renderSafeHtml,
  highlightHtml,
  generateStandaloneHtml,
} from '@/lib/markdown-preview-parser';
import { applyMarkdownFormat } from '@/lib/markdown-format-helpers';

export type ViewLayout = 'split' | 'editor' | 'preview';
export type RightPaneView = 'preview' | 'html';

export function useMarkdownPreviewWorkflow(isFr: boolean) {
  const [markdown, setMarkdown] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  const [viewLayout, setViewLayout] = useState<ViewLayout>('split');
  const [rightPaneView, setRightPaneView] = useState<RightPaneView>('preview');
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const [editorHeight, setEditorHeight] = useState<number>(540);
  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(540);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const htmlViewRef = useRef<HTMLDivElement>(null);
  const isSyncingScroll = useRef(false);
  const selectionRangeRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const [isDragOver, setIsDragOver] = useState(false);

  const updateSelection = () => {
    if (editorRef.current) {
      selectionRangeRef.current = {
        start: editorRef.current.selectionStart,
        end: editorRef.current.selectionEnd,
      };
    }
  };

  const handleMarkdownChange = (val: string) => {
    setHistory((prev) => [...prev.slice(-30), markdown]);
    setRedoStack([]);
    setMarkdown(val);
  };

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const previous = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [...prev, markdown]);
    setMarkdown(previous);
    toast.info(isFr ? 'Action annulée' : 'Action undone');
  }, [history, markdown, isFr]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack((prev) => prev.slice(0, -1));
    setHistory((prev) => [...prev, markdown]);
    setMarkdown(next);
    toast.info(isFr ? 'Action rétablie' : 'Action redone');
  }, [redoStack, markdown, isFr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey)
      ) {
        if (redoStack.length > 0) {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, history.length, redoStack.length]);

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(260, Math.min(1100, startHeightRef.current + deltaY));
      setEditorHeight(newHeight);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleEditorScroll = () => {
    updateSelection();
    if (!syncScroll || isSyncingScroll.current || !editorRef.current) return;
    const targetPane = rightPaneView === 'html' ? htmlViewRef.current : previewRef.current;
    if (!targetPane) return;

    isSyncingScroll.current = true;
    const { scrollTop, scrollHeight, clientHeight } = editorRef.current;
    const maxScrollTop = scrollHeight - clientHeight;
    const ratio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    targetPane.scrollTop = ratio * (targetPane.scrollHeight - targetPane.clientHeight);
    setTimeout(() => { isSyncingScroll.current = false; }, 40);
  };

  const handlePreviewScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!syncScroll || isSyncingScroll.current || !editorRef.current) return;
    const targetPane = e.currentTarget;
    isSyncingScroll.current = true;
    const { scrollTop, scrollHeight, clientHeight } = targetPane;
    const maxScrollTop = scrollHeight - clientHeight;
    const ratio = maxScrollTop > 0 ? scrollTop / maxScrollTop : 0;
    editorRef.current.scrollTop = ratio * (editorRef.current.scrollHeight - editorRef.current.clientHeight);
    setTimeout(() => { isSyncingScroll.current = false; }, 40);
  };

  const applyFormat = (formatType: string, extraArg?: string) => {
    if (viewLayout === 'preview') {
      setViewLayout('split');
    }
    const textarea = editorRef.current;
    const currentVal = textarea ? textarea.value : markdown;
    const start = textarea ? textarea.selectionStart : selectionRangeRef.current.start;
    const end = textarea ? textarea.selectionEnd : selectionRangeRef.current.end;

    const { updated, newPos } = applyMarkdownFormat(currentVal, start, end, formatType, isFr, extraArg);
    setHistory((prev) => [...prev.slice(-30), currentVal]);
    setRedoStack([]);
    setMarkdown(updated);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        editorRef.current.setSelectionRange(newPos, newPos);
        selectionRangeRef.current = { start: newPos, end: newPos };
      }
    }, 40);
  };

  const renderer = useMemo(() => createMarkdownRenderer(isFr), [isFr]);
  const safeHtml = useMemo(() => renderSafeHtml(markdown, renderer), [markdown, renderer]);
  const highlightedHtmlSource = useMemo(() => highlightHtml(safeHtml), [safeHtml]);

  const metrics = useMemo(() => {
    const text = markdown.trim();
    const chars = markdown.length;
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const lines = markdown ? markdown.split('\n').length : 0;
    const headings = (markdown.match(/^#{1,6}\s+/gm) || []).length;
    const readMinutes = Math.max(1, Math.ceil(words / 200));
    return { chars, words, lines, headings, readMinutes };
  }, [markdown]);

  const handleDownloadMd = () => {
    if (!markdown) return;
    trackToolUsed('markdown-preview', 'download-md');
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.md';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isFr ? 'Document Markdown téléchargé (.md)' : 'Markdown document downloaded (.md)');
    setTimeout(() => setIsNextActionOpen(true), 450);
  };

  const handleDownloadHtml = () => {
    if (!safeHtml) return;
    trackToolUsed('markdown-preview', 'download-html');
    const completeDoc = generateStandaloneHtml(safeHtml, isFr);
    const blob = new Blob([completeDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.html';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isFr ? 'Document HTML autonome téléchargé (.html)' : 'Standalone HTML document downloaded (.html)');
  };

  const handleClear = () => {
    setHistory((prev) => [...prev.slice(-30), markdown]);
    setRedoStack([]);
    setMarkdown('');
    toast.info(isFr ? 'Atelier vidé' : 'Workspace cleared');
  };

  const handleFileUpload = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setHistory((prev) => [...prev.slice(-30), markdown]);
        setRedoStack([]);
        setMarkdown(text);
        toast.success(isFr ? `Fichier « ${file.name} » chargé` : `File "${file.name}" loaded`);
      }
    };
    reader.readAsText(file);
  }, [markdown, isFr]);

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFileUpload(staged);
    }
  }, [handleFileUpload]);

  return {
    markdown,
    history,
    redoStack,
    viewLayout,
    setViewLayout,
    rightPaneView,
    setRightPaneView,
    wordWrap,
    setWordWrap,
    syncScroll,
    setSyncScroll,
    isNextActionOpen,
    setIsNextActionOpen,
    editorHeight,
    editorRef,
    previewRef,
    htmlViewRef,
    isDragOver,
    setIsDragOver,
    updateSelection,
    handleMarkdownChange,
    handleUndo,
    handleRedo,
    handleMouseDownResize,
    handleEditorScroll,
    handlePreviewScroll,
    applyFormat,
    safeHtml,
    highlightedHtmlSource,
    metrics,
    handleDownloadMd,
    handleDownloadHtml,
    handleClear,
    handleFileUpload,
    hasContent: Boolean(markdown.trim()),
  };
}
