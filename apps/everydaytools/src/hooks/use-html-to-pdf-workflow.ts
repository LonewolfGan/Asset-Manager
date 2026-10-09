import { useState, useCallback, useEffect } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { toast } from '@/hooks/use-toast';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSourceFormat,
  getTargetFormat,
  validateHtmlFile,
  buildPdfFilename,
  convertHtmlToPdf,
} from '@/lib/html-to-pdf-logic';

export interface HtmlToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export function useHtmlToPdfWorkflow() {
  const { t, isFr } = useLocale();
  const tc = t.htmlToPdf;

  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat();

  const [files, setFiles] = useState<File[]>([]);
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [htmlInput, setHtmlInput] = useState('');
  const [isPastedStaged, setIsPastedStaged] = useState(false);

  const [result, setResult] = useState<HtmlToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

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
    setHtmlInput('');
    setIsPastedStaged(false);
    setResult(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

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
      const message =
        err instanceof Error
          ? err.message
          : tc.error ??
            (isFr
              ? 'Échec de la conversion du document HTML en PDF. Veuillez réessayer.'
              : 'Failed to convert HTML document to PDF. Please try again.');
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
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsNextActionOpen(true);
  }, [result]);

  const handleOpenPreview = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [result]);

  const isStaged = (mode === 'upload' && Boolean(file)) || (mode === 'paste' && isPastedStaged);

  const stagedFile =
    mode === 'upload' && file
      ? file
      : mode === 'paste' && isPastedStaged
        ? new File([htmlInput], isFr ? 'code-html.html' : 'html-code.html', { type: 'text/html' })
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
    htmlInput,
    setHtmlInput,
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
