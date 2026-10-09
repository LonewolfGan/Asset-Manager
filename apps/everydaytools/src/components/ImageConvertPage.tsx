import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { useFileDrop } from '@/hooks/use-file-drop';
import { useImageBatchConvert } from '@/hooks/use-image-batch-convert';
import { Slider } from '@/components/ui/slider';
import { Sliders } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
  ImageNextActionModal,
  BatchStagingGrid,
  BatchResultGallery,
  SingleImagePreview,
} from '@/components/conversion';

interface Props {
  fromLabel: string;
  fromExts: string[];
  fromMimes: string[];
  toMime: string;
  slug: string;
  breadcrumbParent?: string;
  trackUsed?: (toolSlug: string, category: string) => void;
  trackError?: (toolSlug: string, errorType: string) => void;
}

export default function ImageConvertPage({
  fromLabel,
  fromExts,
  fromMimes,
  toMime,
  slug,
  breadcrumbParent = 'Image Tools',
  trackUsed,
  trackError,
}: Props) {
  const { t, isFr } = useLocale();
  const toolTitle = t.tools[slug]?.title ?? slug;
  const toolDesc = t.tools[slug]?.description ?? '';

  const {
    toExt,
    sourceFormat,
    targetFormat,
    isPdfOutput,
    showQuality,
    files,
    isProcessing,
    quality,
    setQuality,
    isSingle,
    singleFile,
    allDone,
    doneCount,
    validateAndAddFiles,
    removeFile,
    handleResetAll,
    processAll,
    downloadOne,
    downloadAllZip,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadedPdf,
    downloadedImage,
  } = useImageBatchConvert({
    fromLabel,
    fromExts,
    fromMimes,
    toMime,
    slug,
    isFr,
    trackUsed,
    trackError,
  });

  const { isDragging, dropProps } = useFileDrop({
    onFilesSelected: validateAndAddFiles,
    accept: fromExts.join(','),
  });

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.image, toolTitle]}
      title={toolTitle}
      description={
        toolDesc ||
        (isFr
          ? `Convertissez vos fichiers ${fromLabel} en ${toExt.toUpperCase()} avec préservation optimale de la qualité.`
          : `Convert your ${fromLabel} files to ${toExt.toUpperCase()} with optimal quality retention.`)
      }
      seoSlug={slug}
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {files.length === 0 && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? `Glissez-déposez vos fichiers ${fromLabel}` : `Drag & drop your ${fromLabel} files`}
                description={
                  isFr
                    ? `ou cliquez pour parcourir vos dossiers et convertir vos images en format ${toExt.toUpperCase()} haute définition.`
                    : `or click to browse your folders and convert your images to high-definition ${toExt.toUpperCase()}.`
                }
                buttonLabel={isFr ? `Sélectionner des fichiers ${fromLabel}` : `Select ${fromLabel} files`}
                accept={fromExts.join(',')}
                multiple={true}
                isDragging={isDragging}
                onFilesSelected={validateAndAddFiles}
                onDragOver={dropProps.onDragOver}
                onDragLeave={dropProps.onDragLeave}
                onDrop={dropProps.onDrop}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {files.length > 0 && !allDone && !isProcessing && (
              <div className="space-y-6">
                {/* Single File Staging */}
                {isSingle && singleFile && (
                  <ConversionStaging
                    sourceFormat={sourceFormat}
                    targetFormat={targetFormat}
                    sourceFile={singleFile.file}
                    targetFileName={`${singleFile.file.name.replace(/\.[^/.]+$/, '')}.${toExt}`}
                    convertBtnLabel={isFr ? `Convertir en ${toExt.toUpperCase()}` : `Convert to ${toExt.toUpperCase()}`}
                    changeFileBtnLabel={isFr ? 'Changer de fichier' : 'Change file'}
                    optionsSlot={
                      showQuality ? (
                        <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-2 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                            <Sliders size={14} style={{ color: targetFormat.color }} />
                            <span>{isFr ? 'Qualité de compression' : 'Compression quality'}</span>
                          </div>
                          <div className="flex items-center gap-2.5 flex-1 max-w-xs">
                            <Slider
                              value={[quality]}
                              min={1}
                              max={100}
                              step={1}
                              onValueChange={([val]) => setQuality(val)}
                              className="flex-1"
                            />
                            <span className="font-mono text-xs font-semibold text-zinc-900 dark:text-zinc-100 min-w-[36px] text-right tabular-nums">
                              {quality}%
                            </span>
                          </div>
                        </div>
                      ) : undefined
                    }
                    onConvert={processAll}
                    onReset={handleResetAll}
                  />
                )}

                {/* Multiple Files (Batch) Staging */}
                {!isSingle && (
                  <BatchStagingGrid
                    files={files}
                    fromLabel={fromLabel}
                    toExt={toExt}
                    targetFormat={targetFormat}
                    showQuality={showQuality}
                    quality={quality}
                    onQualityChange={setQuality}
                    onRemoveFile={removeFile}
                    onAddFiles={validateAndAddFiles}
                    onConvertAll={processAll}
                    onResetAll={handleResetAll}
                    isFr={isFr}
                    fromExts={fromExts}
                  />
                )}
              </div>
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={
                  isSingle && singleFile
                    ? sourceFormat
                    : {
                        name: `${files.length} Images`,
                        extension: 'batch',
                        icon: sourceFormat.icon,
                        color: sourceFormat.color,
                        subLabel: isFr ? 'Conversion par lot' : 'Batch conversion',
                      }
                }
                targetFormat={targetFormat}
                fileName={
                  isSingle && singleFile
                    ? singleFile.file.name
                    : (isFr ? `Conversion de ${doneCount}/${files.length} fichiers...` : `Converting ${doneCount}/${files.length} files...`)
                }
                statusLabel={
                  isFr
                    ? `Encodage haute définition en format ${toExt.toUpperCase()}...`
                    : `High-definition encoding to ${toExt.toUpperCase()}...`
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {allDone && !isProcessing && (
              <div className="space-y-8">
                {/* Single File Result */}
                {isSingle && singleFile && singleFile.blob && (
                  <div className="space-y-8">
                    <ConversionResult
                      targetFormat={targetFormat}
                      resultFileName={`${singleFile.file.name.replace(/\.[^/.]+$/, '')}.${toExt}`}
                      resultFileSize={singleFile.resultSize ?? singleFile.blob.size}
                      downloadBtnLabel={
                        toExt === 'pdf'
                          ? (isFr ? 'Télécharger le document PDF' : 'Download PDF document')
                          : (isFr ? `Télécharger l'image ${toExt.toUpperCase()}` : `Download ${toExt.toUpperCase()} image`)
                      }
                      resetBtnLabel={isFr ? 'Convertir un autre fichier' : 'Convert another file'}
                      onDownload={() => downloadOne(singleFile)}
                      onReset={handleResetAll}
                    />

                    {/* Single Image Preview Slab */}
                    {singleFile.compressedUrl && toMime.startsWith('image/') && toMime !== 'image/svg+xml' && (
                      <SingleImagePreview
                        file={singleFile}
                        toExt={toExt}
                        targetFormat={targetFormat}
                        isFr={isFr}
                      />
                    )}
                  </div>
                )}

                {/* Multiple Files Result */}
                {!isSingle && (
                  <BatchResultGallery
                    files={files}
                    toExt={toExt}
                    toMime={toMime}
                    targetFormat={targetFormat}
                    onDownloadAllZip={downloadAllZip}
                    onDownloadOne={downloadOne}
                    onResetAll={handleResetAll}
                    isFr={isFr}
                  />
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Post-Download Continuum for PDF conversions */}
          {isPdfOutput && (
            <NextActionModal
              toolId={slug}
              isOpen={isNextActionOpen}
              onClose={() => setIsNextActionOpen(false)}
              resultBlob={downloadedPdf?.blob}
              resultFilename={downloadedPdf?.filename}
            />
          )}

          {/* Post-Download Continuum for Image conversions */}
          {!isPdfOutput && (
            <ImageNextActionModal
              toolId={slug}
              isOpen={isNextActionOpen}
              onClose={() => setIsNextActionOpen(false)}
              resultBlob={downloadedImage?.blob}
              resultFilename={downloadedImage?.filename}
            />
          )}
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
