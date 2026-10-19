import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile, consumeHandoffText } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateMarkdownFile,
  convertMarkdownToDocx,
  triggerDownload,
  type MarkdownToDocxResult,
  type MarkdownToDocxMode,
} from '@/lib/markdown-to-docx-logic';

export interface UseMarkdownToDocxOptions {
  isFr?: boolean;
}

function useSafeLocale(options?: UseMarkdownToDocxOptions) {
  try {
    const localeCtx = useLocale();
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).markdownToDocx ?? {}) as Record<string, any>,
      isFr: options?.isFr ?? localeCtx.isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', documents: 'Documents' } },
        tools: {
          'markdown-to-docx': {
            title: isFr ? 'Markdown en Word' : 'Markdown to Word',
            description: isFr
              ? 'Convertissez du Markdown en un vrai document Word.'
              : 'Convert Markdown files to Microsoft Word (.docx) format.',
          },
        },
        markdownToDocx: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useMarkdownToDocxWorkflow(options?: UseMarkdownToDocxOptions) {
  const { t, tc, isFr } = useSafeLocale(options);

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<MarkdownToDocxMode>('upload');
  const [markdownInput, setMarkdownInput] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);

  const [result, setResult] = useState<MarkdownToDocxResult | null>(null);
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
    const stagedFile = consumeHandoffFile();
    if (stagedFile) {
      validateAndSetFile(stagedFile);
      return;
    }
    const stagedText = consumeHandoffText();
    if (stagedText) {
      setMarkdownInput(stagedText);
      setMode('paste');
      setIsPastedStaged(true);
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
      trackToolUsed('markdown-to-docx', 'documents');

      const conversionResult = await convertMarkdownToDocx({
        mode,
        file,
        markdownInput,
        errorFallback: tc.error,
      });

      setResult(conversionResult);
    } catch (err) {
      console.error('Markdown to Word conversion error:', err);
      trackToolError('markdown-to-docx', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion en document Word. Veuillez réessayer.'
              : 'Failed to convert to Word document. Please try again.');
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
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [result]);

  const isStaged = (mode === 'upload' && Boolean(file)) || (mode === 'paste' && isPastedStaged);

  const stagedFile = useMemo(() => {
    if (mode === 'upload' && file) return file;
    if (mode === 'paste' && isPastedStaged) {
      return new File([markdownInput], 'saisie-markdown.md', { type: 'text/markdown' });
    }
    return null;
  }, [mode, file, isPastedStaged, markdownInput]);

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
  };
}
