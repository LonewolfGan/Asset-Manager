import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateRtfFile,
  convertRtfToPdf,
  triggerDownload,
  openPreview,
  type RtfToPdfResult,
} from '@/lib/rtf-to-pdf-logic';

export function useRtfToPdfWorkflow() {
  const { t, isFr } = useLocale();
  const tc = (t as any).rtfToPdf ?? {};

  const sourceFormat = useMemo(() => getSourceFormat(isFr), [isFr]);
  const targetFormat = useMemo(() => getTargetFormat(isFr), [isFr]);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<RtfToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const hasConsumedHandoffRef = useRef(false);

  const file = useMemo(() => files[0], [files]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateRtfFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: validation.errorTitle,
          description: validation.errorDesc,
        });
        return;
      }
      setFiles([selectedFile]);
      setResult(null);
    },
    [isFr]
  );

  useEffect(() => {
    if (hasConsumedHandoffRef.current) return;
    hasConsumedHandoffRef.current = true;
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
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  // Keyboard shortcut: Escape to reset staged file when idle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
        if (isNextActionOpen) {
          return;
        }
        if (file && !isProcessing) {
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, isProcessing, isNextActionOpen, handleReset]);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('rtf-to-pdf', 'documents');
      const conversionResult = await convertRtfToPdf(file, {
        isFr,
        errorFallback: tc.error,
      });
      setResult(conversionResult);
    } catch (err) {
      console.error('RTF to PDF conversion error:', err);
      trackToolError('rtf-to-pdf', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : isFr
            ? 'Échec de la conversion du document RTF en PDF. Veuillez réessayer.'
            : 'Failed to convert RTF document to PDF. Please try again.';
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
    setIsNextActionOpen(true);
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (!result) return;
    openPreview(result.blob);
  }, [result]);

  const handleOpenNextAction = useCallback(() => {
    setIsNextActionOpen(true);
  }, []);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    result,
    setResult,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
    handleOpenPreview,
    handleOpenNextAction,
  };
}
