import React from 'react';
import { Loader2 } from 'lucide-react';
import { ALGO_METAS, ChecksumAlgo } from '@/lib/checksum-logic';
import { ChecksumRow } from './ChecksumRow';

interface ChecksumListProps {
  isFr: boolean;
  hashes: Record<ChecksumAlgo, string> | null;
  matchedAlgo: ChecksumAlgo | null;
  isProcessing: boolean;
  copiedLabel: string;
  filterAlgo?: string;
  onTrackCopy?: (algoId: string) => void;
}

export const ChecksumList: React.FC<ChecksumListProps> = ({
  isFr,
  hashes,
  matchedAlgo,
  isProcessing,
  copiedLabel,
  filterAlgo,
  onTrackCopy,
}) => {
  return (
    <div className="flex flex-col gap-1 pt-2">
      <div className="flex items-center justify-between pb-2 border-b border-zinc-200/80 dark:border-white/10">
        <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400">
          {isFr
            ? 'Empreintes cryptographiques calculées'
            : 'Computed cryptographic checksums'}
        </span>
        {isProcessing && (
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{isFr ? 'Calcul en cours...' : 'Computing...'}</span>
          </div>
        )}
      </div>

      <div className="divide-y divide-zinc-200/60 dark:divide-white/5">
        {ALGO_METAS.filter((algo) => {
          if (!filterAlgo || filterAlgo === 'all') return true;
          return (
            algo.id.toLowerCase().replace(/[^a-z0-9]/g, '') ===
            filterAlgo.toLowerCase().replace(/[^a-z0-9]/g, '')
          );
        }).map((algo) => {
          const rawVal = (hashes?.[algo.id] ?? '').toLowerCase();
          const isMatched = Boolean(matchedAlgo && matchedAlgo === algo.id);
          const isDimmed = Boolean(matchedAlgo && !isMatched);

          return (
            <ChecksumRow
              key={algo.id}
              isFr={isFr}
              algo={algo}
              value={rawVal}
              isMatched={isMatched}
              isDimmed={isDimmed}
              isProcessing={isProcessing}
              copiedLabel={copiedLabel}
              onCopy={() => onTrackCopy?.(algo.id.toLowerCase())}
            />
          );
        })}
      </div>
    </div>
  );
};
