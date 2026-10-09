import React from 'react';
import { Radio, RefreshCw } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { POPULAR_PAIRS } from '@/lib/currency-converter-logic';
import type { CurrencySourceInfo } from '@/hooks/use-currency-converter-workflow';

interface CurrencyTelemetryBarProps {
  fromCurrency: string;
  toCurrency: string;
  directRate: number | null;
  inverseRate: number | null;
  sourceInfo: CurrencySourceInfo;
  isRefreshing: boolean;
  onRefresh: () => void;
  onSelectPair: (from: string, to: string) => void;
  locale: string;
  isFr: boolean;
}

export function CurrencyTelemetryBar({
  fromCurrency,
  toCurrency,
  directRate,
  inverseRate,
  sourceInfo,
  isRefreshing,
  onRefresh,
  onSelectPair,
  locale,
  isFr,
}: CurrencyTelemetryBarProps) {
  const directRateStr =
    directRate !== null
      ? directRate.toLocaleString(locale || 'fr-FR', { maximumFractionDigits: 5 })
      : '...';

  const inverseRateStr =
    inverseRate !== null
      ? inverseRate.toLocaleString(locale || 'fr-FR', { maximumFractionDigits: 5 })
      : '...';

  const sourceLabel =
    sourceInfo.type === 'live'
      ? sourceInfo.age > 0
        ? isFr
          ? `actualisé il y a ${sourceInfo.age} min`
          : `updated ${sourceInfo.age} min ago`
        : isFr
        ? 'cours en direct'
        : 'live rates'
      : sourceInfo.type === 'offline'
      ? `snapshot ${sourceInfo.date}`
      : '';

  return (
    <div className="p-4 sm:p-5 border-b border-border/60 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col gap-3">
      {/* Top Row: Live Telemetry + Refresh */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <Radio className="w-4 h-4 text-muted-foreground shrink-0" />
          <span className="font-mono font-semibold text-foreground text-xs sm:text-sm tracking-tight truncate">
            1 {fromCurrency} = {directRateStr} {toCurrency}
          </span>
          <span className="text-muted-foreground/70 hidden sm:inline font-mono text-[11px] truncate">
            · {isFr ? 'Inverse :' : 'Inverse:'} 1 {toCurrency} = {inverseRateStr} {fromCurrency}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-mono text-muted-foreground">{sourceLabel}</span>
          <ActionTooltip label={isFr ? 'Actualiser les cours en direct' : 'Refresh live rates'} side="top">
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="p-1.5 rounded-lg border border-border/60 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-muted-foreground hover:text-foreground transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              aria-label={isFr ? 'Actualiser les cours' : 'Refresh rates'}
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isRefreshing ? 'animate-spin text-[#FF6B35]' : ''
                }`}
              />
            </button>
          </ActionTooltip>
        </div>
      </div>

      {/* Bottom Row: Quick Currency Chips */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pt-0.5">
        {POPULAR_PAIRS.map((pair) => {
          const isActive = fromCurrency === pair.from && toCurrency === pair.to;
          return (
            <button
              key={pair.label}
              type="button"
              onClick={() => onSelectPair(pair.from, pair.to)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all shrink-0 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                  : 'text-muted-foreground hover:text-foreground hover:bg-zinc-200/60 dark:hover:bg-zinc-800'
              }`}
            >
              {pair.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
