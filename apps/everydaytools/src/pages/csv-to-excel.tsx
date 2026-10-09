import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  DocumentNextActionModal,
} from '@/components/conversion';
import {
  DelimiterRadioGroup,
  DataPreviewTableLite,
  EncodingSelector,
} from '@workspace/ui/controls';
import { useCsvToExcelWorkflow } from '@/hooks/use-csv-to-excel-workflow';
import {
  CsvToExcelModeSelector,
  CsvToExcelPastePane,
} from '@/components/csv-to-excel';

export default function CsvToExcel() {
  const {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    mode,
    setMode,
    csvText,
    setCsvText,
    isPastedStaged,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    isStaged,
    stagedFile,
    delimiter,
    setDelimiter,
    encoding,
    setEncoding,
    previewData,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  } = useCsvToExcelWorkflow();

  const pageTitle = t.tools['csv-to-excel']?.title ?? (isFr ? 'CSV en Excel' : 'CSV to Excel');
  const pageDesc =
    t.tools['csv-to-excel']?.description ??
    (isFr
      ? 'Convertissez instantanément vos fichiers CSV en classeurs Microsoft Excel (.xlsx).'
      : 'Convert CSV files into clean Microsoft Excel (.xlsx) spreadsheets.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="csv-to-excel"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Mode Switcher Tabs (Upload vs Paste) */}
          {!result && !isProcessing && !isStaged && (
            <CsvToExcelModeSelector
              mode={mode}
              onModeChange={setMode}
              uploadLabel={tc.tabUpload ?? (isFr ? 'Importer un fichier (.csv)' : 'Upload a file (.csv)')}
              pasteLabel={tc.tabPaste ?? (isFr ? 'Coller des données CSV' : 'Paste CSV data')}
            />
          )}

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1A : UPLOAD DROPZONE ─── */}
            {mode === 'upload' && !file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre fichier CSV' : 'Drag & drop your CSV file here'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en classeur Microsoft Excel (.xlsx).'
                    : 'or click to browse your files and convert to Microsoft Excel (.xlsx) workbook.'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier CSV' : 'Select a CSV file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCENE 1B : TEXTAREA PASTE PANE ─── */}
            {mode === 'paste' && !isPastedStaged && !result && !isProcessing && (
              <CsvToExcelPastePane
                csvText={csvText}
                onCsvTextChange={setCsvText}
                onSubmit={() => setIsPastedStaged(true)}
                placeholder={tc.pastePlaceholder}
                isFr={isFr}
              />
            )}

            {/* ─── SCENE 2 : STANDARDIZED ARCHITECTURAL STAGING ─── */}
            {isStaged && stagedFile && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={stagedFile}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Excel' : 'Convert to Excel')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de données / fichier' : 'Change data / file')}
                optionsSlot={
                  <div className="space-y-6 p-5 rounded-2xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/10 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <DelimiterRadioGroup
                        value={delimiter}
                        onChange={setDelimiter}
                        label={isFr ? 'Séparateur CSV source' : 'Source CSV Delimiter'}
                        isFr={isFr}
                        allowCustom
                      />
                      <EncodingSelector
                        value={encoding}
                        onChange={setEncoding}
                        label={isFr ? 'Encodage du fichier' : 'File Encoding'}
                        isFr={isFr}
                      />
                    </div>

                    {previewData && previewData.headers.length > 0 && (
                      <DataPreviewTableLite
                        headers={previewData.headers}
                        rows={previewData.rows}
                        label={isFr ? 'Aperçu des données' : 'Data preview'}
                        isFr={isFr}
                        maxRows={4}
                      />
                    )}
                  </div>
                }
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCENE 3 : UNIFIED KINETIC CONDUIT ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={
                  mode === 'upload'
                    ? file?.name
                    : (isFr ? 'donnees-saisies.csv' : 'pasted-data.csv')
                }
                statusLabel={
                  tc.converting ??
                  (isFr
                    ? 'Génération du classeur Microsoft Excel XLSX...'
                    : 'Generating Microsoft Excel XLSX workbook...')
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
                  tc.downloadXlsx ??
                  (isFr ? 'Télécharger le classeur Excel (.xlsx)' : 'Download Excel workbook (.xlsx)')
                }
                resetBtnLabel={
                  tc.convertAnother ??
                  (isFr ? 'Convertir un autre fichier CSV' : 'Convert another CSV file')
                }
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="csv-to-excel"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="xlsx"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
