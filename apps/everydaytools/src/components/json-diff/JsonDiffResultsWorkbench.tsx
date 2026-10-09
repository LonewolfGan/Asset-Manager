import React from 'react';
import { toast } from 'sonner';
import { WrapButton } from '@/components/ui/wrap-button';
import type {
  DiffViewMode,
  AlignedLine,
  UnifiedLine,
  SemanticDelta,
} from '@/lib/json-diff-aligned-logic';
import { JsonDiffSplitView } from './JsonDiffSplitView';
import { JsonDiffUnifiedView } from './JsonDiffUnifiedView';
import { JsonDiffTableDeltasView } from './JsonDiffTableDeltasView';

export interface JsonDiffResultsWorkbenchProps {
  viewMode: DiffViewMode;
  metrics: {
    added: number;
    removed: number;
    modified: number;
    total: number;
    isIdentical: boolean;
  };
  deltas: SemanticDelta[];
  alignedLines: AlignedLine[];
  unifiedLines: UnifiedLine[];
  wordWrap: boolean;
  onToggleWordWrap: (next: boolean) => void;
  isFr: boolean;
}

export function JsonDiffResultsWorkbench({
  viewMode,
  metrics,
  deltas,
  alignedLines,
  unifiedLines,
  wordWrap,
  onToggleWordWrap,
  isFr,
}: JsonDiffResultsWorkbenchProps) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-950 overflow-hidden">
      {/* En-tête des résultats */}
      <div className="h-10 px-4 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            {isFr ? 'Résultat de la comparaison' : 'Comparison result'}
          </span>

          {/* Télémétrie des deltas */}
          {metrics.isIdentical ? (
            <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono font-medium">
              {isFr ? 'Objets JSON 100% Identiques' : 'JSON Objects 100% Identical'}
            </span>
          ) : deltas.length > 0 ? (
            <div className="flex items-center gap-2 text-[11px] font-mono">
              {metrics.added > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                  +{metrics.added} {isFr ? `ajout${metrics.added > 1 ? 's' : ''}` : `addition${metrics.added > 1 ? 's' : ''}`}
                </span>
              )}
              {metrics.removed > 0 && (
                <span className="text-rose-600 dark:text-rose-400 font-medium">
                  -{metrics.removed} {isFr ? `suppression${metrics.removed > 1 ? 's' : ''}` : `deletion${metrics.removed > 1 ? 's' : ''}`}
                </span>
              )}
              {metrics.modified > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  ~{metrics.modified} {isFr ? `modification${metrics.modified > 1 ? 's' : ''}` : `modification${metrics.modified > 1 ? 's' : ''}`}
                </span>
              )}
            </div>
          ) : null}
        </div>

        <div className="flex items-center">
          <WrapButton
            wrapped={wordWrap}
            onToggle={(next) => {
              onToggleWordWrap(next);
              toast.info(
                next
                  ? isFr
                    ? 'Retour à la ligne activé'
                    : 'Line wrap enabled'
                  : isFr
                    ? 'Retour à la ligne désactivé'
                    : 'Line wrap disabled'
              );
            }}
            label={isFr ? 'Retour à la ligne' : 'Line wrap'}
            size="sm"
          />
        </div>
      </div>

      {viewMode === 'split' && (
        <JsonDiffSplitView alignedLines={alignedLines} wordWrap={wordWrap} />
      )}

      {viewMode === 'unified' && (
        <JsonDiffUnifiedView unifiedLines={unifiedLines} wordWrap={wordWrap} />
      )}

      {viewMode === 'table' && (
        <JsonDiffTableDeltasView deltas={deltas} isFr={isFr} />
      )}
    </div>
  );
}
