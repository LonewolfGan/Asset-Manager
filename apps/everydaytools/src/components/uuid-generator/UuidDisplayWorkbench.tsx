import React from 'react';
import { CopyButton } from '@/components/ui/copy-button';

interface UuidDisplayWorkbenchProps {
  count: number;
  uuids: string[];
  singleUuid: string;
  isFr: boolean;
  copiedLabel: string;
  onCopySingle: () => void;
}

export const UuidDisplayWorkbench: React.FC<UuidDisplayWorkbenchProps> = ({
  count,
  uuids,
  singleUuid,
  isFr,
  copiedLabel,
  onCopySingle,
}) => {
  if (count === 1) {
    return (
      <div className="p-8 sm:p-14 flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-full max-w-2xl py-8 px-6 rounded-xl border border-zinc-200/80 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex flex-col items-center justify-center gap-4 text-center">
          <div className="font-mono text-lg sm:text-2xl md:text-3xl font-semibold tracking-wider text-zinc-900 dark:text-zinc-100 break-all select-all">
            {singleUuid}
          </div>

          <CopyButton
            text={singleUuid}
            label={isFr ? "Copier l'UUID" : 'Copy UUID'}
            copiedLabel={copiedLabel}
            size="md"
            variant="default"
            toastMessage={isFr ? 'UUID copié' : 'UUID copied'}
            onCopy={onCopySingle}
          />
        </div>

        {/* Indication claire du raccourci clavier */}
        <div className="mt-4 flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <span>{isFr ? 'Appuyez sur' : 'Press'}</span>
          <kbd className="px-2 py-0.5 text-[11px] font-mono font-medium rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-white/10 shadow-2xs">
            {isFr ? 'Espace' : 'Space'}
          </kbd>
          <span>{isFr ? 'pour régénérer' : 'to regenerate'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200/80 dark:divide-white/5 bg-white dark:bg-zinc-950 max-h-[560px] overflow-y-auto">
      {uuids.map((id, idx) => (
        <div
          key={idx}
          className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3 hover:bg-zinc-50/60 dark:hover:bg-zinc-900/30 transition-colors group"
        >
          {/* Numéro de ligne + UUID */}
          <div className="flex items-center gap-3.5 min-w-0">
            <span className="text-[11px] font-mono text-zinc-400 select-none w-7 text-right shrink-0">
              #{String(idx + 1).padStart(2, '0')}
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-wider text-zinc-900 dark:text-zinc-100 select-all truncate">
              {id}
            </span>
          </div>

          {/* Bouton de copie individuel */}
          <div className="shrink-0">
            <CopyButton
              text={id}
              label={isFr ? 'Copier' : 'Copy'}
              copiedLabel={copiedLabel}
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
};
