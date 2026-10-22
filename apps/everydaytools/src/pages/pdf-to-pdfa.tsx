import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfToPdfaEngine } from '@/engine/engines/pdf-to-pdfa-engine';
import {
  type PdfaConformance,
  getSourceFormat,
  getTargetFormat,
  buildPdfaFilename,
} from '@/lib/pdf-to-pdfa-logic';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
  ReciprocalTitle,
} from '@/components/conversion';
import { PdfaConformanceSwitcher } from '@/components/pdf-to-pdfa';
import { Eye } from 'lucide-react';

export default function PdfToPdfa() {
  const { t, isFr } = useLocale();
  const tc = t.pdfToPdfa ?? {};
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [conformance, setConformance] = useState<PdfaConformance>('2b');
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const engine = useMemo(
    () => createPdfToPdfaEngine({ conformance }),
    [conformance]
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
    toolSlug: 'pdf-to-pdfa',
    category: 'documents',
    autoConsumeHandoff: true,
  });

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
    if (result?.data && result.filename) {
      downloadBlob(result.data, result.filename);
      setTimeout(() => setIsNextActionOpen(true), 450);
    }
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (result?.data) {
      const url = URL.createObjectURL(result.data);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    }
  }, [result]);

  const title = t.tools['pdf-to-pdfa']?.title ?? (isFr ? 'PDF en PDF/A' : 'PDF to PDF/A');
  const desc =
    t.tools['pdf-to-pdfa']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF au standard ISO 19005 (PDF/A-2b, 1b, 3b) pour un archivage pérenne garanti.'
      : 'Convert PDF documents into ISO 19005 standard (PDF/A-2b, 1b, 3b) for guaranteed long-term preservation.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home ?? 'Home', t.nav.breadcrumb.pdf ?? 'PDF', title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-pdfa"
          isFr={isFr}
          getCurrentFile={() => inputFile ?? undefined}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-pdfa"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between text-sm">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 cursor-pointer"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (ConversionDropzone) ─── */}
            {!inputFile && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? "ou cliquez pour parcourir vos dossiers et convertir au format d'archivage pérenne ISO (PDF/A)."
                    : 'or click to browse your folders and convert to the long-term ISO archival format (PDF/A).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : STAGING NOBLE ET SÉLECTION DE CONFORMITÉ (ConversionStaging) ─── */}
            {inputFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={inputFile}
                targetFileName={buildPdfaFilename(inputFile.name, conformance)}
                targetSubLabel={`ISO 19005 PDF/A-${conformance.toUpperCase()}`}
                optionsSlot={
                  <PdfaConformanceSwitcher
                    conformance={conformance}
                    onConformanceChange={setConformance}
                    isFr={isFr}
                  />
                }
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en PDF/A' : 'Convert to PDF/A')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleExecute}
                onReset={handleReset}
              />
            )}

            {/* ─── SCÈNE 3 : CONDUIT CINÉTIQUE (ConversionConduit) ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={inputFile?.name}
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Standardisation ISO 19005 en cours...'
                    : 'ISO 19005 standardization in progress...')
                }
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT HÉROÏQUE ET TÉLÉCHARGEMENT DIRECT (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.resultSize}
                downloadBtnLabel={
                  tc.downloadPdfa ?? (isFr ? 'Télécharger le fichier PDF/A' : 'Download PDF/A file')
                }
                resetBtnLabel={
                  tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')
                }
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={handleOpenPreview}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[color,background-color,border-color,opacity,box-shadow,transform] flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    <Eye size={16} strokeWidth={2.2} />
                    <span>{isFr ? "Ouvrir l'aperçu PDF" : 'Open PDF preview'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        toolId="pdf-to-pdfa"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result ? new Blob([result.data], { type: result.mimeType }) : undefined}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
