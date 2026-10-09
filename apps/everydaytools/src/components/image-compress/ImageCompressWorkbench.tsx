import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sliders } from 'lucide-react';
import { StudioCommandBar, QualitySliderField } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import type { ConversionFormat } from '@/components/conversion';
import type { Level, CompressionPreset } from '@/lib/image-compress-logic';
import {
  ImageCompressPresetGrid,
  ImageCompressActionFooter,
} from '@/components/image-compress';

export interface ImageCompressWorkbenchProps {
  file: File;
  format: ConversionFormat;
  presets: CompressionPreset[];
  level: Level;
  isFr: boolean;
  onLevelChange: (level: Level) => void;
  onReset: () => void;
  onCompress: () => void;
  customQuality?: number;
  onQualityChange?: (val: number) => void;
  showCustomQuality?: boolean;
}

export const ImageCompressWorkbench: React.FC<ImageCompressWorkbenchProps> = ({
  file,
  format,
  presets,
  level,
  isFr,
  onLevelChange,
  onReset,
  onCompress,
  customQuality = 75,
  onQualityChange,
  showCustomQuality = false,
}) => {
  const [useCustom, setUseCustom] = useState(showCustomQuality);
  const selectedPreset = presets.find((p) => p.id === level);

  return (
    <motion.div
      key="staging-atelier"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-6 sm:py-10 flex flex-col gap-6"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, format.icon),
        }}
        onReset={onReset}
        resetLabel={isFr ? "Changer d'image" : 'Change image'}
        primaryAction={{
          label: isFr ? "Compresser l'image" : 'Compress image',
          onClick: onCompress,
          icon: ArrowRight,
        }}
      />

      {showCustomQuality || useCustom ? (
        <div className="p-6 rounded-2xl border border-black/[0.08] dark:border-white/10 bg-white dark:bg-zinc-900">
          <QualitySliderField
            value={customQuality}
            onChange={onQualityChange ?? (() => {})}
            isFr={isFr}
          />
        </div>
      ) : (
        <ImageCompressPresetGrid
          presets={presets}
          level={level}
          fileSize={file.size}
          isFr={isFr}
          onLevelChange={onLevelChange}
        />
      )}

      <ImageCompressActionFooter
        selectedPreset={selectedPreset}
        isFr={isFr}
        onReset={onReset}
        onCompress={onCompress}
      />
    </motion.div>
  );
};
