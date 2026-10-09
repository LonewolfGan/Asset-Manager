import React from 'react';
import {
  Columns2,
  AlignLeft,
  ListTree,
  SlidersHorizontal,
  ArrowLeftRight,
  Trash2,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';
import type { DiffViewMode } from '@/lib/json-diff-aligned-logic';

export interface JsonDiffToolbarProps {
  viewMode: DiffViewMode;
  onViewModeChange: (mode: DiffViewMode) => void;
  deltasCount: number;
  normalizeKeys: boolean;
  onToggleNormalizeKeys: () => void;
  filterOnlyDiffs: boolean;
  onToggleFilterOnlyDiffs: () => void;
  hasBothInputs: boolean;
  hasInputs: boolean;
  onSwap: () => void;
  onClear: () => void;
  getDiffSummary: () => string;
  isFr: boolean;
}

export function JsonDiffToolbar({
  viewMode,
  onViewModeChange,
  deltasCount,
  normalizeKeys,
  onToggleNormalizeKeys,
  filterOnlyDiffs,
  onToggleFilterOnlyDiffs,
  hasBothInputs,
  hasInputs,
  onSwap,
  onClear,
  getDiffSummary,
  isFr,
}: JsonDiffToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-zinc-200 dark:border-white/10">
      {/* Groupe 1 : Modes de Visualisation du Diff */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onViewModeChange('split')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            viewMode === 'split'
              ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          }`}
        >
          <Columns2 className="w-3.5 h-3.5" />
          <span>{isFr ? 'Côte à côte' : 'Split View'}</span>
        </button>

        <button
          onClick={() => onViewModeChange('unified')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            viewMode === 'unified'
              ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          }`}
        >
          <AlignLeft className="w-3.5 h-3.5" />
          <span>{isFr ? 'Unifié' : 'Unified'}</span>
        </button>

        <button
          onClick={() => onViewModeChange('table')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            viewMode === 'table'
              ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-100 font-semibold'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
          }`}
        >
          <ListTree className="w-3.5 h-3.5" />
          <span>{isFr ? 'Résumé des deltas' : 'Deltas summary'}</span>
          {deltasCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono">
              {deltasCount}
            </span>
          )}
        </button>
      </div>

      {/* Groupe 2 : Options de Comparaison Sémantique */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <ActionTooltip
          label={
            isFr
              ? "Trier récursivement les clés avant comparaison pour ignorer l'ordre d'affichage"
              : 'Recursively sort keys before comparison to ignore key order'
          }
          side="bottom"
        >
          <button
            onClick={onToggleNormalizeKeys}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              normalizeKeys
                ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{isFr ? 'Normaliser les clés' : 'Normalize keys'}</span>
          </button>
        </ActionTooltip>

        {hasBothInputs && (
          <ActionTooltip
            label={
              isFr
                ? 'Masquer les lignes identiques pour afficher uniquement les modifications'
                : 'Hide identical lines to show only differences'
            }
            side="bottom"
          >
            <button
              onClick={onToggleFilterOnlyDiffs}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                filterOnlyDiffs
                  ? 'bg-zinc-200/80 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold'
                  : 'border-zinc-200 dark:border-white/10 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <span>{isFr ? 'Différences seules' : 'Diffs only'}</span>
            </button>
          </ActionTooltip>
        )}

        <ActionTooltip
          label={isFr ? 'Inverser les versions' : 'Swap versions'}
          side="bottom"
        >
          <button
            onClick={onSwap}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>{isFr ? 'Inverser les versions' : 'Swap versions'}</span>
          </button>
        </ActionTooltip>
      </div>

      {/* Groupe 3 : Actions d'Exportation & Nettoyage */}
      <div className="flex items-center gap-1.5 ml-auto">
        {hasInputs && (
          <ActionTooltip
            label={isFr ? 'Effacer les deux JSONs' : 'Clear both JSON payloads'}
            side="bottom"
          >
            <button
              onClick={onClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {hasBothInputs && (
          <CopyButton
            text={getDiffSummary}
            label={isFr ? 'Copier le diff' : 'Copy diff'}
            copiedLabel={isFr ? 'Diff copié !' : 'Diff copied!'}
            variant="default"
            size="sm"
            onCopy={() => trackToolUsed('json-diff', 'copy')}
          />
        )}
      </div>
    </div>
  );
}
