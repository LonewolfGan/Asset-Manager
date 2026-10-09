import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ConversionFormat } from './types';

export interface ConversionConduitProps {
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  fileName?: string;
  statusLabel: string;
}

export const ConversionConduit: React.FC<ConversionConduitProps> = ({
  sourceFormat,
  targetFormat,
  fileName,
  statusLabel,
}) => {
  return (
    <motion.div
      key="processing-scene"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-16 sm:py-24 flex flex-col items-center text-center"
    >
      {/* Visual Conduit: Fluid Living Transfer from Source to Target */}
      <div className="w-full max-w-xl mx-auto flex items-center justify-between gap-4 sm:gap-8 mb-12 px-4">
        {/* Left: Source Format Origin */}
        <div className="flex flex-col items-center">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1.5 bg-neutral-200/40 dark:bg-white/[0.04] border border-black/5 dark:border-white/10 shadow-md">
            <div className="w-full h-full rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-950 flex items-center justify-center p-3 relative overflow-hidden">
              <img
                src={sourceFormat.icon}
                alt={sourceFormat.name}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 object-contain ${
                  sourceFormat.icon.includes('/file.svg') || sourceFormat.icon.includes('/image.svg')
                    ? 'dark:brightness-0 dark:invert'
                    : ''
                }`}
              />
            </div>
          </div>
          <span className="mt-3 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400">
            {sourceFormat.name}
          </span>
        </div>

        {/* Center: Kinetic Transmission Conduit (Zero Progress Bar) */}
        <div className="flex-1 flex flex-col items-center justify-center relative px-4 sm:px-8">
          {/* Living Transfer Wave Conduit */}
          <div className="w-full relative flex items-center justify-center">
            {/* Ethereal subtle baseline connecting the two formats */}
            <div
              className="w-full h-px"
              style={{
                backgroundImage: `linear-gradient(to right, ${sourceFormat.color}4D, #71717A66, ${targetFormat.color}4D)`,
              }}
            />

            {/* Traveling kinetic energy pulse */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none flex items-center">
              <motion.div
                animate={{ x: ['-20%', '120%'], opacity: [0, 1, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                className="w-14 h-1 rounded-full"
                style={{
                  backgroundImage: `linear-gradient(to right, ${sourceFormat.color}, #7B3BD0, ${targetFormat.color})`,
                  boxShadow: `0 0 12px ${targetFormat.color}B3`,
                }}
              />
            </div>

            {/* Center Transformation Glyph */}
            <div className="absolute z-10 w-10 h-10 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 flex items-center justify-center shadow-md">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 3.5, ease: 'linear' }}
                className="flex items-center justify-center"
              >
                <ArrowRight size={16} strokeWidth={2} />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Right: Target Format Destination */}
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: [0.98, 1.02, 0.98] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1.5 shadow-md"
            style={{
              backgroundColor: `${targetFormat.color}1A`,
              borderColor: `${targetFormat.color}33`,
              borderWidth: 1,
            }}
          >
            <div className="w-full h-full rounded-[calc(1rem-2px)] bg-white dark:bg-zinc-950 flex items-center justify-center p-3 relative overflow-hidden">
              <img
                src={targetFormat.icon}
                alt={targetFormat.name}
                className={`relative w-12 h-12 sm:w-14 sm:h-14 object-contain ${
                  targetFormat.icon.includes('/file.svg') || targetFormat.icon.includes('/image.svg')
                    ? 'dark:brightness-0 dark:invert'
                    : ''
                }`}
              />
            </div>
          </motion.div>
          <span
            className="mt-3 text-xs font-mono font-medium"
            style={{ color: targetFormat.color }}
          >
            {targetFormat.name}
          </span>
        </div>
      </div>

      {/* Direct Status Heading & Active File (Zero Progress Bar Clutter) */}
      <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
        {statusLabel}
      </h3>
      {fileName && (
        fileName.length > 30 ? (
          <ActionTooltip label={fileName} side="top">
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 max-w-sm truncate cursor-default">
              {fileName}
            </p>
          </ActionTooltip>
        ) : (
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 max-w-sm truncate">
            {fileName}
          </p>
        )
      )}
    </motion.div>
  );
};
