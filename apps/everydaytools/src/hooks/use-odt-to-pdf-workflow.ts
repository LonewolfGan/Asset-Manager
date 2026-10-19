import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { formatFetchError } from '@/lib/apiBase';
import {
  getSourceFormat,
  getTargetFormat,
  validateOdtFile,
  convertOdtToPdf,
  triggerDownload,
  openPreview,
  type OdtToPdfResult,
} from '@/lib/odt-to-pdf-logic';

export interface UseOdtToPdfOptions {
  isFr?: boolean;
}

function useSafeLocale(options?: UseOdtToPdfOptions) {
  try {
    const localeCtx = useLocale();
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).odtToPdf ?? {}) as Record<string, any>,
      isFr: options?.isFr ?? localeCtx.isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', documents: 'Documents' } },
        tools: {
          'odt-to-pdf': {
            title: isFr ? 'ODT en PDF' : 'ODT to PDF',
            description: isFr
              ? 'Convertissez des documents ODT en fichiers PDF de haute fidélité.'
              : 'Convert OpenDocument Text (ODT) files to PDF with maximum layout fidelity.',
          },
        },
      },
      tc: {
        convertBtn: isFr ? 'Convertir en PDF' : 'Convert to PDF',
        converting: isFr
          ? 'Conversion du document ODT en PDF haute fidélité...'
          : 'Converting ODT document to high-fidelity PDF...',
        convertAnother: isFr ? 'Changer de fichier' : 'Change file',
        downloadPdf: isFr ? 'Télécharger le document PDF' : 'Download PDF document',
        error: isFr
          ? 'Échec de la conversion du document ODT en PDF. Veuillez vérifier votre fichier.'
          : 'Failed to convert ODT document to PDF. Please check your file.',
      },
      isFr,
    };
  }
}

export function useOdtToPdfWorkflow(options?: UseOdtToPdfOptions) {
  const { t, tc, isFr } = useSafeLocale(options);

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<OdtToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const hasConsumedHandoffRef = useRef(false);
  const file = files[0];

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateOdtFile(selectedFile, isFr);
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

  const handleConvert = useCallback(async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('odt-to-pdf', 'documents');
      const conversionResult = await convertOdtToPdf(file, {
        isFr,
        errorFallback: tc.error,
      });
      setResult(conversionResult);
    } catch (err) {
      console.error('ODT to PDF conversion error:', err);
      trackToolError('odt-to-pdf', 'conversion-error');
      const message = formatFetchError(err, isFr);
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

  // Global Escape keyboard shortcut
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
        if (isNextActionOpen) return;
        if (!isProcessing && (file || result)) {
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNextActionOpen, isProcessing, file, result, handleReset]);

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
  };
}
