import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { Eye } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
} from '@/components/conversion';
import { useExcelToPdfWorkflow } from '@/hooks/use-excel-to-pdf-workflow';
import { ExcelToPdfSheetSelector } from '@/components/excel-to-pdf';

export default function ExcelToPdf() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    sheets,
    selectedSheet,
    setSelectedSheet,
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
    handleOpenPreview,
  } = useExcelToPdfWorkflow();

  const pageTitle = t.tools['excel-to-pdf']?.title ?? (isFr ? 'Excel en PDF' : 'Excel to PDF');
  const pageDesc =
    t.tools['excel-to-pdf']?.description ??
    (isFr
      ? 'Convertissez vos feuilles de calcul Excel (.xlsx, .xls) en documents PDF haute fidélité.'
      : 'Convert Excel spreadsheets (.xlsx, .xls) to high-fidelity PDF documents.');

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.excelSpreadsheets,
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="excel-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre feuille Excel' : 'Drag & drop your Excel spreadsheet here'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en tableau PDF vectoriel (.pdf).'
                    : 'or click to browse your files and convert to vector PDF document (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en PDF' : 'Convert to PDF')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleConvert}
                onReset={handleReset}
                optionsSlot={
                  <ExcelToPdfSheetSelector
                    sheets={sheets}
                    selectedSheet={selectedSheet}
                    onSelectSheet={setSelectedSheet}
                    label={tc.sheetLabel ?? (isFr ? 'Feuille à convertir' : 'Sheet to convert')}
                  />
                }
              />
            )}

            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={tc.converting ?? (isFr ? 'Conversion du tableau en cours...' : 'Converting spreadsheet...')}
              />
            )}

            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadPdf ?? (isFr ? 'Télécharger le fichier PDF' : 'Download PDF file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={handleOpenPreview}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm cursor-pointer"
                  >
                    <Eye size={16} strokeWidth={2.2} />
                    <span>{isFr ? "Ouvrir l'aperçu PDF" : 'Open PDF preview'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>

          <NextActionModal
            toolId="excel-to-pdf"
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
