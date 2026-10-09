import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateTxtFile,
  convertTxtToPdf,
  triggerDownload,
  openPdfPreview,
  type TxtToPdfResult,
  type TxtToPdfMode,
} from '@/lib/txt-to-pdf-logic';

export function useTxtToPdfWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.txtToPdf;

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<TxtToPdfMode>('upload');
  const [textInput, setTextInput] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);

  const [result, setResult] = useState<TxtToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateTxtFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format non supporté' : 'Unsupported format',
          description: validation.error,
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

  const handleReset = useCallback(() => {
    setFiles([]);
    setTextInput('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (mode === 'upload' && !file) return;
    if (mode === 'paste' && !textInput.trim()) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      trackToolUsed('txt-to-pdf', 'documents');

      const conversionResult = await convertTxtToPdf({
        mode,
        file,
        textInput,
        errorFallback: tc.error,
        isFr,
      });

      setResult(conversionResult);
    } catch (err) {
      console.error('Text to PDF conversion error:', err);
      trackToolError('txt-to-pdf', 'conversion-error');
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
  }, [mode, file, textInput, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
    setIsNextActionOpen(true);
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (!result) return;
    openPdfPreview(result.blob);
  }, [result]);

  const isStaged = mode === 'upload' ? Boolean(file) : isPastedStaged && Boolean(textInput.trim());

  const stagedFile =
    mode === 'upload'
      ? file
      : isPastedStaged
      ? new File([textInput], isFr ? 'texte-saisi.txt' : 'pasted-text.txt', { type: 'text/plain' })
      : null;

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    mode,
    setMode,
    files,
    file,
    textInput,
    setTextInput,
    isPastedStaged,
    setIsPastedStaged,
    result,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    isStaged,
    stagedFile,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleReset,
    handleConvert,
    handleDownload,
    handleOpenPreview,
  };
}
