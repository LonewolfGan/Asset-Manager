import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { formatBytes } from '@/lib/utils';
import { AlertCircle, Eye } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
  ReciprocalTitle,
} from '@/components/conversion';
import {
  SOURCE_FORMAT,
  TARGET_FORMAT,
  QUICK_TAG_SUGGESTIONS,
  parsePdfMetadata,
} from '@/lib/pdf-metadata-logic';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfMetadataEngine } from '@/engine/engines/pdf-metadata-engine';
import { usePdfMetadataForm } from '@/hooks/use-pdf-metadata-form';
import { PdfMetadataWorkshop } from '@/components/pdf-metadata/PdfMetadataWorkshop';
import { downloadBlob } from '@/lib/download';

export default function PdfMetadata() {
  const { t, isFr } = useLocale();
  const tc = t.pdfMetadata;
  const form = usePdfMetadataForm();
  const { setFormData, resetForm } = form;

  const [pageCount, setPageCount] = useState<number | null>(null);
  const [creationDate, setCreationDate] = useState<Date | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const engine = useMemo(
    () => createPdfMetadataEngine({ metadata: form.getFormData() }),
    [form]
  );

  const {
    inputFile,
    result,
    isProcessing,
    progress,
    error,
    handleFileSelect,
    handleExecute,
    handleReset: resetWorkflow,
    setError,
  } = useToolWorkflow<File, Blob>({
    engine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-metadata',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  const handleReset = useCallback(() => {
    resetWorkflow();
    resetForm();
    setPageCount(null);
    setCreationDate(null);
    setIsNextActionOpen(false);
  }, [resetWorkflow, resetForm]);

  useEffect(() => {
    if (!inputFile) {
      setPageCount(null);
      setCreationDate(null);
      resetForm();
      return;
    }

    let active = true;
    inputFile
      .arrayBuffer()
      .then((buf) => {
        if (!active) return;
        return parsePdfMetadata(buf).then((parsed) => {
          if (!active) return;
          setPageCount(parsed.pageCount);
          setCreationDate(parsed.creationDate);
          setFormData(parsed.form, parsed.initialValues);
        });
      })
      .catch((err: unknown) => {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : isFr
              ? 'Impossible de lire les métadonnées de ce document PDF.'
              : 'Unable to read metadata from this PDF document.'
          );
        }
      });

    return () => {
      active = false;
    };
  }, [inputFile, setFormData, resetForm, isFr, setError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) handleFileSelect(droppedFile);
    },
    [handleFileSelect]
  );

  const handleSave = useCallback(async () => {
    const res = await handleExecute();
    if (res?.data) setTimeout(() => setIsNextActionOpen(true), 450);
  }, [handleExecute]);

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

  const quickTagSuggestions = isFr
    ? QUICK_TAG_SUGGESTIONS
    : ['Report', 'Contract', 'Invoice', '2026', 'Official', 'Documentation', 'Confidential', 'Audit'];

  const titleText = t.tools['pdf-metadata']?.title ?? (isFr ? 'Modifier les métadonnées PDF' : 'Edit PDF Metadata');
  const descText = t.tools['pdf-metadata']?.description ?? (isFr
    ? 'Consultez et modifiez les informations de vos documents PDF (titre, auteur, sujet, mots-clés, date, langue).'
    : 'View and edit your PDF document properties (title, author, subject, keywords, date, language).');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, titleText]}
      title={<ReciprocalTitle currentSlug="pdf-metadata" isFr={isFr} getCurrentFile={() => inputFile ?? undefined} fallbackTitle={titleText} />}
      description={descText}
      seoSlug="pdf-metadata"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm w-full shadow-sm"
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
            {!inputFile && !result && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto" key="dropzone-scene">
                <ConversionDropzone
                  sourceFormat={{
                    ...SOURCE_FORMAT,
                    subLabel: isFr ? 'Document PDF' : 'PDF Document',
                  }}
                  title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                  description={
                    isFr
                      ? 'ou cliquez pour parcourir vos fichiers et modifier les propriétés de votre document (titre, auteur, sujet, mots-clés, date, langue).'
                      : 'or click to browse your files and edit your document properties (title, author, subject, keywords, date, language).'
                  }
                  buttonLabel={isFr ? 'Sélectionner un document PDF' : 'Select a PDF document'}
                  isDragging={isDragging}
                  onFileSelected={handleFileSelect}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {inputFile && !result && !isProcessing && (
              <PdfMetadataWorkshop
                key="workshop-staging"
                file={inputFile}
                pageCount={pageCount}
                creationDate={creationDate}
                isProcessing={isProcessing}
                onReset={handleReset}
                onSave={handleSave}
                form={form}
                quickTagSuggestions={quickTagSuggestions}
                isFr={isFr}
              />
            )}

            {isProcessing && (
              <ConversionConduit
                sourceFormat={SOURCE_FORMAT}
                targetFormat={TARGET_FORMAT}
                fileName={inputFile?.name}
                statusLabel={
                  tc?.saving ??
                  (isFr ? 'Écriture des métadonnées…' : 'Writing updated metadata…')
                }
              />
            )}

            {result && !isProcessing && (
              <div className="w-full max-w-4xl mx-auto" key="result-scene">
                <ConversionResult
                  targetFormat={{
                    ...TARGET_FORMAT,
                    subLabel: tc?.readyBadge ?? (isFr ? 'Document PDF mis à jour' : 'Updated PDF Document'),
                  }}
                  resultFileName={result.filename ?? 'document_metadata.pdf'}
                  resultFileSize={result.resultSize ?? result.data?.size ?? 0}
                  resultMetadataText={`${formatBytes(result.resultSize ?? result.data?.size ?? 0)} · ${
                    isFr ? 'Propriétés enregistrées avec succès' : 'Properties saved successfully'
                  }`}
                  downloadBtnLabel={tc?.downloadPdf ?? (isFr ? 'Télécharger le PDF' : 'Download PDF')}
                  downloadBtnColor="#FF6B35"
                  resetBtnLabel={tc?.changeFile ?? (isFr ? 'Modifier un autre document' : 'Edit another document')}
                  onDownload={handleDownload}
                  onReset={handleReset}
                  extraActions={
                    <button
                      type="button"
                      onClick={handleOpenPreview}
                      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>{isFr ? 'Aperçu' : 'Preview'}</span>
                    </button>
                  }
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        toolId="pdf-metadata"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.data}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
