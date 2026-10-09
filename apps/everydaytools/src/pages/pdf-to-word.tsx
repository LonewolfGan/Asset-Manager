import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace } from '@/components/ToolContent';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { AlertCircle } from 'lucide-react';
import {
  ConversionDropzone,
  ConversionStaging,
  ConversionConduit,
  ConversionResult,
  DocumentNextActionModal,
  type ConversionFormat,
} from '@/components/conversion';

const getSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

const getTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'DOCX',
  extension: 'docx',
  icon: '/icons/word.svg',
  color: '#185ABD',
  subLabel: isFr ? 'Format Word (.docx)' : 'Word Format (.docx)',
});

export default function PdfToWord() {
  const { t, isFr } = useLocale();
  const tc = t.pdfToWord;
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{
    blob: Blob;
    filename: string;
    sizeAfter: number;
    sizeBefore?: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const handleReset = () => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  };

  const validateAndSetFile = useCallback((selectedFile: File) => {
    const isPdf =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) {
      setError(
        isFr
          ? 'Veuillez sélectionner un document au format PDF valide.'
          : 'Please select a valid PDF document.'
      );
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      setError(
        isFr
          ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
          : 'File exceeds maximum allowed size of 50 MB.'
      );
      return;
    }

    setError(null);
    setResult(null);
    setFiles([selectedFile]);
  }, [isFr]);

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

  const handleConvert = async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-to-word', 'documents');
      const fd = new FormData();
      fd.append('file', file);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/convert/pdf-to-word'), {
          method: 'POST',
          body: fd,
        }),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(err.error ?? tc.error);
      }

      const blob = await res.blob();
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '.docx'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('pdf-to-word', 'general-error');
      setError(e instanceof Error ? e.message : tc.error);
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
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const title = t.tools['pdf-to-word']?.title ?? (isFr ? 'PDF en Word' : 'PDF to Word');
  const desc =
    t.tools['pdf-to-word']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en fichiers Word (DOCX) parfaitement éditables.'
      : 'Convert PDF documents into fully editable Word (DOCX) files.');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-word"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                className="mb-8 max-w-2xl mx-auto p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-between gap-3 text-sm shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} className="shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-xs font-semibold uppercase tracking-wider opacity-70 hover:opacity-100 transition-opacity px-2 py-1 cursor-pointer"
                >
                  {isFr ? 'Fermer' : 'Close'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unified 4-Scene Conversion Flow */}
          <AnimatePresence mode="wait">
            {/* ─── SCENE 1 : ARCHITECTURAL DOUBLE-BEZEL UPLOAD BOX ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir votre document en fichier Word (.docx).'
                    : 'or click to browse your folders and convert your document to a Word (.docx) file.'
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
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en Word (DOCX)' : 'Convert to Word (DOCX)')}
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
                downloadBtnLabel={tc.downloadDocx ?? (isFr ? 'Télécharger le fichier Word' : 'Download Word file')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre PDF' : 'Convert another PDF')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-word"
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
