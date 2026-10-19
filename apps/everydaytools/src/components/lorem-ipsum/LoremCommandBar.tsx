import React from 'react';
import { RefreshCw, ChevronDown, Plus, Minus, Download, Sparkles } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  UNITS,
  PRESETS,
  FLAVORS,
  type LoremFlavor,
  type LoremUnit,
} from '@/lib/lorem-ipsum-logic';
import { LOREM_PRESETS, type LoremPreset } from '@/lib/lorem-samples';
import type { LoremFormat } from '@/hooks/use-lorem-ipsum-workflow';

const FORMATS: { id: LoremFormat; labelFr: string; labelEn: string }[] = [
  { id: 'plain', labelFr: 'Texte', labelEn: 'Plain' },
  { id: 'html', labelFr: 'HTML', labelEn: 'HTML' },
  { id: 'markdown', labelFr: 'Markdown', labelEn: 'Markdown' },
  { id: 'json', labelFr: 'JSON', labelEn: 'JSON' },
];

export interface LoremCommandBarProps {
  unit: LoremUnit;
  count: number;
  flavor: LoremFlavor;
  format: LoremFormat;
  startWithClassic: boolean;
  isRefreshing: boolean;
  fullText: string;
  onUnitSelect: (unit: LoremUnit) => void;
  onCountChange: (delta: number) => void;
  onCountSet: (count: number) => void;
  onFlavorChange: (flavor: LoremFlavor) => void;
  onFormatChange: (format: LoremFormat) => void;
  onToggleStartWithClassic: () => void;
  onApplyPreset?: (preset: LoremPreset) => void;
  onRegenerate: () => void;
  onDownload: () => void;
  isFr: boolean;
}

export function LoremCommandBar({
  unit,
  count,
  flavor,
  format,
  startWithClassic,
  isRefreshing,
  fullText,
  onUnitSelect,
  onCountChange,
  onCountSet,
  onFlavorChange,
  onFormatChange,
  onToggleStartWithClassic,
  onApplyPreset,
  onRegenerate,
  onDownload,
  isFr,
}: LoremCommandBarProps) {
  return (
    <div className="p-3.5 sm:px-5 sm:py-3 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Gauche : Unités, Stepper, Paliers, Lexique, Format */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Sélecteur d'unité */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onUnitSelect(u.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-colors duration-150 cursor-pointer active:scale-[0.98] ${
                unit === u.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {isFr ? u.labelFr : u.labelEn}
            </button>
          ))}
        </div>

        {/* Stepper tactile compact */}
        <div className="flex items-center rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 h-7 px-1">
          <ActionTooltip label={isFr ? 'Diminuer' : 'Decrease'}>
            <button
              type="button"
              onClick={() => onCountChange(-1)}
              disabled={count <= 1}
              className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer active:scale-[0.95] transition-colors duration-150"
            >
              <Minus className="w-3 h-3" />
            </button>
          </ActionTooltip>
          <span className="w-7 text-center font-mono text-xs font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {count}
          </span>
          <ActionTooltip label={isFr ? 'Augmenter' : 'Increase'}>
            <button
              type="button"
              onClick={() => onCountChange(1)}
              className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 cursor-pointer active:scale-[0.95] transition-colors duration-150"
            >
              <Plus className="w-3 h-3" />
            </button>
          </ActionTooltip>
        </div>

        {/* Paliers rapides numériques */}
        <div className="hidden sm:flex items-center gap-1">
          {PRESETS[unit].map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onCountSet(p)}
              className={`w-6 h-6 flex items-center justify-center rounded font-mono text-xs transition-colors duration-150 cursor-pointer active:scale-[0.96] ${
                count === p
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Sélecteur de Lexique */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 cursor-pointer"
            >
              <span className="text-zinc-400">{isFr ? 'Lexique :' : 'Lexicon:'}</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                {isFr
                  ? FLAVORS.find((f) => f.id === flavor)?.labelFr
                  : FLAVORS.find((f) => f.id === flavor)?.labelEn}
              </span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {FLAVORS.map((f) => (
              <DropdownMenuItem
                key={f.id}
                onClick={() => onFlavorChange(f.id)}
                className="flex flex-col items-start gap-0.5 cursor-pointer py-1.5"
              >
                <span
                  className={`text-xs font-medium ${
                    flavor === f.id
                      ? 'text-[var(--accent)] font-semibold'
                      : 'text-zinc-900 dark:text-zinc-100'
                  }`}
                >
                  {isFr ? f.labelFr : f.labelEn}
                </span>
                <span className="text-[10px] text-zinc-400">
                  {isFr ? f.descFr : f.descEn}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu Modèles / Presets */}
        {onApplyPreset && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-150 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[var(--accent)]" />
                <span>{isFr ? 'Modèles' : 'Presets'}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-[11px] text-zinc-400 font-mono">
                {isFr ? 'Configurations courantes' : 'Common setups'}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {LOREM_PRESETS.map((pr) => (
                <DropdownMenuItem
                  key={pr.id}
                  onClick={() => onApplyPreset(pr)}
                  className="flex flex-col items-start gap-0.5 cursor-pointer py-1.5"
                >
                  <span className="text-xs font-medium text-zinc-900 dark:text-zinc-100">
                    {isFr ? pr.labelFr : pr.labelEn}
                  </span>
                  <span className="text-[10px] text-zinc-400">
                    {isFr ? pr.descFr : pr.descEn}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Sélecteur de format de sortie */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.id}
              type="button"
              onClick={() => onFormatChange(fmt.id)}
              className={`px-2 py-1 rounded-md font-mono text-[11px] font-medium transition-colors duration-150 cursor-pointer active:scale-[0.98] ${
                format === fmt.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold shadow-2xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {isFr ? fmt.labelFr : fmt.labelEn}
            </button>
          ))}
        </div>

        {/* Bascule classique */}
        {flavor === 'classic' && (
          <button
            type="button"
            onClick={onToggleStartWithClassic}
            className={`h-7 px-2.5 rounded-lg text-xs font-medium border transition-colors duration-150 cursor-pointer ${
              startWithClassic
                ? 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent)]/5'
                : 'border-zinc-200/80 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 bg-white dark:bg-zinc-900'
            }`}
          >
            {isFr ? '« Lorem ipsum… »' : '"Lorem ipsum…"'}
          </button>
        )}
      </div>

      {/* Droite : Télécharger, Régénérer & Copier tout */}
      <div className="flex items-center justify-end gap-2">
        <ActionTooltip label={isFr ? 'Télécharger le document' : 'Download document'}>
          <button
            type="button"
            onClick={onDownload}
            aria-label={isFr ? 'Télécharger' : 'Download'}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-150 cursor-pointer active:scale-[0.96]"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </ActionTooltip>

        <button
          type="button"
          onClick={onRegenerate}
          className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors duration-150 cursor-pointer active:scale-[0.96] ${
            isRefreshing ? 'bg-zinc-200 dark:bg-zinc-700' : ''
          }`}
        >
          <RefreshCw
            className={`w-3.5 h-3.5 transition-transform ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          />
          <span>{isFr ? 'Régénérer' : 'Regenerate'}</span>
        </button>

        <CopyButton
          text={fullText}
          label={isFr ? 'Copier tout' : 'Copy all'}
          copiedLabel={isFr ? 'Copié !' : 'Copied!'}
          size="sm"
          className="bg-[var(--accent)] text-white hover:opacity-90 border-none shadow-xs font-semibold cursor-pointer transition-colors duration-150"
        />
      </div>
    </div>
  );
}
