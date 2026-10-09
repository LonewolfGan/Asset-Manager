import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface PasswordRandomControlsProps {
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
  isFr: boolean;
  lengthLabel: (len: number) => string;
  uppercaseLabel: string;
  lowercaseLabel: string;
  numbersLabel: string;
  symbolsLabel: string;
  pronounceableLabel: string;
}

const PRESET_LENGTHS = [12, 16, 20, 24, 32, 48, 64];

export function PasswordRandomControls({
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
  isFr,
  lengthLabel,
  uppercaseLabel,
  lowercaseLabel,
  numbersLabel,
  symbolsLabel,
  pronounceableLabel,
}: PasswordRandomControlsProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* Slider Longueur */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-medium text-zinc-800 dark:text-zinc-200">
            {lengthLabel(length)}
          </span>
          <div className="flex items-center gap-1.5">
            {PRESET_LENGTHS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onLengthChange(preset)}
                className={`h-7 px-2.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  length === preset
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
          min={6}
          max={64}
          step={1}
          value={[length]}
          onValueChange={(vals) => onLengthChange(vals[0])}
          className="w-full py-2 cursor-pointer"
        />
      </div>

      {/* Toggles Caractères (Plats, Alignés, Neutres, Zéro Duplication) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {uppercaseLabel}
          </span>
          <Switch
            checked={uppercase}
            onCheckedChange={onUppercaseChange}
            disabled={pronounceable}
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {lowercaseLabel}
          </span>
          <Switch
            checked={lowercase}
            onCheckedChange={onLowercaseChange}
            disabled={pronounceable}
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {numbersLabel}
          </span>
          <Switch
            checked={numbers}
            onCheckedChange={onNumbersChange}
            disabled={pronounceable}
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {symbolsLabel}
          </span>
          <Switch
            checked={symbols}
            onCheckedChange={onSymbolsChange}
            disabled={pronounceable}
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
            {isFr ? 'Exclure les caractères ambigus' : 'Exclude ambiguous characters'}
          </span>
          <Switch
            checked={excludeAmbiguous}
            onCheckedChange={onExcludeAmbiguousChange}
          />
        </label>

        <label className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 transition-colors cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-900 dark:text-zinc-100 font-medium">
              {pronounceableLabel}
            </span>
            {pronounceable && (
              <ActionTooltip
                label={
                  isFr
                    ? isSpeaking
                      ? 'Arrêter la lecture'
                      : 'Écouter la prononciation'
                    : isSpeaking
                      ? 'Stop speaking'
                      : 'Listen'
                }
                side="top"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onSpeak();
                  }}
                  className={`p-1 rounded-md transition-colors cursor-pointer ${
                    isSpeaking
                      ? 'bg-[#FF6B35]/20 text-[#FF6B35]'
                      : 'hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {isSpeaking ? (
                    <VolumeX className="w-3.5 h-3.5 text-[#FF6B35] animate-pulse" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                </button>
              </ActionTooltip>
            )}
          </div>
          <Switch
            checked={pronounceable}
            onCheckedChange={(val) => {
              if (!val) onStopSpeaking();
              onPronounceableChange(val);
            }}
          />
        </label>
      </div>
    </div>
  );
}
