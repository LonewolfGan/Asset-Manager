import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye, AlertCircle } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { pdfToHtmlEngine } from '@/engine/engines/pdf-to-html-engine';
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
  name: 'HTML',
  extension: 'html',
  icon: '/icons/html.svg',
  color: '#E34F26',
  subLabel: isFr ? 'Page web HTML5' : 'HTML5 Webpage',
});

export default function PdfToHtml() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToHtml ?? {};
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [htmlOutput, setHtmlOutput] = useState<string>('');

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
    engine: pdfToHtmlEngine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-to-html',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  // Extract raw HTML text from result blob for preview dialog and quick-copy
  useEffect(() => {
    if (result?.data) {
      result.data.text().then((text) => setHtmlOutput(text)).catch(() => setHtmlOutput(''));
    } else {
      setHtmlOutput('');
    }
  }, [result]);

  const handleReset = useCallback(() => {
    baseReset();
    setIsDragging(false);
    setIsPreviewOpen(false);
    setIsNextActionOpen(false);
    setHtmlOutput('');
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
      downloadBlob(result.data, result.filename ?? 'document.html');
    }
  }, [result]);

  const title = t.tools['pdf-to-html']?.title ?? (isFr ? 'PDF en HTML' : 'PDF to HTML');
  const desc =
    t.tools['pdf-to-html']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en pages web HTML5 propres et réactives.'
      : 'Convert PDF documents into clean, responsive HTML web pages.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-html"
          isFr={isFr}
          getCurrentFile={() => inputFile ?? undefined}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-html"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">{isFr ? 'Erreur de conversion' : 'Conversion Error'}</span>
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs uppercase tracking-wider font-semibold opacity-70 hover:opacity-100 cursor-pointer"
              >
                {isFr ? 'Fermer' : 'Dismiss'}
              </button>
            </div>
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!inputFile && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en page HTML5 responsive (.html).'
                    : 'or click to browse your folders and convert to a responsive HTML5 page (.html).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {inputFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={inputFile}
                convertBtnLabel={tc?.convertBtn ?? (isFr ? 'Convertir en HTML' : 'Convert to HTML')}
                changeFileBtnLabel={tc?.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleExecute}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={inputFile?.name}
                statusLabel={tc?.converting ?? (isFr ? 'Génération de la page HTML5 en cours...' : 'Generating HTML5 page...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT WITH QUICK COPY & PREVIEW ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename ?? 'document.html'}
                resultFileSize={result.resultSize ?? 0}
                downloadBtnLabel={tc?.downloadHtml ?? (isFr ? 'Télécharger le fichier .html' : 'Download .html file')}
                resetBtnLabel={tc?.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    {/* Quick 1-Click Copy HTML Code Button */}
                    <CopyButton
                      text={htmlOutput}
                      label={isFr ? 'Copier le code HTML' : 'Copy HTML code'}
                      copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    {/* Shadcn Dialog Trigger: Voir l'aperçu du code */}
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[color,background-color,border-color,opacity,box-shadow,transform] flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <Eye size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Voir le code source' : 'View source code'}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {/* Shadcn HTML Source Preview Dialog Modal */}
          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename ?? 'document.html'}
              text={htmlOutput}
              formatTag="HTML5 · UTF-8"
              onDownload={handleDownload}
              copyLabel={isFr ? 'Copier le code HTML' : 'Copy HTML code'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              downloadLabel={tc?.downloadHtml ?? (isFr ? 'Télécharger le fichier .html' : 'Download .html file')}
            />
          )}

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-html"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.data}
            resultFilename={result?.filename}
            formatType="html"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
