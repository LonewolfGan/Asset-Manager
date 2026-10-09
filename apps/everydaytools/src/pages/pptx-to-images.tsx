import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  ImageNextActionModal,
} from '@/components/conversion';
import { usePptxToImagesWorkflow } from '@/hooks/use-pptx-to-images-workflow';
import { PptxFormatSelector, PptxSlidesGallery } from '@/components/pptx-to-images';

export default function PptxToImages() {
  const { t, isFr } = useLocale();
  const tc = t.pptxToImages;

  const {
    file,
    sourceFormat,
    targetFormats,
    activeTargetFormat,
    selectedFormat,
    setSelectedFormat,
    slides,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadedSlide,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownloadSlide,
    handleDownloadZip,
  } = usePptxToImagesWorkflow(isFr, tc.error);

  const pageTitle = t.tools['pptx-to-images']?.title ?? 'PowerPoint to Images';
  const pageDesc =
    t.tools['pptx-to-images']?.description ??
    (isFr
      ? 'Convertissez et extrayez chaque diapositive PowerPoint en images haute résolution PNG, JPG ou WEBP dans une archive ZIP.'
      : 'Convert and extract every PowerPoint slide into high-resolution PNG, JPG, or WEBP images in a ZIP archive.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="pptx-to-images"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto space-y-8">
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : DROPZONE INITIALE ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={
                  isFr
                    ? 'Glissez-déposez votre présentation PowerPoint'
                    : 'Drag & drop your PowerPoint presentation'
                }
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et exporter chaque diapositive en images haute définition (PNG, JPG, WEBP) dans une archive ZIP.'
                    : 'or click to browse your files and export every slide as high-definition images (PNG, JPG, WEBP) in a ZIP archive.'
                }
                buttonLabel={
                  isFr
                    ? 'Sélectionner un fichier PowerPoint'
                    : 'Select a PowerPoint file'
                }
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 2 : STAGING DE CONVERSION ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={activeTargetFormat}
                sourceFile={file}
                targetFileName={`${file.name.replace(/\.[^/.]+$/, '')}_slides_${selectedFormat}.zip`}
                convertBtnLabel={
                  tc.convertBtn
                    ? tc.convertBtn.replace(/PNG/i, selectedFormat.toUpperCase())
                    : isFr
                    ? `Exporter en images ${selectedFormat.toUpperCase()}`
                    : `Export as ${selectedFormat.toUpperCase()} images`
                }
                changeFileBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Changer de présentation' : 'Change presentation')
                }
                optionsSlot={
                  <PptxFormatSelector
                    selectedFormat={selectedFormat}
                    onChange={setSelectedFormat}
                    isFr={isFr}
                  />
                }
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : CONDUIT DE CONVERSION ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={activeTargetFormat}
                fileName={file?.name}
                statusLabel={
                  tc.converting
                    ? tc.converting.replace(/PNG/i, selectedFormat.toUpperCase())
                    : isFr
                    ? `Rendu des diapositives en images ${selectedFormat.toUpperCase()}...`
                    : `Rendering slides as ${selectedFormat.toUpperCase()} images...`
                }
              />
            )}

            {/* ─── SCENE 4 : RÉSULTAT & GALERIE DES DIAPOSITIVES ─── */}
            {result && !isProcessing && (
              <div className="space-y-8">
                <ConversionResult
                  targetFormat={targetFormats[result.format]}
                  resultFileName={result.filename}
                  resultFileSize={result.sizeAfter}
                  downloadBtnLabel={
                    tc.downloadZip
                      ? `${tc.downloadZip} (${result.format.toUpperCase()})`
                      : isFr
                      ? `Télécharger l'archive ZIP (${result.format.toUpperCase()})`
                      : `Download ZIP archive (${result.format.toUpperCase()})`
                  }
                  resetBtnLabel={
                    tc.convertAnother ??
                    (isFr
                      ? 'Convertir une autre présentation'
                      : 'Convert another presentation')
                  }
                  onDownload={handleDownloadZip}
                  onReset={handleReset}
                />

                <PptxSlidesGallery
                  slides={slides}
                  format={result.format}
                  formatColor={targetFormats[result.format].color}
                  isFr={isFr}
                  slidesCountLabel={
                    tc.slidesCount ? tc.slidesCount(slides.length) : undefined
                  }
                  onDownloadSlide={handleDownloadSlide}
                />
              </div>
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>

      <ImageNextActionModal
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        toolId="pptx-to-images"
        file={downloadedSlide}
      />
    </ToolPageLayout>
  );
}
