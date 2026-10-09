import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  getSupportedLanguages,
  validatePdfOcrFile,
  buildPdfOcrFilename,
  calculateOcrStats,
  performPdfOcr,
} from '@/lib/pdf-ocr-logic';

export interface PdfOcrResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore?: number;
  textOutput: string;
  wordCount: number;
  charCount: number;
  totalPages?: number;
}

export function usePdfOcrWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.pdfOcr;
  const sourceFormat = useMemo(() => getSourceFormat(isFr), [isFr]);
  const targetFormat = useMemo(() => getTargetFormat(isFr), [isFr]);
  const supportedLanguages = useMemo(
    () => getSupportedLanguages(isFr, tc),
    [isFr, tc]
  );

  const [files, setFiles] = useState<File[]>([]);
  const [lang, setLang] = useState('eng+fra');
  const [result, setResult] = useState<PdfOcrResult | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validatePdfOcrFile(selectedFile, isFr);
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
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        validateAndSetFile(droppedFiles[0]);
      }
    },
    [validateAndSetFile]
  );

  const runOcr = useCallback(async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);
    trackToolUsed('pdf-ocr', 'pdf');

    try {
      const ocrData = await performPdfOcr(file, lang, isFr, tc.error);
      const extractedText = ocrData.text;

      const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
      const filename = buildPdfOcrFilename(file.name, isFr);
      const stats = calculateOcrStats(extractedText);

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore: file.size,
        textOutput: extractedText,
        wordCount: stats.wordCount,
        charCount: stats.charCount,
        totalPages: ocrData.totalPages,
      });
    } catch (e) {
      trackToolError('pdf-ocr', 'general-error');
      const msg = e instanceof Error ? e.message : tc.error;
      setError(msg === 'true' ? tc.error : msg);
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, lang, isFr, tc.error]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const handleDownload = useCallback(() => {
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
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    supportedLanguages,
    files,
    file,
    lang,
    setLang,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    runOcr,
    handleReset,
    handleDownload,
  };
}
