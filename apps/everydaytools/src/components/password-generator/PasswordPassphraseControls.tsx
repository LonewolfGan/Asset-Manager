import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

export interface PasswordPassphraseControlsProps {
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

const PRESET_WORD_COUNTS = [3, 4, 5, 6, 8];

export function PasswordPassphraseControls({
  wordCount,
  onWordCountChange,
  separator,
  onSeparatorChange,
  capitalizeWords,
  onCapitalizeWordsChange,
  includeNumberInPassphrase,
  onIncludeNumberInPassphraseChange,
  isFr,
}: PasswordPassphraseControlsProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Slider Nombre de Mots */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
            {isFr ? `Nombre de mots : ${wordCount}` : `Word count: ${wordCount}`}
          </span>
          <div className="flex items-center gap-1.5">
            {PRESET_WORD_COUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onWordCountChange(preset)}
                className={`h-7 px-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  wordCount === preset
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-white'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        <Slider
          min={3}
          max={8}
          step={1}
          value={[wordCount]}
          onValueChange={(vals) => onWordCountChange(vals[0])}
          className="w-full py-2 cursor-pointer"
        />
      </div>

      {/* Séparateur (Ligne dédiée pleine largeur) */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
            {isFr ? 'Séparateur' : 'Separator'}
          </span>
          {separator === ' ' ? (
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {isFr ? 'Espace' : 'Space'}
            </span>
          ) : separator === '' ? (
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {isFr ? 'Aucun (collés)' : 'None (joined)'}
            </span>
          ) : null}
        </div>
        <input
          type="text"
          value={separator}
          onChange={(e) => onSeparatorChange(e.target.value)}
          maxLength={8}
          placeholder="-"
          className="h-11 w-full px-4 rounded-xl font-mono text-sm font-medium bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-all"
        />
      </div>

      {/* Configurations en bas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {isFr ? 'Majuscule par mot' : 'Capitalize words'}
          </span>
          <Switch
            checked={capitalizeWords}
            onCheckedChange={onCapitalizeWordsChange}
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {isFr ? 'Ajouter un chiffre à la fin' : 'Append number'}
          </span>
          <Switch
            checked={includeNumberInPassphrase}
            onCheckedChange={onIncludeNumberInPassphraseChange}
          />
        </label>
      </div>
    </div>
  );
}
