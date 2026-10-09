import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ConversionFormat } from './types';

export interface ConversionStagingProps {
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  sourceFile: File;
  targetFileName?: string;
  targetSubLabel?: string;
  convertBtnLabel: string;
  changeFileBtnLabel: string;
  onConvert: () => void;
  onReset: () => void;
  optionsSlot?: ReactNode;
  optionsClassName?: string;
  disabled?: boolean;
}

export const ConversionStaging: React.FC<ConversionStagingProps> = ({
  sourceFormat,
  targetFormat,
  sourceFile,
  targetFileName,
  targetSubLabel,
  convertBtnLabel,
  changeFileBtnLabel,
  onConvert,
  onReset,
  optionsSlot,
  optionsClassName,
  disabled = false,
}) => {
  const finalTargetFileName =
    targetFileName ??
    `${sourceFile.name.replace(/\.[^/.]+$/, '')}.${targetFormat.extension}`;

  return (
    <motion.div
      key="staging-scene"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-8 sm:py-14 flex flex-col items-center"
    >
      {/* Visual Transformation Canvas: Heroic Architectural Format Slabs */}
      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-6 sm:gap-10 mb-14">
        {/* Source Card: Pure Architectural Slab (NO Badges, Large Authentic SVG 96px-112px) */}
        <div className="w-full sm:w-84 md:w-96 rounded-[2rem] p-2 bg-neutral-200/40 dark:bg-white/[0.04] border border-black/5 dark:border-white/10 shadow-lg shadow-black/[0.03] dark:shadow-black/20 group hover:shadow-xl hover:border-black/10 dark:hover:border-white/15 transition-all duration-300">
          <div className="rounded-[calc(2rem-8px)] bg-white dark:bg-zinc-950 border border-black/[0.04] dark:border-white/5 py-10 px-8 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl min-h-[290px] justify-center">
            {/* Heroic Source Vector */}
            <div className="relative mb-6 flex items-center justify-center">
              <img
                src={sourceFormat.icon}
                alt={sourceFormat.name}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  sourceFormat.icon.includes('/file.svg') || sourceFormat.icon.includes('/image.svg')
                    ? 'dark:brightness-0 dark:invert'
                    : ''
                }`}
              />
            </div>

            {/* File Identification & Clean Typographic Metadata */}
            {sourceFile.name.length > 25 ? (
              <ActionTooltip label={sourceFile.name} side="top">
                <h4 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 max-w-[260px] truncate mb-1.5 cursor-default">
                  {sourceFile.name}
                </h4>
              </ActionTooltip>
            ) : (
              <h4 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 max-w-[260px] truncate mb-1.5">
                {sourceFile.name}
              </h4>
            )}
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
              {formatBytes(sourceFile.size)} &middot; {sourceFormat.name}
            </p>
          </div>
        </div>

        {/* Flow Connector */}
        <div className="flex items-center justify-center shrink-0">
          <div className="w-11 h-11 rounded-full bg-neutral-100 dark:bg-zinc-900 border border-black/5 dark:border-white/10 text-zinc-400 dark:text-zinc-500 flex items-center justify-center shadow-sm">
            <ArrowRight size={18} strokeWidth={2.2} className="rotate-90 md:rotate-0" />
          </div>
        </div>

        {/* Target Card: Pure Architectural Slab */}
        <div
          className="w-full sm:w-84 md:w-96 rounded-[2rem] p-2 shadow-lg group hover:shadow-xl transition-all duration-300"
          style={{
            backgroundColor: `${targetFormat.color}0D`,
            borderColor: `${targetFormat.color}25`,
            borderWidth: 1,
          }}
        >
          <div
            className="rounded-[calc(2rem-8px)] bg-white dark:bg-zinc-950 py-10 px-8 flex flex-col items-center text-center relative overflow-hidden backdrop-blur-xl min-h-[290px] justify-center"
            style={{
              borderColor: `${targetFormat.color}25`,
              borderWidth: 1,
            }}
          >
            {/* Heroic Target Vector */}
            <div className="relative mb-6 flex items-center justify-center">
              <img
                src={targetFormat.icon}
                alt={targetFormat.name}
                className={`relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md group-hover:-translate-y-1 group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  targetFormat.icon.includes('/file.svg') || targetFormat.icon.includes('/image.svg')
                    ? 'dark:brightness-0 dark:invert'
                    : ''
                }`}
              />
            </div>

            {/* File Identification & Clean Typographic Metadata */}
            <h4 className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-zinc-100 max-w-[260px] truncate mb-1.5">
              {finalTargetFileName}
            </h4>
            <p
              className="text-xs font-mono font-medium"
              style={{ color: targetFormat.color }}
            >
              {targetFormat.name} {targetSubLabel ? `\u00B7 ${targetSubLabel}` : targetFormat.subLabel ? `\u00B7 ${targetFormat.subLabel}` : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Optional Options / Parameters Slot */}
      {optionsSlot && (
        <div className={optionsClassName ?? 'w-full max-w-xl mx-auto mb-8'}>
          {optionsSlot}
        </div>
      )}

      {/* Actions Stage: Noir + Neutre Duo */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        {/* Premier bouton (Gauche) : Le bouton NOIR principal */}
        <button
          type="button"
          onClick={onConvert}
          disabled={disabled}
          className="h-12 px-8 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-base shadow-xl shadow-zinc-950/10 hover:shadow-2xl active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-3 group"
        >
          <span>{convertBtnLabel}</span>
          <span className="w-7 h-7 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center group-hover:translate-x-0.5 transition-transform">
            <ArrowRight size={14} strokeWidth={2.5} />
          </span>
        </button>

        {/* Bouton secondaire (Droite) : Épuré et sobre */}
        <button
          type="button"
          onClick={onReset}
          className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5"
        >
          <RotateCcw size={15} strokeWidth={2.2} />
          <span>{changeFileBtnLabel}</span>
        </button>
      </div>
    </motion.div>
  );
};
