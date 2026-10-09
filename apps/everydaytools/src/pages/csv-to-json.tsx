import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import {
  TextPreviewDialog,
  DocumentNextActionModal,
} from '@/components/conversion';
import { useCsvJsonWorkflow } from '@/hooks/use-csv-json-workflow';
import {
  CsvJsonDirectionToolbar,
  CsvJsonFlow,
} from '@/components/csv-to-json';

export default function CsvToJson() {
  const { t, isFr } = useLocale();

  const workflow = useCsvJsonWorkflow(isFr);
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

  const pageTitle = t.tools['csv-to-json']?.title ?? 'CSV ↔ JSON';
  const pageDesc =
    t.tools['csv-to-json']?.description ??
    'Convert between CSV and JSON formats instantly in your browser.';

  return (
    <ToolPageLayout
      breadcrumb={[
        t.nav.breadcrumb.home,
        t.nav.breadcrumb.excelSpreadsheets,
        pageTitle,
      ]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="csv-to-json"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Direction Switcher & Mode Selector */}
          {!result && !isProcessing && !isStaged && (
            <CsvJsonDirectionToolbar
              direction={direction}
              inputMode={inputMode}
              onToggleDirection={handleToggleDirection}
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

          {/* Modal continuum */}
          <DocumentNextActionModal
            toolId="csv-to-json"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType={direction === 'csv-to-json' ? 'json' : 'csv'}
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
