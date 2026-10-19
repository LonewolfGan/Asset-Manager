import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlFile,
  convertHtmlToWord,
  triggerDownload,
  type HtmlToWordResult,
} from '@/lib/html-to-word-logic';
import type { ConversionFormat } from '@/components/conversion/types';

export interface UseHtmlToWordOptions {
  isFr?: boolean;
}

export interface UseHtmlToWordWorkflowReturn {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  file: File | undefined;
  result: HtmlToWordResult | null;
  isProcessing: boolean;
  isDragging: boolean;
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

function useSafeLocale(options?: UseHtmlToWordOptions): {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
} {
  try {
    const localeCtx = useLocale();
    const isFr = options?.isFr ?? localeCtx.isFr;
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).htmlToWord ?? {}) as Record<string, any>,
      isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', documents: 'Documents' } },
        tools: {
          'html-to-word': {
            title: isFr ? 'HTML en Word' : 'HTML to Word',
            description: isFr
              ? 'Convertissez vos pages et balises HTML en documents Microsoft Word (.docx) prêts à l’édition.'
              : 'Convert HTML code and web pages into editable Microsoft Word (.docx) documents.',
          },
        },
        htmlToWord: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useHtmlToWordWorkflow(
  options?: UseHtmlToWordOptions
): UseHtmlToWordWorkflowReturn {
  const { t, tc, isFr } = useSafeLocale(options);
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<HtmlToWordResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const hasConsumedHandoffRef = useRef(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateHtmlFile(selectedFile, isFr);
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
      const droppedFile = e.dataTransfer.files?.[0];
      if (droppedFile) {
        validateAndSetFile(droppedFile);
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

  // Global Escape shortcut to reset workflow at rest
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing && (file || result)) {
        if (isNextActionOpen) return;
        const activeTag = document.activeElement?.tagName?.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, handleReset, isNextActionOpen, isProcessing, result]);

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;

    setIsProcessing(true);
    trackToolUsed('html-to-word', 'documents');

    try {
      const res = await convertHtmlToWord(file, {
        isFr,
        errorFallback: tc.error,
      });
      setResult(res);
      toast({
        title: isFr ? 'Conversion réussie' : 'Conversion successful',
        description: isFr
          ? 'Votre document Word est prêt au téléchargement.'
          : 'Your Word document is ready for download.',
      });
    } catch (err: any) {
      trackToolError('html-to-word', 'conversion_error');
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: err.message ?? tc.error,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);

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
    file,
    result,
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
  };
}
