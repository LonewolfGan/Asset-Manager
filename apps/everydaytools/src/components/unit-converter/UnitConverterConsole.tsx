import React from 'react';
import { ArrowLeftRight, ChevronDown } from 'lucide-react';
import type { UnitDef } from '@/config/units.config';
import { SYSTEM_GROUPS, type MeasurementSystem } from '@/lib/unit-systems';
import { CopyButton } from '@/components/ui/copy-button';
import { ActionTooltip } from '@/components/ui/tooltip';

interface UnitConverterConsoleProps {
  formulaExplanation: string;
  fromDef: UnitDef;
  toDef: UnitDef;
  fromSystem: MeasurementSystem;
  toSystem: MeasurementSystem;
  fromValue: string;
  toValue: string;
  isSwapping: boolean;
  isFr: boolean;
  unitNames?: Record<string, string>;
  onFromChange: (val: string) => void;
  onToChange: (val: string) => void;
  onSwap: () => void;
  onOpenPicker: (target: 'from' | 'to') => void;
}

export function UnitConverterConsole({
  formulaExplanation,
  fromDef,
  toDef,
  fromSystem,
  toSystem,
  fromValue,
  toValue,
  isSwapping,
  isFr,
  unitNames,
  onFromChange,
  onToChange,
  onSwap,
  onOpenPicker,
}: UnitConverterConsoleProps) {
  return (
    <div className="w-full max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
      {/* Top Formula Header */}
      <div className="px-5 py-3 border-b border-border/60 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-center text-center text-xs font-mono">
        <span className="font-semibold text-foreground text-xs sm:text-sm tracking-tight truncate">
          {formulaExplanation}
        </span>
      </div>

      {/* Side-by-Side Bilateral Console */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] items-center divide-y md:divide-y-0 md:divide-x divide-border/60">
        {/* Unit A (Left Console) */}
        <div className="p-5 sm:p-6 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpenPicker('from')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-all shadow-xs active:scale-98 cursor-pointer"
              aria-label={isFr ? "Changer l'unité A" : 'Change unit A'}
            >
              <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-border/60">
                {fromDef.symbol}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {unitNames?.[fromDef.id] ?? fromDef.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-0.5" />
            </button>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-muted-foreground">
              {SYSTEM_GROUPS[fromSystem].badge}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3 pt-1">
            <input
              type="text"
              inputMode="decimal"
              value={fromValue}
              onChange={(e) => onFromChange(e.target.value)}
              placeholder="0"
              className="w-full text-4xl sm:text-5xl font-mono font-bold tracking-tight text-foreground bg-transparent border-none outline-none p-0 focus:ring-0"
            />
            <span className="text-lg sm:text-xl font-mono font-medium text-muted-foreground select-none shrink-0">
              {fromDef.symbol}
            </span>
          </div>
        </div>

        {/* Central Equalizer & Swap Button */}
        <div className="p-3 md:p-4 flex items-center justify-center">
          <ActionTooltip
            label={isFr ? 'Inverser les unités (A ↔ B)' : 'Swap units (A ↔ B)'}
            side="top"
          >
            <button
              type="button"
              onClick={onSwap}
              aria-label={isFr ? 'Inverser les unités' : 'Swap units'}
              className="w-10 h-10 rounded-full border border-border/80 bg-background text-foreground shadow-sm flex items-center justify-center hover:border-[#FF6B35] hover:text-[#FF6B35] dark:hover:border-[#FF6B35] transition-all duration-200 active:scale-90 active:rotate-180 cursor-pointer"
            >
              <ArrowLeftRight
                className={`w-4 h-4 transition-transform duration-200 ${
                  isSwapping ? 'rotate-180' : ''
                }`}
              />
            </button>
          </ActionTooltip>
        </div>

        {/* Unit B (Right Console) */}
        <div className="p-5 sm:p-6 space-y-2 bg-zinc-50/40 dark:bg-zinc-900/30">
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => onOpenPicker('to')}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border/80 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-all shadow-xs active:scale-98 cursor-pointer"
              aria-label={isFr ? "Changer l'unité B" : 'Change unit B'}
            >
              <span className="px-2 py-0.5 rounded-md font-mono font-bold text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-border/60">
                {toDef.symbol}
              </span>
              <span className="text-xs font-semibold text-foreground">
                {unitNames?.[toDef.id] ?? toDef.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-0.5" />
            </button>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-muted-foreground">
              {SYSTEM_GROUPS[toSystem].badge}
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3 pt-1">
            <input
              type="text"
              inputMode="decimal"
              value={toValue}
              onChange={(e) => onToChange(e.target.value)}
              placeholder="0"
              className="w-full text-4xl sm:text-5xl font-mono font-bold tracking-tight text-foreground bg-transparent border-none outline-none p-0 focus:ring-0"
            />
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-lg sm:text-xl font-mono font-medium text-muted-foreground select-none">
                {toDef.symbol}
              </span>
              <CopyButton
                text={
                  toValue && toValue !== '—'
                    ? `${toValue} ${toDef.symbol}`
                    : ''
                }
                disabled={!toValue || toValue === '—'}
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground border border-border/70 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800"
                toastMessage={
                  isFr
                    ? 'Valeur copiée dans le presse-papier'
                    : 'Value copied to clipboard'
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
