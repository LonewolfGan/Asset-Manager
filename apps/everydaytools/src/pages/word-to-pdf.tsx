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
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: '#185ABD',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export default function WordToPdf() {
  const { t, isFr } = useLocale();
  const tc = t.wordToPdf;
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
      const isWord =
        selectedFile.name.toLowerCase().endsWith('.docx') ||
        selectedFile.name.toLowerCase().endsWith('.doc') ||
        selectedFile.type ===
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        selectedFile.type === 'application/msword';

      if (!isWord) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format non supporté' : 'Unsupported format',
          description: isFr
            ? 'Veuillez sélectionner un document Word (.docx ou .doc) valide.'
            : 'Please select a valid Word (.docx or .doc) document.',
        });
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Fichier trop volumineux' : 'File too large',
          description: isFr
            ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
            : 'File exceeds maximum allowed size of 50 MB.',
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
      trackToolUsed('word-to-pdf', 'documents');

      const res = await runAsyncDocumentConversion({
        taskType: 'word-to-pdf',
        file,
        targetFormat: 'pdf',
        fallbackSyncUrl: '/api/tools/word-to-pdf',
      });

      setResult({
        blob: res.blob,
        filename: res.filename,
        sizeAfter: res.sizeAfter || res.blob.size,
        sizeBefore: file.size,
      });
    } catch (err) {
      console.error('Word to PDF conversion error:', err);
      trackToolError('word-to-pdf', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion en PDF. Veuillez réessayer.'
              : 'Failed to convert to PDF. Please try again.');
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

  const pageTitle = t.tools['word-to-pdf']?.title ?? (isFr ? 'Word en PDF' : 'Word to PDF');
  const pageDesc =
    t.tools['word-to-pdf']?.description ??
    (isFr
      ? 'Convertissez vos fichiers DOCX et DOC en documents PDF haute fidélité.'
      : 'Convert DOCX and DOC files to high-fidelity PDF documents.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="word-to-pdf"
      hideRelatedTools
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document Word' : 'Drag and drop your Word document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir en document PDF haute fidélité (.pdf).'
                    : 'or click to browse your folders and convert to a high-fidelity PDF document (.pdf).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
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
                statusLabel={tc.converting ?? (isFr ? 'Conversion en cours...' : 'Converting...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
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
        </div>
      </ToolWorkspace>

      {/* Post-Download Continuum Modal */}
      <NextActionModal
        toolId="word-to-pdf"
        isOpen={isNextActionOpen}
        onClose={() => setIsNextActionOpen(false)}
        resultBlob={result?.blob}
        resultFilename={result?.filename}
      />
    </ToolPageLayout>
  );
}
