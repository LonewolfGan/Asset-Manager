import React from 'react';
import {
  FileText,
  FolderOpen,
  X,
  Type,
  Undo2,
  Redo2,
  Trash2,
  Copy,
  Download,
  FileJson,
  BarChart2,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ActionTooltip } from '@/components/ui/tooltip';
import { CaseTransformButtonGroup, type CaseTransformType } from '@workspace/ui/controls';
import { formatFileSize } from '@/lib/word-counter-export-logic';

interface WordCounterCommandBarProps {
  loadedFile: { name: string; size: number } | null;
  text: string;
  undoStackLength: number;
  redoStackLength: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isFr: boolean;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDetachFile: () => void;
  onTransformCase: (mode: CaseTransformType | 'sentence' | 'slug') => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onCopyText: () => void;
  onDownloadTxt: () => void;
  onCopyReport: () => void;
  onExportJson: () => void;
}

export const WordCounterCommandBar: React.FC<WordCounterCommandBarProps> = ({
  loadedFile,
  text,
  undoStackLength,
  redoStackLength,
  fileInputRef,
  isFr,
  onFileUpload,
  onDetachFile,
  onTransformCase,
  onUndo,
  onRedo,
  onClear,
  onCopyText,
  onDownloadTxt,
  onCopyReport,
  onExportJson,
}) => {
  return (
    <div className="h-12 px-4 sm:px-6 border-b border-zinc-200 dark:border-white/10 bg-zinc-50/70 dark:bg-zinc-900/40 flex items-center justify-between gap-3">
      {/* Gauche : Document & Importation */}
      <div className="flex items-center gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.md,.markdown,text/plain"
          onChange={onFileUpload}
          className="hidden"
        />
        {!loadedFile ? (
          <ActionTooltip
            label={
              isFr
                ? 'Prend en charge les fichiers .txt, .md, .markdown'
                : 'Supports .txt, .md, .markdown files'
            }
            side="bottom"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-2 h-8 px-3 text-xs font-medium rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-100 transition-all active:scale-[0.98] cursor-pointer"
            >
              <FolderOpen className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors" />
              <span>{isFr ? 'Importer un document' : 'Import document'}</span>
              <span className="hidden sm:inline-flex text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-200/60 dark:bg-zinc-700/60 px-1.5 py-0.5 rounded">
                .txt, .md
              </span>
            </button>
          </ActionTooltip>
        ) : (
          <div className="flex items-center gap-2 h-8 px-2.5 rounded-lg border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-xs">
            <FileText className="w-3.5 h-3.5 text-[#FF6B35] shrink-0" />
            <span className="font-mono text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[150px] sm:max-w-[240px]">
              {loadedFile.name}
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
              ({formatFileSize(loadedFile.size, isFr)})
            </span>
            <ActionTooltip label={isFr ? 'Détacher le document' : 'Detach document'} side="top">
              <button
                type="button"
                onClick={onDetachFile}
                className="ml-1 p-0.5 rounded text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </ActionTooltip>
          </div>
        )}
      </div>

      {/* Droite : Casse -> Annuler / Rétablir -> Vider -> Exporter */}
      <div className="flex items-center justify-end gap-2">
        {/* Menu Conversion de Casse */}
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              data-testid="case-transform-trigger"
              disabled={!text}
              className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Type className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">{isFr ? 'Casse' : 'Case'}</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-auto max-w-xs p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-xl">
            <CaseTransformButtonGroup
              onSelectCase={(type) => onTransformCase(type)}
              label={isFr ? 'Transformer la casse' : 'Transform case'}
              isFr={isFr}
              disabled={!text}
            />
          </PopoverContent>
        </Popover>

        {/* Bouton Annuler */}
        {undoStackLength > 0 && (
          <ActionTooltip label={isFr ? 'Annuler (Ctrl+Z)' : 'Undo (Ctrl+Z)'} side="bottom">
            <button
              type="button"
              onClick={onUndo}
              className="flex items-center gap-1 h-8 px-2.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">{isFr ? 'Annuler' : 'Undo'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Bouton Rétablir */}
        {redoStackLength > 0 && (
          <ActionTooltip label={isFr ? 'Rétablir (Ctrl+Y)' : 'Redo (Ctrl+Y)'} side="bottom">
            <button
              type="button"
              onClick={onRedo}
              className="flex items-center gap-1 h-8 px-2.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            >
              <Redo2 className="w-3.5 h-3.5 text-zinc-500" />
              <span className="hidden sm:inline">{isFr ? 'Rétablir' : 'Redo'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Bouton Vider */}
        {text && (
          <ActionTooltip label={isFr ? 'Effacer le texte' : 'Clear text'} side="bottom">
            <button
              type="button"
              onClick={onClear}
              className="flex items-center gap-1 h-8 px-2.5 text-xs font-medium rounded-lg border border-zinc-200 dark:border-white/10 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Vider' : 'Clear'}</span>
            </button>
          </ActionTooltip>
        )}

        {/* Menu Exporter (Orange #FF6B35 en dernier à droite) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              disabled={!text}
              className="flex items-center gap-1.5 h-8 px-3 text-xs font-semibold rounded-lg bg-[#FF6B35] text-white hover:bg-[#e85a26] transition-all active:scale-[0.98] shadow-xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Exporter' : 'Export'}</span>
              <ChevronDown className="w-3 h-3 opacity-80" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={onCopyText}>
              <Copy className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Copier le texte brut' : 'Copy plain text'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDownloadTxt}>
              <FileText className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Télécharger document.txt' : 'Download document.txt'}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCopyReport}>
              <BarChart2 className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Copier le rapport statistique' : 'Copy statistics report'}</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportJson}>
              <FileJson className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              <span>{isFr ? 'Statistiques au format JSON' : 'JSON statistics'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
