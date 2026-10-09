import React, { RefObject } from 'react';
import { ChevronDown, AlertCircle, Settings2, SlidersHorizontal } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { trackToolUsed } from '@/lib/analytics';
import type { RegexPreset } from '@/lib/regex-tester-logic';

interface RegexTopBarProps {
  pattern: string;
  onPatternChange: (val: string) => void;
  patternInputRef: RefObject<HTMLInputElement | null>;
  flags: string;
  onToggleFlag: (flag: string) => void;
  activeFlagsCount: number;
  flagOptions: { flag: string; name: string; desc: string }[];
  presets: RegexPreset[];
  showPresetsMenu: boolean;
  onShowPresetsMenuChange: (open: boolean) => void;
  onApplyPreset: (preset: RegexPreset) => void;
  isValid: boolean;
  errorMsg: string;
  isFr: boolean;
}

export function RegexTopBar({
  pattern,
  onPatternChange,
  patternInputRef,
  flags,
  onToggleFlag,
  activeFlagsCount,
  flagOptions,
  presets,
  showPresetsMenu,
  onShowPresetsMenuChange,
  onApplyPreset,
  isValid,
  errorMsg,
  isFr,
}: RegexTopBarProps) {
  return (
    <div className="flex flex-col gap-2.5 pb-3 border-b border-zinc-200 dark:border-white/10">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Champ Expression Régulière clair et explicite */}
        <div className="flex-1 flex items-center gap-2">
          <label htmlFor="regex-input" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">
            {isFr ? 'Expression régulière :' : 'Regular expression:'}
          </label>

          <div className="flex-1 flex items-center px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/60 focus-within:border-[#FF6B35] transition-colors">
            <input
              id="regex-input"
              ref={patternInputRef}
              type="text"
              value={pattern}
              onChange={(e) => onPatternChange(e.target.value)}
              placeholder={isFr ? 'Tapez votre motif regex (ex: [a-z0-9._%+-]+@...)' : 'Enter regex pattern (e.g. [a-z0-9._%+-]+@...)'}
              spellCheck={false}
              className="w-full bg-transparent font-mono text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 outline-none border-none"
            />
          </div>

          <CopyButton
            text={pattern}
            label={isFr ? 'Copier la regex' : 'Copy regex'}
            copiedLabel={isFr ? 'Copié !' : 'Copied!'}
            size="sm"
            variant="default"
            onCopy={() => trackToolUsed('regex-tester', 'copy-regex')}
            toastMessage={isFr ? 'Motif regex copié' : 'Regex pattern copied'}
            className="shrink-0"
          />
        </div>

        {/* Menus d'aide : Options et Modèles */}
        <div className="flex items-center gap-2 shrink-0">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer outline-none ${
                  activeFlagsCount > 0
                    ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100'
                    : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5 text-zinc-500" />
                <span>
                  {isFr
                    ? `Options (${flags ? `/${flags}` : 'aucune'})`
                    : `Flags (${flags ? `/${flags}` : 'none'})`}
                </span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="start" className="w-72 p-2 space-y-1">
              <div className="px-2 py-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                {isFr ? 'Options de recherche (Drapeaux)' : 'Regex flags / options'}
              </div>
              {flagOptions.map(({ flag, name, desc: flagDesc }) => {
                const isChecked = flags.includes(flag);
                return (
                  <label
                    key={flag}
                    onClick={() => onToggleFlag(flag)}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 accent-[#FF6B35]"
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                        {name}
                      </span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {flagDesc}
                      </span>
                    </div>
                  </label>
                );
              })}
            </PopoverContent>
          </Popover>

          <Popover open={showPresetsMenu} onOpenChange={onShowPresetsMenuChange}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer outline-none"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-500" />
                <span>{isFr ? 'Modèles' : 'Presets'}</span>
                <ChevronDown className="w-3 h-3 text-zinc-400" />
              </button>
            </PopoverTrigger>

            <PopoverContent align="end" className="w-72 max-h-80 overflow-y-auto p-1 divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {presets.map((p) => (
                <button
                  key={p.name}
                  onClick={() => onApplyPreset(p)}
                  className="w-full text-left p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs flex flex-col gap-0.5 cursor-pointer"
                >
                  <div className="flex items-center justify-between font-medium text-zinc-900 dark:text-zinc-100">
                    <span>{p.name}</span>
                    <span className="font-mono text-[10px] text-zinc-400">/{p.flags}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500 line-clamp-1">{p.description}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {!isValid && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400 font-mono">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{isFr ? 'Erreur :' : 'Error:'} {errorMsg}</span>
        </div>
      )}
    </div>
  );
}
