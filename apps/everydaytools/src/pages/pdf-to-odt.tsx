import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  ReciprocalTitle,
} from '@/components/conversion';
import { usePdfToOdtWorkflow } from '@/hooks/use-pdf-to-odt-workflow';
import { useLocale } from '@/hooks/use-locale';

export default function PdfToOdt() {
  const { isFr } = useLocale();
  const {
    t,
    tc,
    sourceFormat,
    targetFormat,
    file,
    result,
    isProcessing,
    isDragging,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = usePdfToOdtWorkflow();

  const pageTitle = t.tools['pdf-to-odt']?.title ?? (isFr ? 'PDF en ODT' : 'PDF to ODT');
  const pageDesc =
    t.tools['pdf-to-odt']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en fichiers texte OpenDocument (.odt) pour LibreOffice et Apache OpenOffice.'
      : 'Convert PDF documents into editable OpenDocument Text (.odt) files.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-odt"
          isFr={isFr}
          getCurrentFile={() => file}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="pdf-to-odt"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag & drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document OpenDocument (.odt).'
                    : 'or click to browse your folders and convert to OpenDocument (.odt).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier PDF' : 'Select a PDF file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en ODT' : 'Convert to ODT')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={
                  tc.converting ??
                  (isFr ? 'Conversion du PDF en document ODT en cours...' : 'Converting PDF to ODT document...')
                }
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={
                  tc.downloadOdt ?? (isFr ? 'Télécharger le document ODT' : 'Download ODT document')
                }
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Convertir un autre fichier' : 'Convert another file')
                }
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
