import React, { useState, useCallback, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { downloadBlob } from '@/lib/download';
import { useToolWorkflow } from '@/engine/use-tool-workflow';
import { createPdfToImageEngine } from '@/engine/engines/pdf-to-image-engine';
import {
  type ImageFormat,
  getSourceFormat,
  getFormatConfigs,
} from '@/lib/pdf-to-image-logic';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  ImageNextActionModal,
  ReciprocalTitle,
} from '@/components/conversion';
import {
  PdfToImageFormatSwitcher,
  PdfToImageErrorBanner,
} from '@/components/pdf-to-image';

export default function PdfToImage() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToImage ?? {};
  const sourceFormat = getSourceFormat(isFr);
  const formatConfigs = getFormatConfigs(isFr);

  const [format, setFormat] = useState<ImageFormat>('png');
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const targetFormat = formatConfigs[format];

  const engine = useMemo(
    () => createPdfToImageEngine({ format, dpi: 150 }),
    [format]
  );

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
    engine,
    acceptedMimeTypes: ['application/pdf', '.pdf'],
    maxFileSizeBytes: 50 * 1024 * 1024,
    toolSlug: 'pdf-to-image',
    category: 'documents',
    autoConsumeHandoff: true,
  });

  const handleReset = useCallback(() => {
    baseReset();
    setIsDragging(false);
    setIsNextActionOpen(false);
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
      setTimeout(() => setIsNextActionOpen(true), 450);
    }
  }, [result]);

  const title = (t as any).tools?.['pdf-to-image']?.title ?? (isFr ? 'PDF en Images' : 'PDF to Image');
  const desc =
    (t as any).tools?.['pdf-to-image']?.description ??
    (isFr
      ? 'Convertissez vos pages PDF en images haute définition (PNG, JPG, WEBP).'
      : 'Convert PDF pages into crisp images in PNG, JPG, or WEBP.');

  const isZip = result?.filename.endsWith('.zip') ?? false;

  return (
    <ToolPageLayout
      breadcrumb={[(t as any).nav?.breadcrumb?.home ?? 'Home', (t as any).nav?.breadcrumb?.pdf ?? 'PDF', title]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-image"
          isFr={isFr}
          getCurrentFile={() => inputFile ?? undefined}
          fallbackTitle={title}
        />
      }
      description={desc}
      seoSlug="pdf-to-image"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Banner */}
          <PdfToImageErrorBanner
            error={error}
            onClear={() => setError(null)}
            closeLabel={isFr ? 'Fermer' : 'Close'}
          />

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (ConversionDropzone) ─── */}
            {!inputFile && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos fichiers et convertir vos pages en images haute définition (PNG, JPG, WEBP).'
                    : 'or click to browse your files and convert your pages into high-definition images (PNG, JPG, WEBP).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={handleFileSelect}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : ATELIER STAGING NOBLE (ConversionStaging) ─── */}
            {inputFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={inputFile}
                targetFileName={
                  inputFile.name.replace(/\.[^/.]+$/, '') +
                  `_images.${targetFormat.extension}`
                }
                targetSubLabel={targetFormat.subLabel}
                optionsSlot={
                  <PdfToImageFormatSwitcher
                    format={format}
                    onFormatChange={setFormat}
                    formatConfigs={formatConfigs}
                  />
                }
                convertBtnLabel={tc.convertBtn ?? (isFr ? `Convertir en ${targetFormat.name}` : `Convert to ${targetFormat.name}`)}
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
                statusLabel={tc.converting ?? (isFr ? 'Extraction des images en cours...' : 'Extracting images...')}
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT ET TÉLÉCHARGEMENT DIRECT (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.resultSize}
                downloadBtnLabel={
                  isZip
                    ? (isFr ? 'Télécharger le pack ZIP des images' : 'Download images ZIP archive')
                    : (isFr ? `Télécharger l'image ${targetFormat.name}` : `Download ${targetFormat.name} image`)
                }
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pdf-to-image"
        file={result && !isZip ? new File([result.data], result.filename, { type: result.mimeType }) : null}
      />
    </ToolPageLayout>
  );
}
