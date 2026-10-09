import React from 'react';
import { Crop } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '../../lib/file-format-icon';
import { IMAGE_FORMAT, type CropRect } from '../../lib/image-crop-logic';
import { ImageCropCanvas } from './ImageCropCanvas';
import { ImageCropInspector } from './ImageCropInspector';

interface ImageCropWorkbenchProps {
  file: File;
  origW: number;
  origH: number;
  isModified: boolean;
  isProcessing: boolean;
  isFr?: boolean;
  onFullReset: () => void;
  onResetCrop: () => void;
  onProcessCrop: () => void;
  imgObj: HTMLImageElement | null;
  crop: CropRect;
  setCrop: (crop: CropRect) => void;
  aspectRatio: number | null;
  onCenterCrop: () => void;
  onMaximizeCrop: () => void;
  onSelectAspectPreset: (ratio: number | null) => void;
  onSwapOrientation: () => void;
  croppedRatioLabel: string;
  surfaceRetainedPct: number;
}

export function ImageCropWorkbench({
  file,
  origW,
  origH,
  isModified,
  isProcessing,
  isFr = true,
  onFullReset,
  onResetCrop,
  onProcessCrop,
  imgObj,
  crop,
  setCrop,
  aspectRatio,
  onCenterCrop,
  onMaximizeCrop,
  onSelectAspectPreset,
  onSwapOrientation,
  croppedRatioLabel,
  surfaceRetainedPct,
}: ImageCropWorkbenchProps) {
  const canCrop = !isProcessing && crop.w > 0 && crop.h > 0;

  return (
    <div className="w-full space-y-6">
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, IMAGE_FORMAT.icon),
          dimensions: origW > 0 && origH > 0 ? { width: origW, height: origH } : undefined,
        }}
        onReset={onFullReset}
        resetLabel={isFr ? "Changer d'image" : 'Change image'}
        isModified={isModified}
        onResetChanges={onResetCrop}
        primaryAction={{
          label: isFr ? 'Appliquer le recadrage' : 'Apply crop',
          loadingLabel: isFr ? 'Recadrage...' : 'Cropping...',
          onClick: onProcessCrop,
          isDisabled: !canCrop,
          isLoading: isProcessing,
          icon: Crop,
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <ImageCropCanvas
          imgObj={imgObj}
          crop={crop}
          setCrop={setCrop}
          origW={origW}
          origH={origH}
          aspectRatio={aspectRatio}
          isProcessing={isProcessing}
          onCenterCrop={onCenterCrop}
          onMaximizeCrop={onMaximizeCrop}
          onResetCrop={onResetCrop}
        />

        <ImageCropInspector
          aspectRatio={aspectRatio}
          onSelectAspectPreset={onSelectAspectPreset}
          onSwapOrientation={onSwapOrientation}
          crop={crop}
          croppedRatioLabel={croppedRatioLabel}
          surfaceRetainedPct={surfaceRetainedPct}
        />
      </div>
    </div>
  );
}
