import React from 'react';
import { RefreshCw, ChevronDown, Plus, Minus } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  UNITS,
  PRESETS,
  FLAVORS,
  type LoremFlavor,
  type LoremUnit,
} from '@/lib/lorem-ipsum-logic';

interface LoremCommandBarProps {
  unit: LoremUnit;
  count: number;
  flavor: LoremFlavor;
  isRefreshing: boolean;
  fullText: string;
  onUnitSelect: (unit: LoremUnit) => void;
  onCountChange: (delta: number) => void;
  onCountSet: (count: number) => void;
  onFlavorChange: (flavor: LoremFlavor) => void;
  onRegenerate: () => void;
  isFr: boolean;
}

export function LoremCommandBar({
  unit,
  count,
  flavor,
  isRefreshing,
  fullText,
  onUnitSelect,
  onCountChange,
  onCountSet,
  onFlavorChange,
  onRegenerate,
  isFr,
}: LoremCommandBarProps) {
  return (
    <div className="p-4 sm:px-6 sm:py-3.5 border-b border-zinc-200/80 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Gauche : Unités, Stepper, Paliers et Menu Lexique */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
        {/* Sélecteur d'unité */}
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs">
          {UNITS.map((u) => (
            <button
              key={u.id}
              type="button"
              onClick={() => onUnitSelect(u.id)}
              className={`px-2.5 sm:px-3 py-1 rounded-md font-medium transition-colors cursor-pointer active:scale-[0.98] ${
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
              className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 disabled:opacity-30 disabled:pointer-events-none cursor-pointer active:scale-[0.95]"
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
              className="w-5 h-5 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-100 cursor-pointer active:scale-[0.95]"
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
              className={`w-6 h-6 flex items-center justify-center rounded font-mono text-xs transition-colors cursor-pointer active:scale-[0.96] ${
                count === p
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Sélecteur de Lexique monté en haut */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer ml-1"
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
                      ? 'text-[#FF6B35] font-semibold'
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
      </div>

      {/* Droite : Régénérer & Copier tout */}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onRegenerate}
          className={`flex items-center gap-1.5 h-8 px-3 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer active:scale-[0.96] ${
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
          className="bg-[#FF6B35] text-white hover:bg-[#e85a26] border-none shadow-xs font-semibold cursor-pointer"
        />
      </div>
    </div>
  );
}
