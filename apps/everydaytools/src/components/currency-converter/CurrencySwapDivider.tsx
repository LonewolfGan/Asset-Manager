import React from 'react';
import { ArrowLeftRight } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';

interface CurrencySwapDividerProps {
  isSwapping: boolean;
  onSwap: () => void;
  isFr: boolean;
}

export function CurrencySwapDivider({
  isSwapping,
  onSwap,
  isFr,
}: CurrencySwapDividerProps) {
  return (
    <div className="relative flex items-center justify-center">
      <div className="w-full border-t border-border/60" />
      <ActionTooltip label={isFr ? 'Inverser les devises' : 'Swap currencies'} side="top">
        <button
          type="button"
          onClick={onSwap}
          aria-label={isFr ? 'Inverser les devises' : 'Swap currencies'}
          className="absolute z-10 w-11 h-11 rounded-full border border-border/80 bg-background text-foreground shadow-sm flex items-center justify-center hover:border-[#FF6B35] hover:text-[#FF6B35] dark:hover:border-[#FF6B35] transition-all duration-200 active:scale-90 active:rotate-180 cursor-pointer"
        >
          <ArrowLeftRight
            className={`w-4 h-4 transition-transform duration-200 ${
              isSwapping ? 'rotate-180' : ''
            }`}
          />
        </button>
      </ActionTooltip>
    </div>
  );
}
