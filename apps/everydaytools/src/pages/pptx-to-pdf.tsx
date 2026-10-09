import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { toast } from '@/hooks/use-toast';
import { runAsyncDocumentConversion } from '@/lib/async-conversion';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { Eye } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  NextActionModal,
  type ConversionFormat,
} from '@/components/conversion';

const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PowerPoint',
  extension: 'pptx',
  icon: '/icons/pptx.svg',
  color: '#D83B01',
  subLabel: 'Microsoft PowerPoint',
});

const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: 'Adobe Acrobat',
});

export default function PptxToPdf() {
  const { t, isFr } = useLocale();
  const tc = t.pptxToPdf;

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{
    blob: Blob;
    filename: string;
    sizeBefore?: number;
    sizeAfter: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const isPptx =
        selectedFile.name.toLowerCase().endsWith('.pptx') ||
        selectedFile.name.toLowerCase().endsWith('.ppt') ||
        selectedFile.type ===
          'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
        selectedFile.type === 'application/vnd.ms-powerpoint';

      if (!isPptx) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format non supporté' : 'Unsupported format',
          description: isFr
            ? 'Veuillez sélectionner une présentation PowerPoint (.pptx ou .ppt) valide.'
            : 'Please select a valid PowerPoint presentation (.pptx or .ppt).',
        });
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Fichier trop volumineux' : 'File too large',
          description: isFr
            ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
            : 'File exceeds the maximum allowed size of 50 MB.',
        });
        return;
      }
      setFiles([selectedFile]);
      setResult(null);
    },
    [isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
    }
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  };

  const handleConvert = async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('pptx-to-pdf', 'documents');

      const res = await runAsyncDocumentConversion({
        taskType: 'pptx-to-pdf',
        file,
        targetFormat: 'pdf',
        fallbackSyncUrl: '/api/tools/pptx-to-pdf',
      });

      setResult({
        blob: res.blob,
        filename: res.filename,
        sizeAfter: res.sizeAfter || res.blob.size,
        sizeBefore: file.size,
      });
    } catch (err) {
      console.error('PowerPoint to PDF conversion error:', err);
      trackToolError('pptx-to-pdf', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ?? (isFr ? 'Échec de la conversion en PDF. Veuillez réessayer.' : 'Failed to convert to PDF. Please try again.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Open next action continuum modal
    setIsNextActionOpen(true);
  };

  const handleOpenPreview = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    window.open(url, '_blank');
  };

  const pageTitle = t.tools['pptx-to-pdf']?.title ?? 'PowerPoint to PDF';
  const pageDesc =
    t.tools['pptx-to-pdf']?.description ??
    'Convert PowerPoint presentations (.pptx, .ppt) to sequential PDF documents.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="pptx-to-pdf"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre présentation PowerPoint' : 'Drag & drop your PowerPoint presentation'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF haute fidélité (.pdf).'
                    : 'or click to browse your files and convert to high-fidelity PDF (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner une présentation' : 'Select a presentation'}
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en PDF' : 'Convert to PDF')}
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
                statusLabel={tc.converting ?? (isFr ? 'Conversion des diapositives en PDF en cours...' : 'Converting slides to PDF...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadPdf ?? (isFr ? 'Télécharger le document PDF' : 'Download PDF document')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir une autre présentation' : 'Convert another presentation')}
                onDownload={handleDownload}
                onReset={handleReset}
                extraActions={
                  <button
                    type="button"
                    onClick={handleOpenPreview}
                    className="h-12 px-6 rounded-full border border-neutral-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-base active:scale-[0.98] transition-all flex items-center gap-2.5 shadow-sm"
                  >
                    <Eye size={16} strokeWidth={2.2} />
                    <span>{isFr ? "Ouvrir l'aperçu PDF" : 'Open PDF preview'}</span>
                  </button>
                }
              />
            )}
          </AnimatePresence>

          {/* Post-Download Action Continuum Modal */}
          <NextActionModal
            toolId="pptx-to-pdf"
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
