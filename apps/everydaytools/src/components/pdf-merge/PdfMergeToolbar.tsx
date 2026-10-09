import React from 'react';
import {
  LayoutGrid,
  List,
  Plus,
  ArrowDownAZ,
  ArrowUpDown,
  Trash2,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface PdfMergeToolbarProps {
  filesCount: number;
  outputFilename: string;
  viewMode: 'grid' | 'list';
  isFr: boolean;
  t: any;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onOutputFilenameChange: (name: string) => void;
  onAddMore: () => void;
  onSortAZ: () => void;
  onReverseOrder: () => void;
  onReset: () => void;
}

export const PdfMergeToolbar: React.FC<PdfMergeToolbarProps> = ({
  filesCount,
  outputFilename,
  viewMode,
  isFr,
  t,
  onViewModeChange,
  onOutputFilenameChange,
  onAddMore,
  onSortAZ,
  onReverseOrder,
  onReset,
}) => {
  return (
    <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-black/[0.06] dark:border-white/10">
      {/* Gauche : Mode d'affichage & Nom du fichier de sortie */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Bascule Planches / Registre */}
        <div className="flex items-center p-0.5 rounded-lg bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/60 dark:border-white/5">
          <ActionTooltip label={isFr ? 'Vue planches' : 'Grid view'}>
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                viewMode === 'grid'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              )}
            >
              <LayoutGrid size={13} strokeWidth={2.2} />
              <span>{isFr ? 'Planches' : 'Grid'}</span>
            </button>
          </ActionTooltip>
          <ActionTooltip label={isFr ? 'Vue registre' : 'List view'}>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={cn(
                'flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer',
                viewMode === 'list'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
              )}
            >
              <List size={13} strokeWidth={2.2} />
              <span>{isFr ? 'Registre' : 'List'}</span>
            </button>
          </ActionTooltip>
        </div>

        <div className="h-4 w-px bg-black/[0.08] dark:bg-white/10 shrink-0 hidden sm:block" />

        {/* Champ nom du document de sortie */}
        <div className="flex items-center gap-2">
          <label htmlFor="output-name" className="text-xs font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
            {isFr ? 'Nom :' : 'Name:'}
          </label>
          <input
            id="output-name"
            type="text"
            value={outputFilename}
            onChange={(e) => onOutputFilenameChange(e.target.value)}
            placeholder={isFr ? 'document_fusionne.pdf' : 'merged_document.pdf'}
            className="h-7 px-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/90 border border-zinc-200/80 dark:border-white/10 text-xs font-mono text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B35] w-48 sm:w-60 transition-all"
          />
        </div>
      </div>

      {/* Droite : Actions sur la liste (Ajouter, Trier, Inverser, Effacer) */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={onAddMore}
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] transition-all cursor-pointer"
        >
          <Plus size={13} strokeWidth={2.2} />
          <span>{t.pdfMerge?.addMore ?? (isFr ? 'Ajouter' : 'Add')}</span>
        </button>

        <ActionTooltip label={isFr ? 'Trier alphabétiquement par nom' : 'Sort alphabetically by name'}>
          <button
            type="button"
            onClick={onSortAZ}
            disabled={filesCount < 2}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ArrowDownAZ size={13} strokeWidth={2.2} />
            <span className="hidden sm:inline">{t.pdfMerge?.sortAZ ?? (isFr ? 'Trier A-Z' : 'Sort A-Z')}</span>
          </button>
        </ActionTooltip>

        <ActionTooltip label={isFr ? "Inverser l'ordre des documents" : 'Reverse document order'}>
          <button
            type="button"
            onClick={onReverseOrder}
            disabled={filesCount < 2}
            className="flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer"
          >
            <ArrowUpDown size={13} strokeWidth={2.2} />
            <span className="hidden sm:inline">{isFr ? 'Inverser' : 'Reverse'}</span>
          </button>
        </ActionTooltip>

        <ActionTooltip label={t.pdfMerge?.clearAll ?? (isFr ? "Réinitialiser l'assemblage" : 'Clear all')}>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 h-7 px-2 rounded-lg text-xs font-medium text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">{isFr ? 'Effacer' : 'Clear'}</span>
          </button>
        </ActionTooltip>
      </div>
    </div>
  );
};
