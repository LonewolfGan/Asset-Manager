import React from 'react';
import { StudioGeometryResult } from '@workspace/ui';
import { useLocale } from '@/hooks/use-locale';
import { getAspectRatioLabel } from '../../lib/image-crop-logic';
import type { CropResult } from '../../services/image-crop-api';

export interface ImageCropResultShowcaseProps {
  result: CropResult;
  resultPreviewUrl: string | null;
  origW: number;
  origH: number;
  originalRatioLabel: string;
  onDownload: () => void;
  onBackToEditor: () => void;
  onFullReset: () => void;
}

export function ImageCropResultShowcase({
  result,
  resultPreviewUrl,
  origW,
  origH,
  originalRatioLabel,
  onDownload,
  onBackToEditor,
  onFullReset,
}: ImageCropResultShowcaseProps) {
  const { isFr } = useLocale();

  return (
    <div className="w-full">
      <StudioGeometryResult
        fileName={result.filename}
        previewUrl={resultPreviewUrl}
        origDimensions={{ width: origW, height: origH }}
        finalDimensions={{ width: result.finalW, height: result.finalH }}
        origRatioLabel={originalRatioLabel}
        finalRatioLabel={getAspectRatioLabel(result.finalW, result.finalH)}
        sizeBefore={result.sizeBefore}
        sizeAfter={result.sizeAfter}
        onDownload={onDownload}
        onBackToEditor={onBackToEditor}
        onReset={onFullReset}
        isFr={isFr}
      />
    </div>
  );
}
