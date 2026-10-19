import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateWordFile,
  convertWordToText,
  triggerDownload,
  type WordToTextResult,
} from '@/lib/word-to-text-logic';
import type { ConversionFormat } from '@/components/conversion/types';

export interface UseWordToTextWorkflowOptions {
  isFr?: boolean;
}

export interface UseWordToTextWorkflowReturn {
  t: any;
  tc: any;
  isFr: boolean;
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  file: File | undefined;
  result: WordToTextResult | null;
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

function useSafeLocale(options?: UseWordToTextWorkflowOptions): {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
} {
  try {
    const localeCtx = useLocale();
    const isFr = options?.isFr ?? localeCtx.isFr;
    return {
      t: localeCtx.t,
      tc: (localeCtx.t.wordToText ?? {}) as Record<string, any>,
      isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        tools: {
          'word-to-text': {
            title: isFr ? 'Word en Texte' : 'Word to Text',
            description: isFr
              ? 'Extrayez le texte brut de documents Word.'
              : 'Extract plain text from Word document.',
          },
        },
        wordToText: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useWordToTextWorkflow(
  options?: UseWordToTextWorkflowOptions
): UseWordToTextWorkflowReturn {
  const { t, tc, isFr } = useSafeLocale(options);
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<WordToTextResult | null>(null);
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
      trackToolUsed('word-to-text', 'documents');
      const conversionResult = await convertWordToText(file, {
        isFr,
        errorFallback: tc.error,
      });
      setResult(conversionResult);
    } catch (err) {
      console.error('Word to Text extraction error:', err);
      trackToolError('word-to-text', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de l’extraction du texte. Veuillez réessayer.'
              : 'Failed to extract text. Please try again.');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur d’extraction' : 'Extraction error',
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
