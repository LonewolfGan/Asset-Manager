import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { AlertCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import {
  createPdfCompressEngine,
  type PdfCompressMetadata,
} from '@/engine/engines/pdf-compress-engine';
import {
  ConversionDropzone,
  NextActionModal,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import {
  type Level,
  type PdfCompressResult,
  getPdfFormat,
  getPresets,
  calculateGain,
} from '@/lib/pdf-compress-logic';
import { PdfCompressWorkbench } from '@/components/pdf-compress/PdfCompressWorkbench';
import { PdfCompressResultShowcase } from '@/components/pdf-compress/PdfCompressResultShowcase';

export default function PdfCompress() {
  const { t, isFr } = useLocale();
  const pdfFormat = getPdfFormat(isFr);
  const presets = useMemo(() => getPresets(isFr), [isFr]);

  const [level, setLevel] = useState<Level>('ebook');
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const engine = useMemo(
    () => createPdfCompressEngine({ level, isFr }),
    [level, isFr]
  );

  const {
    inputFile,
    result,
    isProcessing,
    error,
    handleFileSelect,
    handleExecute,
    handleReset,
    setError,
  } = useToolWorkflow<File, Blob>({
    engine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-compress',
    category: 'pdf',
    autoConsumeHandoff: true,
  });

  const compressResult: PdfCompressResult | null = useMemo(() => {
    if (!result?.data || !inputFile) return null;
    const meta = result.metadata as (PdfCompressMetadata | undefined);
    const sizeBefore = meta?.sizeBefore ?? result.originalSize ?? inputFile.size;
    const sizeAfter = meta?.sizeAfter ?? result.resultSize ?? result.data.size;
    const gain = meta?.gain ?? calculateGain(sizeBefore, sizeAfter);

    return {
      blob: result.data,
      filename: result.filename,
      sizeBefore,
      sizeAfter,
      gain,
    };
  }, [result, inputFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        handleFileSelect(droppedFile);
      }
    },
    [handleFileSelect]
  );

  const handleDownload = useCallback(() => {
    if (!compressResult) return;
    downloadBlob(compressResult.blob, compressResult.filename);
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [compressResult]);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.pdf,
        t.tools['pdf-compress']?.title ?? (isFr ? 'Compresser un PDF' : 'Compress PDF'),
      ]}
      title={t.tools['pdf-compress']?.title ?? (isFr ? 'Compresser un PDF' : 'Compress PDF')}
      description={
        t.tools['pdf-compress']?.description ??
        (isFr
          ? 'Réduisez la taille de votre document PDF tout en conservant une excellente lisibilité.'
          : 'Reduce the file size of your PDF document while keeping excellent readability.')
      }
      seoSlug="pdf-compress"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DROPZONE PLEINE LARGEUR (MAX-W-5XL) ─── */}
            {!inputFile && !compressResult && !isProcessing && (
              <ConversionDropzone
                sourceFormat={pdfFormat}
                title={isFr ? 'Compresser un document PDF' : 'Compress a PDF document'}
                description={
                  isFr
                    ? 'Glissez-déposez votre fichier ici ou cliquez pour parcourir votre appareil.'
                    : 'Drag and drop your file here or click to browse your device.'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier PDF' : 'Select a PDF file'}
                isDragging={isDragging}
                onFileSelected={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : L'ATELIER DE CALIBRAGE ─── */}
            {inputFile && !compressResult && !isProcessing && (
              <PdfCompressWorkbench
                file={inputFile}
                pdfFormat={pdfFormat}
                presets={presets}
                level={level}
                isFr={isFr}
                isProcessing={isProcessing}
                onReset={handleReset}
                onCompress={handleExecute}
                onSelectLevel={setLevel}
              />
            )}

            {/* ─── SCÈNE 3 : APERTURE OPTIQUE CINÉTIQUE ─── */}
            {isProcessing && (
              <ProcessingAperture
                formatIcon={pdfFormat.icon}
                formatAlt="PDF"
                stageLabel={isFr ? 'Compression en cours' : 'Compression in progress'}
                title={formatBytes(inputFile?.size ?? 0)}
                detail={inputFile?.name}
              />
            )}

            {/* ─── SCÈNE 4 : TRANSFORMATION DE MASSE ─── */}
            {compressResult && !isProcessing && (
              <PdfCompressResultShowcase
                result={compressResult}
                pdfFormat={pdfFormat}
                isFr={isFr}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-compress"
        resultBlob={compressResult?.blob}
        resultFilename={compressResult?.filename}
      />
    </ToolPageLayout>
  );
}
