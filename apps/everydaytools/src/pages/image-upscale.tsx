import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { ConversionDropzone, ImageNextActionModal } from '@/components/conversion';
import { IMAGE_FORMAT } from '@/lib/image-upscale-logic';
import { useImageUpscaleLoupe } from '@/hooks/use-image-upscale-loupe';
import { useImageUpscaleWorkflow } from '@/hooks/use-image-upscale-workflow';
import { ImageUpscaleWorkbench } from '@/components/image-upscale';

export default function ImageUpscalePage() {
  const { t, isFr } = useLocale();

  const {
    isLoupeActive,
    loupePos,
    stageImageRef,
    toggleLoupe,
    resetLoupe,
    handleStagePointerMove,
    handleStagePointerLeave,
  } = useImageUpscaleLoupe();

  const {
    file,
    previewUrl,
    resultUrl,
    resultBlob,
    origDims,
    isDragging,
    scale,
    setScale,
    sharpen,
    setSharpen,
    isProcessing,
    error,
    setError,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUpscale,
    handleDownload,
    handleFullReset,
    handleBackToEditor,
    outputFilename,
    targetDims,
    sourceMp,
  } = useImageUpscaleWorkflow({ isFr, onResetLoupe: resetLoupe });

  const titleText =
    t.tools?.['image-upscale']?.title ?? (isFr ? 'Agrandir une image' : 'Upscale Image');
  const descText =
    t.tools?.['image-upscale']?.description ??
    (isFr
      ? 'Augmentez la définition de vos images en 2x ou 4x avec préservation de la netteté.'
      : 'Increase the resolution of your images by 2x or 4x while preserving sharpness.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav?.breadcrumb?.home ?? (isFr ? 'Accueil' : 'Home'),
        isFr ? 'Outils Image' : 'Image Tools',
        titleText,
      ]}
      title={titleText}
      description={descText}
      seoSlug="image-upscale"
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
                className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm max-w-5xl mx-auto"
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
            {/* ─── SCÈNE 1 : DROPZONE CANONIQUE (max-w-5xl mx-auto) ─── */}
            {!file ? (
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
                  title={isFr ? 'Agrandir une image' : 'Upscale an image'}
                  description={
                    isFr
                      ? 'Multipliez la résolution par 2x ou 4x sans perte de qualité.'
                      : 'Multiply resolution by 2x or 4x without quality loss.'
                  }
                  buttonLabel={isFr ? 'Sélectionner une image' : 'Select an image'}
                  accept="image/jpeg,image/png,image/webp,image/avif,image/tiff"
                  isDragging={isDragging}
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </motion.div>
            ) : (
              /* ─── SCÈNES 2 & 3 : ATELIER PLEINE LARGEUR & STUDIO D'INSPECTION ─── */
              <ImageUpscaleWorkbench
                file={file}
                previewUrl={previewUrl}
                resultUrl={resultUrl}
                resultBlob={resultBlob}
                origDims={origDims}
                targetDims={targetDims}
                sourceMp={sourceMp}
                outputFilename={outputFilename}
                scale={scale}
                onScaleChange={setScale}
                sharpen={sharpen}
                onSharpenChange={setSharpen}
                isProcessing={isProcessing}
                stageImageRef={stageImageRef}
                isLoupeActive={isLoupeActive}
                loupePos={loupePos}
                onToggleLoupe={toggleLoupe}
                onStagePointerMove={handleStagePointerMove}
                onStagePointerLeave={handleStagePointerLeave}
                onUpscale={handleUpscale}
                onDownload={handleDownload}
                onFullReset={handleFullReset}
                onBackToEditor={handleBackToEditor}
                isFr={isFr}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="image-upscale"
        file={
          resultBlob
            ? new File([resultBlob], outputFilename, {
                type: resultBlob.type || 'image/png',
              })
            : null
        }
      />
    </ToolPageLayout>
  );
}
