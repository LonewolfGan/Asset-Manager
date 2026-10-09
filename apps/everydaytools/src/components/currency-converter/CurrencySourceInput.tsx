import React from 'react';
import { ChevronDown } from 'lucide-react';
import CurrencyFlag from '@/components/CurrencyFlag';

interface CurrencySourceInputProps {
  amount: string;
  onAmountChange: (val: string) => void;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  onOpenPicker: () => void;
  label: string;
  isFr: boolean;
}

export function CurrencySourceInput({
  amount,
  onAmountChange,
  currency,
  currencyName,
  currencySymbol,
  onOpenPicker,
  label,
  isFr,
}: CurrencySourceInputProps) {
  return (
    <div className="p-6 sm:p-8 space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="currency-amount-input"
          className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground font-medium"
        >
          {label}
        </label>
        <button
          type="button"
          onClick={onOpenPicker}
          className="inline-flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border/80 bg-background hover:bg-zinc-100 dark:hover:bg-zinc-800 text-foreground transition-all shadow-xs active:scale-98 cursor-pointer"
          aria-label={isFr ? 'Changer la devise source' : 'Change source currency'}
        >
          <CurrencyFlag code={currency} size="md" />
          <span className="font-mono font-bold text-sm">{currency}</span>
          <span className="text-xs text-muted-foreground max-w-[150px] truncate sm:inline hidden">
            {currencyName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0 ml-0.5" />
        </button>
      </div>

      <div className="flex items-baseline justify-between gap-4 pt-1">
        <input
          id="currency-amount-input"
          type="text"
          inputMode="decimal"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0"
          className="w-full text-4xl sm:text-5xl lg:text-6xl font-mono font-bold tracking-tight text-foreground bg-transparent border-none outline-none p-0 focus:ring-0"
        />
        {currencySymbol && (
          <span className="text-xl sm:text-2xl font-mono font-medium text-muted-foreground shrink-0 select-none">
            {currencySymbol}
          </span>
        )}
      </div>
    </div>
  );
}
