import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { AlertCircle } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import {
  BASE_SOURCE_FORMAT,
  BASE_TARGET_FORMAT,
  formatPageNumberLabel,
  getPositionOptions,
  getFormatOptions,
} from '@/lib/pdf-page-numbers-logic';
import { usePdfPagePreview } from '@/hooks/use-pdf-page-preview';
import { usePdfPageNumbersWorkflow } from '@/hooks/use-pdf-page-numbers-workflow';
import { PdfPageNumbersWorkbench } from '@/components/pdf-page-numbers';

export default function PdfPageNumbers() {
  const { t, isFr } = useLocale();
  const tc = t.pdfPageNumbers;

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

  const workflow = usePdfPageNumbersWorkflow({
    isFr,
    tc,
    onResetExtra: () => preview.resetPreview(),
  });

  const preview = usePdfPagePreview(workflow.file, workflow.skipFirst);

  const handleToggleSkipFirst = () => {
    workflow.handleToggleSkipFirst();
    if (!workflow.skipFirst && preview.previewPage === 1 && preview.totalPages && preview.totalPages > 1) {
      preview.handlePageChange(2);
    }
  };

  const positionOptions = useMemo(() => getPositionOptions(tc, isFr), [tc, isFr]);
  const formatOptions = useMemo(() => getFormatOptions(isFr), [isFr]);

  const stampLabel = useMemo(
    () =>
      formatPageNumberLabel({
        format: workflow.format,
        previewPage: preview.previewPage,
        startNum: workflow.startNum,
        skipFirst: workflow.skipFirst,
        totalPages: preview.totalPages,
        isFr,
      }),
    [workflow.format, preview.previewPage, workflow.startNum, workflow.skipFirst, preview.totalPages, isFr]
  );

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.pdf,
        t.tools['pdf-page-numbers']?.title ?? 'Add Page Numbers',
      ]}
      title={t.tools['pdf-page-numbers']?.title ?? 'Numéroter le PDF'}
      description={
        t.tools['pdf-page-numbers']?.description ??
        'Insérez une pagination vectorielle calibrée avec contrôle d’emplacement, typographie et couverture.'
      }
      seoSlug="pdf-page-numbers"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Alerte d'erreur */}
          <AnimatePresence>
            {workflow.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm w-full shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{workflow.error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => workflow.setError(null)}
                  className="text-xs font-mono font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ ─── */}
            {!workflow.file && !workflow.result && !workflow.isProcessing && (
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
                  isDragging={workflow.isDragging}
                  onFileSelected={workflow.validateAndSetFile}
                  onDragOver={workflow.handleDragOver}
                  onDragLeave={workflow.handleDragLeave}
                  onDrop={workflow.handleDrop}
                />
              </div>
            )}

            {/* ─── SCÈNE 2 : L'ATELIER DE NUMÉROTATION (PLEINE LARGEUR, ZÉRO BOX SLOP) ─── */}
            {workflow.file && !workflow.result && (
              <PdfPageNumbersWorkbench
                file={workflow.file}
                sourceFormat={sourceFormat}
                totalPages={preview.totalPages}
                isProcessing={workflow.isProcessing}
                isFr={isFr}
                tc={tc}
                onReset={workflow.handleReset}
                onConvert={workflow.handleConvert}
                position={workflow.position}
                setPosition={workflow.setPosition}
                format={workflow.format}
                setFormat={workflow.setFormat}
                startNum={workflow.startNum}
                setStartNum={workflow.setStartNum}
                fontSize={workflow.fontSize}
                setFontSize={workflow.setFontSize}
                skipFirst={workflow.skipFirst}
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

            {/* ─── SCÈNE 3 : RÉSULTAT & TÉLÉCHARGEMENT DIRECT ─── */}
            {workflow.result && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={workflow.result.filename}
                resultFileSize={workflow.result.sizeAfter}
                downloadBtnLabel={tc.downloadNumbered ?? (isFr ? 'Télécharger le PDF numéroté' : 'Download numbered PDF')}
                resetBtnLabel={isFr ? 'Numéroter un autre document' : 'Number another document'}
                onDownload={workflow.handleDownload}
                onReset={workflow.handleReset}
                downloadBtnColor="#FF6B35"
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        isOpen={workflow.isNextActionOpen}
        onClose={() => workflow.setIsNextActionOpen(false)}
        toolId="pdf-page-numbers"
        resultBlob={workflow.result?.blob}
        resultFilename={workflow.result?.filename}
      />
    </ToolPageLayout>
  );
}
