import React from 'react';
import { motion } from 'framer-motion';
import {
  RotateCcw,
  RotateCw,
  RefreshCw,
  FlipHorizontal,
  FlipVertical,
  Download,
  AlertCircle,
} from 'lucide-react';
import { StudioCommandBar, FormatPillsSelector } from '@workspace/ui';
import { ActionTooltip } from '@/components/ui/tooltip';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { cn } from '@/lib/utils';
import {
  type OutputFormat,
  FORMAT_OPTIONS,
  IMAGE_FORMAT,
} from '@/lib/flip-rotate-format-logic';
import { FlipRotateViewport } from './FlipRotateViewport';

interface FlipRotateWorkbenchProps {
  file: File;
  previewUrl: string;
  imgRef: React.RefObject<HTMLImageElement | null>;
  currentDims: { w: number; h: number; isSwapped: boolean } | null;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  outputFormat: OutputFormat;
  hasTransform: boolean;
  isDraggingRotation: boolean;
  isProcessing: boolean;
  error: string | null;
  isFr: boolean;
  onFullReset: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  onRotate180: () => void;
  onToggleFlipH: () => void;
  onToggleFlipV: () => void;
  onFormatChange: (fmt: OutputFormat) => void;
  onResetTransform: () => void;
  onDownload: () => void;
  onRotatePointerDown: (e: React.PointerEvent) => void;
  onRotatePointerMove: (e: React.PointerEvent) => void;
  onRotatePointerUp: (e: React.PointerEvent) => void;
}

export const FlipRotateWorkbench: React.FC<FlipRotateWorkbenchProps> = ({
  file,
  previewUrl,
  imgRef,
  currentDims,
  rotation,
  flipH,
  flipV,
  outputFormat,
  hasTransform,
  isDraggingRotation,
  isProcessing,
  error,
  isFr,
  onFullReset,
  onRotateLeft,
  onRotateRight,
  onRotate180,
  onToggleFlipH,
  onToggleFlipV,
  onFormatChange,
  onResetTransform,
  onDownload,
  onRotatePointerDown,
  onRotatePointerMove,
  onRotatePointerUp,
}) => {
  return (
    <motion.div
      key="studio-screen"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full space-y-5"
    >
      {/* 1. Barre de commande Studio transversale (@workspace/ui) */}
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, IMAGE_FORMAT.icon),
          dimensions: currentDims ? { width: currentDims.w, height: currentDims.h } : undefined,
        }}
        onReset={onFullReset}
        resetLabel={isFr ? "Changer d'image" : 'Change image'}
        isModified={hasTransform}
        onResetChanges={onResetTransform}
        centerControls={
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {/* Groupe Rotation */}
            <div className="flex items-center gap-0.5">
              <ActionTooltip label={isFr ? 'Pivoter de 90° vers la gauche' : 'Rotate 90° counter-clockwise'}>
                <button
                  type="button"
                  onClick={onRotateLeft}
                  className="flex items-center gap-1 h-8 px-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>-90°</span>
                </button>
              </ActionTooltip>

              <ActionTooltip label={isFr ? 'Pivoter de 90° vers la droite' : 'Rotate 90° clockwise'}>
                <button
                  type="button"
                  onClick={onRotateRight}
                  className="flex items-center gap-1 h-8 px-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>+90°</span>
                </button>
              </ActionTooltip>

              <ActionTooltip label={isFr ? 'Retournement à 180°' : 'Rotate 180°'}>
                <button
                  type="button"
                  onClick={onRotate180}
                  className="flex items-center gap-1 h-8 px-2 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>180°</span>
                </button>
              </ActionTooltip>
            </div>

            <div className="h-4 w-px bg-black/[0.08] dark:bg-white/10 shrink-0 mx-0.5" />

            {/* Groupe Miroir */}
            <div className="flex items-center gap-0.5">
              <ActionTooltip label={isFr ? 'Miroir Horizontal' : 'Flip Horizontal'}>
                <button
                  type="button"
                  onClick={onToggleFlipH}
                  className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-[0.98]',
                    flipH
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  )}
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>
              </ActionTooltip>

              <ActionTooltip label={isFr ? 'Miroir Vertical' : 'Flip Vertical'}>
                <button
                  type="button"
                  onClick={onToggleFlipV}
                  className={cn(
                    'flex items-center justify-center h-8 w-8 rounded-lg text-xs font-medium transition-all cursor-pointer active:scale-[0.98]',
                    flipV
                      ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-semibold shadow-xs'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  )}
                >
                  <FlipVertical className="w-3.5 h-3.5" />
                </button>
              </ActionTooltip>
            </div>

            <div className="h-4 w-px bg-black/[0.08] dark:bg-white/10 shrink-0 mx-0.5" />

            {/* Sélecteur de format d'export modulaire (@workspace/ui) */}
            <FormatPillsSelector
              value={outputFormat}
              onChange={(val) => onFormatChange(val as OutputFormat)}
              formats={FORMAT_OPTIONS.map((opt) => ({
                id: opt.value,
                label: opt.label,
                extension: `.${opt.ext}`,
                mimeType: opt.value,
              }))}
              isFr={isFr}
            />
          </div>
        }
        primaryAction={{
          label: isFr ? "Télécharger l'image" : 'Download image',
          loadingLabel: isFr ? 'Génération...' : 'Generating...',
          onClick: onDownload,
          isLoading: isProcessing,
          icon: Download,
        }}
      />

      {/* 2. Studio Viewport avec poignée manuelle tactile */}
      <FlipRotateViewport
        previewUrl={previewUrl}
        imgRef={imgRef}
        rotation={rotation}
        flipH={flipH}
        flipV={flipV}
        isDraggingRotation={isDraggingRotation}
        currentDims={currentDims}
        isFr={isFr}
        onRotatePointerDown={onRotatePointerDown}
        onRotatePointerMove={onRotatePointerMove}
        onRotatePointerUp={onRotatePointerUp}
      />

      {/* 3. Bannière d'erreur éventuelle */}
      {error && (
        <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </motion.div>
  );
};
