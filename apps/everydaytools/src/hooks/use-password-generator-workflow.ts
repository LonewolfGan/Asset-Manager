import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffText } from '@/lib/file-handoff';
import { usePasswordHistory } from '@/hooks/use-password-history';
import {
  generatePassword,
  generatePassphrase,
  calculateVaultStrength,
  getTextSizeClass,
  calculateEntropyBits,
  estimateCrackTime,
  type PasswordVaultStrength,
} from '@/lib/password-generator-logic';
import type { PasswordPreset } from '@/lib/password-generator-presets';

export type GeneratorMode = 'random' | 'passphrase';

export interface UsePasswordGeneratorWorkflowOptions {
  onStopSpeaking?: () => void;
  onHandoffText?: (text: string) => void;
  isFr?: boolean;
  labels: {
    weak: string;
    fair: string;
    strong: string;
    exceptional: string;
  };
}

export function usePasswordGeneratorWorkflow({
  onStopSpeaking,
  onHandoffText,
  isFr = false,
  labels,
}: UsePasswordGeneratorWorkflowOptions) {
  const [mode, setMode] = useState<GeneratorMode>('random');
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Random Mode Settings
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [pronounceable, setPronounceable] = useState(false);

  // Passphrase Settings
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState('-');
  const [capitalizeWords, setCapitalizeWords] = useState(true);
  const [includeNumberInPassphrase, setIncludeNumberInPassphrase] = useState(true);

  // Password History Manager (Undo / Redo)
  const history = usePasswordHistory();
  const [isSpinning, setIsSpinning] = useState(false);

  // Ingest handoff text on mount if available
  useEffect(() => {
    const text = consumeHandoffText();
    if (text) {
      onHandoffText?.(text);
    }
  }, [onHandoffText]);

  const generateNextPassword = useCallback(() => {
    if (mode === 'passphrase') {
      return generatePassphrase({
        wordCount,
        separator,
        capitalizeWords,
        includeNumberInPassphrase,
      });
    }

    return generatePassword({
      length,
      uppercase,
      lowercase,
      numbers,
      symbols,
      excludeAmbiguous,
      pronounceable,
    });
  }, [
    mode,
    wordCount,
    separator,
    capitalizeWords,
    includeNumberInPassphrase,
    length,
    uppercase,
    lowercase,
    numbers,
    symbols,
    excludeAmbiguous,
    pronounceable,
  ]);

  const regenerate = useCallback(() => {
    onStopSpeaking?.();
    trackToolUsed('password-generator', 'utilities');
    setIsSpinning(true);
    setTimeout(() => setIsSpinning(false), 300);

    const next = generateNextPassword();
    history.pushPassword(next);
  }, [generateNextPassword, history, onStopSpeaking]);

  // Initial password generation on mount
  useEffect(() => {
    if (!history.currentPassword) {
      regenerate();
    }
  }, [history.currentPassword, regenerate]);

  const applyPreset = useCallback(
    (preset: PasswordPreset) => {
      onStopSpeaking?.();
      setActivePresetId(preset.id);

      if (preset.mode === 'random') {
        setMode('random');
        setLength(preset.length);
        setUppercase(preset.uppercase);
        setLowercase(preset.lowercase);
        setNumbers(preset.numbers);
        setSymbols(preset.symbols);
        setExcludeAmbiguous(preset.excludeAmbiguous);
        setPronounceable(preset.pronounceable);

        const next = generatePassword({
          length: preset.length,
          uppercase: preset.uppercase,
          lowercase: preset.lowercase,
          numbers: preset.numbers,
          symbols: preset.symbols,
          excludeAmbiguous: preset.excludeAmbiguous,
          pronounceable: preset.pronounceable,
        });
        history.pushPassword(next);
      } else {
        setMode('passphrase');
        setWordCount(preset.wordCount);
        setSeparator(preset.separator);
        setCapitalizeWords(preset.capitalizeWords);
        setIncludeNumberInPassphrase(preset.includeNumberInPassphrase);

        const next = generatePassphrase({
          wordCount: preset.wordCount,
          separator: preset.separator,
          capitalizeWords: preset.capitalizeWords,
          includeNumberInPassphrase: preset.includeNumberInPassphrase,
        });
        history.pushPassword(next);
      }
    },
    [history, onStopSpeaking]
  );

  // Global keyboard shortcuts: Spacebar (regenerate), Ctrl/Cmd+Z (Undo), Ctrl+Y / Cmd+Shift+Z (Redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable) {
        return;
      }

      const isMac = typeof navigator !== 'undefined' && /Mac/i.test(navigator.userAgent);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      if (e.code === 'Space') {
        e.preventDefault();
        regenerate();
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          history.redo();
        } else {
          history.undo();
        }
      } else if (isCmdOrCtrl && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        history.redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [history, regenerate]);

  const password = history.currentPassword;

  const strengthInfo: PasswordVaultStrength = useMemo(() => {
    return calculateVaultStrength({
      mode,
      wordCount,
      uppercase,
      lowercase,
      numbers,
      symbols,
      length,
      labels,
    });
  }, [mode, wordCount, uppercase, lowercase, numbers, symbols, length, labels]);

  const textSizeClass = useMemo(() => {
    return getTextSizeClass(password.length);
  }, [password.length]);

  const entropyBits = useMemo(() => {
    return calculateEntropyBits(password);
  }, [password]);

  const crackTime = useMemo(() => {
    return estimateCrackTime(entropyBits, isFr);
  }, [entropyBits, isFr]);

  const createSetter = <T>(setter: React.Dispatch<React.SetStateAction<T>>) => (val: T) => {
    setActivePresetId(null);
    setter(val);
  };

  return {
    mode,
    setMode: createSetter(setMode),
    activePresetId,
    applyPreset,
    length,
    setLength: createSetter(setLength),
    uppercase,
    setUppercase: createSetter(setUppercase),
    lowercase,
    setLowercase: createSetter(setLowercase),
    numbers,
    setNumbers: createSetter(setNumbers),
    symbols,
    setSymbols: createSetter(setSymbols),
    excludeAmbiguous,
    setExcludeAmbiguous: createSetter(setExcludeAmbiguous),
    pronounceable,
    setPronounceable: createSetter(setPronounceable),
    wordCount,
    setWordCount: createSetter(setWordCount),
    separator,
    setSeparator: createSetter(setSeparator),
    capitalizeWords,
    setCapitalizeWords: createSetter(setCapitalizeWords),
    includeNumberInPassphrase,
    setIncludeNumberInPassphrase: createSetter(setIncludeNumberInPassphrase),
    password,
    isSpinning,
    regenerate,
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
    historyList: history.historyList,
    strengthInfo,
    textSizeClass,
    entropyBits,
    crackTime,
  };
}
