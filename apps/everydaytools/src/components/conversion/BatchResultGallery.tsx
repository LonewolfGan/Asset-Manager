import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, FileDown, RotateCcw, Download } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import type { FileResult } from '@/lib/image-convert-logic';
import type { ConversionFormat } from './types';

export interface BatchResultGalleryProps {
  files: FileResult[];
  toExt: string;
  toMime: string;
  targetFormat: ConversionFormat;
  onDownloadAllZip: () => void;
  onDownloadOne: (entry: FileResult) => void;
  onResetAll: () => void;
  isFr: boolean;
}

export function BatchResultGallery({
  files,
  toExt,
  toMime,
  targetFormat,
  onDownloadAllZip,
  onDownloadOne,
  onResetAll,
  isFr,
}: BatchResultGalleryProps) {
  return (
    <motion.div
      key="batch-result"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full space-y-8"
    >
      {/* Heroic Batch Download Card */}
      <div className="rounded-3xl p-8 sm:p-12 bg-neutral-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 shadow-sm flex flex-col items-center text-center space-y-6">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg"
          style={{ backgroundColor: targetFormat.color }}
        >
          <CheckCircle2 size={36} strokeWidth={2.2} />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
            {isFr
              ? `${files.length} fichiers ${toExt.toUpperCase()} générés avec succès`
              : `${files.length} ${toExt.toUpperCase()} files generated successfully`}
          </h3>
          <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400">
            {isFr ? 'Poids final :' : 'Final size:'}{' '}
            {formatBytes(
              files.reduce((acc, curr) => acc + (curr.resultSize ?? 0), 0)
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onDownloadAllZip}
            style={{ backgroundColor: targetFormat.color }}
            className="h-12 px-8 rounded-full text-white font-medium text-base shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center gap-3"
          >
            <span>{isFr ? 'Télécharger le pack ZIP (.zip)' : 'Download ZIP package (.zip)'}</span>
            <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
              <FileDown size={15} strokeWidth={2.5} />
            </span>
          </button>

          <button
            type="button"
            onClick={onResetAll}
            className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm"
          >
            <RotateCcw size={15} strokeWidth={2.2} />
            <span>{isFr ? 'Convertir d’autres fichiers' : 'Convert more files'}</span>
          </button>
        </div>
      </div>

      {/* Converted Gallery Grid */}
      <div className="rounded-3xl p-6 sm:p-8 bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-black/5 dark:border-white/5">
          <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
            {isFr
              ? `Fichiers convertis unitaires (${files.length})`
              : `Individual converted files (${files.length})`}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((item) => {
            const delta =
              item.resultSize && item.file.size > 0
                ? Math.round((1 - item.resultSize / item.file.size) * 100)
                : null;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-black/5 dark:border-white/5 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs group transition-transform hover:-translate-y-0.5"
              >
                <div className="aspect-video bg-neutral-100 dark:bg-zinc-950 flex items-center justify-center overflow-hidden relative">
                  {item.compressedUrl && toMime.startsWith('image/') ? (
                    <img
                      src={item.compressedUrl}
                      alt={item.file.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <img
                      src={item.originalUrl}
                      alt={item.file.name}
                      className="w-full h-full object-contain opacity-50"
                    />
                  )}
                </div>
                <div className="p-3 bg-white dark:bg-zinc-900 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs">
                  <div className="min-w-0 flex-1 pr-2">
                    {item.file.name.length > 25 ? (
                      <ActionTooltip label={`${item.file.name.replace(/\.[^.]+$/, '')}.${toExt}`}>
                        <p className="font-mono text-zinc-700 dark:text-zinc-300 truncate text-[11px] cursor-default">
                          {item.file.name.replace(/\.[^.]+$/, '')}.{toExt}
                        </p>
                      </ActionTooltip>
                    ) : (
                      <p className="font-mono text-zinc-700 dark:text-zinc-300 truncate text-[11px]">
                        {item.file.name.replace(/\.[^.]+$/, '')}.{toExt}
                      </p>
                    )}
                    <p className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                      {item.resultSize ? formatBytes(item.resultSize) : ''}{' '}
                      {delta !== null && delta > 0 && (
                        <span className="text-emerald-500 font-semibold">
                          (-{delta}%)
                        </span>
                      )}
                    </p>
                  </div>
                  <ActionTooltip label={isFr ? `Télécharger ${item.file.name}` : `Download ${item.file.name}`}>
                    <button
                      type="button"
                      onClick={() => onDownloadOne(item)}
                      aria-label={isFr ? `Télécharger ${item.file.name}` : `Download ${item.file.name}`}
                      className="h-8 px-2.5 rounded-lg border border-black/5 dark:border-white/10 bg-neutral-50 dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors shrink-0"
                    >
                      <Download size={12} />
                      <span>{toExt.toUpperCase()}</span>
                    </button>
                  </ActionTooltip>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
