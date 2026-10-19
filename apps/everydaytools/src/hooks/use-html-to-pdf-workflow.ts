import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile, consumeHandoffText } from '@/lib/file-handoff';
import { formatFetchError } from '@/lib/apiBase';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlFile,
  buildPdfFilename,
  convertHtmlToPdf,
  triggerDownload,
  type HtmlToPdfMode,
  type HtmlToPdfResult,
} from '@/lib/html-to-pdf-logic';

export interface UseHtmlToPdfOptions {
  isFr?: boolean;
}

function useSafeLocale(options?: UseHtmlToPdfOptions) {
  try {
    const localeCtx = useLocale();
    return {
      t: localeCtx.t,
      tc: ((localeCtx.t as any).htmlToPdf ?? {}) as Record<string, any>,
      isFr: options?.isFr ?? localeCtx.isFr,
    };
  } catch {
    const isFr = options?.isFr ?? false;
    return {
      t: {
        nav: { breadcrumb: { home: isFr ? 'Accueil' : 'Home', documents: 'Documents' } },
        tools: {
          'html-to-pdf': {
            title: isFr ? 'HTML en PDF' : 'HTML to PDF',
            description: isFr
              ? 'Convertissez des documents HTML en fichiers PDF paginés de haute fidélité.'
              : 'Convert HTML snippets or files into structured, printable PDF documents.',
          },
        },
      },
      tc: {
        convertBtn: isFr ? 'Convertir en PDF' : 'Convert to PDF',
        converting: isFr
          ? 'Génération du document PDF haute fidélité...'
          : 'Generating high-fidelity PDF...',
        convertAnother: isFr ? 'Changer de fichier / code' : 'Change file / code',
        downloadPdf: isFr ? 'Télécharger le document PDF' : 'Download PDF document',
        tabUpload: isFr ? 'Importer un fichier (.html)' : 'Upload file (.html)',
        tabPaste: isFr ? 'Coller du code HTML' : 'Paste HTML code',
        error: isFr
          ? 'Échec de la conversion du document HTML en PDF. Veuillez réessayer.'
          : 'Failed to convert HTML document to PDF. Please try again.',
      },
      isFr,
    };
  }
}

export function useHtmlToPdfWorkflow(options?: UseHtmlToPdfOptions) {
  const { t, tc, isFr } = useSafeLocale(options);

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat();

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<HtmlToPdfMode>('upload');
  const [htmlInput, setHtmlInput] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);

  const [result, setResult] = useState<HtmlToPdfResult | null>(null);
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
    if (hasConsumedHandoffRef.current) return;
    hasConsumedHandoffRef.current = true;

    const staged = consumeHandoffFile();
    if (staged) {
      validateAndSetFile(staged);
      setMode('upload');
      return;
    }

    const handedText = consumeHandoffText();
    if (handedText && handedText.trim()) {
      setHtmlInput(handedText);
      setMode('paste');
      setIsPastedStaged(true);
      setResult(null);
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
    if (mode !== 'paste') {
      setHtmlInput('');
    }
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, [mode]);

  const handleConvert = useCallback(async () => {
    if (mode === 'upload' && !file) return;
    if (mode === 'paste' && !htmlInput.trim()) return;
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      trackToolUsed('html-to-pdf', 'documents');

      const filename = buildPdfFilename(mode, file, isFr);
      const sizeBefore =
        mode === 'upload' && file ? file.size : new Blob([htmlInput]).size;

      const blob = await convertHtmlToPdf({
        mode,
        file,
        htmlInput,
        fallbackError: tc.error,
      });

      setResult({
        blob,
        filename,
        sizeAfter: blob.size,
        sizeBefore,
      });
    } catch (err) {
      console.error('HTML to PDF conversion error:', err);
      trackToolError('html-to-pdf', 'conversion-error');
      const message = formatFetchError(err, isFr);
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  }, [mode, file, htmlInput, isProcessing, isFr, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    triggerDownload(result.blob, result.filename);
    setIsNextActionOpen(true);
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    window.open(url, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 10000);
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
        if (!isProcessing && (file || isPastedStaged || result)) {
          handleReset();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isNextActionOpen, isProcessing, file, isPastedStaged, result, handleReset]);

  const isStaged = (mode === 'upload' && Boolean(file)) || (mode === 'paste' && isPastedStaged);

  const stagedFile = useMemo(() => {
    if (mode === 'upload' && file) {
      return file;
    }
    if (mode === 'paste' && isPastedStaged) {
      return new File([htmlInput], isFr ? 'code-html.html' : 'html-code.html', {
        type: 'text/html',
      });
    }
    return null;
  }, [mode, file, isPastedStaged, htmlInput, isFr]);

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
    htmlInput,
    setHtmlInput,
    isPastedStaged,
    setIsPastedStaged,
    result,
    setResult,
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
