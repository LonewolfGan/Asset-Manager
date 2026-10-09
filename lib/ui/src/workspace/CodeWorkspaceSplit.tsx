import React from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { CodeWorkspaceSplitProps } from './types';

export const CodeWorkspaceSplit: React.FC<CodeWorkspaceSplitProps> = ({
  sourceTitle = 'Entrée',
  outputTitle = 'Sortie',
  sourceStats,
  outputStats,
  sourceActions,
  outputActions,
  sourceContent,
  outputContent,
  children,
  footerSlot,
  isDragOver = false,
  dragMessage = 'Déposez votre fichier pour charger son contenu',
  onDropFile,
  isProcessing = false,
  processingMessage = 'Traitement en cours...',
  className = '',
  minHeight = 'min-h-[460px]',
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && onDropFile) {
      onDropFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative w-full rounded-2xl border transition-colors bg-white dark:bg-zinc-950 overflow-hidden ${
        isDragOver
          ? 'border-zinc-500 ring-2 ring-zinc-400/30'
          : 'border-zinc-200 dark:border-white/10'
      } ${className}`}
    >
      {/* Overlay de glisser-déposer */}
      {isDragOver && (
        <div
          data-testid="code-drag-overlay"
          className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs transition-opacity duration-150"
        >
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 shadow-lg">
            <Upload className="w-4 h-4 text-[#FF6B35]" />
            <span>{dragMessage}</span>
          </div>
        </div>
      )}

      {/* Overlay de processing */}
      {isProcessing && (
        <div
          data-testid="code-processing-overlay"
          className="absolute inset-0 z-40 flex items-center justify-center bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xs transition-opacity duration-150"
        >
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5 shadow-lg">
            <Loader2 className="w-4 h-4 animate-spin text-[#FF6B35]" />
            <span>{processingMessage}</span>
          </div>
        </div>
      )}

      {/* Contenu : mode split ou mode personnalisé */}
      {children ? (
        children
      ) : (
        <div className={`grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10 ${typeof minHeight === 'string' ? minHeight : ''}`}>
          {/* Volet Source (Gauche) */}
          <div className="flex flex-col min-w-0">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 min-h-[45px]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
                  {sourceTitle}
                </span>
                {sourceStats && (
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {sourceStats}
                  </span>
                )}
              </div>
              {sourceActions && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {sourceActions}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              {sourceContent}
            </div>
          </div>

          {/* Volet Sortie / Résultat (Droite) */}
          <div className="flex flex-col min-w-0">
            <div className="px-4 py-2.5 flex items-center justify-between border-b border-zinc-200 dark:border-white/10 bg-zinc-50/50 dark:bg-zinc-900/30 min-h-[45px]">
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 tracking-tight">
                  {outputTitle}
                </span>
                {outputStats && (
                  <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
                    {outputStats}
                  </span>
                )}
              </div>
              {outputActions && (
                <div className="flex items-center gap-1.5 shrink-0">
                  {outputActions}
                </div>
              )}
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              {outputContent}
            </div>
          </div>
        </div>
      )}

      {/* Footer optionnel (ex: poignée de redimensionnement) */}
      {footerSlot}
    </div>
  );
};
