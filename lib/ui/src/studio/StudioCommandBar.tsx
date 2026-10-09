import React from 'react';
import { ArrowLeft, Undo2, Loader2, FileText } from 'lucide-react';
import { StudioCommandBarProps } from './types';
import { cn, formatBytes } from '../utils';

export const StudioCommandBar: React.FC<StudioCommandBarProps> = ({
  meta,
  onReset,
  resetLabel = 'Changer de fichier',
  isModified = false,
  onResetChanges,
  centerControls,
  secondaryActions,
  primaryAction,
  actionSlot,
}) => {
  const isActionDisabled = primaryAction ? (primaryAction.isDisabled || primaryAction.isLoading) : false;

  return (
    <div className="w-full flex items-center justify-between gap-3 py-3 border-b border-black/[0.08] dark:border-white/10 flex-wrap">
      {/* 1. Zone Gauche : Retour Dropzone + Identité Fichier + Métadonnées */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onReset}
          data-testid="studio-reset-btn"
          aria-label={resetLabel}
          className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 active:scale-[0.98] transition-colors cursor-pointer shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{resetLabel}</span>
        </button>

        <div className="h-4 w-px bg-black/[0.08] dark:bg-white/10 shrink-0 mx-0.5" />

        <div className="flex items-center gap-2 min-w-0">
          {meta.icon ? (
            <img
              src={meta.icon}
              alt="Format"
              className="w-7 h-7 sm:w-8 sm:h-8 object-contain shrink-0 drop-shadow-xs"
            />
          ) : (
            <FileText className="w-5 h-5 text-zinc-500 shrink-0" />
          )}

          <span
            className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px] sm:max-w-[220px]"
            title={meta.name}
          >
            {meta.name}
          </span>

          <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 shrink-0">
            {meta.dimensions ? `(${meta.dimensions.width}×${meta.dimensions.height}) · ` : ''}
            {meta.pageCount ? `${meta.pageCount} p. · ` : ''}
            {formatBytes(meta.size)}
          </span>
        </div>
      </div>

      {/* 2. Zone Centrale : Contrôles d'outils injectés à plat (zéro card-slop) */}
      {centerControls && (
        <div className="flex items-center gap-2 justify-center flex-1 min-w-[200px] order-last md:order-none">
          {centerControls}
        </div>
      )}

      {/* 3. Zone Droite : Annuler modifications (si applicable) + Actions secondaires + CTA Principal */}
      <div className="flex items-center gap-2.5 shrink-0 ml-auto">
        {secondaryActions}
        {isModified && onResetChanges && (
          <button
            type="button"
            onClick={onResetChanges}
            data-testid="studio-undo-btn"
            className="flex items-center gap-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-zinc-100 active:scale-[0.98] transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        )}

        {actionSlot ? (
          actionSlot
        ) : primaryAction ? (
          <button
            type="button"
            onClick={primaryAction.onClick}
            disabled={isActionDisabled}
            data-testid="studio-primary-action-btn"
            className={cn(
              'h-9 px-4 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition-colors',
              isActionDisabled
                ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed opacity-70'
                : 'bg-[#FF6B35] text-white hover:bg-[#ff5519] cursor-pointer active:scale-[0.98]'
            )}
          >
            {primaryAction.isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{primaryAction.loadingLabel || 'Traitement...'}</span>
              </>
            ) : (
              <>
                {primaryAction.icon && <primaryAction.icon className="w-3.5 h-3.5" />}
                <span>{primaryAction.label}</span>
              </>
            )}
          </button>
        ) : null}
      </div>
    </div>
  );
};
