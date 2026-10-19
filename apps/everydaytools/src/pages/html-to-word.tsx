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
import { DocumentNextActionModal } from '@/components/conversion/DocumentNextActionModal';
import { useHtmlToWordWorkflow } from '@/hooks/use-html-to-word-workflow';

export default function HtmlToWord() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = useHtmlToWordWorkflow();

  const pageTitle = t.tools['html-to-word']?.title ?? (isFr ? 'HTML en Word' : 'HTML to Word');
  const pageDesc =
    t.tools['html-to-word']?.description ??
    (isFr
      ? 'Convertissez vos pages et balises HTML en documents Microsoft Word (.docx) prêts à l’édition.'
      : 'Convert HTML code and web pages into editable Microsoft Word (.docx) documents.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={
        <ReciprocalTitle
          currentSlug="html-to-word"
          isFr={isFr}
          getCurrentFile={() => file}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug="html-to-word"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre fichier HTML' : 'Drag & drop your HTML file'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document Microsoft Word (.docx).'
                    : 'or click to browse your folders and convert to Microsoft Word (.docx).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier HTML' : 'Select an HTML file'}
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Word' : 'Convert to Word')}
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
                  (isFr ? 'Génération du document Word en cours...' : 'Generating Word document...')
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
                  tc.downloadDocx ?? (isFr ? 'Télécharger le document Word' : 'Download Word document')
                }
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Convertir un autre fichier' : 'Convert another file')
                }
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={() => setIsNextActionOpen(true)}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-[background-color,border-color,transform] duration-150 flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    <span>{isFr ? 'Actions suivantes' : 'Next actions'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          {result && (
            <DocumentNextActionModal
              toolId="html-to-word"
              isOpen={isNextActionOpen}
              onClose={() => setIsNextActionOpen(false)}
              resultBlob={result.blob}
              resultFilename={result.filename}
              formatType="docx"
            />
          )}
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
