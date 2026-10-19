import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateWordFile,
  convertWordToMarkdown,
  triggerDownload,
  type WordToMarkdownResult,
} from '@/lib/word-to-markdown-logic';
import type { ConversionFormat } from '@/components/conversion/types';

export interface UseWordToMarkdownWorkflowOptions {
  isFr?: boolean;
}

export interface UseWordToMarkdownWorkflowReturn {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  file: File | undefined;
  result: WordToMarkdownResult | null;
  isProcessing: boolean;
  isDragging: boolean;
  previewOpen: boolean;
  setPreviewOpen: (open: boolean) => void;
  isNextActionOpen: boolean;
  setIsNextActionOpen: (open: boolean) => void;
  validateAndSetFile: (selectedFile: File) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: () => void;
  handleDrop: (e: React.DragEvent) => void;
  handleReset: () => void;
  handleConvert: () => Promise<void>;
  handleDownload: () => void;
}

function useSafeLocale(options?: UseWordToMarkdownWorkflowOptions): {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
} {
  try {
    const localeCtx = useLocale();
    const isFr = options?.isFr ?? localeCtx.isFr;
    return {
      t: localeCtx.t,
      tc: (localeCtx.t.wordToMarkdown ?? {}) as Record<string, any>,
      isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        tools: {
          'word-to-markdown': {
            title: isFr ? 'Word en Markdown' : 'Word to Markdown',
            description: isFr
              ? 'Convertissez vos fichiers DOCX en syntaxe Markdown propre et lisible.'
              : 'Convert DOCX files to clean Markdown.',
          },
        },
        wordToMarkdown: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useWordToMarkdownWorkflow(
  options?: UseWordToMarkdownWorkflowOptions
): UseWordToMarkdownWorkflowReturn {
  const { t, tc, isFr } = useSafeLocale(options);
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<WordToMarkdownResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const hasConsumedHandoffRef = useRef(false);
  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateWordFile(selectedFile, isFr);
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
    setPreviewOpen(false);
    setIsNextActionOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        if (previewOpen || isNextActionOpen) return;
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, previewOpen, isNextActionOpen, handleReset]);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('word-to-markdown', 'documents');
      const conversionResult = await convertWordToMarkdown(file, {
        isFr,
        errorFallback: tc.error,
      });
      setResult(conversionResult);
    } catch (err) {
      console.error('Word to Markdown conversion error:', err);
      trackToolError('word-to-markdown', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion en Markdown. Veuillez réessayer.'
              : 'Failed to convert to Markdown. Please try again.');
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
  }, [result]);

  return {
    t,
    tc,
    isFr,
    sourceFormat,
    targetFormat,
    file,
    result,
    isProcessing,
    isDragging,
    previewOpen,
    setPreviewOpen,
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
