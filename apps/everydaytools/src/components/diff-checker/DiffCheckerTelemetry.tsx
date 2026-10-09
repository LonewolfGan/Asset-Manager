import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { type DiffStats } from '@/lib/diff-checker-logic';

interface DiffCheckerTelemetryProps {
  stats: DiffStats;
  isFr: boolean;
}

export function DiffCheckerTelemetry({ stats, isFr }: DiffCheckerTelemetryProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 text-xs">
      <div className="flex items-center gap-2.5 flex-wrap">
        <span className="flex items-center gap-1 font-medium text-emerald-600 dark:text-emerald-400">
          <Plus className="w-3.5 h-3.5" />
          <span>
            {stats.additions} {isFr ? 'ajouts' : 'additions'}
          </span>
        </span>

        <span className="text-zinc-300 dark:text-zinc-700">·</span>

        <span className="flex items-center gap-1 font-medium text-red-600 dark:text-red-400">
          <Minus className="w-3.5 h-3.5" />
          <span>
            {stats.deletions} {isFr ? 'suppressions' : 'deletions'}
          </span>
        </span>

        <span className="text-zinc-300 dark:text-zinc-700">·</span>

        <span className="flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
          <span>
            ~ {stats.modifications} {isFr ? 'modifications' : 'modifications'}
          </span>
        </span>

        <span className="text-zinc-300 dark:text-zinc-700">·</span>

        <span className="text-zinc-500 dark:text-zinc-400 font-mono">
          {stats.unchanged} {isFr ? 'identiques' : 'identical'}
        </span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="px-2 py-0.5 rounded-full bg-zinc-200/80 dark:bg-zinc-800 text-[11px] font-mono text-zinc-700 dark:text-zinc-300">
          {stats.similarityPct}% {isFr ? 'similarité' : 'similarity'}
        </span>
      </div>
    </div>
  );
}
