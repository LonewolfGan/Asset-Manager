import React from 'react';
import { motion } from 'framer-motion';
import { StudioResultCard } from '@workspace/ui';
import { downloadBlob } from '@/lib/download';
import type { CompressResultData } from '@/hooks/use-image-compress-workflow';

export interface ImageCompressResultViewProps {
  result: CompressResultData;
  formatIcon: string;
  isFr: boolean;
  t: any;
  onReset: () => void;
  onOpenNextAction?: () => void;
}

export const ImageCompressResultView: React.FC<ImageCompressResultViewProps> = ({
  result,
  formatIcon,
  isFr,
  t,
  onReset,
  onOpenNextAction,
}) => {
  const tc = t?.imageCompress ?? {};

  const handleDownload = () => {
    downloadBlob(result.blob, result.filename);
    setTimeout(() => {
      onOpenNextAction?.();
    }, 450);
  };

  return (
    <motion.div
      key="result-showcase"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
      className="w-full"
    >
      <StudioResultCard
        variant="monument"
        fileName={result.filename}
        fileSize={result.sizeAfter}
        originalSize={result.sizeBefore}
        gain={result.gain}
        fileIcon={formatIcon}
        isFr={isFr}
        downloadLabel={tc.downloadCompressed ?? (isFr ? 'Télécharger l’image' : 'Download image')}
        resetLabel={isFr ? 'Compresser une autre image' : 'Compress another image'}
        onDownload={handleDownload}
        onReset={onReset}
      />
    </motion.div>
  );
};
