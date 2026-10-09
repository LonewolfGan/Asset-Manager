import React from 'react';
import { Search, Check, X } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { ChecksumAlgo } from '@/lib/checksum-logic';

interface ChecksumIntegrityVerifierProps {
  isFr: boolean;
  expectedHash: string;
  setExpectedHash: (val: string) => void;
  matchedAlgo: ChecksumAlgo | null;
  isInvalidMatch: boolean;
}

export const ChecksumIntegrityVerifier: React.FC<ChecksumIntegrityVerifierProps> = ({
  isFr,
  expectedHash,
  setExpectedHash,
  matchedAlgo,
  isInvalidMatch,
}) => {
  return (
    <div className="relative flex items-center w-full h-11 px-3.5 rounded-xl font-mono text-xs sm:text-sm bg-zinc-100/50 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-white/10 focus-within:border-zinc-400 dark:focus-within:border-zinc-600 transition-colors">
      <Search className="w-4 h-4 text-zinc-400 shrink-0 mr-2.5 pointer-events-none" />
      <input
        type="text"
        value={expectedHash}
        onChange={(e) => setExpectedHash(e.target.value)}
        placeholder={
          isFr
            ? 'Comparer avec une empreinte attendue (SHA-256, MD5...)...'
            : 'Compare with an expected checksum (SHA-256, MD5...)...'
        }
        className="flex-1 min-w-0 bg-transparent text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 outline-none font-mono text-xs sm:text-sm"
      />
      <div className="flex items-center gap-2 shrink-0 ml-2">
        {matchedAlgo && (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/15">
            <Check className="w-3 h-3 stroke-[2.5]" />
            <span>{matchedAlgo}</span>
          </span>
        )}
        {isInvalidMatch && (
          <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500">
            {isFr ? 'Aucune correspondance' : 'No match'}
          </span>
        )}
        {expectedHash && (
          <ActionTooltip label={isFr ? 'Effacer' : 'Clear'} side="top">
            <button
              type="button"
              onClick={() => setExpectedHash('')}
              className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </ActionTooltip>
        )}
      </div>
    </div>
  );
};
