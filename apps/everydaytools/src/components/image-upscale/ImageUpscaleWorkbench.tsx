import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Download, Sliders, Columns, Eye, RotateCcw } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { IMAGE_FORMAT, type UpscaleDimensions } from '@/lib/image-upscale-logic';
import { ImageUpscaleStage } from './ImageUpscaleStage';
import { ImageUpscaleResultView } from './ImageUpscaleResultView';
import type { LoupePosition } from '@/hooks/use-image-upscale-loupe';

export interface ImageUpscaleWorkbenchProps {
  file: File;
  previewUrl: string | null;
  resultUrl: string | null;
  resultBlob: Blob | null;
  origDims: { w: number; h: number } | null;
  targetDims: UpscaleDimensions;
  sourceMp: string;
  outputFilename: string;
  scale: 2 | 4;
  onScaleChange: (scale: 2 | 4) => void;
  sharpen: boolean;
  onSharpenChange: (checked: boolean) => void;
  isProcessing: boolean;
  stageImageRef: React.RefObject<HTMLImageElement | null>;
  isLoupeActive: boolean;
  loupePos: LoupePosition | null;
  onToggleLoupe: () => void;
  onStagePointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  onStagePointerLeave: () => void;
  onUpscale: () => void;
  onDownload: () => void;
  onFullReset: () => void;
  onBackToEditor: () => void;
  isFr: boolean;
}

export function ImageUpscaleWorkbench({
  file,
  previewUrl,
  resultUrl,
  resultBlob,
  origDims,
  targetDims,
  sourceMp,
  outputFilename,
  scale,
  onScaleChange,
  sharpen,
  onSharpenChange,
  isProcessing,
  stageImageRef,
  isLoupeActive,
  loupePos,
  onToggleLoupe,
  onStagePointerMove,
  onStagePointerLeave,
  onUpscale,
  onDownload,
  onFullReset,
  onBackToEditor,
  isFr,
}: ImageUpscaleWorkbenchProps) {
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side' | 'single'>('split');

  return (
    <AnimatePresence mode="wait">
      {/* ─── SCÈNE 2 : ATELIER PLEINE LARGEUR SANS TEXTE INUTILE ─── */}
      {!resultUrl ? (
        <motion.div
          key="staging-scene"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="w-full space-y-6"
        >
          <StudioCommandBar
            meta={{
              name: file.name,
              size: file.size,
              icon: getFileFormatIcon(file, IMAGE_FORMAT.icon),
              dimensions: origDims ? { width: origDims.w, height: origDims.h } : undefined,
            }}
            resetLabel={isFr ? "Changer d'image" : 'Change image'}
            onReset={onFullReset}
            centerControls={
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 rounded-xl p-1 border border-zinc-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => onScaleChange(2)}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${
                    scale === 2
                      ? 'bg-white dark:bg-zinc-750 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  <span>2x</span>
                  <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                    ({origDims ? Math.min(8000, origDims.w * 2) : 0}×{origDims ? Math.min(8000, origDims.h * 2) : 0})
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onScaleChange(4)}
                  className={`h-7 px-3 rounded-lg text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 active:scale-[0.97] ${
                    scale === 4
                      ? 'bg-white dark:bg-zinc-750 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  <span>4x</span>
                  <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
                    ({origDims ? Math.min(8000, origDims.w * 4) : 0}×{origDims ? Math.min(8000, origDims.h * 4) : 0})
                  </span>
                </button>
              </div>
            }
            primaryAction={{
              label: isFr ? `Agrandir en ${scale}x` : `Upscale to ${scale}x`,
              loadingLabel: isFr ? 'Agrandissement...' : 'Upscaling...',
              onClick: onUpscale,
              isLoading: isProcessing,
              icon: Maximize2,
            }}
          />

          <ImageUpscaleStage
            previewUrl={previewUrl}
            stageImageRef={stageImageRef}
            isLoupeActive={isLoupeActive}
            loupePos={loupePos}
            onToggleLoupe={onToggleLoupe}
            sharpen={sharpen}
            onSharpenChange={onSharpenChange}
            isProcessing={isProcessing}
            scale={scale}
            targetDims={targetDims}
            onPointerMove={onStagePointerMove}
            onPointerLeave={onStagePointerLeave}
            isFr={isFr}
          />
        </motion.div>
      ) : (
        /* ─── SCÈNE 3 : STUDIO D'INSPECTION HAUTE-FIDÉLITÉ PLEINE LARGEUR ─── */
        <motion.div
          key="result-scene"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
          className="w-full space-y-6"
        >
          <StudioCommandBar
            meta={{
              name: outputFilename,
              size: resultBlob?.size || file.size,
              icon: getFileFormatIcon(file, IMAGE_FORMAT.icon),
              dimensions: { width: targetDims.targetW, height: targetDims.targetH },
            }}
            resetLabel={isFr ? 'Réajuster' : 'Readjust'}
            onReset={onBackToEditor}
            centerControls={
              <div className="flex items-center bg-zinc-100 dark:bg-zinc-850 rounded-xl p-1 border border-zinc-200/80 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97] ${
                    viewMode === 'split'
                      ? 'bg-white dark:bg-zinc-750 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Avant / Après' : 'Before / After'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('side-by-side')}
                  className={`h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97] ${
                    viewMode === 'side-by-side'
                      ? 'bg-white dark:bg-zinc-750 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Côte à côte' : 'Side by side'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('single')}
                  className={`h-7 px-2.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.97] ${
                    viewMode === 'single'
                      ? 'bg-white dark:bg-zinc-750 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isFr ? 'Image finale' : 'Final image'}</span>
                </button>
              </div>
            }
            secondaryActions={
              <button
                type="button"
                onClick={onFullReset}
                className="flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-850 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200/80 dark:border-white/10 active:scale-[0.98] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isFr ? 'Autre image' : 'Another image'}</span>
              </button>
            }
            primaryAction={{
              label: isFr ? 'Télécharger' : 'Download',
              onClick: onDownload,
              icon: Download,
            }}
          />

          <ImageUpscaleResultView
            viewMode={viewMode}
            previewUrl={previewUrl}
            resultUrl={resultUrl}
            origDims={origDims}
            targetDims={targetDims}
            scale={scale}
            isFr={isFr}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
