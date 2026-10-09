import React from 'react';
import { ChevronDown } from 'lucide-react';
import CurrencyFlag from '@/components/CurrencyFlag';
import { CopyButton } from '@/components/ui/copy-button';

interface CurrencyTargetOutputProps {
  convertedValue: string;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  onOpenPicker: () => void;
  label: string;
  isFr: boolean;
}

export function CurrencyTargetOutput({
  convertedValue,
  currency,
  currencyName,
  currencySymbol,
  onOpenPicker,
  label,
  isFr,
}: CurrencyTargetOutputProps) {
  return (
    <div className="p-6 sm:p-8 space-y-2 bg-zinc-50/40 dark:bg-zinc-900/30">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium">
          {label}
        </span>
        <button
          type="button"
          onClick={onOpenPicker}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border/80 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-all shadow-xs active:scale-98 cursor-pointer"
          aria-label={isFr ? 'Changer la devise cible' : 'Change target currency'}
        >
          <CurrencyFlag code={currency} size="md" />
          <span className="font-mono font-bold text-sm">{currency}</span>
          <span className="text-xs text-muted-foreground max-w-[150px] truncate sm:inline hidden">
            {currencyName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-0.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="text-4xl sm:text-5xl lg:text-6xl font-mono font-bold tracking-tight text-foreground truncate select-all">
          {convertedValue}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {currencySymbol && (
            <span className="text-xl sm:text-2xl font-mono font-medium text-muted-foreground select-none">
              {currencySymbol}
            </span>
          )}
          <CopyButton
            text={convertedValue !== '—' ? `${convertedValue} ${currency}` : ''}
            disabled={convertedValue === '—'}
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-foreground border border-border/70 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
            toastMessage={isFr ? 'Montant copié dans le presse-papier' : 'Amount copied to clipboard'}
          />
        </div>
      </div>
    </div>
  );
}
