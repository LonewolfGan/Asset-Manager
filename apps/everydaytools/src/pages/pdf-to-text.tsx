import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye, AlertCircle } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { pdfToTextEngine } from '@/engine/engines/pdf-to-text-engine';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  DocumentNextActionModal,
  ReciprocalTitle,
  type ConversionFormat,
} from '@/components/conversion';

const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'TXT',
  extension: 'txt',
  icon: '/icons/txt.svg',
  color: '#4B5563',
  subLabel: isFr ? 'Texte brut UTF-8' : 'UTF-8 Plain Text',
});

export default function PdfToText() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToText ?? {};
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [extractedText, setExtractedText] = useState<string>('');

  const {
    inputFile,
    result,
    error,
    isProcessing,
    handleFileSelect,
    handleExecute,
    handleReset: baseReset,
    setError,
  } = useToolWorkflow<File, Blob>({
    engine: pdfToTextEngine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-to-text',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  // Extract raw text from result blob for preview dialog and quick-copy
  useEffect(() => {
    if (result?.data) {
      result.data.text().then((text) => setExtractedText(text)).catch(() => setExtractedText(''));
    } else {
      setExtractedText('');
    }
  }, [result]);

  const handleReset = useCallback(() => {
    baseReset();
    setIsDragging(false);
    setIsPreviewOpen(false);
    setIsNextActionOpen(false);
    setExtractedText('');
  }, [baseReset]);

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
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        handleFileSelect(droppedFiles[0]);
      }
    },
    [handleFileSelect]
  );

  const handleDownload = useCallback(() => {
    if (result?.data) {
      downloadBlob(result.data, result.filename ?? 'document.txt');
      setTimeout(() => {
        setIsNextActionOpen(true);
      }, 450);
    }
  }, [result]);

  const title = (t as any).tools?.['pdf-to-text']?.title ?? (isFr ? 'PDF en Texte' : 'PDF to Text');
  const desc =
    (t as any).tools?.['pdf-to-text']?.description ??
    (isFr
      ? 'Extrayez le texte brut de vos documents PDF de manière propre et rapide.'
      : 'Extract clean, editable plain text from PDF documents.');

  return (
    <ToolPageLayout
      breadcrumb={[(t as any).nav?.breadcrumb?.home ?? 'Home', (t as any).nav?.breadcrumb?.pdf ?? 'PDF', title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-text"
          isFr={isFr}
          getCurrentFile={() => inputFile ?? undefined}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-text"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {error && (
            <div
              role="alert"
              className="mb-6 p-4 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50/80 dark:bg-red-950/20 text-red-700 dark:text-red-300 flex items-center justify-between text-sm shadow-sm"
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs font-semibold px-2.5 py-1 rounded-md bg-red-100 hover:bg-red-200 dark:bg-red-900/50 dark:hover:bg-red-900 text-red-800 dark:text-red-200 transition-colors cursor-pointer"
              >
                {isFr ? 'Fermer' : 'Close'}
              </button>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!inputFile && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et extraire le texte brut en fichier TXT UTF-8.'
                    : 'or click to browse your folders and extract plain text into a UTF-8 TXT file.'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {inputFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={inputFile}
                convertBtnLabel={tc?.convertBtn ?? (isFr ? 'Extraire le texte brut' : 'Extract plain text')}
                changeFileBtnLabel={tc?.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleExecute}
                onReset={handleReset}
              />
            )}

            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={inputFile?.name}
                statusLabel={tc?.converting ?? (isFr ? 'Extraction du contenu texte...' : 'Extracting text content...')}
              />
            )}

            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename ?? 'document.txt'}
                resultFileSize={result.resultSize ?? 0}
                downloadBtnLabel={tc?.downloadTxt ?? (isFr ? 'Télécharger le fichier TXT' : 'Download TXT file')}
                resetBtnLabel={tc?.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    <CopyButton
                      text={extractedText}
                      label={tc?.copyText ?? (isFr ? 'Copier le texte' : 'Copy text')}
                      copiedLabel={tc?.copiedText ?? (isFr ? 'Copié !' : 'Copied!')}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[color,background-color,border-color,opacity,box-shadow,transform] flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{tc?.previewText ?? (isFr ? "Voir l'aperçu" : 'Preview text')}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {/* Text Preview Dialog Modal */}
          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename ?? 'document.txt'}
              text={extractedText}
              formatTag="TXT · UTF-8"
              onDownload={handleDownload}
              copyLabel={tc?.copyText ?? (isFr ? 'Copier tout le texte' : 'Copy all text')}
              copiedLabel={tc?.copiedText ?? (isFr ? 'Copié !' : 'Copied!')}
              downloadLabel={tc?.downloadTxt ?? (isFr ? 'Télécharger le fichier TXT' : 'Download TXT file')}
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-text"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.data}
            resultFilename={result?.filename}
            formatType="txt"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
