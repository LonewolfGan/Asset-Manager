import React from 'react';
import { ArrowLeft, Download, Undo2, Globe, Smartphone, Search, Layers, Code2, Loader2 } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes, cn } from '@/lib/utils';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { StageView } from '@/hooks/use-favicon-workflow';

interface FaviconTopBarProps {
  file: File;
  dimensions: { width: number; height: number } | null;
  stageView: StageView;
  onStageViewChange: (view: StageView) => void;
  isModified: boolean;
  isProcessing: boolean;
  onFullReset: () => void;
  onResetAdjustments: () => void;
  onGenerateZip: () => void;
  isFr: boolean;
  sourceFormatIcon: string;
}

export function FaviconTopBar({
  file,
  dimensions,
  stageView,
  onStageViewChange,
  isModified,
  isProcessing,
  onFullReset,
  onResetAdjustments,
  onGenerateZip,
  isFr,
  sourceFormatIcon,
}: FaviconTopBarProps) {
  return (
    <div className="w-full flex items-center justify-between gap-3 py-3 border-b border-black/[0.08] dark:border-white/10 flex-wrap">
      {/* Gauche : Retour Dropzone & Informations sur l'image */}
      <div className="flex items-center gap-2.5 min-w-0">
        <ActionTooltip label={isFr ? "Changer d'image" : "Change image"}>
          <button
            type="button"
            onClick={onFullReset}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFr ? "Changer d'image" : "Change image"}</span>
          </button>
        </ActionTooltip>

        <div className="h-5 w-px bg-black/[0.08] dark:bg-white/10 shrink-0" />

        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={getFileFormatIcon(file, sourceFormatIcon)}
            alt="Format"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-xs"
          />
          <span className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px] sm:max-w-[200px]">
            {file.name}
          </span>
          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0 hidden md:inline">
            {dimensions ? `(${dimensions.width}×${dimensions.height})` : ''} · {formatBytes(file.size)}
          </span>
        </div>
      </div>

      {/* Centre : Sélecteur d'onglets de simulation / code */}
      <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800/90 p-1 rounded-xl border border-black/[0.06] dark:border-white/10 overflow-x-auto">
        <button
          type="button"
          onClick={() => onStageViewChange('browser')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-[0.98]',
            stageView === 'browser'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{isFr ? 'Onglet Web' : 'Web Tab'}</span>
        </button>

        <button
          type="button"
          onClick={() => onStageViewChange('mobile')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-[0.98]',
            stageView === 'mobile'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{isFr ? 'Écran Mobile' : 'Mobile Screen'}</span>
        </button>

        <button
          type="button"
          onClick={() => onStageViewChange('search')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-[0.98]',
            stageView === 'search'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Google Search</span>
        </button>

        <button
          type="button"
          onClick={() => onStageViewChange('manifest')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-[0.98]',
            stageView === 'manifest'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{isFr ? 'Toutes les Tailles (9)' : 'All Sizes (9)'}</span>
        </button>

        <button
          type="button"
          onClick={() => onStageViewChange('code')}
          className={cn(
            'px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer active:scale-[0.98]',
            stageView === 'code'
              ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
          )}
        >
          <Code2 className="w-3.5 h-3.5" />
          <span>{isFr ? "Code d'Intégration" : 'Integration Code'}</span>
        </button>
      </div>

      {/* Droite : Réinitialiser (si modifié) + Bouton Exportation Principal */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto sm:ml-0">
        {isModified && (
          <ActionTooltip label={isFr ? 'Réinitialiser tous les réglages' : 'Reset all settings'}>
            <button
              type="button"
              onClick={onResetAdjustments}
              className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition-colors cursor-pointer"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isFr ? 'Réinitialiser' : 'Reset'}</span>
            </button>
          </ActionTooltip>
        )}

        <button
          type="button"
          onClick={onGenerateZip}
          disabled={isProcessing}
          className={cn(
            'h-9 px-4 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors active:scale-[0.98]',
            isProcessing
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
              : 'bg-[#FF6B35] text-white hover:bg-[#ff5519]'
          )}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>{isFr ? 'Génération...' : 'Generating...'}</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>{isFr ? 'Télécharger le pack (.ZIP)' : 'Download Pack (.ZIP)'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
