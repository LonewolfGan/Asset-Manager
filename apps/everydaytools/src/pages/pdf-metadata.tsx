import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { formatBytes } from '@/lib/utils';
import { AlertCircle } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import {
  SOURCE_FORMAT,
  TARGET_FORMAT,
  QUICK_TAG_SUGGESTIONS,
} from '@/lib/pdf-metadata-logic';
import { usePdfMetadataWorkflow } from '@/hooks/use-pdf-metadata-workflow';
import { PdfMetadataWorkshop } from '@/components/pdf-metadata/PdfMetadataWorkshop';

export default function PdfMetadata() {
  const { t, isFr } = useLocale();
  const tc = t.pdfMetadata;

  const {
    file,
    pageCount,
    creationDate,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    form,
    handleReset,
    validateAndLoadFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSave,
    handleDownload,
  } = usePdfMetadataWorkflow(isFr);

  const quickTagSuggestions = isFr
    ? QUICK_TAG_SUGGESTIONS
    : ['Report', 'Contract', 'Invoice', '2026', 'Official', 'Documentation', 'Confidential', 'Audit'];

  const titleText =
    t.tools['pdf-metadata']?.title ?? (isFr ? 'Modifier les métadonnées PDF' : 'Edit PDF Metadata');
  const descText =
    t.tools['pdf-metadata']?.description ??
    (isFr
      ? 'Consultez et modifiez les informations de vos documents PDF (titre, auteur, sujet, mots-clés, date, langue).'
      : 'View and edit your PDF document properties (title, author, subject, keywords, date, language).');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, titleText]}
      title={titleText}
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
            {!file && !result && !isProcessing && (
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
                  onFileSelected={validateAndLoadFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {file && !result && (
              <PdfMetadataWorkshop
                file={file}
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

            {result && !isProcessing && (
              <ConversionResult
                targetFormat={{
                  ...TARGET_FORMAT,
                  subLabel: tc?.readyBadge ?? (isFr ? 'Document PDF mis à jour' : 'Updated PDF Document'),
                }}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                resultMetadataText={`${formatBytes(result.sizeAfter)} · ${
                  isFr ? 'Propriétés enregistrées avec succès' : 'Properties saved successfully'
                }`}
                downloadBtnLabel={tc?.downloadPdf ?? (isFr ? 'Télécharger le PDF' : 'Download PDF')}
                downloadBtnColor="#FF6B35"
                resetBtnLabel={tc?.changeFile ?? (isFr ? 'Modifier un autre document' : 'Edit another document')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <NextActionModal
        toolId="pdf-metadata"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
