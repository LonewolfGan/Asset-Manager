import React from 'react';
import { KeyRound, BookOpen } from 'lucide-react';
import { PasswordRandomControls } from './PasswordRandomControls';
import { PasswordPassphraseControls } from './PasswordPassphraseControls';
import type { GeneratorMode } from '@/hooks/use-password-generator-workflow';

export interface PasswordControlsDeckProps {
  mode: GeneratorMode;
  onModeChange: (mode: GeneratorMode) => void;
  // Random mode props
  length: number;
  onLengthChange: (val: number) => void;
  uppercase: boolean;
  onUppercaseChange: (val: boolean) => void;
  lowercase: boolean;
  onLowercaseChange: (val: boolean) => void;
  numbers: boolean;
  onNumbersChange: (val: boolean) => void;
  symbols: boolean;
  onSymbolsChange: (val: boolean) => void;
  excludeAmbiguous: boolean;
  onExcludeAmbiguousChange: (val: boolean) => void;
  pronounceable: boolean;
  onPronounceableChange: (val: boolean) => void;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStopSpeaking: () => void;
  lengthLabel: (len: number) => string;
  uppercaseLabel: string;
  lowercaseLabel: string;
  numbersLabel: string;
  symbolsLabel: string;
  pronounceableLabel: string;
  // Passphrase props
  wordCount: number;
  onWordCountChange: (val: number) => void;
  separator: string;
  onSeparatorChange: (val: string) => void;
  capitalizeWords: boolean;
  onCapitalizeWordsChange: (val: boolean) => void;
  includeNumberInPassphrase: boolean;
  onIncludeNumberInPassphraseChange: (val: boolean) => void;
  isFr: boolean;
}

export function PasswordControlsDeck({
  mode,
  onModeChange,
  length,
  onLengthChange,
  uppercase,
  onUppercaseChange,
  lowercase,
  onLowercaseChange,
  numbers,
  onNumbersChange,
  symbols,
  onSymbolsChange,
  excludeAmbiguous,
  onExcludeAmbiguousChange,
  pronounceable,
  onPronounceableChange,
  isSpeaking,
  onSpeak,
  onStopSpeaking,
  lengthLabel,
  uppercaseLabel,
  lowercaseLabel,
  numbersLabel,
  symbolsLabel,
  pronounceableLabel,
  wordCount,
  onWordCountChange,
  separator,
  onSeparatorChange,
  capitalizeWords,
  onCapitalizeWordsChange,
  includeNumberInPassphrase,
  onIncludeNumberInPassphraseChange,
  isFr,
}: PasswordControlsDeckProps) {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8">
      {/* Mode Tabs (Segmented) */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10">
          <button
            type="button"
            onClick={() => {
              onStopSpeaking();
              onModeChange('random');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'random'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{isFr ? 'Aléatoire' : 'Random'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onStopSpeaking();
              onModeChange('passphrase');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
              mode === 'passphrase'
                ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white font-semibold shadow-xs'
                : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isFr ? 'Phrase secrète' : 'Passphrase'}</span>
          </button>
        </div>
      </div>

      {mode === 'random' ? (
        <PasswordRandomControls
          length={length}
          onLengthChange={onLengthChange}
          uppercase={uppercase}
          onUppercaseChange={onUppercaseChange}
          lowercase={lowercase}
          onLowercaseChange={onLowercaseChange}
          numbers={numbers}
          onNumbersChange={onNumbersChange}
          symbols={symbols}
          onSymbolsChange={onSymbolsChange}
          excludeAmbiguous={excludeAmbiguous}
          onExcludeAmbiguousChange={onExcludeAmbiguousChange}
          pronounceable={pronounceable}
          onPronounceableChange={onPronounceableChange}
          isSpeaking={isSpeaking}
          onSpeak={onSpeak}
          onStopSpeaking={onStopSpeaking}
          isFr={isFr}
          lengthLabel={lengthLabel}
          uppercaseLabel={uppercaseLabel}
          lowercaseLabel={lowercaseLabel}
          numbersLabel={numbersLabel}
          symbolsLabel={symbolsLabel}
          pronounceableLabel={pronounceableLabel}
        />
      ) : (
        <PasswordPassphraseControls
          wordCount={wordCount}
          onWordCountChange={onWordCountChange}
          separator={separator}
          onSeparatorChange={onSeparatorChange}
          capitalizeWords={capitalizeWords}
          onCapitalizeWordsChange={onCapitalizeWordsChange}
          includeNumberInPassphrase={includeNumberInPassphrase}
          onIncludeNumberInPassphraseChange={onIncludeNumberInPassphraseChange}
          isFr={isFr}
        />
      )}
    </div>
  );
}
