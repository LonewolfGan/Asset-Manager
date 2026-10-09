import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { AlertCircle } from 'lucide-react';
import { formatBytes } from '@/lib/utils';
import {
  ConversionDropzone,
  NextActionModal,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { getPdfFormat } from '@/lib/pdf-compress-logic';
import { usePdfCompressWorkflow } from '@/hooks/use-pdf-compress-workflow';
import { PdfCompressWorkbench } from '@/components/pdf-compress/PdfCompressWorkbench';
import { PdfCompressResultShowcase } from '@/components/pdf-compress/PdfCompressResultShowcase';

export default function PdfCompress() {
  const { t, isFr } = useLocale();
  const pdfFormat = getPdfFormat(isFr);

  const {
    presets,
    file,
    level,
    setLevel,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    liveBytes,
    isNextActionOpen,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCompress,
    handleDownload,
  } = usePdfCompressWorkflow({ isFr });

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
            {!file && !result && !isProcessing && (
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
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : L'ATELIER DE CALIBRAGE ─── */}
            {file && !result && !isProcessing && (
              <PdfCompressWorkbench
                file={file}
                pdfFormat={pdfFormat}
                presets={presets}
                level={level}
                isFr={isFr}
                isProcessing={isProcessing}
                onReset={handleReset}
                onCompress={handleCompress}
                onSelectLevel={setLevel}
              />
            )}

            {/* ─── SCÈNE 3 : APERTURE OPTIQUE CINÉTIQUE ─── */}
            {isProcessing && (
              <ProcessingAperture
                formatIcon={pdfFormat.icon}
                formatAlt="PDF"
                stageLabel={isFr ? 'Compression en cours' : 'Compression in progress'}
                title={formatBytes(liveBytes)}
                detail={file?.name}
              />
            )}

            {/* ─── SCÈNE 4 : TRANSFORMATION DE MASSE ─── */}
            {result && !isProcessing && (
              <PdfCompressResultShowcase
                result={result}
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
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
