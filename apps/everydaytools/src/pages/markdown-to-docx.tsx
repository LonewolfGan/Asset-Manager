import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  DocumentNextActionModal,
  type ConversionFormat,
} from '@/components/conversion';

const SOURCE_FORMAT: ConversionFormat = {
  name: 'Markdown',
  extension: 'md',
  icon: '/icons/markdown.svg',
  color: '#0284C7',
  subLabel: 'Syntaxe Markdown',
};

const TARGET_FORMAT: ConversionFormat = {
  name: 'Word',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: '#185ABD',
  subLabel: 'Microsoft Word',
};

export default function MarkdownToDocx() {
  const { t, isFr } = useLocale();
  const tc = t.markdownToDocx;

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
      const isMd =
        selectedFile.name.toLowerCase().endsWith('.md') ||
        selectedFile.name.toLowerCase().endsWith('.markdown') ||
        selectedFile.name.toLowerCase().endsWith('.txt') ||
        selectedFile.type === 'text/markdown' ||
        selectedFile.type === 'text/plain' ||
        selectedFile.type === '';

      if (!isMd) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format non supporté' : 'Unsupported format',
          description: isFr ? 'Veuillez sélectionner un fichier Markdown (.md) valide.' : 'Please select a valid Markdown (.md) file.',
        });
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Fichier trop volumineux' : 'File too large',
          description: isFr ? 'Le fichier dépasse la taille maximale autorisée de 10 Mo.' : 'The file exceeds the maximum allowed size of 10 MB.',
        });
        return;
      }
      setFiles([selectedFile]);
      setResult(null);
    },
    [isFr]
  );

  // Auto-consume handoff file from previous workflow step
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
      trackToolUsed('markdown-to-docx', 'documents');
      const fd = new FormData();
      fd.append('file', file);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/convert/markdown-to-docx'), {
          method: 'POST',
          body: fd,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (!res.ok) {
        const errJson = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        throw new Error(
          errJson.message ??
            errJson.error ??
            tc.error ??
            (isFr ? 'Échec de la conversion en document Word. Veuillez réessayer.' : 'Failed to convert to Word document. Please try again.')
        );
      }

      const blob = await res.blob();
      const filename = file.name.replace(/\.(md|markdown|txt)$/i, '.docx');

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (err) {
      console.error('Markdown to Word conversion error:', err);
      trackToolError('markdown-to-docx', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ?? (isFr ? 'Échec de la conversion en document Word. Veuillez réessayer.' : 'Failed to convert to Word document. Please try again.');
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

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const pageTitle = t.tools['markdown-to-docx']?.title ?? 'Markdown to Word';
  const pageDesc =
    t.tools['markdown-to-docx']?.description ??
    'Convert Markdown files to Microsoft Word (.docx) format.';

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.documents, pageTitle]}
      title={pageTitle}
      description={pageDesc}
      seoSlug="markdown-to-docx"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={SOURCE_FORMAT}
                title={isFr ? "Glissez-déposez votre fichier Markdown" : "Drag and drop your Markdown file"}
                description={isFr ? "ou cliquez pour parcourir vos dossiers et convertir en document Microsoft Word (.docx)." : "or click to browse your folders and convert to Microsoft Word (.docx)."}
                buttonLabel={isFr ? "Sélectionner un fichier Markdown" : "Select a Markdown file"}
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
                sourceFormat={SOURCE_FORMAT}
                targetFormat={TARGET_FORMAT}
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
                sourceFormat={SOURCE_FORMAT}
                targetFormat={TARGET_FORMAT}
                fileName={file?.name}
                statusLabel={tc.converting ?? (isFr ? 'Génération du document Word DOCX en cours...' : 'Generating Word DOCX document...')}
              />
            )}

            {/* ─── SCENE 4 : HEROIC UNBOXED RESULT ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={TARGET_FORMAT}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadDocx ?? (isFr ? 'Télécharger le document Word' : 'Download Word document')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre fichier' : 'Convert another file')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="markdown-to-docx"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="docx"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
