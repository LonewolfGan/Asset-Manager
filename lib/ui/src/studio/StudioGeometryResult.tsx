import React from 'react';
import { Download, Sliders, RotateCcw, ArrowRight } from 'lucide-react';
import { StudioGeometryResultProps } from './types';
import { formatBytes } from '../utils';
import { FileSizeBadge } from '../controls/FileSizeBadge';

export { type StudioGeometryResultProps };

export const StudioGeometryResult: React.FC<StudioGeometryResultProps> = ({
  fileName,
  previewUrl,
  origDimensions,
  finalDimensions,
  origRatioLabel,
  finalRatioLabel,
  sizeBefore,
  sizeAfter,
  onDownload,
  onBackToEditor,
  onReset,
  downloadLabel,
  editLabel,
  resetLabel,
  isFr = true,
}) => {
  const defaultDownloadLabel = isFr ? "Télécharger l'image" : 'Download image';
  const defaultEditLabel = isFr ? 'Modifier le cadrage' : 'Edit settings';
  const defaultResetLabel = isFr ? 'Nouvelle image' : 'New image';

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 pt-1 pb-4">
      {/* 1. Nom du fichier */}
      <h2
        className="text-base sm:text-lg font-bold tracking-tight text-zinc-950 dark:text-zinc-50 truncate max-w-xl"
        title={fileName}
      >
        {fileName}
      </h2>

      {/* 2. Visualisation Directe */}
      <div className="w-full flex items-center justify-center select-none">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Result Preview"
            className="max-h-[300px] sm:max-h-[360px] w-auto max-w-full object-contain rounded-lg drop-shadow-md"
          />
        )}
      </div>

      {/* 3. Monument Typographique de Transformation (Zéro Box Slop) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 py-3 sm:py-4 border-y border-black/[0.08] dark:border-white/10">
        {/* Dimensions */}
        <div className="flex flex-col items-center justify-center space-y-1 sm:border-r sm:border-black/[0.06] sm:dark:border-white/[0.08] sm:pr-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            {isFr ? 'Dimensions' : 'Dimensions'}
          </span>
          <div className="flex items-center gap-2 font-mono">
            <span className="text-xs line-through text-zinc-400 tabular-nums">
              {origDimensions.width} × {origDimensions.height}
            </span>
            <ArrowRight size={13} className="text-zinc-400 shrink-0" />
            <span className="text-base sm:text-lg font-bold text-[#FF6B35] tabular-nums">
              {finalDimensions.width} × {finalDimensions.height} px
            </span>
          </div>
        </div>

        {/* Ratio d'aspect */}
        <div className="flex flex-col items-center justify-center space-y-1 sm:border-r sm:border-black/[0.06] sm:dark:border-white/[0.08] sm:px-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            {isFr ? 'Proportions' : 'Aspect ratio'}
          </span>
          <div className="flex items-center gap-2 font-mono">
            {origRatioLabel && <span className="text-xs text-zinc-400">{origRatioLabel}</span>}
            {origRatioLabel && finalRatioLabel && (
              <ArrowRight size={13} className="text-zinc-400 shrink-0" />
            )}
            {finalRatioLabel && (
              <span className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                {finalRatioLabel}
              </span>
            )}
          </div>
        </div>

        {/* Poids du fichier */}
        <div className="flex flex-col items-center justify-center space-y-1 sm:pl-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
            {isFr ? 'Poids optimisé' : 'Optimized size'}
          </span>
          <FileSizeBadge
            originalBytes={sizeBefore}
            compressedBytes={sizeAfter}
            showSavings
            isFr={isFr}
          />
        </div>
      </div>

      {/* 4. Actions Décisives & Claires */}
      <div className="flex flex-row flex-nowrap items-center justify-center gap-3 w-full max-w-2xl pt-2">
        <button
          type="button"
          onClick={onDownload}
          data-testid="studio-geometry-download-btn"
          className="h-11 px-6 bg-[#FF6B35] hover:bg-[#E85A24] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] transition-all shadow-xs whitespace-nowrap shrink-0"
        >
          <Download size={16} />
          <span>{downloadLabel || defaultDownloadLabel}</span>
        </button>

        <button
          type="button"
          onClick={onBackToEditor}
          data-testid="studio-geometry-edit-btn"
          className="h-11 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <Sliders size={14} />
          <span>{editLabel || defaultEditLabel}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          data-testid="studio-geometry-reset-btn"
          className="h-11 px-5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 active:scale-[0.98] transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RotateCcw size={14} />
          <span>{resetLabel || defaultResetLabel}</span>
        </button>
      </div>
    </div>
  );
};
