import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateMarkdownFile,
  convertMarkdownToPdf,
  triggerDownload,
  openPdfPreview,
  type MarkdownToPdfResult,
  type MarkdownToPdfMode,
} from '@/lib/markdown-to-pdf-logic';

export function useMarkdownToPdfWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.markdownToPdf;

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat();

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<MarkdownToPdfMode>('upload');
  const [markdownInput, setMarkdownInput] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);

  const [result, setResult] = useState<MarkdownToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateMarkdownFile(selectedFile, isFr);
      if (!validation.isValid) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Format ou taille invalide' : 'Invalid format or size',
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
    setMarkdownInput('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  const handleConvert = useCallback(async () => {
    if (mode === 'upload' && !file) return;
    if (mode === 'paste' && !markdownInput.trim()) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      trackToolUsed('markdown-to-pdf', 'documents');

      const conversionResult = await convertMarkdownToPdf({
        mode,
        file,
        markdownInput,
        errorFallback: tc.error,
      });

      setResult(conversionResult);
    } catch (err) {
      console.error('Markdown to PDF conversion error:', err);
      trackToolError('markdown-to-pdf', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion en document PDF. Veuillez réessayer.'
              : 'Failed to convert to PDF document. Please try again.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [mode, file, markdownInput, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
    setIsNextActionOpen(true);
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (!result) return;
    openPdfPreview(result.blob);
  }, [result]);

  const isStaged = (mode === 'upload' && Boolean(file)) || (mode === 'paste' && isPastedStaged);

  const stagedFile =
    mode === 'upload' && file
      ? file
      : mode === 'paste' && isPastedStaged
        ? new File([markdownInput], 'saisie-markdown.md', { type: 'text/markdown' })
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
    markdownInput,
    setMarkdownInput,
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
