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
import { usePdfToRtfWorkflow } from '@/hooks/use-pdf-to-rtf-workflow';
import { useLocale } from '@/hooks/use-locale';

export default function PdfToRtf() {
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
  } = usePdfToRtfWorkflow();

  const pageTitle = t.tools['pdf-to-rtf']?.title ?? (isFr ? 'PDF en RTF' : 'PDF to RTF');
  const pageDesc =
    t.tools['pdf-to-rtf']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en format texte enrichi (.rtf) compatible avec tous les traitements de texte.'
      : 'Convert PDF documents into Rich Text Format (.rtf) compatible with any word processor.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="pdf-to-rtf"
          isFr={isFr}
          getCurrentFile={() => file}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="pdf-to-rtf"
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
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en texte enrichi (.rtf).'
                    : 'or click to browse your folders and convert to Rich Text Format (.rtf).'
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en RTF' : 'Convert to RTF')}
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
                  (isFr ? 'Conversion du PDF en document RTF en cours...' : 'Converting PDF to RTF document...')
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
                  tc.downloadRtf ?? (isFr ? 'Télécharger le document RTF' : 'Download RTF document')
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
