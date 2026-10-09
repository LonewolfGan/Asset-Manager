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
  name: 'PPTX',
  extension: 'pptx',
  icon: '/icons/pptx.svg',
  color: '#D24726',
  subLabel: isFr ? 'Présentation PowerPoint (.pptx)' : 'PowerPoint Presentation (.pptx)',
});

export default function PdfToPptx() {
  const { t, isFr } = useLocale();
  const tc = t.pdfToPptx;
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

  const validateAndSetFile = (selectedFile: File) => {
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
  };

  // Auto-consume handoff file from previous workflow step
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
    }
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleConvert = async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-to-pptx', 'documents');
      const fd = new FormData();
      fd.append('file', file);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-to-pptx'), {
          method: 'POST',
          body: fd,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          message?: string;
          error?: unknown;
        };
        const msg =
          typeof err.message === 'string'
            ? err.message
            : typeof err.error === 'string'
            ? err.error
            : tc.error;
        throw new Error(msg);
      }

      const blob = await res.blob();
      setResult({
        blob,
        filename: file.name.replace(/\.[^/.]+$/, '') + '.pptx',
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
      setIsProcessing(false);
    } catch (e) {
      trackToolError('pdf-to-pptx', 'general-error');
      const msg = e instanceof Error ? e.message : tc.error;
      setError(msg === 'true' ? tc.error : msg);
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

  const title = t.tools['pdf-to-pptx']?.title ?? (isFr ? 'PDF en PowerPoint' : 'PDF to PowerPoint');
  const desc =
    t.tools['pdf-to-pptx']?.description ??
    (isFr
      ? 'Convertissez vos documents PDF en présentations Microsoft PowerPoint éditables (.pptx).'
      : 'Convert PDF documents into editable Microsoft PowerPoint presentations (.pptx).');

  return (
    <ToolPageLayout
      breadcrumb={[t.nav.breadcrumb.home, t.nav.breadcrumb.pdf, title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-pptx"
    >
      <ToolWorkspace noGrid>
        <div className="w-full max-w-5xl mx-auto">
          {/* Error Banner */}
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
            {/* ─── SCÈNE 1 : DÉPÔT INITIAL CADRÉ (ConversionDropzone) ─── */}
            {!file && !result && !isProcessing && (
              <ConversionDropzone
                sourceFormat={sourceFormat}
                title={isFr ? 'Glissez-déposez votre document PDF' : 'Drag and drop your PDF document'}
                description={
                  isFr
                    ? 'ou cliquez pour parcourir vos dossiers et convertir vos diapositives en présentation PowerPoint (.pptx).'
                    : 'or click to browse your folders and convert your slides into a PowerPoint presentation (.pptx).'
                }
                buttonLabel={isFr ? 'Sélectionner un fichier' : 'Select a file'}
                isDragging={isDragging}
                onFileSelected={validateAndSetFile}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            )}

            {/* ─── SCÈNE 2 : ATELIER STAGING NOBLE (ConversionStaging) ─── */}
            {file && !result && !isProcessing && (
              <ConversionStaging
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                sourceFile={file}
                convertBtnLabel={tc.convertBtn ?? (isFr ? 'Convertir en PowerPoint (PPTX)' : 'Convert to PowerPoint (PPTX)')}
                changeFileBtnLabel={tc.convertAnother ?? (isFr ? 'Changer de fichier' : 'Change file')}
                onConvert={handleConvert}
                onReset={handleReset}
              />
            )}

            {/* ─── SCÈNE 3 : CONDUIT CINÉTIQUE (ConversionConduit) ─── */}
            {isProcessing && (
              <ConversionConduit
                sourceFormat={sourceFormat}
                targetFormat={targetFormat}
                fileName={file?.name}
                statusLabel={tc.converting ?? (isFr ? 'Conversion des diapositives...' : 'Converting slides...')}
              />
            )}

            {/* ─── SCÈNE 4 : RÉSULTAT ET TÉLÉCHARGEMENT DIRECT (ConversionResult) ─── */}
            {result && !isProcessing && (
              <ConversionResult
                targetFormat={targetFormat}
                resultFileName={result.filename}
                resultFileSize={result.sizeAfter}
                downloadBtnLabel={tc.downloadPptx ?? (isFr ? 'Télécharger la présentation PowerPoint' : 'Download PowerPoint presentation')}
                resetBtnLabel={tc.convertAnother ?? (isFr ? 'Convertir un autre document' : 'Convert another document')}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </AnimatePresence>

          {/* Continuum Modal */}
          <DocumentNextActionModal
            toolId="pdf-to-pptx"
            isOpen={isNextActionOpen}
            onClose={() => setIsNextActionOpen(false)}
            resultBlob={result?.blob}
            resultFilename={result?.filename}
            formatType="pptx"
          />
        </div>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
