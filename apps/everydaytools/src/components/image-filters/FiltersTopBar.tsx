import React from 'react';
import {
  ArrowLeft,
  Columns,
  Maximize2,
  Undo2,
  Download,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { formatBytes, cn } from '@/lib/utils';
import type { ConversionFormat } from '@/components/conversion';
import type { OutputFormat, FormatOption } from '@/lib/image-filters-export';

interface FiltersTopBarProps {
  file: File;
  originalDims: { w: number; h: number } | null;
  imageFormat: ConversionFormat;
  viewMode: 'split' | 'direct';
  onViewModeChange: (mode: 'split' | 'direct') => void;
  hasModifications: boolean;
  onResetAll: () => void;
  onFullReset: () => void;
  isExportMenuOpen: boolean;
  setIsExportMenuOpen: (open: boolean) => void;
  isExporting: boolean;
  onExportWithFormat: (format: OutputFormat) => void;
  formatOptions: FormatOption[];
  isFr: boolean;
}

export function FiltersTopBar({
  file,
  originalDims,
  imageFormat,
  viewMode,
  onViewModeChange,
  hasModifications,
  onResetAll,
  onFullReset,
  isExportMenuOpen,
  setIsExportMenuOpen,
  isExporting,
  onExportWithFormat,
  formatOptions,
  isFr,
}: FiltersTopBarProps) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3 py-3 border-b border-black/[0.08] dark:border-white/10">
      {/* Gauche : Retour Dropzone & Informations sur l'image */}
      <div className="flex items-center gap-2.5 min-w-0 justify-self-start">
        <ActionTooltip label={isFr ? 'Changer de photo (Échap)' : 'Change photo (Esc)'}>
          <button
            type="button"
            onClick={onFullReset}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {isFr ? "Changer d'image" : 'Change image'}
            </span>
          </button>
        </ActionTooltip>

        <div className="h-5 w-px bg-black/[0.08] dark:bg-white/10 shrink-0" />

        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={getFileFormatIcon(file, imageFormat.icon)}
            alt="Format"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-xs"
          />
          {file.name.length > 20 ? (
            <ActionTooltip label={file.name}>
              <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px] sm:max-w-[180px] cursor-default">
                {file.name}
              </span>
            </ActionTooltip>
          ) : (
            <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px] sm:max-w-[180px]">
              {file.name}
            </span>
          )}
          {originalDims && (
            <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0 hidden md:inline">
              ({originalDims.w}×{originalDims.h}) &middot; {formatBytes(file.size)}
            </span>
          )}
        </div>
      </div>

      {/* Centre : Mode de comparaison Viewport */}
      <div className="justify-self-center flex items-center bg-zinc-100 dark:bg-zinc-800/90 rounded-xl p-1 border border-black/[0.06] dark:border-white/10">
        <button
          type="button"
          onClick={() => onViewModeChange('split')}
          className={cn(
            'flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-[0.97]',
            viewMode === 'split'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          )}
        >
          <Columns className="w-3.5 h-3.5" />
          <span>{isFr ? 'Avant / Après' : 'Before / After'}</span>
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('direct')}
          className={cn(
            'flex items-center gap-1.5 h-7 px-2.5 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-[0.97]',
            viewMode === 'direct'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
          )}
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span>{isFr ? 'Vue Directe' : 'Direct View'}</span>
        </button>
      </div>

      {/* Droite : Reset & Bouton Menu Déroulant d'Exportation */}
      <div className="flex items-center gap-2.5 shrink-0 justify-self-end">
        {hasModifications && (
          <ActionTooltip
            label={
              isFr
                ? 'Réinitialiser tous les réglages (R)'
                : 'Reset all settings (R)'
            }
          >
            <button
              type="button"
              onClick={onResetAll}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">
                {isFr ? 'Réinitialiser' : 'Reset'}
              </span>
            </button>
          </ActionTooltip>
        )}

        <Popover open={isExportMenuOpen} onOpenChange={setIsExportMenuOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              disabled={isExporting}
              className="flex items-center gap-1.5 h-9 px-4 rounded-xl font-semibold text-xs text-white bg-[#FF6B35] hover:bg-[#ff5519] active:scale-[0.98] transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>{isFr ? 'Exportation...' : 'Exporting...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Exporter' : 'Export'}</span>
                  <ChevronDown
                    className={cn(
                      'w-3 h-3 transition-transform duration-200',
                      isExportMenuOpen && 'rotate-180'
                    )}
                  />
                </>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64 p-1">
            <div className="px-3 py-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400 border-b border-black/[0.05] dark:border-white/5">
              {isFr ? "Choisir le format d'export" : 'Choose export format'}
            </div>
            {formatOptions.map((fmt) => (
              <button
                key={fmt.value}
                type="button"
                onClick={() => {
                  setIsExportMenuOpen(false);
                  onExportWithFormat(fmt.value);
                }}
                className="w-full px-3 py-2 text-left flex items-center justify-between gap-2 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 rounded-lg transition-colors cursor-pointer group"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="text-xs font-semibold whitespace-nowrap text-zinc-900 dark:text-zinc-100">
                    Image {fmt.label}{' '}
                    <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 font-normal">
                      (.{fmt.ext})
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-600 dark:text-zinc-400 whitespace-nowrap">
                    {fmt.description}
                  </div>
                </div>
                <Download className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-400 group-hover:text-[#FF6B35] transition-colors shrink-0" />
              </button>
            ))}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
