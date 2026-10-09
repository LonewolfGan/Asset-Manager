import { useState, useCallback } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import {
  getSourceFormat,
  getTargetFormat,
  getSupportedLanguages,
  validateImageFile,
  performImageOcr,
  triggerDownload,
  type OcrResult,
} from '@/lib/ocr-logic';

export function useOcrWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.ocr;
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);
  const supportedLanguages = getSupportedLanguages(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [lang, setLang] = useState<string>('fra+eng');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [result, setResult] = useState<OcrResult | null>(null);

  const file = files[0] ?? null;

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setProgress(0);
  }, []);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateImageFile(selectedFile, isFr);
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

  const handleExtract = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);
    setProgress(0);
    setError(null);
    trackToolUsed('ocr', 'utilities');

    try {
      const ocrResult = await performImageOcr({
        file,
        lang,
        onProgress: setProgress,
        errorFallback: tc.error,
        isFr,
      });

      setResult(ocrResult);
    } catch (e) {
      trackToolError('ocr', 'general-error');
      const msg = e instanceof Error ? e.message : tc.error;
      setError(msg === 'true' ? tc.error : msg);
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, lang, tc.error, isFr]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    supportedLanguages,
    file,
    lang,
    setLang,
    isProcessing,
    progress,
    error,
    setError,
    isDragging,
    result,
    validateAndSetFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleExtract,
    handleReset,
    handleDownload,
  };
}
