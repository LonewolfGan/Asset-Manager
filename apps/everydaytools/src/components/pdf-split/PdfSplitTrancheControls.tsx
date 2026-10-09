import React from 'react';
import { Minus, Plus, Trash2, Info, FileText, Layers } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { Tranche } from '@/lib/pdf-split-logic';

export interface PdfSplitTrancheControlsProps {
  totalPages: number;
  tranches: Tranche[];
  splitViewMode: 'list' | 'pages';
  batchChunkSize: number;
  overlappingTranchesInfo: { rangesText: string; count: number } | null;
  isFr: boolean;
  t: any;
  onSplitViewModeChange: (mode: 'list' | 'pages') => void;
  onBatchChunkSizeChange: (val: number | ((prev: number) => number)) => void;
  onGenerateBatchSlices: () => void;
  onAddTranche: () => void;
  onUpdateTranche: (id: string, field: 'from' | 'to', value: number) => void;
  onRemoveTranche: (id: string) => void;
}

export const PdfSplitTrancheControls: React.FC<PdfSplitTrancheControlsProps> = ({
  totalPages,
  tranches,
  splitViewMode,
  batchChunkSize,
  overlappingTranchesInfo,
  isFr,
  t,
  onSplitViewModeChange,
  onBatchChunkSizeChange,
  onGenerateBatchSlices,
  onAddTranche,
  onUpdateTranche,
  onRemoveTranche,
}) => {
  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-900 border border-black/[0.08] dark:border-white/10 p-6 sm:p-8 flex flex-col gap-6">
      {/* Top Header: View mode & regular chunking */}
      <div className="pb-5 border-b border-black/[0.06] dark:border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center bg-zinc-100 dark:bg-zinc-800/90 p-1 rounded-xl border border-black/[0.06] dark:border-white/10">
            <button
              type="button"
              onClick={() => onSplitViewModeChange('list')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                splitViewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isFr ? `Vue Liste (${tranches.length})` : `List view (${tranches.length})`}</span>
            </button>
            <button
              type="button"
              onClick={() => onSplitViewModeChange('pages')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98] ${
                splitViewMode === 'pages'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{isFr ? `Vue Planches (${totalPages} p.)` : `Grid view (${totalPages} p.)`}</span>
            </button>
          </div>

          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono hidden sm:inline">
            {splitViewMode === 'list'
              ? isFr
                ? 'Ajustez chaque tranche et ses pages'
                : 'Adjust each split range and its pages'
              : isFr
              ? 'Vérifiez la répartition visuelle des fichiers'
              : 'Check visual file distribution'}
          </span>
        </div>

        {/* Regular batch chunking */}
        <div className="flex items-center gap-2.5 self-start lg:self-auto bg-black/[0.02] dark:bg-white/[0.02] p-1.5 sm:p-2 rounded-xl border border-black/[0.06] dark:border-white/10">
          <span className="text-xs font-mono text-zinc-500 shrink-0">
            {isFr ? 'Lots réguliers de :' : 'Split every:'}
          </span>
          <div className="flex items-center rounded-lg border border-black/[0.1] dark:border-white/15 bg-white dark:bg-zinc-800 overflow-hidden h-8">
            <button
              type="button"
              onClick={() => onBatchChunkSizeChange((p: number) => Math.max(1, p - 1))}
              className="w-7 h-full flex items-center justify-center hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-zinc-300 transition-colors"
            >
              <Minus size={11} />
            </button>
            <input
              type="number"
              min={1}
              max={totalPages || 1}
              value={batchChunkSize}
              onChange={(e) =>
                onBatchChunkSizeChange(Math.max(1, Math.min(totalPages || 1, parseInt(e.target.value) || 1)))
              }
              className="w-10 h-full text-center text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => onBatchChunkSizeChange((p: number) => Math.min(totalPages || 1, p + 1))}
              className="w-7 h-full flex items-center justify-center hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-zinc-300 transition-colors"
            >
              <Plus size={11} />
            </button>
          </div>
          <span className="text-xs font-mono text-zinc-500">{isFr ? 'pages' : 'pages'}</span>
          <button
            type="button"
            onClick={onGenerateBatchSlices}
            className="h-8 px-3 rounded-lg text-xs font-semibold bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
          >
            {isFr ? 'Appliquer' : 'Apply'}
          </button>
        </div>
      </div>

      {splitViewMode === 'list' && (
        <>
          {overlappingTranchesInfo && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-700 dark:text-blue-300">
              <Info size={16} className="shrink-0 text-blue-500" />
              <span>
                {isFr
                  ? `Chevauchement pris en compte : les pages (${overlappingTranchesInfo.rangesText}) sont incluses dans plusieurs fichiers. Elles sont identifiées en bleu et seront dupliquées dans chaque fichier PDF respectif.`
                  : `Overlap detected: pages (${overlappingTranchesInfo.rangesText}) belong to multiple files. They are highlighted in blue and will be duplicated in each respective PDF.`}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {tranches.length === 0 && (
              <div className="py-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {isFr
                  ? 'Aucun découpage défini. Cliquez sur « Ajouter un fichier » ci-dessous ou appliquez des lots réguliers.'
                  : 'No split ranges defined. Click "Add split file" below or apply regular batches.'}
              </div>
            )}
            {tranches.map((tranche, idx) => {
              const count = tranche.to - tranche.from + 1;
              return (
                <div
                  key={tranche.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 rounded-xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/[0.06] dark:border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-[#FF6B35] text-white text-xs font-mono font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {isFr ? `Fichier ${idx + 1} :` : `File ${idx + 1}:`}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* From */}
                    <div className="flex items-center rounded-lg border border-black/[0.1] dark:border-white/15 bg-white dark:bg-zinc-800 overflow-hidden h-8">
                      <span className="px-2 text-xs text-zinc-500 font-mono border-r border-black/[0.06] dark:border-white/10">
                        {t.pdfSplit?.fromPage ?? (isFr ? 'De' : 'From')}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateTranche(tranche.id, 'from', tranche.from - 1)}
                        className="w-6 h-full flex items-center justify-center hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-zinc-300 transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={totalPages || 1}
                        value={tranche.from}
                        onChange={(e) => onUpdateTranche(tranche.id, 'from', parseInt(e.target.value) || 1)}
                        className="w-10 h-full text-center text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateTranche(tranche.id, 'from', tranche.from + 1)}
                        className="w-6 h-full flex items-center justify-center hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-zinc-300 transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    {/* To */}
                    <div className="flex items-center rounded-lg border border-black/[0.1] dark:border-white/15 bg-white dark:bg-zinc-800 overflow-hidden h-8">
                      <span className="px-2 text-xs text-zinc-500 font-mono border-r border-black/[0.06] dark:border-white/10">
                        {t.pdfSplit?.toPage ?? (isFr ? 'À' : 'To')}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateTranche(tranche.id, 'to', tranche.to - 1)}
                        className="w-6 h-full flex items-center justify-center hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-zinc-300 transition-colors"
                      >
                        <Minus size={11} />
                      </button>
                      <input
                        type="number"
                        min={1}
                        max={totalPages || 1}
                        value={tranche.to}
                        onChange={(e) => onUpdateTranche(tranche.id, 'to', parseInt(e.target.value) || 1)}
                        className="w-10 h-full text-center text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100 bg-transparent border-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <button
                        type="button"
                        onClick={() => onUpdateTranche(tranche.id, 'to', tranche.to + 1)}
                        className="w-6 h-full flex items-center justify-center hover:bg-black/[0.05] dark:hover:bg-white/[0.1] text-zinc-600 dark:text-zinc-300 transition-colors"
                      >
                        <Plus size={11} />
                      </button>
                    </div>

                    <span className="text-xs font-mono text-zinc-400">
                      ({count} page{count > 1 ? 's' : ''})
                    </span>

                    <ActionTooltip label={isFr ? 'Supprimer ce fichier' : 'Delete this file'}>
                      <button
                        type="button"
                        onClick={() => onRemoveTranche(tranche.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors ml-auto sm:ml-0 cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </ActionTooltip>
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <button
                type="button"
                onClick={onAddTranche}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-800 dark:text-zinc-200 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.06] dark:hover:bg-white/[0.1] active:scale-[0.98] transition-colors cursor-pointer"
              >
                <Plus size={14} strokeWidth={2.5} />
                <span>{isFr ? 'Ajouter un fichier (tranche)' : 'Add split file'}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
