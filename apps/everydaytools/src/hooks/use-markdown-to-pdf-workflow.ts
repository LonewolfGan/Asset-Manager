import { useState, useCallback, useEffect, useRef } from 'react';
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

export interface UseMarkdownToPdfOptions {
  isFr?: boolean;
}

function useSafeLocale(options?: UseMarkdownToPdfOptions) {
  try {
    const localeCtx = useLocale();
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).markdownToPdf ?? {}) as Record<string, any>,
      isFr: options?.isFr ?? localeCtx.isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', documents: 'Documents' } },
        tools: {
          'markdown-to-pdf': {
            title: isFr ? 'Markdown en PDF' : 'Markdown to PDF',
            description: isFr
              ? 'Convertissez vos fichiers Markdown en documents PDF.'
              : 'Convert Markdown (.md) or text files into an elegant, formatted PDF document.',
          },
        },
        markdownToPdf: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useMarkdownToPdfWorkflow(options?: UseMarkdownToPdfOptions) {
  const { t, tc, isFr } = useSafeLocale(options);

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
      setMode('upload');
      setResult(null);
    },
    [isFr]
  );

  const hasConsumedHandoffRef = useRef(false);
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
    setMarkdownInput('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing && !isNextActionOpen) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, isNextActionOpen, handleReset]);

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
