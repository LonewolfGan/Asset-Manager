import React from 'react';
import { motion } from 'framer-motion';
import { StudioResultCard } from '@workspace/ui';
import type { ConversionFormat } from '@/components/conversion';
import type { PdfCompressResult } from '@/hooks/use-pdf-compress-workflow';

export interface PdfCompressResultShowcaseProps {
  result: PdfCompressResult;
  pdfFormat: ConversionFormat;
  isFr: boolean;
  onDownload: () => void;
  onReset: () => void;
}

export const PdfCompressResultShowcase: React.FC<PdfCompressResultShowcaseProps> = ({
  result,
  pdfFormat,
  isFr,
  onDownload,
  onReset,
}) => {
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
        fileIcon={pdfFormat.icon}
        isFr={isFr}
        downloadLabel={isFr ? 'Télécharger le PDF compressé' : 'Download compressed PDF'}
        resetLabel={isFr ? 'Compresser un autre document' : 'Compress another document'}
        onDownload={onDownload}
        onReset={onReset}
      />
    </motion.div>
  );
};
