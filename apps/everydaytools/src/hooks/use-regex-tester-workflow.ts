import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import {
  evaluateRegex,
  computeHighlightedChunks,
  getPresets,
  getFlagOptions,
  getCheatSheet,
  type ResultTab,
  type MatchDisplayMode,
  type RegexPreset,
} from '@/lib/regex-tester-logic';

export function useRegexTesterWorkflow(isFr: boolean) {
  const presets = useMemo(() => getPresets(isFr), [isFr]);
  const flagOptions = useMemo(() => getFlagOptions(isFr), [isFr]);
  const cheatSheet = useMemo(() => getCheatSheet(isFr), [isFr]);

  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState<string>('g');
  const [testString, setTestString] = useState<string>(
    isFr
      ? 'Contactez notre service technique à support@example.com ou sales.team@enterprise.org pour vos questions.\nPour la facturation, écrivez à billing@startup.co.uk ou rejoignez notre communauté.'
      : 'Contact our technical support at support@example.com or sales.team@enterprise.org with questions.\nFor billing, write to billing@startup.co.uk or join our community.'
  );
  const [replaceWith, setReplaceWith] = useState<string>(isFr ? '[EMAIL_MASQUÉ]' : '[MASKED_EMAIL]');

  const [resultTab, setResultTab] = useState<ResultTab>('matches');
  const [matchDisplayMode, setMatchDisplayMode] = useState<MatchDisplayMode>('highlight');
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [editorHeight, setEditorHeight] = useState<number>(440);
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null);

  const [showPresetsMenu, setShowPresetsMenu] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const isDraggingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(440);
  const patternInputRef = useRef<HTMLInputElement>(null);

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = editorHeight;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const deltaY = moveEvent.clientY - startYRef.current;
      const newHeight = Math.max(240, Math.min(850, startHeightRef.current + deltaY));
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

  const handleInputChange = (val: string) => {
    setHistory((prev) => [...prev.slice(-30), testString]);
    setTestString(val);
  };

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setTestString(last);
    toast.info(isFr ? 'Dernière saisie annulée' : 'Last input undone');
  }, [history, isFr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (document.activeElement?.tagName !== 'INPUT' && history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, history.length]);

  const toggleFlag = (flagChar: string) => {
    setFlags((prev) => (prev.includes(flagChar) ? prev.replace(flagChar, '') : prev + flagChar));
  };

  const { matches, isValid, errorMsg, replacedText } = useMemo(() => {
    return evaluateRegex(pattern, flags, testString, replaceWith);
  }, [pattern, flags, testString, replaceWith]);

  const highlightedChunks = useMemo(() => {
    return computeHighlightedChunks(testString, matches);
  }, [testString, matches]);

  const handleDownloadReplacedText = () => {
    trackToolUsed('regex-tester', 'download-replaced');
    const blob = new Blob([replacedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = isFr ? 'texte-remplace.txt' : 'replaced-text.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success(isFr ? 'Fichier téléchargé' : 'File downloaded');
  };

  const handleClearTestString = () => {
    setHistory((prev) => [...prev.slice(-30), testString]);
    setTestString('');
    toast.info(isFr ? 'Texte de test vidé' : 'Test text cleared');
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setHistory((prev) => [...prev.slice(-30), testString]);
        setTestString(text);
        toast.success(isFr ? `Fichier « ${file.name} » importé` : `File "${file.name}" imported`);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyPreset = (preset: RegexPreset) => {
    setHistory((prev) => [...prev.slice(-30), testString]);
    setPattern(preset.pattern);
    setFlags(preset.flags);
    setTestString(preset.sample);
    setShowPresetsMenu(false);
    toast.success(isFr ? `Modèle « ${preset.name} » chargé` : `Preset "${preset.name}" loaded`);
    trackToolUsed('regex-tester', `preset-${preset.name}`);
  };

  const handleInsertToken = (token: string) => {
    setPattern((prev) => prev + token);
    toast.info(isFr ? `« ${token} » inséré dans l'expression` : `"${token}" inserted into expression`);
    if (patternInputRef.current) {
      patternInputRef.current.focus();
    }
  };

  const hasTestContent = Boolean(testString.trim());
  const activeFlagsCount = flags.length;

  return {
    presets,
    flagOptions,
    cheatSheet,
    pattern,
    setPattern,
    flags,
    toggleFlag,
    testString,
    replaceWith,
    setReplaceWith,
    resultTab,
    setResultTab,
    matchDisplayMode,
    setMatchDisplayMode,
    wordWrap,
    setWordWrap,
    editorHeight,
    selectedMatchIndex,
    setSelectedMatchIndex,
    showPresetsMenu,
    setShowPresetsMenu,
    isDragOver,
    setIsDragOver,
    history,
    patternInputRef,
    matches,
    isValid,
    errorMsg,
    replacedText,
    highlightedChunks,
    hasTestContent,
    activeFlagsCount,
    handleMouseDownResize,
    handleInputChange,
    handleUndo,
    handleDownloadReplacedText,
    handleClearTestString,
    handleFileUpload,
    handleApplyPreset,
    handleInsertToken,
  };
}
