import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { BookOpen } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { pdfToEpubEngine } from '@/engine/engines/pdf-to-epub-engine';
import { getSourceFormat, getTargetFormat } from '@/lib/pdf-to-epub-logic';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  TextPreviewDialog,
  DocumentNextActionModal,
  ReciprocalTitle,
} from '@/components/conversion';

export default function PdfToEpub() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToEpub ?? {};
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
    engine: pdfToEpubEngine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-to-epub',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  // Extract plain text preview dynamically from the generated EPUB archive
  useEffect(() => {
    let isCancelled = false;
    if (result?.data) {
      import('jszip')
        .then(({ default: JSZip }) => JSZip.loadAsync(result.data))
        .then(async (zip) => {
          const xhtmlFiles = Object.keys(zip.files)
            .filter((f) => f.startsWith('EPUB/chapter_') && f.endsWith('.xhtml'))
            .sort();
          let fullText = '';
          for (const fname of xhtmlFiles) {
            const raw = await zip.files[fname].async('text');
            const clean = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
            if (clean) fullText += clean + '\n\n';
          }
          if (!isCancelled) setExtractedText(fullText.trim());
        })
        .catch(() => {
          if (!isCancelled) setExtractedText('');
        });
    } else {
      setExtractedText('');
    }
    return () => {
      isCancelled = true;
    };
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
    if (result?.data && result.filename) {
      downloadBlob(result.data, result.filename);
      setIsNextActionOpen(true);
    }
  }, [result]);

  const title = t.tools['pdf-to-epub']?.title ?? (isFr ? 'PDF en EPUB' : 'PDF to EPUB');
  const desc =
    t.tools['pdf-to-epub']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en livres numériques EPUB fluides et adaptatifs.'
      : 'Convert PDF documents into flowable EPUB e-books.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-epub"
          isFr={isFr}
          getCurrentFile={() => inputFile}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-epub"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs font-semibold underline ml-4 hover:opacity-80"
              >
                {isFr ? 'Ignorer' : 'Dismiss'}
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en livre numérique EPUB (.epub).'
                    : 'or click to browse your folders and convert to an EPUB e-book (.epub).'
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en EPUB' : 'Convert to EPUB')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
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
                statusLabel={tc.converting ?? (isFr ? 'Génération du livre EPUB en cours...' : 'Generating EPUB e-book...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT WITH QUICK COPY & PREVIEW ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.resultSize}
                downloadBtnLabel={tc.downloadEpub ?? (isFr ? 'Télécharger le fichier .epub' : 'Download .epub file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                downloadBtnColor="#558B2F"
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <>
                    <CopyButton
                      text={extractedText}
                      label={isFr ? 'Copier le texte' : 'Copy text'}
                      copiedLabel={isFr ? 'Copié !' : 'Copied!'}
                      variant="pill"
                      className="h-12 px-6 text-sm font-sans"
                    />

                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(true)}
                      className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[color,background-color,border-color,opacity,box-shadow,transform] flex items-center gap-2.5 shadow-sm cursor-pointer"
                    >
                      <BookOpen size={16} strokeWidth={2.2} />
                      <span>{isFr ? 'Aperçu du contenu' : 'Content preview'}</span>
                    </button>
                  </>
                }
              />
            )}
          </AnimatePresence>

          {/* Shadcn EPUB Book Preview Dialog Modal */}
          {result && (
            <TextPreviewDialog
              open={isPreviewOpen}
              onOpenChange={setIsPreviewOpen}
              filename={result.filename}
              text={extractedText}
              formatTag="EPUB 3.0 · E-Book"
              onDownload={handleDownload}
              copyLabel={isFr ? 'Copier le texte' : 'Copy text'}
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              downloadLabel={tc.downloadEpub ?? (isFr ? 'Télécharger le fichier .epub' : 'Download .epub file')}
            />
          )}

          {/* Continuum Next Action Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-epub"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.data}
            resultFilename={result?.filename}
            formatType="epub"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
