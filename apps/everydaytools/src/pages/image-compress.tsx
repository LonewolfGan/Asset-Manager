import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { useFileDrop } from '@/hooks/use-file-drop';
import {
  ConversionDropzone,
  ImageNextActionModal,
  type ConversionFormat,
} from '@/components/conversion';
import { ProcessingAperture } from '@/components/conversion/ProcessingAperture';
import { getCompressionPresets } from '@/lib/image-compress-logic';
import { useImageCompressWorkflow } from '@/hooks/use-image-compress-workflow';
import {
  ImageCompressWorkbench,
  ImageCompressResultView,
} from '@/components/image-compress';
import { formatBytes } from '@/lib/utils';

const IMAGE_FORMAT: ConversionFormat = {
  name: 'Image',
  extension: 'jpg',
  icon: '/icons/image.svg',
  color: '#FF6B35',
  subLabel: 'JPEG, PNG, WebP, AVIF',
};

export default function ImageCompress() {
  const { t, isFr } = useLocale();
  const presets = getCompressionPresets(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const file = files[0];

  const workflow = useImageCompressWorkflow(file, presets, isFr);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const isImage =
        selectedFile.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|avif)$/i.test(selectedFile.name);

      if (!isImage) {
        workflow.setError(
          isFr
            ? 'Veuillez sélectionner un fichier image valide (JPEG, PNG, WebP, AVIF).'
            : 'Please select a valid image file (JPEG, PNG, WebP, AVIF).'
        );
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        workflow.setError(
          isFr
            ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
            : 'The file exceeds the maximum allowed size of 50 MB.'
        );
        return;
      }

      workflow.resetWorkflow();
      setFiles([selectedFile]);
    },
    [isFr, workflow]
  );

  const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useFileDrop({
    onFileSelected: validateAndSetFile,
    accept: 'image/jpeg,image/png,image/webp,image/avif',
  });

  // Check for pending handoff file from previous workflow step
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
    }
  }, [validateAndSetFile]);

  const handleReset = useCallback(() => {
    setFiles([]);
    workflow.resetWorkflow();
    setIsNextActionOpen(false);
  }, [workflow]);

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        isFr ? 'Outils Image' : 'Image Tools',
        t.tools['image-compress']?.title ?? (isFr ? 'Compresser une image' : 'Compress Image'),
      ]}
      title={t.tools['image-compress']?.title ?? (isFr ? 'Compresser une image' : 'Compress Image')}
      description={
        t.tools['image-compress']?.description ??
        (isFr
          ? 'Réduisez la taille de votre image tout en conservant une excellente netteté visuelle.'
          : 'Reduce your image file size while keeping high visual clarity.')
      }
      seoSlug="image-compress"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Banner */}
          <AnimatePresence>
            {workflow.error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0 text-red-500" />
                  <span className="font-medium">{workflow.error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => workflow.setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* Scène 1 : Dropzone Pleine Largeur */}
            {!file && !workflow.result && !workflow.isProcessing && (
              <ConversionDropzone
                sourceFormat={IMAGE_FORMAT}
                title={t.tools['image-compress']?.title ?? (isFr ? 'Compresser une image' : 'Compress Image')}
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
            )}

            {/* Scène 2 : L'atelier de calibrage */}
            {file && !workflow.result && !workflow.isProcessing && (
              <ImageCompressWorkbench
                key="staging-atelier"
                file={file}
                format={IMAGE_FORMAT}
                presets={presets}
                level={workflow.level}
                isFr={isFr}
                onLevelChange={workflow.setLevel}
                onReset={handleReset}
                onCompress={workflow.handleCompress}
              />
            )}

            {/* Scène 3 : Aperture optique cinétique centralisée avec télémétrie fluide */}
            {workflow.isProcessing && (
              <div key="processing-aperture" className="w-full py-20 flex justify-center">
                <ProcessingAperture
                  formatIcon={IMAGE_FORMAT.icon}
                  formatAlt="Image"
                  stageLabel={isFr ? 'Compression en cours' : 'Compressing'}
                  title={
                    workflow.liveBytes > 0
                      ? isFr
                        ? `Optimisation : ${formatBytes(workflow.liveBytes)}`
                        : `Optimizing: ${formatBytes(workflow.liveBytes)}`
                      : isFr
                      ? 'Réduction du poids en cours...'
                      : 'Reducing file size...'
                  }
                  detail={
                    file
                      ? isFr
                        ? `Poids source : ${formatBytes(file.size)}`
                        : `Original size: ${formatBytes(file.size)}`
                      : undefined
                  }
                />
              </div>
            )}

            {/* Scène 4 : Résultat monumental */}
            {workflow.result && !workflow.isProcessing && (
              <ImageCompressResultView
                key="result-showcase"
                result={workflow.result}
                formatIcon={IMAGE_FORMAT.icon}
                isFr={isFr}
                t={t}
                onReset={handleReset}
                onOpenNextAction={() => setIsNextActionOpen(true)}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="image-compress"
        resultBlob={workflow.result?.blob}
        resultFilename={workflow.result?.filename}
      />
    </ToolPageLayout>
  );
}
