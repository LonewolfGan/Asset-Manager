import React from 'react';
import { motion } from 'framer-motion';
import { Columns, Eye, Layers, Download } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { cn } from '@/lib/utils';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import {
  type QueueItem,
  type ViewMode,
  type BackdropType,
  IMAGE_FORMAT,
} from '@/lib/background-remover-logic';
import { RemoverBackdropSelector } from './RemoverBackdropSelector';
import { RemoverStudioViewport } from './RemoverStudioViewport';

interface RemoverStudioSceneProps {
  item: QueueItem;
  isInspecting: boolean;
  onBackToGallery: () => void;
  onFullReset: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  backdropType: BackdropType;
  onBackdropTypeChange: (type: BackdropType) => void;
  customColor: string;
  onCustomColorChange: (color: string) => void;
  customBgUrl: string | null;
  customBgInputRef: React.RefObject<HTMLInputElement | null>;
  onCustomBgChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  stageBackgroundStyle: React.CSSProperties;
  isCompositing: boolean;
  onDownload: () => void;
  onRetry: () => void;
  isFr: boolean;
}

export function RemoverStudioScene({
  item,
  isInspecting,
  onBackToGallery,
  onFullReset,
  viewMode,
  onViewModeChange,
  backdropType,
  onBackdropTypeChange,
  customColor,
  onCustomColorChange,
  customBgUrl,
  customBgInputRef,
  onCustomBgChange,
  stageBackgroundStyle,
  isCompositing,
  onDownload,
  onRetry,
  isFr,
}: RemoverStudioSceneProps) {
  const downloadLabel =
    backdropType === 'transparent'
      ? isFr
        ? 'Télécharger PNG'
        : 'Download PNG'
      : backdropType === 'image'
      ? isFr
        ? 'Télécharger avec fond'
        : 'Download with background'
      : isFr
      ? 'Télécharger composé'
      : 'Download composite';

  return (
    <motion.div
      key="studio-screen"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full space-y-4"
    >
      <StudioCommandBar
        meta={{
          name: item.file.name,
          size: item.file.size,
          icon: getFileFormatIcon(item.file, IMAGE_FORMAT.icon),
          dimensions: item.dims ? { width: item.dims.w, height: item.dims.h } : undefined,
        }}
        onReset={isInspecting ? onBackToGallery : onFullReset}
        resetLabel={
          isInspecting
            ? isFr
              ? 'Retour galerie'
              : 'Back to gallery'
            : isFr
            ? "Changer d'image"
            : 'Change image'
        }
        centerControls={
          item.status === 'done' ? (
            <div className="flex items-center bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-0.5 border border-zinc-200/60 dark:border-white/5">
              <button
                type="button"
                onClick={() => onViewModeChange('split')}
                className={cn(
                  'flex items-center gap-1.5 h-7 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer active:scale-[0.98]',
                  viewMode === 'split'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                )}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{isFr ? 'Avant / Après' : 'Before / After'}</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('cutout')}
                className={cn(
                  'flex items-center gap-1.5 h-7 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer active:scale-[0.98]',
                  viewMode === 'cutout'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                )}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{isFr ? 'Sujet détouré' : 'Cutout subject'}</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('original')}
                className={cn(
                  'flex items-center gap-1.5 h-7 px-2.5 rounded-md font-medium text-xs transition-all cursor-pointer active:scale-[0.98]',
                  viewMode === 'original'
                    ? 'bg-white dark:bg-zinc-700 text-zinc-950 dark:text-zinc-50 shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                )}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isFr ? 'Original' : 'Original'}</span>
              </button>
            </div>
          ) : undefined
        }
        primaryAction={{
          label: downloadLabel,
          loadingLabel: isFr ? 'Génération...' : 'Generating...',
          onClick: onDownload,
          isDisabled: isCompositing || item.status !== 'done',
          isLoading: isCompositing,
          icon: Download,
        }}
      />

      {item.status === 'done' && viewMode !== 'original' && (
        <RemoverBackdropSelector
          backdropType={backdropType}
          onBackdropTypeChange={onBackdropTypeChange}
          customColor={customColor}
          onCustomColorChange={onCustomColorChange}
          customBgUrl={customBgUrl}
          customBgInputRef={customBgInputRef}
          onCustomBgChange={onCustomBgChange}
          isFr={isFr}
        />
      )}

      <RemoverStudioViewport
        item={item}
        viewMode={viewMode}
        stageBackgroundStyle={stageBackgroundStyle}
        onRetry={onRetry}
        isFr={isFr}
      />
    </motion.div>
  );
}
