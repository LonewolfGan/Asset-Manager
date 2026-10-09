import React from 'react';
import { Download, RotateCcw, FileCheck, ArrowRight } from 'lucide-react';
import { StudioResultCardProps } from './types';
import { cn, formatBytes } from '../utils';

export { type StudioResultCardProps };

export const StudioResultCard: React.FC<StudioResultCardProps> = ({
  fileName,
  fileSize,
  originalSize,
  fileIcon,
  gain,
  variant = 'card',
  isFr = true,
  onDownload,
  onReset,
  downloadLabel = 'Télécharger le fichier',
  resetLabel = 'Traiter un autre document',
  nextActionsSlot,
}) => {
  const effectiveGain =
    gain !== undefined
      ? gain
      : originalSize && originalSize > fileSize
      ? Math.round(((originalSize - fileSize) / originalSize) * 100)
      : null;

  if (variant === 'monument') {
    return (
      <div
        data-testid="studio-result-monument"
        className="w-full py-12 sm:py-16 flex flex-col items-center text-center select-none"
      >
        {fileIcon && (
          <img
            src={fileIcon}
            alt="Format"
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain mb-5"
          />
        )}

        <h3
          className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight max-w-xl truncate mb-12"
          title={fileName}
        >
          {fileName}
        </h3>

        <div className="w-full py-14 border-y border-black/[0.08] dark:border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 mb-14">
          {originalSize !== undefined && (
            <>
              <div className="flex flex-col items-center">
                <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                  {isFr ? 'Taille initiale' : 'Initial size'}
                </span>
                <span className="text-2xl sm:text-3xl font-mono text-zinc-400 dark:text-zinc-500 line-through tabular-nums">
                  {formatBytes(originalSize)}
                </span>
              </div>

              <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-black/[0.03] dark:bg-white/[0.05] text-zinc-400 dark:text-zinc-500">
                <ArrowRight size={18} strokeWidth={2.2} />
              </div>
            </>
          )}

          <div className="flex flex-col items-center">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
              {isFr ? 'Taille compressée' : 'Compressed size'}
            </span>
            <span className="text-5xl sm:text-7xl font-mono font-bold text-zinc-950 dark:text-zinc-50 tabular-nums tracking-tight">
              {formatBytes(fileSize)}
            </span>
          </div>

          {effectiveGain !== null && (
            <div className="flex flex-col items-center">
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">
                {isFr ? 'Gain effectif' : 'Effective gain'}
              </span>
              <span className="text-3xl sm:text-4xl font-mono font-bold text-[#FF6B35] tabular-nums tracking-tight">
                {effectiveGain > 0 ? `-${effectiveGain}%` : isFr ? 'Optimum' : 'Optimal'}
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={onDownload}
            data-testid="studio-result-download-btn"
            className="group w-full sm:w-auto h-12 px-8 rounded-xl bg-[#FF6B35] hover:bg-[#E85A24] text-white text-sm font-semibold active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer"
          >
            <Download size={16} strokeWidth={2.2} />
            <span>{downloadLabel}</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            data-testid="studio-result-reset-btn"
            className="w-full sm:w-auto h-12 px-6 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-black/[0.04] dark:hover:bg-white/[0.06] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RotateCcw size={14} />
            <span>{resetLabel}</span>
          </button>
        </div>

        {nextActionsSlot && <div className="w-full pt-4">{nextActionsSlot}</div>}
      </div>
    );
  }

  const savingsPct = effectiveGain;

  return (
    <div
      data-testid="studio-result-card"
      className="w-full max-w-xl mx-auto rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white dark:bg-zinc-900 p-6 sm:p-8 flex flex-col items-center text-center gap-6 shadow-sm"
    >
      {/* 1. Icône & Badge statut */}
      <div className="relative flex items-center justify-center">
        {fileIcon ? (
          <img
            src={fileIcon}
            alt="Format"
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-sm"
          />
        ) : (
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-[#FF6B35]">
            <FileCheck className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
        )}
      </div>

      {/* 2. Titre du fichier & Métadonnées de poids */}
      <div className="space-y-1.5 max-w-full">
        <h3
          className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-md px-2"
          title={fileName}
        >
          {fileName}
        </h3>

        <div className="flex items-center justify-center gap-2 text-xs font-mono text-zinc-500 dark:text-zinc-400">
          <span>{formatBytes(fileSize)}</span>
          {savingsPct !== null && (
            <span className="font-sans font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              -{savingsPct}%
            </span>
          )}
        </div>
      </div>

      {/* 3. Actions : Télécharger (primaire) + Recommencer (secondaire) */}
      <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={onDownload}
          data-testid="studio-result-download-btn"
          className="w-full sm:w-auto h-10 px-5 rounded-xl bg-[#FF6B35] hover:bg-[#ff5519] text-white text-sm font-medium shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.98]"
        >
          <Download className="w-4 h-4" />
          <span>{downloadLabel}</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          data-testid="studio-result-reset-btn"
          className="w-full sm:w-auto h-10 px-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium border border-zinc-200/80 dark:border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors active:scale-[0.98]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{resetLabel}</span>
        </button>
      </div>

      {/* 4. Slot pour recommandations d'actions suivantes */}
      {nextActionsSlot && <div className="w-full pt-2">{nextActionsSlot}</div>}
    </div>
  );
};
