import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import {
  BASE_SOURCE_FORMAT,
  BASE_TARGET_FORMAT,
  formatPageNumberLabel,
  getPositionOptions,
  getFormatOptions,
} from '@/lib/pdf-page-numbers-logic';
import { usePdfPagePreview } from '@/hooks/use-pdf-page-preview';
import { usePdfPageNumbersOptions } from '@/hooks/use-pdf-page-numbers-options';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfPageNumbersEngine } from '@/engine/engines/pdf-page-numbers-engine';
import { PdfPageNumbersWorkbench } from '@/components/pdf-page-numbers';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';

export default function PdfPageNumbers() {
  const { t, isFr } = useLocale();
  const tc = t.pdfPageNumbers ?? {};

  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const sourceFormat: ConversionFormat = useMemo(
    () => ({
      ...BASE_SOURCE_FORMAT,
      subLabel: isFr ? 'Document source' : 'Source document',
    }),
    [isFr]
  );

  const targetFormat: ConversionFormat = useMemo(
    () => ({
      ...BASE_TARGET_FORMAT,
      subLabel: isFr ? 'Document numéroté' : 'Numbered document',
    }),
    [isFr]
  );

  const opts = usePdfPageNumbersOptions();

  const engine = useMemo(
    () =>
      createPdfPageNumbersEngine({
        position: opts.position,
        format: opts.format,
        startFrom: opts.startFrom,
        skipFirst: opts.skipFirst,
        fontSize: opts.fontSize,
        margin: opts.margin,
        color: opts.color,
        isFr,
      }),
    [opts.position, opts.format, opts.startFrom, opts.skipFirst, opts.fontSize, opts.margin, opts.color, isFr]
  );

  const {
    inputFile,
    result,
    isProcessing,
    error,
    handleFileSelect,
    handleExecute,
    handleReset: handleWorkflowReset,
    setError,
  } = useToolWorkflow<File, Blob>({
    engine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-page-numbers',
    category: 'pdf',
    autoConsumeHandoff: true,
  });

  const preview = usePdfPagePreview(inputFile ?? undefined, opts.skipFirst);

  const numberedResult = useMemo(() => {
    if (!result?.data || !inputFile) return null;
    return {
      blob: result.data,
      filename: result.filename,
      sizeAfter: result.resultSize ?? result.data.size,
      sizeBefore: result.originalSize ?? inputFile.size,
    };
  }, [result, inputFile]);

  const handleReset = useCallback(() => {
    handleWorkflowReset();
    opts.resetOptions();
    preview.resetPreview();
    setIsNextActionOpen(false);
  }, [handleWorkflowReset, opts, preview]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inputFile && !isProcessing) handleReset();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [inputFile, isProcessing, handleReset]);

  const handleToggleSkipFirst = useCallback(() => {
    opts.toggleSkipFirst();
    if (!opts.skipFirst && preview.previewPage === 1 && preview.totalPages && preview.totalPages > 1) {
      preview.handlePageChange(2);
    }
  }, [opts, preview]);

  const positionOptions = useMemo(() => getPositionOptions(tc, isFr), [tc, isFr]);
  const formatOptions = useMemo(() => getFormatOptions(isFr), [isFr]);

  const stampLabel = useMemo(
    () =>
      formatPageNumberLabel({
        format: opts.format,
        previewPage: preview.previewPage,
        startNum: opts.startFrom,
        skipFirst: opts.skipFirst,
        totalPages: preview.totalPages,
        isFr,
      }),
    [opts.format, preview.previewPage, opts.startFrom, opts.skipFirst, preview.totalPages, isFr]
  );

  const handleDownload = useCallback(() => {
    if (!numberedResult) return;
    downloadBlob(numberedResult.blob, numberedResult.filename);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [numberedResult]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const dropped = e.dataTransfer.files?.[0];
      if (dropped) handleFileSelect(dropped);
    },
    [handleFileSelect]
  );

  const title = t.tools['pdf-page-numbers']?.title ?? (isFr ? 'Numéroter le PDF' : 'Add Page Numbers');
  const description =
    t.tools['pdf-page-numbers']?.description ??
    (isFr
      ? 'Insérez une pagination vectorielle calibrée avec contrôle d’emplacement, typographie et couverture.'
      : 'Insert calibrated vector page numbering with layout position, typography, and cover page control.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={description}
      seoSlug="pdf-page-numbers"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-3xl mx-auto"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!inputFile && !numberedResult && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag & drop your PDF document'}
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos fichiers et configurer la numérotation des pages.'
                      : 'or click to browse your files and configure page numbering.'
                  }
                  buttonLabel={isFr ? 'Sélectionner un fichier PDF' : 'Select a PDF file'}
                  isDragging={isDragging}
                  onFileSelected={handleFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {inputFile && !numberedResult && !isProcessing && (
              <PdfPageNumbersWorkbench
                file={inputFile}
                sourceFormat={sourceFormat}
                totalPages={preview.totalPages}
                isProcessing={isProcessing}
                isFr={isFr}
                tc={tc}
                onReset={handleReset}
                onConvert={handleExecute}
                position={opts.position}
                setPosition={opts.setPosition}
                format={opts.format}
                setFormat={opts.setFormat}
                startNum={opts.startFrom}
                setStartNum={opts.setStartFrom}
                fontSize={opts.fontSize}
                setFontSize={opts.setFontSize}
                skipFirst={opts.skipFirst}
                onToggleSkipFirst={handleToggleSkipFirst}
                positionOptions={positionOptions}
                formatOptions={formatOptions}
                pagePreviewUrl={preview.pagePreviewUrl}
                previewPage={preview.previewPage}
                isLoadingPreview={preview.isLoadingPreview}
                onPageChange={preview.handlePageChange}
                stampLabel={stampLabel}
              />
            )}

            {isProcessing && (
              <ProcessingAperture
                formatIcon={sourceFormat.icon}
                formatColor={sourceFormat.color}
                formatAlt="PDF"
                stageLabel={
                  isFr
                    ? 'Numérotation vectorielle des pages en cours'
                    : 'Applying vector page numbers to PDF'
                }
                title={formatBytes(inputFile?.size ?? 0)}
                detail={inputFile?.name}
              />
            )}

            {numberedResult && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={numberedResult.filename}
                resultFileSize={numberedResult.sizeAfter}
                downloadBtnLabel={tc.downloadNumbered ?? (isFr ? 'Télécharger le PDF numéroté' : 'Download numbered PDF')}
                resetBtnLabel={isFr ? 'Numéroter un autre document' : 'Number another document'}
                onDownload={handleDownload}
                onReset={handleReset}
                downloadBtnColor="#FF6B35"
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-page-numbers"
        resultBlob={numberedResult?.blob}
        resultFilename={numberedResult?.filename}
      />
    </ToolPageLayout>
  );
}
