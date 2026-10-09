import React from 'react';
import { FileUp } from 'lucide-react';
import { Base64SourcePane, type Base64SourcePaneProps } from './Base64SourcePane';
import { Base64ResultPane, type Base64ResultPaneProps } from './Base64ResultPane';

export interface Base64WorkbenchProps {
  isDragOver: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  sourceProps: Base64SourcePaneProps;
  resultProps: Base64ResultPaneProps;
  isFr: boolean;
}

export function Base64Workbench({
  isDragOver,
  onDragOver,
  onDragLeave,
  onDrop,
  sourceProps,
  resultProps,
  isFr,
}: Base64WorkbenchProps) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative w-full rounded-2xl border transition-colors bg-white dark:bg-zinc-950 overflow-hidden shadow-xs ${
        isDragOver
          ? 'border-zinc-500 ring-2 ring-zinc-400/30'
          : 'border-zinc-200 dark:border-white/10'
      }`}
    >
      {/* Overlay de glisser-déposer de fichier universel */}
      {isDragOver && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-900/60 backdrop-blur-xs">
          <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 text-sm font-medium text-zinc-900 dark:text-zinc-100 flex items-center gap-3 shadow-xl">
            <FileUp className="w-5 h-5 text-[#FF6B35]" />
            <span>
              {isFr
                ? "Déposez votre fichier pour l'encoder instantanément en Base64"
                : 'Drop your file to instantly encode as Base64'}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 dark:divide-white/10">
        <Base64SourcePane {...sourceProps} />
        <Base64ResultPane {...resultProps} />
      </div>
    </div>
  );
}
