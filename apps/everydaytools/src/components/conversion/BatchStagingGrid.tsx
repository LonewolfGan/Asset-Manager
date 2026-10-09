import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Layers, Trash2, Sliders, Plus, ArrowRight, RotateCcw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { ActionTooltip } from '@/components/ui/tooltip';
import { formatBytes } from '@/lib/utils';
import type { FileResult } from '@/lib/image-convert-logic';
import type { ConversionFormat } from './types';

export interface BatchStagingGridProps {
  files: FileResult[];
  fromLabel: string;
  toExt: string;
  targetFormat: ConversionFormat;
  showQuality: boolean;
  quality: number;
  onQualityChange: (quality: number) => void;
  onRemoveFile: (id: string) => void;
  onAddFiles: (files: FileList | File[]) => void;
  onConvertAll: () => void;
  onResetAll: () => void;
  isFr: boolean;
  fromExts: string[];
}

export function BatchStagingGrid({
  files,
  fromLabel,
  toExt,
  targetFormat,
  showQuality,
  quality,
  onQualityChange,
  onRemoveFile,
  onAddFiles,
  onConvertAll,
  onResetAll,
  isFr,
  fromExts,
}: BatchStagingGridProps) {
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  return (
    <motion.div
      key="batch-staging"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full space-y-6"
    >
      {/* Header Card with Summary & Quality */}
      <div className="rounded-3xl p-6 sm:p-8 bg-neutral-100/80 dark:bg-zinc-900/60 border border-black/5 dark:border-white/10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/5 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-sm"
              style={{ backgroundColor: targetFormat.color }}
            >
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {isFr
                  ? `${files.length} fichiers ${fromLabel} prêts pour la conversion`
                  : `${files.length} ${fromLabel} files ready for conversion`}
              </h3>
              <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {isFr ? 'Taille totale :' : 'Total size:'}{' '}
                {formatBytes(files.reduce((acc, curr) => acc + curr.file.size, 0))}{' '}
                &middot; {isFr ? 'Sortie :' : 'Output:'} {toExt.toUpperCase()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onResetAll}
            className="text-xs font-medium text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 self-start sm:self-center"
          >
            <Trash2 size={13} />
            <span>{isFr ? 'Tout effacer' : 'Clear all'}</span>
          </button>
        </div>

        {showQuality && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              <Sliders size={14} style={{ color: targetFormat.color }} />
              <span>
                {isFr
                  ? `Qualité de sortie ${toExt.toUpperCase()} :`
                  : `${toExt.toUpperCase()} output quality:`}
              </span>
            </div>
            <div className="flex items-center gap-2.5 flex-1 max-w-sm">
              <Slider
                value={[quality]}
                min={1}
                max={100}
                step={1}
                onValueChange={([val]) => onQualityChange(val)}
                className="flex-1"
              />
              <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-[36px] text-right tabular-nums">
                {quality}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Files Queue Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {files.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-3 bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/10 shadow-xs flex items-center justify-between gap-3 group hover:border-black/15 dark:hover:border-white/20 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-zinc-950 border border-black/5 dark:border-white/5 flex items-center justify-center shrink-0 overflow-hidden p-0.5">
                <img
                  src={item.originalUrl}
                  alt={item.file.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="min-w-0 flex-1">
                {item.file.name.length > 25 ? (
                  <ActionTooltip label={item.file.name}>
                    <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate cursor-default">
                      {item.file.name}
                    </p>
                  </ActionTooltip>
                ) : (
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {item.file.name}
                  </p>
                )}
                <p className="text-[11px] font-mono text-zinc-400 dark:text-zinc-500 mt-0.5">
                  {formatBytes(item.file.size)} &middot; {fromLabel} →{' '}
                  <span style={{ color: targetFormat.color }}>
                    {toExt.toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            <ActionTooltip label={isFr ? 'Retirer cette image' : 'Remove this image'}>
              <button
                type="button"
                onClick={() => onRemoveFile(item.id)}
                aria-label={isFr ? 'Retirer cette image' : 'Remove this image'}
                className="w-8 h-8 rounded-lg text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </ActionTooltip>
          </div>
        ))}

        {/* Add More Files Trigger Tile */}
        {files.length < 20 && (
          <div
            onClick={() => addMoreInputRef.current?.click()}
            className="rounded-2xl p-3 border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500 bg-neutral-50/50 dark:bg-zinc-950/40 hover:bg-neutral-100/80 dark:hover:bg-zinc-900/60 flex items-center justify-center gap-2 cursor-pointer transition-colors min-h-[56px]"
          >
            <Plus size={16} className="text-zinc-500 dark:text-zinc-400" />
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
              {isFr ? 'Ajouter d’autres fichiers' : 'Add more files'}
            </span>
          </div>
        )}
      </div>

      <input
        ref={addMoreInputRef}
        type="file"
        multiple
        accept={fromExts.join(',')}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onAddFiles(e.target.files);
          }
        }}
      />

      {/* Batch Actions Stage */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={onConvertAll}
          className="h-12 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-base shadow-xl shadow-zinc-950/10 hover:shadow-2xl active:scale-[0.98] transition-all flex items-center gap-3 group"
        >
          <span>
            {isFr
              ? `Convertir les ${files.length} fichiers en ${toExt.toUpperCase()}`
              : `Convert ${files.length} files to ${toExt.toUpperCase()}`}
          </span>
          <span className="w-7 h-7 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </button>

        <button
          type="button"
          onClick={onResetAll}
          className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5"
        >
          <RotateCcw size={15} strokeWidth={2.2} />
          <span>{isFr ? 'Changer de fichiers' : 'Change files'}</span>
        </button>
      </div>
    </motion.div>
  );
}
