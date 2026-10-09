import React from 'react';
import { Check } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { AlgoMeta } from '@/lib/checksum-logic';

interface ChecksumRowProps {
  isFr: boolean;
  algo: AlgoMeta;
  value: string;
  isMatched: boolean;
  isDimmed: boolean;
  isProcessing: boolean;
  copiedLabel: string;
  onCopy?: () => void;
}

export const ChecksumRow: React.FC<ChecksumRowProps> = ({
  isFr,
  algo,
  value,
  isMatched,
  isDimmed,
  isProcessing,
  copiedLabel,
  onCopy,
}) => {
  return (
    <div
      className={`py-3 px-3 rounded-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
        isDimmed ? 'opacity-30 hover:opacity-75' : 'opacity-100'
      } ${
        isMatched
          ? 'bg-zinc-100/80 dark:bg-zinc-800/60'
          : 'hover:bg-zinc-100/40 dark:hover:bg-zinc-900/30'
      }`}
    >
      {/* Info Algorithme */}
      <div className="flex items-center gap-2.5 w-48 shrink-0">
        <span className="font-mono font-bold text-xs uppercase tracking-wide text-zinc-900 dark:text-zinc-100">
          {algo.name}
        </span>
        <span className="font-mono text-[10px] text-zinc-400">
          {algo.bits}b
        </span>
        {isMatched ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <Check className="w-2.5 h-2.5 stroke-[2.5]" />
            <span>{isFr ? 'Vérifié' : 'Verified'}</span>
          </span>
        ) : algo.isStandard ? (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#FF6B35]/10 text-[#FF6B35] font-semibold">
            {isFr ? 'Standard' : 'Standard'}
          </span>
        ) : null}
      </div>

      {/* Valeur du Hash */}
      <div className="flex-1 min-w-0 md:px-3">
        {isProcessing && !value ? (
          <div className="h-4 w-48 bg-zinc-200/60 dark:bg-zinc-800 rounded animate-pulse" />
        ) : (
          <p className="font-mono text-xs sm:text-sm break-all select-all font-medium text-zinc-800 dark:text-zinc-200">
            {value}
          </p>
        )}
      </div>

      {/* Bouton de copie direct */}
      <div className="shrink-0 flex items-center justify-end">
        <CopyButton
          text={value ? value.toLowerCase() : ''}
          disabled={!value || isProcessing}
          label={isFr ? 'Copier' : 'Copy'}
          copiedLabel={copiedLabel}
          size="sm"
          variant="default"
          onCopy={onCopy}
        />
      </div>
    </div>
  );
};
