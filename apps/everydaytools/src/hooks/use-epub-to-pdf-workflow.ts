import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getEpubSourceFormat,
  getPdfTargetFormat,
  validateEpubFile,
  convertEpub,
  triggerDownload,
  type EpubConvertResult,
} from '@/lib/epub-converter-logic';
import type { ConversionFormat } from '@/components/conversion/types';

export interface UseEpubToPdfOptions {
  isFr?: boolean;
}

export interface UseEpubToPdfWorkflowReturn {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  file: File | undefined;
  result: EpubConvertResult | null;
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

function useSafeLocale(options?: UseEpubToPdfOptions): {
  t: any;
  tc: Record<string, any>;
  isFr: boolean;
} {
  try {
    const localeCtx = useLocale();
    const isFr = options?.isFr ?? localeCtx.isFr;
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).epubToPdf ?? {}) as Record<string, any>,
      isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', pdf: 'PDF' } },
        tools: {
          'epub-to-pdf': {
            title: isFr ? 'EPUB en PDF' : 'EPUB to PDF',
            description: isFr
              ? 'Convertissez vos livres électroniques EPUB en documents PDF prêts à imprimer et faciles à partager.'
              : 'Convert EPUB e-books into print-ready, easily shareable PDF documents.',
          },
        },
        epubToPdf: {},
      },
      tc: {} as Record<string, any>,
      isFr,
    };
  }
}

export function useEpubToPdfWorkflow(
  options?: UseEpubToPdfOptions
): UseEpubToPdfWorkflowReturn {
  const { t, tc, isFr } = useSafeLocale(options);
  const sourceFormat = getEpubSourceFormat(isFr);
  const targetFormat = getPdfTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<EpubConvertResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const hasConsumedHandoffRef = useRef(false);

  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateEpubFile(selectedFile, isFr);
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
    const staged = consumeHandoffFile();
    if (staged) {
      hasConsumedHandoffRef.current = true;
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
    trackToolUsed('epub-to-pdf', 'pdf');

    try {
      const res = await convertEpub(file, 'pdf', {
        isFr,
        errorFallback: tc.error,
      });
      setResult(res);
      toast({
        title: isFr ? 'Conversion réussie' : 'Conversion successful',
        description: isFr
          ? 'Votre document PDF est prêt.'
          : 'Your PDF document is ready.',
      });
    } catch (err: any) {
      trackToolError('epub-to-pdf', 'conversion_error');
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
