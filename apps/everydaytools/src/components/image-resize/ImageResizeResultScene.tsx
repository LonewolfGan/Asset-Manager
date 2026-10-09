import React from 'react';
import { motion } from 'framer-motion';
import { StudioGeometryResult } from '@workspace/ui';
import { type ResizeResult, getAspectRatioLabel } from '@/lib/image-resize-logic';

export interface ImageResizeResultSceneProps {
  result: ResizeResult;
  resultPreviewUrl: string | null;
  origW: number;
  origH: number;
  originalRatioLabel: string;
  onDownload: () => void;
  onBackToEditor: () => void;
  onFullReset: () => void;
  isFr: boolean;
}

export function ImageResizeResultScene({
  result,
  resultPreviewUrl,
  origW,
  origH,
  originalRatioLabel,
  onDownload,
  onBackToEditor,
  onFullReset,
  isFr,
}: ImageResizeResultSceneProps) {
  return (
    <motion.div
      key="result-scene"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full"
    >
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
    </motion.div>
  );
}
