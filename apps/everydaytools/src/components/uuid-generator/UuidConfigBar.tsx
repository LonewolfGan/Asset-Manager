import React from 'react';
import { RefreshCw } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { UuidVersion } from '@/lib/uuid-logic';
import { QUANTITY_PRESETS } from '@/lib/uuid-export-logic';

interface UuidConfigBarProps {
  version: UuidVersion | 'nil';
  count: number;
  isRefreshing: boolean;
  isFr: boolean;
  onVersionChange: (version: UuidVersion | 'nil') => void;
  onCountChange: (count: number) => void;
  onGenerate: () => void;
}

export const UuidConfigBar: React.FC<UuidConfigBarProps> = ({
  version,
  count,
  isRefreshing,
  isFr,
  onVersionChange,
  onCountChange,
  onGenerate,
}) => {
  return (
    <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Choix de la version */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mr-1">
          {isFr ? 'Version :' : 'Version:'}
        </span>
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/80 text-xs">
          {(['v4', 'v7', 'nil'] as const).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onVersionChange(v)}
              className={`px-3 py-1 rounded transition-colors cursor-pointer ${
                version === v
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {v === 'nil' ? 'Nil' : v}
            </button>
          ))}
        </div>
      </div>

      {/* Choix de la quantité */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 mr-1">
          {isFr ? 'Quantité :' : 'Quantity:'}
        </span>
        <div className="flex items-center p-0.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800/80 text-xs">
          {QUANTITY_PRESETS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => onCountChange(q)}
              className={`px-2.5 py-1 rounded transition-colors cursor-pointer font-mono ${
                count === q
                  ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-100 font-semibold shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* Bouton de Régénération direct avec raccourci clavier explicite */}
      <ActionTooltip
        label={
          isFr
            ? 'Appuyez sur la touche Espace pour régénérer'
            : 'Press Space key to regenerate'
        }
        side="top"
      >
        <button
          type="button"
          onClick={onGenerate}
          className="flex items-center justify-center gap-2 h-8 px-3 text-xs font-semibold rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isFr ? 'Régénérer' : 'Regenerate'}</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono font-medium rounded bg-zinc-800 text-zinc-300 dark:bg-zinc-200 dark:text-zinc-700 border border-zinc-700 dark:border-zinc-300">
            {isFr ? 'Espace' : 'Space'}
          </kbd>
        </button>
      </ActionTooltip>
    </div>
  );
};
