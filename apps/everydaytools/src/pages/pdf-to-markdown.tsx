import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye, AlertCircle } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { pdfToMarkdownEngine } from '@/engine/engines/pdf-to-markdown-engine';
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
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: isFr ? 'Format CommonMark / GFM' : 'CommonMark / GFM',
});

export default function PdfToMarkdown() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToMarkdown ?? {};
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [extractedMarkdown, setExtractedMarkdown] = useState<string>('');

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
    engine: pdfToMarkdownEngine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-to-markdown',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  // Extract raw markdown text from result blob for preview dialog and quick-copy
  useEffect(() => {
    if (result?.data) {
      result.data.text().then((text) => setExtractedMarkdown(text)).catch(() => setExtractedMarkdown(''));
    } else {
      setExtractedMarkdown('');
    }
  }, [result]);

  const handleReset = useCallback(() => {
    baseReset();
    setIsDragging(false);
    setIsPreviewOpen(false);
    setIsNextActionOpen(false);
    setExtractedMarkdown('');
  }, [baseReset]);

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
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) handleFileSelect(droppedFiles[0]);
    },
    [handleFileSelect]
  );

  const handleDownload = useCallback(() => {
    if (result?.data) {
      downloadBlob(result.data, result.filename ?? 'document.md');
      setTimeout(() => setIsNextActionOpen(true), 450);
    }
  }, [result]);

  const title = (t as any).tools?.['pdf-to-markdown']?.title ?? (isFr ? 'PDF en Markdown' : 'PDF to Markdown');
  const desc =
    (t as any).tools?.['pdf-to-markdown']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en fichiers Markdown (.md) structurés.'
      : 'Convert PDF documents into formatted Markdown (.md).');

  return (
    <ToolPageLayout
      breadcrumb={[(t as any).nav?.breadcrumb?.home ?? 'Home', (t as any).nav?.breadcrumb?.pdf ?? 'PDF', title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-markdown"
          isFr={isFr}
          getCurrentFile={() => inputFile ?? undefined}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-markdown"
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en Markdown structuré (.md).'
                    : 'or click to browse your folders and convert to structured Markdown (.md).'
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
                convertBtnLabel={tc?.convertBtn ?? (isFr ? 'Convertir en Markdown' : 'Convert to Markdown')}
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
                statusLabel={tc?.converting ?? (isFr ? 'Conversion en Markdown en cours...' : 'Converting to Markdown...')}
              />
            )}

            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename ?? 'document.md'}
                resultFileSize={result.resultSize ?? 0}
                downloadBtnLabel={tc?.downloadMd ?? (isFr ? 'Télécharger le fichier .md' : 'Download .md file')}
                resetBtnLabel={tc?.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    <CopyButton
                      text={extractedMarkdown}
                      label={tc?.copyMd ?? (isFr ? 'Copier le Markdown' : 'Copy Markdown')}
                      copiedLabel={tc?.copiedMd ?? (isFr ? 'Copié !' : 'Copied!')}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[color,background-color,border-color,opacity,box-shadow,transform] flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{tc?.previewText ?? (t as any).pdfToText?.previewText ?? (isFr ? "Voir l'aperçu" : 'Preview')}</span>
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
              filename={result.filename ?? 'document.md'}
              text={extractedMarkdown}
              formatTag="Markdown · UTF-8"
              onDownload={handleDownload}
              copyLabel={tc?.copyMd ?? (isFr ? 'Copier le Markdown' : 'Copy Markdown')}
              copiedLabel={tc?.copiedMd ?? (isFr ? 'Copié !' : 'Copied!')}
              downloadLabel={tc?.downloadMd ?? (isFr ? 'Télécharger le fichier .md' : 'Download .md file')}
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-markdown"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.data}
            resultFilename={result?.filename}
            formatType="md"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
