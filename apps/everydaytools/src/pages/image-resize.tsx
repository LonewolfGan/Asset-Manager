import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { ConversionDropzone, ImageNextActionModal } from '@/components/conversion';
import { IMAGE_FORMAT, getStandardPresets } from '@/lib/image-resize-logic';
import { useImageResizeWorkflow } from '@/hooks/use-image-resize-workflow';
import { ImageResizeWorkbench } from '@/components/image-resize/ImageResizeWorkbench';
import { ImageResizeResultScene } from '@/components/image-resize/ImageResizeResultScene';

export default function ImageResize() {
  const { t, isFr } = useLocale();
  const standardPresets = useMemo(() => getStandardPresets(isFr), [isFr]);

  const {
    file,
    previewUrl,
    resultPreviewUrl,
    origW,
    origH,
    isDragging,
    isProcessing,
    error,
    setError,
    result,
    isNextActionOpen,
    setIsNextActionOpen,
    dimensions,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleProcessResize,
    handleDownload,
    handleFullReset,
    handleBackToEditor,
  } = useImageResizeWorkflow(isFr);

  const titleText =
    t.tools?.['image-resize']?.title ?? (isFr ? 'Redimensionner une image' : 'Resize Image');
  const descText =
    t.tools?.['image-resize']?.description ??
    (isFr
      ? 'Redimensionnez vos images en pixels ou en pourcentage avec un atelier visuel réactif en direct.'
      : 'Resize your images in pixels or percentage with a live reactive visual workbench.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav?.breadcrumb?.home ?? (isFr ? 'Accueil' : 'Home'),
        isFr ? 'Outils Image' : 'Image Tools',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="image-resize"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Alerte Erreur */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-5xl mx-auto shadow-xs"
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
            {/* SCÈNE 1 : DROPZONE CANONIQUE */}
            {!file && (
              <motion.div
                key="dropzone-scene"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                className="w-full max-w-5xl mx-auto"
              >
                <ConversionDropzone
                  sourceFormat={IMAGE_FORMAT}
                  title={titleText}
                  description={
                    isFr
                      ? 'Glissez-déposez votre image ici (JPEG, PNG, WebP, AVIF) ou cliquez pour parcourir votre appareil.'
                      : 'Drag and drop your image here (JPEG, PNG, WebP, AVIF) or click to browse your device.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une image' : 'Select an image'}
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  isDragging={isDragging}
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </motion.div>
            )}

            {/* SCÈNE 2 : L'ATELIER STUDIO OUVERT */}
            {file && !result && (
              <ImageResizeWorkbench
                key="studio-scene"
                file={file}
                previewUrl={previewUrl}
                origW={origW}
                origH={origH}
                mode={dimensions.mode}
                onModeChange={dimensions.setMode}
                width={dimensions.width}
                height={dimensions.height}
                onWidthChange={dimensions.handleWidthChange}
                onHeightChange={dimensions.handleHeightChange}
                lockRatio={dimensions.lockRatio}
                onToggleLockRatio={() => dimensions.setLockRatio(!dimensions.lockRatio)}
                percentage={dimensions.percentage}
                onPercentageChange={dimensions.handlePercentageChange}
                selectedPresetId={dimensions.selectedPresetId}
                standardPresets={standardPresets}
                onPresetSelect={dimensions.handlePresetSelect}
                onResetDimensions={dimensions.handleResetDimensions}
                targetW={dimensions.targetW}
                targetH={dimensions.targetH}
                isModified={dimensions.isModified}
                visualScaleFactor={dimensions.visualScaleFactor}
                targetRatioLabel={dimensions.targetRatioLabel}
                isProcessing={isProcessing}
                onFullReset={handleFullReset}
                onProcessResize={handleProcessResize}
                isFr={isFr}
              />
            )}

            {/* SCÈNE 3 : SCÈNE DE RÉSULTAT COMPACTE & DIRECTE */}
            {file && result && !isProcessing && (
              <ImageResizeResultScene
                key="result-scene"
                result={result}
                resultPreviewUrl={resultPreviewUrl}
                origW={origW}
                origH={origH}
                originalRatioLabel={dimensions.originalRatioLabel}
                onDownload={handleDownload}
                onBackToEditor={handleBackToEditor}
                onFullReset={handleFullReset}
                isFr={isFr}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        toolId="image-resize"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
