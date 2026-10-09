import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type ImageFormat,
  getSourceFormat,
  getFormatConfigs,
  validatePdfFile,
  convertPdfToImages,
  triggerDownload,
  type PdfToImageResult,
} from '@/lib/pdf-to-image-logic';

export function usePdfToImageWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.pdfToImage;
  const sourceFormat = getSourceFormat(isFr);
  const formatConfigs = getFormatConfigs(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<PdfToImageResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];
  const targetFormat = formatConfigs[format];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validatePdfFile(selectedFile, isFr);
      if (!validation.isValid) {
        setError(validation.error ?? null);
        return;
      }

      setError(null);
      setResult(null);
      setFiles([selectedFile]);
    },
    [isFr]
  );

  useEffect(() => {
    const handoff = consumeHandoffFile();
    if (handoff && (handoff.type === 'application/pdf' || handoff.name.toLowerCase().endsWith('.pdf'))) {
      validateAndSetFile(handoff);
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
      trackToolUsed('pdf-to-image', 'images');
      const conversionResult = await convertPdfToImages(file, format, tc.error);
      setResult(conversionResult);
    } catch (e) {
      trackToolError('pdf-to-image', 'general-error');
      const msg = e instanceof Error ? e.message : tc.error;
      setError(msg === 'true' ? tc.error : msg);
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, format, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);

    if (!result.isZip) {
      setTimeout(() => {
        setIsNextActionOpen(true);
      }, 450);
    }
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    formatConfigs,
    targetFormat,
    file,
    format,
    setFormat,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleConvert,
    handleReset,
    handleDownload,
  };
}
