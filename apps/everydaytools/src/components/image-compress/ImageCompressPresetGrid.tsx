import React from 'react';
import { motion } from 'framer-motion';
import { formatBytes } from '@/lib/utils';
import {
  type Level,
  type CompressionPreset,
  calculateEstimatedSize,
} from '@/lib/image-compress-logic';

export interface ImageCompressPresetGridProps {
  presets: CompressionPreset[];
  level: Level;
  fileSize: number;
  isFr: boolean;
  onLevelChange: (level: Level) => void;
}

export const ImageCompressPresetGrid: React.FC<ImageCompressPresetGridProps> = ({
  presets,
  level,
  fileSize,
  isFr,
  onLevelChange,
}) => {
  return (
    <div className="py-12">
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-6 px-1">
        <span>{isFr ? 'Niveau de compression' : 'Compression level'}</span>
        <span>{isFr ? '3 intensités' : '3 intensities'}</span>
      </div>

      {/* Grille architecturale avec séparateurs 1px nets */}
      <div className="grid grid-cols-1 md:grid-cols-3 border border-black/[0.08] dark:border-white/10 rounded-2xl overflow-hidden bg-neutral-100/70 dark:bg-zinc-900 divide-y md:divide-y-0 md:divide-x divide-black/[0.08] dark:divide-white/10">
        {presets.map((preset) => {
          const isSelected = level === preset.id;
          const estimatedSize = calculateEstimatedSize(fileSize, preset.ratio);

          return (
            <div
              key={preset.id}
              onClick={() => onLevelChange(preset.id)}
              className={`group relative p-8 sm:p-10 cursor-pointer select-none transition-colors duration-150 flex flex-col justify-between min-h-[250px] ${
                isSelected
                  ? 'bg-white dark:bg-zinc-800/95'
                  : 'hover:bg-white/60 dark:hover:bg-zinc-800/40'
              }`}
            >
              {/* Accent bar solide #FF6B35 sur le choix actif */}
              {isSelected && (
                <motion.div
                  layoutId="calibrator-active-line"
                  className="absolute top-0 left-0 right-0 h-1 bg-[#FF6B35]"
                />
              )}

              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">
                    {preset.index}
                  </span>
                  <span
                    className={`text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded ${
                      isSelected
                        ? 'bg-[#FF6B35]/15 text-[#FF6B35] font-semibold'
                        : 'text-zinc-400 dark:text-zinc-500 bg-black/[0.03] dark:bg-white/[0.05]'
                    }`}
                  >
                    {preset.tag}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight mb-2.5">
                  {preset.name}
                </h3>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans mb-8">
                  {preset.description}
                </p>
              </div>

              {/* Estimation dynamique en temps réel */}
              <div className="pt-5 border-t border-black/[0.06] dark:border-white/10 flex items-baseline justify-between">
                <div>
                  <span className="block text-[10px] font-mono uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-0.5">
                    {isFr ? 'Poids estimé' : 'Estimated size'}
                  </span>
                  <span className="text-xl font-mono font-bold text-zinc-950 dark:text-zinc-50 tabular-nums">
                    ~{formatBytes(estimatedSize)}
                  </span>
                </div>

                <span className="text-base font-mono font-bold text-[#FF6B35]">
                  {preset.gainLabel}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
