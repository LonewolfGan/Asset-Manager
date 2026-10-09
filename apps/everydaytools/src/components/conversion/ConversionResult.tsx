import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FileDown, RotateCcw } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ConversionFormat } from './types';

export interface ConversionResultProps {
  targetFormat: ConversionFormat;
  resultFileName: string;
  resultFileSize?: number;
  resultMetadataText?: string;
  downloadBtnLabel: string;
  resetBtnLabel: string;
  onDownload: () => void;
  onReset: () => void;
  extraActions?: ReactNode;
  /** Optional custom color for primary download button; defaults to targetFormat.color */
  downloadBtnColor?: string;
  children?: ReactNode;
}

export const ConversionResult: React.FC<ConversionResultProps> = ({
  targetFormat,
  resultFileName,
  resultFileSize,
  resultMetadataText,
  downloadBtnLabel,
  resetBtnLabel,
  onDownload,
  onReset,
  extraActions,
  downloadBtnColor,
  children,
}) => {
  const metadata =
    resultMetadataText ??
    (resultFileSize !== undefined
      ? `Fichier ${targetFormat.name} prêt \u00B7 ${formatBytes(resultFileSize)}`
      : `Fichier ${targetFormat.name} prêt`);

  const primaryBg = downloadBtnColor ?? targetFormat.color;

  return (
    <motion.div
      key="result-scene"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-10 sm:py-16 flex flex-col items-center text-center"
    >
      {/* Heroic Target Vector (Unboxed, Free-Standing) */}
      <div className="relative mb-5 flex items-center justify-center">
        <img
          src={targetFormat.icon}
          alt={targetFormat.name}
          className={`relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
            targetFormat.icon.includes('/file.svg') || targetFormat.icon.includes('/image.svg')
              ? 'dark:brightness-0 dark:invert'
              : ''
          }`}
        />
      </div>

      {/* File Identification */}
      {resultFileName.length > 25 ? (
        <ActionTooltip label={resultFileName} side="top">
          <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 max-w-xl truncate px-4 mb-2 cursor-default">
            {resultFileName}
          </h3>
        </ActionTooltip>
      ) : (
        <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 max-w-xl truncate px-4 mb-2">
          {resultFileName}
        </h3>
      )}
      <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400 mb-8">
        {metadata}
      </p>

      {/* Primary Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
        {/* Primary Download Button (Calm, High-End Tactile Feel, Zero Bizarre Bouncing) */}
        <button
          type="button"
          onClick={onDownload}
          className="h-12 px-8 rounded-full text-white font-medium text-base shadow-lg hover:brightness-105 active:scale-[0.98] transition-[transform,filter] duration-150 flex items-center gap-3"
          style={{
            backgroundColor: primaryBg,
            boxShadow: `0 8px 20px -4px ${primaryBg}40`,
          }}
        >
          <span>{downloadBtnLabel}</span>
          <span className="w-7 h-7 rounded-full bg-white/25 flex items-center justify-center">
            <FileDown size={15} strokeWidth={2.5} />
          </span>
        </button>

        {/* Extra contextual actions (e.g. Copy, Preview Dialog) */}
        {extraActions}

        {/* Reset Action */}
        <button
          type="button"
          onClick={onReset}
          className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium text-base active:scale-[0.98] transition-[transform,background-color] duration-150 flex items-center gap-2.5 shadow-sm"
        >
          <RotateCcw size={15} strokeWidth={2.2} />
          <span>{resetBtnLabel}</span>
        </button>
      </div>

      {/* Optional Children (e.g. inline drawer if needed) */}
      {children}
    </motion.div>
  );
};
