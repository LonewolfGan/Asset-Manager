import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validatePdfFile,
  convertPdfToText,
  downloadPdfToTextResult,
  type PdfToTextResult,
} from '@/lib/pdf-to-text-logic';

export function usePdfToTextWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.pdfToText;
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<PdfToTextResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      setError(null);
      const validation = validatePdfFile(selectedFile, isFr);
      if (!validation.isValid) {
        setError(validation.error ?? null);
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

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsPreviewOpen(false);
    setIsNextActionOpen(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-to-text', 'pdf');
      const conversionResult = await convertPdfToText(file, {
        isFr,
        errorFallback: tc.error,
      });
      setResult(conversionResult);
    } catch (err) {
      trackToolError('pdf-to-text', 'conversion-error');
      setError(
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? "Échec de l'extraction du texte. Veuillez réessayer."
              : 'Failed to extract text. Please try again.')
      );
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadPdfToTextResult(result, () => {
      setTimeout(() => {
        setIsNextActionOpen(true);
      }, 450);
    });
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
    clearError: () => setError(null),
    isProcessing,
    isDragging,
    isPreviewOpen,
    setIsPreviewOpen,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
  };
}
