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
  getWatermarkPresets,
} from '@/lib/pdf-watermark-logic';
import { usePdfPagePreview } from '@/hooks/use-pdf-page-preview';
import { usePdfWatermarkWorkflow } from '@/hooks/use-pdf-watermark-workflow';
import { PdfWatermarkWorkbench } from '@/components/pdf-watermark';

export default function PdfWatermark() {
  const { t, isFr } = useLocale();
  const tc = t.pdfWatermark;

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

  const workflow = usePdfWatermarkWorkflow({
    isFr,
    tc,
    onResetExtra: () => preview.resetPreview(),
  });

  const preview = usePdfPagePreview(workflow.file);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.pdf,
        t.tools['pdf-watermark']?.title ?? 'Watermark PDF',
      ]}
      title={t.tools['pdf-watermark']?.title ?? 'Ajouter un filigrane au PDF'}
      description={
        t.tools['pdf-watermark']?.description ??
        'Incrustez un filigrane textuel vectoriel personnalisé avec contrôle d’orientation, opacité et typographie.'
      }
      seoSlug="pdf-watermark"
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
                      ? 'ou cliquez pour parcourir vos fichiers et configurer votre filigrane de sécurité.'
                      : 'or click to browse your files and configure your security watermark.'
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

            {/* ─── SCÈNE 2 : L'ATELIER DE FILIGRANE (PLEINE LARGEUR, ZÉRO BOX SLOP) ─── */}
            {workflow.file && !workflow.result && (
              <PdfWatermarkWorkbench
                file={workflow.file}
                sourceFormat={sourceFormat}
                totalPages={preview.totalPages}
                isProcessing={workflow.isProcessing}
                isFr={isFr}
                tc={tc}
                onReset={workflow.handleReset}
                onConvert={workflow.handleConvert}
                text={workflow.text}
                setText={workflow.setText}
                presetTexts={presetTexts}
                pattern={workflow.pattern}
                setPattern={workflow.setPattern}
                colorHex={workflow.colorHex}
                setColorHex={workflow.setColorHex}
                fontSize={workflow.fontSize}
                setFontSize={workflow.setFontSize}
                opacity={workflow.opacity}
                setOpacity={workflow.setOpacity}
                angle={workflow.angle}
                setAngle={workflow.setAngle}
                pagesScope={workflow.pagesScope}
                setPagesScope={workflow.setPagesScope}
                pagePreviewUrl={preview.pagePreviewUrl}
                previewPage={preview.previewPage}
                isLoadingPreview={preview.isLoadingPreview}
                onPageChange={preview.handlePageChange}
              />
            )}

            {/* ─── SCÈNE 3 : RÉSULTAT & TÉLÉCHARGEMENT DIRECT ─── */}
            {workflow.result && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={workflow.result.filename}
                resultFileSize={workflow.result.sizeAfter}
                downloadBtnLabel={tc.downloadWatermarked ?? (isFr ? 'Télécharger le PDF filigrané' : 'Download watermarked PDF')}
                resetBtnLabel={isFr ? 'Filigraner un autre document' : 'Watermark another document'}
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
        toolId="pdf-watermark"
        resultBlob={workflow.result?.blob}
        resultFilename={workflow.result?.filename}
      />
    </ToolPageLayout>
  );
}
