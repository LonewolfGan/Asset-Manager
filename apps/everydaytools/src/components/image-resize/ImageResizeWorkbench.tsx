import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { type Mode, type StandardPreset, IMAGE_FORMAT } from '@/lib/image-resize-logic';
import { ImageResizeCanvas } from './ImageResizeCanvas';
import { ImageResizeControls } from './ImageResizeControls';

interface ImageResizeWorkbenchProps {
  file: File;
  previewUrl: string | null;
  origW: number;
  origH: number;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  width: number;
  height: number;
  onWidthChange: (w: number) => void;
  onHeightChange: (h: number) => void;
  lockRatio: boolean;
  onToggleLockRatio: () => void;
  percentage: number;
  onPercentageChange: (pct: number) => void;
  selectedPresetId: string | null;
  standardPresets: StandardPreset[];
  onPresetSelect: (preset: StandardPreset) => void;
  onResetDimensions: () => void;
  targetW: number;
  targetH: number;
  isModified: boolean;
  visualScaleFactor: number;
  targetRatioLabel: string;
  isProcessing: boolean;
  onFullReset: () => void;
  onProcessResize: () => void;
  isFr: boolean;
}

export function ImageResizeWorkbench({
  file,
  previewUrl,
  origW,
  origH,
  mode,
  onModeChange,
  width,
  height,
  onWidthChange,
  onHeightChange,
  lockRatio,
  onToggleLockRatio,
  percentage,
  onPercentageChange,
  selectedPresetId,
  standardPresets,
  onPresetSelect,
  onResetDimensions,
  targetW,
  targetH,
  isModified,
  visualScaleFactor,
  targetRatioLabel,
  isProcessing,
  onFullReset,
  onProcessResize,
  isFr,
}: ImageResizeWorkbenchProps) {
  return (
    <motion.div
      key="studio-scene"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-2 flex flex-col space-y-6"
    >
      {/* 1. Barre de commande Studio transversale (@workspace/ui) */}
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, IMAGE_FORMAT.icon),
          dimensions: origW > 0 ? { width: origW, height: origH } : undefined,
        }}
        onReset={onFullReset}
        resetLabel={isFr ? "Changer d'image" : 'Change image'}
        isModified={isModified}
        onResetChanges={onResetDimensions}
        primaryAction={{
          label: isFr ? "Redimensionner l'image" : 'Resize image',
          loadingLabel: isFr ? 'Redimensionnement...' : 'Resizing...',
          onClick: onProcessResize,
          isLoading: isProcessing,
          isDisabled: targetW <= 0 || targetH <= 0,
          icon: Download,
        }}
      />

      {/* 2. Le Workbench ouvert (Canvas réactif à gauche + Panneau de contrôles à droite) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pt-2">
        <ImageResizeCanvas
          previewUrl={previewUrl}
          targetW={targetW}
          targetH={targetH}
          visualScaleFactor={visualScaleFactor}
          isProcessing={isProcessing}
          isFr={isFr}
        />

        <ImageResizeControls
          mode={mode}
          onModeChange={onModeChange}
          width={width}
          height={height}
          onWidthChange={onWidthChange}
          onHeightChange={onHeightChange}
          lockRatio={lockRatio}
          onToggleLockRatio={onToggleLockRatio}
          percentage={percentage}
          onPercentageChange={onPercentageChange}
          selectedPresetId={selectedPresetId}
          standardPresets={standardPresets}
          onPresetSelect={onPresetSelect}
          onResetDimensions={onResetDimensions}
          targetW={targetW}
          targetH={targetH}
          targetRatioLabel={targetRatioLabel}
          isProcessing={isProcessing}
          isFr={isFr}
        />
      </div>
    </motion.div>
  );
}
