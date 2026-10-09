import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { ConversionFormat } from '@/components/conversion';
import type { CompressionPreset, Level } from '@/lib/pdf-compress-logic';
import { PdfCompressCalibrator } from './PdfCompressCalibrator';

export interface PdfCompressWorkbenchProps {
  file: File;
  pdfFormat: ConversionFormat;
  presets: CompressionPreset[];
  level: Level;
  isFr: boolean;
  isProcessing: boolean;
  onReset: () => void;
  onCompress: () => void;
  onSelectLevel: (level: Level) => void;
}

export const PdfCompressWorkbench: React.FC<PdfCompressWorkbenchProps> = ({
  file,
  pdfFormat,
  presets,
  level,
  isFr,
  isProcessing,
  onReset,
  onCompress,
  onSelectLevel,
}) => {
  return (
    <motion.div
      key="staging-atelier"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-6 sm:py-10 flex flex-col"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, pdfFormat.icon),
        }}
        onReset={onReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        primaryAction={{
          label: isFr ? 'Compresser le document' : 'Compress document',
          loadingLabel: isFr ? 'Compression...' : 'Compressing...',
          onClick: onCompress,
          isDisabled: isProcessing || !file,
          isLoading: isProcessing,
          icon: ArrowRight,
        }}
      />

      <PdfCompressCalibrator
        presets={presets}
        fileSize={file.size}
        selectedLevel={level}
        isFr={isFr}
        onSelectLevel={onSelectLevel}
      />
    </motion.div>
  );
};
