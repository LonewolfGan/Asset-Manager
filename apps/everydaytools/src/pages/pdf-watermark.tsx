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
  getWatermarkPresets,
} from '@/lib/pdf-watermark-logic';
import { usePdfPagePreview } from '@/hooks/use-pdf-page-preview';
import { usePdfWatermarkOptions } from '@/hooks/use-pdf-watermark-options';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfWatermarkEngine } from '@/engine/engines/pdf-watermark-engine';
import { PdfWatermarkWorkbench } from '@/components/pdf-watermark';
import { downloadBlob } from '@/lib/download';
import { formatBytes } from '@/lib/utils';

export default function PdfWatermark() {
  const { t, isFr } = useLocale();
  const tc = t.pdfWatermark;

  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const presetTexts = useMemo(() => getWatermarkPresets(isFr), [isFr]);

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
      subLabel: isFr ? 'Document filigrané' : 'Watermarked document',
    }),
    [isFr]
  );

  const opts = usePdfWatermarkOptions({
    initialText: isFr ? 'CONFIDENTIEL' : 'CONFIDENTIAL',
    isFr,
  });

  const engine = useMemo(
    () =>
      createPdfWatermarkEngine({
        text: opts.text,
        fontSize: opts.fontSize,
        opacity: opts.opacity,
        angle: opts.angle,
        color: opts.color,
        pattern: opts.pattern,
        pages: opts.pages,
        imageFile: opts.imageFile ?? undefined,
        isFr,
      }),
    [
      opts.text,
      opts.fontSize,
      opts.opacity,
      opts.angle,
      opts.color,
      opts.pattern,
      opts.pages,
      opts.imageFile,
      isFr,
    ]
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
    toolSlug: 'pdf-watermark',
    category: 'pdf',
    autoConsumeHandoff: true,
  });

  const preview = usePdfPagePreview(inputFile ?? undefined);

  const watermarkResult = useMemo(() => {
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

  const handleDownload = useCallback(() => {
    if (!watermarkResult) return;
    downloadBlob(watermarkResult.blob, watermarkResult.filename);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [watermarkResult]);

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

  const title = t.tools['pdf-watermark']?.title ?? (isFr ? 'Ajouter un filigrane au PDF' : 'Watermark PDF');
  const description =
    t.tools['pdf-watermark']?.description ??
    (isFr
      ? 'Incrustez un filigrane textuel vectoriel personnalisé avec contrôle d’orientation, opacité et typographie.'
      : 'Apply a custom vector text or image watermark with full control over orientation, opacity, and typography.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={description}
      seoSlug="pdf-watermark"
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
            {!inputFile && !watermarkResult && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag & drop your PDF document'}
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos fichiers et configurer votre filigrane de sécurité.'
                      : 'or click to browse your files and configure your security watermark.'
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

            {inputFile && !watermarkResult && !isProcessing && (
              <PdfWatermarkWorkbench
                file={inputFile}
                sourceFormat={sourceFormat}
                totalPages={preview.totalPages}
                isProcessing={isProcessing}
                isFr={isFr}
                tc={tc}
                onReset={handleReset}
                onConvert={handleExecute}
                text={opts.text}
                setText={opts.setText}
                presetTexts={presetTexts}
                pattern={opts.pattern as any}
                setPattern={opts.setPattern}
                colorHex={opts.colorHex}
                setColorHex={opts.setColorHex}
                fontSize={opts.fontSize}
                setFontSize={opts.setFontSize}
                opacity={opts.opacity}
                setOpacity={opts.setOpacity}
                angle={opts.angle as any}
                setAngle={opts.setAngle}
                pagesScope={opts.pagesScope as any}
                setPagesScope={opts.setPagesScope}
                pagePreviewUrl={preview.pagePreviewUrl}
                previewPage={preview.previewPage}
                isLoadingPreview={preview.isLoadingPreview}
                onPageChange={preview.handlePageChange}
              />
            )}

            {isProcessing && (
              <ProcessingAperture
                formatIcon={sourceFormat.icon}
                formatAlt="PDF"
                stageLabel={
                  isFr
                    ? 'Incrustation du filigrane en cours'
                    : 'Applying watermark to PDF document'
                }
                title={formatBytes(inputFile?.size ?? 0)}
                detail={inputFile?.name}
              />
            )}

            {watermarkResult && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={watermarkResult.filename}
                resultFileSize={watermarkResult.sizeAfter}
                downloadBtnLabel={tc.downloadWatermarked ?? (isFr ? 'Télécharger le PDF filigrané' : 'Download watermarked PDF')}
                resetBtnLabel={isFr ? 'Filigraner un autre document' : 'Watermark another document'}
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
        toolId="pdf-watermark"
        resultBlob={watermarkResult?.blob}
        resultFilename={watermarkResult?.filename}
      />
    </ToolPageLayout>
  );
}
