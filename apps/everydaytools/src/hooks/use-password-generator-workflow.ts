import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import {
  generatePassword,
  generatePassphrase,
  calculateVaultStrength,
  getTextSizeClass,
  type PasswordVaultStrength,
} from '@/lib/password-generator-logic';

export type GeneratorMode = 'random' | 'passphrase';

export interface UsePasswordGeneratorWorkflowOptions {
  onStopSpeaking?: () => void;
  labels: {
    weak: string;
    fair: string;
    strong: string;
    exceptional: string;
  };
}

export function usePasswordGeneratorWorkflow({
  onStopSpeaking,
  labels,
}: UsePasswordGeneratorWorkflowOptions) {
  const [mode, setMode] = useState<GeneratorMode>('random');

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

  // Active Generated Key
  const [password, setPassword] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);

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
    setPassword(next);
  }, [generateNextPassword, onStopSpeaking]);

  useEffect(() => {
    regenerate();
  }, [regenerate]);

  // Keyboard shortcut: Spacebar to regenerate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.code === 'Space' &&
        (e.target as HTMLElement).tagName !== 'INPUT' &&
        (e.target as HTMLElement).tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        regenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [regenerate]);

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

  return {
    mode,
    setMode,
    length,
    setLength,
    uppercase,
    setUppercase,
    lowercase,
    setLowercase,
    numbers,
    setNumbers,
    symbols,
    setSymbols,
    excludeAmbiguous,
    setExcludeAmbiguous,
    pronounceable,
    setPronounceable,
    wordCount,
    setWordCount,
    separator,
    setSeparator,
    capitalizeWords,
    setCapitalizeWords,
    includeNumberInPassphrase,
    setIncludeNumberInPassphrase,
    password,
    isSpinning,
    regenerate,
    strengthInfo,
    textSizeClass,
  };
}
