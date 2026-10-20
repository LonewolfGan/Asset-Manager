import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { downloadBlob } from '@/lib/download';
import { consumeHandoffFile } from '@/lib/file-handoff';
import type { ConversionFormat } from '@/components/conversion';

export const getPdfSourceFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PDF',
  extension: 'pdf',
  icon: '/icons/pdf.svg',
  color: '#EC1C24',
  subLabel: isFr ? 'Document Adobe Acrobat' : 'Adobe Acrobat Document',
});

export const getPptxTargetFormat = (isFr: boolean): ConversionFormat => ({
  name: 'PPTX',
  extension: 'pptx',
  icon: '/icons/pptx.svg',
  color: '#D24726',
  subLabel: isFr ? 'Présentation PowerPoint (.pptx)' : 'PowerPoint Presentation (.pptx)',
});

export function usePdfToPptxWorkflow() {
  const { t, isFr } = useLocale();
  const tc = (t as any).pdfToPptx ?? {};
  const sourceFormat = getPdfSourceFormat(isFr);
  const targetFormat = getPptxTargetFormat(isFr);

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

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
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
    },
    [isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
    }
  }, [validateAndSetFile]);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-to-pptx', 'documents');
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch(apiUrl('/api/tools/pdf-to-pptx'), {
        method: 'POST',
        body: fd,
      });

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
  }, [file, isProcessing, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleReset,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleConvert,
    handleDownload,
  };
}
