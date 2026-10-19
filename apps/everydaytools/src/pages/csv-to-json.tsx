import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { TextPreviewDialog, ReciprocalTitle, DocumentNextActionModal } from '@/components/conversion';
import { useCsvJsonWorkflow } from '@/hooks/use-csv-json-workflow';
import { type ConversionDirection } from '@/lib/csv-json-conversion-logic';
import { CsvJsonFlow, CsvJsonModeSelector } from '@/components/csv-to-json';

export interface CsvToJsonProps {
  initialDirection?: ConversionDirection;
  toolSlug?: string;
}

export default function CsvToJson({
  initialDirection = 'csv-to-json',
  toolSlug = 'csv-to-json',
}: CsvToJsonProps = {}) {
  const { t, isFr } = useLocale();

  const workflow = useCsvJsonWorkflow(isFr, initialDirection);
  const {
    direction,
    inputMode,
    setInputMode,
    result,
    isProcessing,
    isStaged,
    previewOpen,
    setPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    targetFormat,
    handleToggleDirection,
    handleDownload,
  } = workflow;

  const isJsonToCsv = toolSlug === 'json-to-csv';
  const pageTitle = isJsonToCsv
    ? (t.tools['json-to-csv']?.title ?? (isFr ? 'JSON en CSV' : 'JSON to CSV'))
    : (t.tools['csv-to-json']?.title ?? (isFr ? 'CSV en JSON' : 'CSV to JSON'));
  const pageDesc = isJsonToCsv
    ? (t.tools['json-to-csv']?.description ??
        (isFr
          ? 'Convertissez des objets et tableaux JSON en fichiers CSV en un clic.'
          : 'Convert JSON data structures and files into CSV format instantly.'))
    : (t.tools['csv-to-json']?.description ??
        (isFr
          ? 'Convertissez vos fichiers CSV en JSON instantanément dans votre navigateur.'
          : 'Convert CSV to JSON instantly in your browser.'));

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.excelSpreadsheets,
        pageTitle,
      ]}
      title={
        <ReciprocalTitle
          currentSlug={toolSlug}
          isFr={isFr}
          getCurrentFile={() => workflow.file}
          getCurrentText={() => workflow.rawText}
          onSwap={(newSlug) => {
            handleToggleDirection(newSlug as ConversionDirection);
          }}
          fallbackTitle={pageTitle}
        />
      }
      description={pageDesc}
      seoSlug={toolSlug}
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Streamlined Input Mode Selector (Zero Box Stacking) */}
          {!result && !isProcessing && !isStaged && (
            <CsvJsonModeSelector
              inputMode={inputMode}
              direction={direction}
              onSetInputMode={setInputMode}
              isFr={isFr}
            />
          )}

          {/* Flux de conversion unifié (4 scènes) */}
          <CsvJsonFlow workflow={workflow} isFr={isFr} />

          {/* Dialogue d'aperçu texte */}
          {result && (
            <TextPreviewDialog
              open={previewOpen}
              onOpenChange={setPreviewOpen}
              filename={result.filename}
              text={result.textOutput}
              onDownload={handleDownload}
              downloadLabel={
                isFr
                  ? `Télécharger le fichier ${targetFormat.name}`
                  : `Download ${targetFormat.name} file`
              }
              copyLabel={
                isFr
                  ? `Copier le ${targetFormat.name}`
                  : `Copy ${targetFormat.name}`
              }
              copiedLabel={isFr ? 'Copié !' : 'Copied!'}
              formatTag={`${targetFormat.name} · UTF-8`}
            />
          )}
        </div>

        <DocumentNextActionModal
          toolId={toolSlug}
          isOpen={isNextActionOpen}
          onClose={() => setIsNextActionOpen(false)}
          resultBlob={result?.blob}
          resultFilename={result?.filename}
          formatType={direction === 'csv-to-json' ? 'json' : 'csv'}
        />
      </ToolWorkspace>
    </ToolPageLayout>
  );
}

