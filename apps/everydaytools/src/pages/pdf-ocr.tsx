import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { formatBytes } from '@/lib/utils';
import { CodeWorkspace } from '@/components/ui/code-workspace';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  DocumentNextActionModal,
} from '@/components/conversion';
import { usePdfOcrWorkflow } from '@/hooks/use-pdf-ocr-workflow';
import {
  PdfOcrLanguageSelector,
  PdfOcrErrorBanner,
} from '@/components/pdf-ocr';

export default function PdfOcr() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    supportedLanguages,
    file,
    lang,
    setLang,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    runOcr,
    handleReset,
    handleDownload,
  } = usePdfOcrWorkflow();

  const title = t.tools['pdf-ocr']?.title ?? 'PDF OCR — Scanned Document to Text';
  const desc =
    t.tools['pdf-ocr']?.description ??
    'Extraire le texte éditable de vos documents PDF scannés grâce à la reconnaissance optique de caractères (OCR).';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-ocr"
    >
      <ToolWorkspace noGrid>
        <div className="w-full">
          {/* Bandeau d'erreur */}
          <PdfOcrErrorBanner
            error={error}
            onDismiss={() => setError(null)}
            isFr={isFr}
          />

          {/* Flux de conversion en 4 scènes harmonisé */}
          <AnimatePresence mode="wait">
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (ConversionDropzone) ─── */}
            {!file && !result && !isProcessing && (
              <div className="w-full max-w-5xl mx-auto" key="dropzone-scene">
                <ConversionDropzone
                  sourceFormat={sourceFormat}
                  accept=".pdf,application/pdf"
                  title={
                    isFr
                      ? 'Glissez-déposez votre document PDF scanné'
                      : 'Drag and drop your scanned PDF document'
                  }
                  description={
                    isFr
                      ? "ou cliquez pour parcourir vos fichiers et extraire l'intégralité du texte en texte brut (.txt) par reconnaissance optique."
                      : 'or click to browse your files and extract all text to raw text (.txt) with optical recognition.'
                  }
                  buttonLabel={isFr ? 'Sélectionner un document PDF' : 'Select a PDF document'}
                  isDragging={isDragging}
                  onFileSelected={validateAndSetFile}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                />
              </div>
            )}

            {/* ─── SCÈNE 2 : ATELIER STAGING NOBLE (ConversionStaging) ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                targetFileName={file.name.replace(/\.[^/.]+$/, '') + (isFr ? '_texte.txt' : '_text.txt')}
                targetSubLabel={targetFormat.subLabel}
                optionsSlot={
                  <PdfOcrLanguageSelector
                    lang={lang}
                    onLangChange={setLang}
                    disabled={isProcessing}
                    supportedLanguages={supportedLanguages}
                    ariaLabel={tc.language ?? (isFr ? 'Langue du document' : 'Document language')}
                  />
                }
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Extraire le texte (OCR)' : 'Extract Text (OCR)')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de document' : 'Change document')}
                onConvert={runOcr}
                onReset={handleReset}
              />
            )}

            {/* ─── SCÈNE 3 : CONDUIT CINÉTIQUE (ConversionConduit) ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Reconnaissance optique du texte en cours...'
                    : 'Optical text recognition in progress...')
                }
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT ET INSPECTION DU TEXTE (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                resultMetadataText={`${result.wordCount} ${isFr ? 'mots' : 'words'} · ${result.charCount} ${isFr ? 'caractères' : 'characters'}${
                  result.totalPages ? ` · ${result.totalPages} page${result.totalPages > 1 ? 's' : ''}` : ''
                } · ${formatBytes(result.sizeAfter)}`}
                downloadBtnLabel={tc.downloadTxt ?? (isFr ? 'Télécharger le fichier .txt' : 'Download .txt file')}
                downloadBtnColor="#18181b"
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Scanner un autre PDF' : 'Scan another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
              >
                {/* Surface d'inspection et copie directe du texte extrait */}
                <div className="w-full max-w-4xl mx-auto mt-8 text-left">
                  <CodeWorkspace
                    mode="preview"
                    value={result.textOutput}
                    format="txt"
                    formatLabel={`OCR PDF · ${result.totalPages ? `${result.totalPages} page${result.totalPages > 1 ? 's' : ''}` : 'TXT'}`}
                    downloadFilename={result.filename}
                    onDownload={handleDownload}
                    minHeight="280px"
                    maxHeight="460px"
                  />
                </div>
              </ConversionResult>
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-ocr"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="txt"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
