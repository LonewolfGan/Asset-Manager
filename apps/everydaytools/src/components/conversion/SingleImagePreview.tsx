import React from 'react';
import type { FileResult } from '@/lib/image-convert-logic';
import type { ConversionFormat } from './types';

export interface SingleImagePreviewProps {
  file: FileResult;
  toExt: string;
  targetFormat: ConversionFormat;
  isFr: boolean;
}

export function SingleImagePreview({
  file,
  toExt,
  targetFormat,
  isFr,
}: SingleImagePreviewProps) {
  if (!file.compressedUrl) return null;

  return (
    <div className="max-w-2xl mx-auto rounded-3xl p-4 sm:p-6 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {isFr ? 'Aperçu du rendu final' : 'Final render preview'}
          </span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-md font-medium"
            style={{
              backgroundColor: `${targetFormat.color}15`,
              color: targetFormat.color,
            }}
          >
            {toExt.toUpperCase()} · {isFr ? 'Prêt' : 'Ready'}
          </span>
        </div>
        {file.resultSize && file.file.size > 0 && (
          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
            {file.resultSize < file.file.size
              ? (isFr
                  ? `-${Math.round((1 - file.resultSize / file.file.size) * 100)}% de réduction`
                  : `-${Math.round((1 - file.resultSize / file.file.size) * 100)}% reduction`)
              : (isFr
                  ? `+${Math.round((file.resultSize / file.file.size - 1) * 100)}% taille`
                  : `+${Math.round((file.resultSize / file.file.size - 1) * 100)}% size`)}
          </span>
        )}
      </div>

      <div className="rounded-2xl border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-zinc-950 p-2 flex items-center justify-center min-h-[220px] max-h-[420px] overflow-hidden">
        <img
          src={file.compressedUrl}
          alt={isFr ? 'Aperçu converti' : 'Converted preview'}
          className="max-h-[380px] w-auto max-w-full object-contain rounded-xl shadow-xs"
        />
      </div>
    </div>
  );
}
