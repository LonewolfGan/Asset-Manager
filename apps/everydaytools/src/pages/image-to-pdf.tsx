import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { useImageToPdfWorkflow } from '@/hooks/use-image-to-pdf-workflow';
import { ImageToPdfFileList } from '@/components/image-to-pdf';

export default function ImageToPdf() {
  const { t, isFr } = useLocale();
  const tc = t.imageToPdf;

  const {
    files,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    sourceFormat,
    targetPdfFormat,
    totalSize,
    stagedFile,
    handleReset,
    handleRemoveFile,
    handleAddFiles,
    handleFilesSelected,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleConvert,
    handleDownload,
  } = useImageToPdfWorkflow(isFr, tc.error);

  const title = t.tools['image-to-pdf']?.title ?? 'Image to PDF';
  const desc =
    t.tools['image-to-pdf']?.description ??
    'Combine multiple JPG, PNG, WEBP, and HEIC images into a single PDF document.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.image, title]}
      title={title}
      description={desc}
      seoSlug="image-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : DROPZONE INITIALE ─── */}
            {files.length === 0 && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={
                  isFr
                    ? 'Convertir et combiner des images en PDF'
                    : 'Convert and combine images to PDF'
                }
                description={
                  isFr
                    ? 'Glissez-déposez une ou plusieurs images (JPG, PNG, WebP, HEIC, AVIF, TIFF, BMP) pour générer un document PDF haute résolution.'
                    : 'Drag and drop one or more images (JPG, PNG, WebP, HEIC, AVIF, TIFF, BMP) to generate a high-resolution PDF document.'
                }
                buttonLabel={
                  isFr ? 'Sélectionner des images' : 'Select images'
                }
                accept="image/*,.jpg,.jpeg,.png,.webp,.avif,.gif,.tiff,.bmp,.heic,.heif,.svg"
                multiple={true}
                isDragging={isDragging}
                onFilesSelected={handleFilesSelected}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 2 : STAGING AVEC LISTE D'IMAGES ─── */}
            {files.length > 0 && stagedFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetPdfFormat}
                sourceFile={stagedFile}
                targetFileName={
                  files.length === 1
                    ? `${files[0].name.replace(/\.[^/.]+$/, '')}.pdf`
                    : isFr
                    ? 'images_combine.pdf'
                    : 'combined_images.pdf'
                }
                targetSubLabel={`${files.length} ${
                  files.length === 1 ? (isFr ? 'page' : 'page') : isFr ? 'pages' : 'pages'
                }`}
                convertBtnLabel={
                  files.length === 1
                    ? isFr
                      ? 'Convertir en PDF'
                      : 'Convert to PDF'
                    : isFr
                    ? `Combiner les ${files.length} images en PDF`
                    : `Combine ${files.length} images into PDF`
                }
                changeFileBtnLabel={isFr ? 'Recommencer' : 'Start over'}
                onConvert={handleConvert}
                onReset={handleReset}
                optionsSlot={
                  <ImageToPdfFileList
                    files={files}
                    totalSize={totalSize}
                    onRemoveFile={handleRemoveFile}
                    onAddFiles={handleAddFiles}
                    isFr={isFr}
                  />
                }
              />
            )}

            {/* ─── SCENE 3 : CONDUIT DE CONVERSION ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetPdfFormat}
                fileName={
                  files.length === 1
                    ? files[0].name
                    : `${files.length} ${isFr ? 'images' : 'images'}`
                }
                statusLabel={
                  isFr
                    ? `Assemblage de ${files.length} image(s) dans le PDF...`
                    : `Assembling ${files.length} image(s) into PDF...`
                }
              />
            )}

            {/* ─── SCENE 4 : RÉSULTAT ET TÉLÉCHARGEMENT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetPdfFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={
                  isFr
                    ? `Télécharger le PDF (${files.length} ${
                        files.length === 1 ? 'page' : 'pages'
                      })`
                    : `Download PDF (${files.length} ${
                        files.length === 1 ? 'page' : 'pages'
                      })`
                }
                resetBtnLabel={
                  isFr ? "Convertir d'autres images" : 'Convert more images'
                }
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Modal continuum */}
          <NextActionModal
            toolId="image-to-pdf"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
