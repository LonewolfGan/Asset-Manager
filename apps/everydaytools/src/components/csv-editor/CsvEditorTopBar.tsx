import React from 'react';
import {
  ArrowLeft,
  Search,
  X,
  Undo2,
  Redo2,
  Plus,
  Trash2,
  Download,
  ChevronDown,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { DelimiterRadioGroup } from '@workspace/ui/controls';

interface CsvEditorTopBarProps {
  documentName: string;
  onDocumentNameChange: (val: string) => void;
  rowsCount: number;
  colsCount: number;
  searchQuery: string;
  onSearchQueryChange: (val: string) => void;
  onReset: () => void;
  historyLength: number;
  futureLength: number;
  onUndo: () => void;
  onRedo: () => void;
  onAddRow: () => void;
  onAddCol: () => void;
  onClearRows: () => void;
  showExportMenu: boolean;
  onShowExportMenuChange: (open: boolean) => void;
  onExportCsv: (delimiter: string) => void;
  onExportExcel: () => void;
  isFr: boolean;
}

export function CsvEditorTopBar({
  documentName,
  onDocumentNameChange,
  rowsCount,
  colsCount,
  searchQuery,
  onSearchQueryChange,
  onReset,
  historyLength,
  futureLength,
  onUndo,
  onRedo,
  onAddRow,
  onAddCol,
  onClearRows,
  showExportMenu,
  onShowExportMenuChange,
  onExportCsv,
  onExportExcel,
  isFr,
}: CsvEditorTopBarProps) {
  const [selectedDelimiter, setSelectedDelimiter] = React.useState(',');

  return (
    <div className="w-full flex items-center justify-between gap-3 py-2.5 border-b border-black/[0.08] dark:border-white/10 flex-wrap lg:flex-nowrap">
      {/* Gauche : Changer de fichier + Format Icon + Nom + Télémétrie */}
      <div className="flex items-center gap-3 min-w-0">
        <ActionTooltip label={isFr ? 'Changer de fichier (Échap)' : 'Change file (Esc)'} side="bottom">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors shrink-0 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">{isFr ? 'Changer de fichier' : 'Change file'}</span>
          </button>
        </ActionTooltip>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 shrink-0" />

        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={getFileFormatIcon(documentName.endsWith('.xlsx') ? 'file.xlsx' : 'file.csv')}
            alt="CSV"
            className="w-5 h-5 object-contain shrink-0"
          />
          <div className="flex items-baseline gap-2 min-w-0">
            <ActionTooltip label={isFr ? 'Renommer le document' : 'Rename document'} side="bottom">
              <input
                type="text"
                value={documentName}
                onChange={(e) => onDocumentNameChange(e.target.value)}
                placeholder={isFr ? 'Nom du fichier...' : 'File name...'}
                className="text-xs font-medium text-zinc-900 dark:text-zinc-100 bg-transparent hover:border-b hover:border-black/20 dark:hover:border-white/20 focus:border-b focus:border-[#FF6B35] focus:outline-none transition-colors max-w-[130px] sm:max-w-[180px] truncate py-0.5"
              />
            </ActionTooltip>
            <span className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 shrink-0">
              ({rowsCount} {isFr ? 'lig.' : 'rows'} × {colsCount} {isFr ? 'col.' : 'cols'})
            </span>
          </div>
        </div>
      </div>

      {/* Centre : Recherche / Filtrage direct */}
      <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm mx-1 order-last lg:order-none w-full lg:w-auto">
        <div className="relative w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            placeholder={isFr ? 'Rechercher dans les cellules...' : 'Search cells...'}
            className="w-full h-8 pl-8 pr-7 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.04] text-xs text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Droite : Actions d'édition & Exportation */}
      <div className="flex items-center gap-1.5 shrink-0 ml-auto lg:ml-0">
        <ActionTooltip label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'} side="bottom">
          <button
            type="button"
            onClick={onUndo}
            disabled={historyLength === 0}
            className="h-9 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Undo2 size={13} />
            <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
          </button>
        </ActionTooltip>

        <ActionTooltip label={isFr ? 'Rétablir (Ctrl+Y)' : 'Redo (Ctrl+Y)'} side="bottom">
          <button
            type="button"
            onClick={onRedo}
            disabled={futureLength === 0}
            className="h-9 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-zinc-700 dark:text-zinc-300 transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
          >
            <Redo2 size={13} />
            <span className="hidden sm:inline">{isFr ? 'Rétablir' : 'Redo'}</span>
          </button>
        </ActionTooltip>

        <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5 shrink-0" />

        <button
          type="button"
          onClick={onAddRow}
          className="h-9 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all flex items-center gap-1 cursor-pointer active:scale-[0.98]"
        >
          <Plus size={13} />
          <span className="hidden md:inline">{isFr ? 'Ligne' : 'Row'}</span>
        </button>

        <button
          type="button"
          onClick={onAddCol}
          className="h-9 px-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-xs font-medium text-zinc-800 dark:text-zinc-200 transition-all flex items-center gap-1 cursor-pointer active:scale-[0.98]"
        >
          <Plus size={13} />
          <span className="hidden md:inline">{isFr ? 'Colonne' : 'Column'}</span>
        </button>

        {/* Vider le tableau (précède immédiatement Exporter par Règle 25) */}
        <ActionTooltip label={isFr ? 'Vider toutes les lignes du tableau' : 'Clear all rows in the table'} side="bottom">
          <button
            type="button"
            onClick={() => {
              if (rowsCount === 0) return;
              if (
                window.confirm(
                  isFr
                    ? 'Voulez-vous vraiment effacer toutes les lignes du tableau ?'
                    : 'Do you really want to clear all rows in the table?'
                )
              ) {
                onClearRows();
              }
            }}
            disabled={rowsCount === 0}
            className="h-9 px-2.5 rounded-xl border border-red-500/20 bg-red-500/[0.04] hover:bg-red-500/[0.08] disabled:opacity-35 disabled:pointer-events-none text-xs font-medium text-red-600 dark:text-red-400 transition-all flex items-center gap-1 cursor-pointer active:scale-[0.98]"
          >
            <Trash2 size={13} />
            <span className="hidden sm:inline">{isFr ? 'Vider' : 'Clear'}</span>
          </button>
        </ActionTooltip>

        {/* Menu d'Exportation (#FF6B35, dernier élément à droite par Règle 25) */}
        <Popover open={showExportMenu} onOpenChange={onShowExportMenuChange}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="h-9 px-3.5 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-xs font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer active:scale-[0.98]"
            >
              <Download size={13} />
              <span>{isFr ? 'Exporter' : 'Export'}</span>
              <ChevronDown size={13} className={`transition-transform duration-200 ${showExportMenu ? 'rotate-180' : ''}`} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" side="bottom" sideOffset={8} className="w-80 p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl space-y-3">
            <div className="space-y-2">
              <DelimiterRadioGroup
                value={selectedDelimiter}
                onChange={setSelectedDelimiter}
                label={isFr ? 'Séparateur CSV de sortie' : 'Output CSV delimiter'}
                isFr={isFr}
                allowCustom
              />
              <button
                type="button"
                onClick={() => onExportCsv(selectedDelimiter)}
                className="w-full h-9 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 transition-colors flex items-center justify-between cursor-pointer active:scale-[0.98]"
              >
                <span>{isFr ? 'Télécharger le fichier .csv' : 'Download .csv file'}</span>
                <span className="text-[11px] font-mono text-zinc-400">.csv</span>
              </button>
            </div>

            <div className="border-t border-black/[0.06] dark:border-white/10" />

            <button
              type="button"
              onClick={onExportExcel}
              className="w-full h-9 px-3 rounded-xl text-left text-xs font-medium text-zinc-800 dark:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center justify-between whitespace-nowrap cursor-pointer active:scale-[0.98]"
            >
              <span>{isFr ? 'Classeur Excel' : 'Excel Workbook'}</span>
              <span className="text-[11px] font-mono text-zinc-400">.xlsx</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
