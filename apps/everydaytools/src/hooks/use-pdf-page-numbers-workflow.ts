import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import type { PdfNumberPosition } from '@/lib/pdf-page-numbers-logic';

export interface UsePdfPageNumbersWorkflowOptions {
  isFr: boolean;
  tc: Record<string, any>;
  onResetExtra?: () => void;
}

export function usePdfPageNumbersWorkflow({
  isFr,
  tc,
  onResetExtra,
}: UsePdfPageNumbersWorkflowOptions) {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{
    blob: Blob;
    filename: string;
    sizeAfter: number;
    sizeBefore?: number;
  } | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  // Precision numbering parameters
  const [position, setPosition] = useState<PdfNumberPosition>('bottom-center');
  const [startNum, setStartNum] = useState<number>(1);
  const [fontSize, setFontSize] = useState<number>(11);
  const [format, setFormat] = useState<string>('{n}');
  const [skipFirst, setSkipFirst] = useState<boolean>(false);

  const file = files[0];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setPosition('bottom-center');
    setStartNum(1);
    setFontSize(11);
    setFormat('{n}');
    setSkipFirst(false);
    setIsProcessing(false);
    setIsNextActionOpen(false);
    onResetExtra?.();
  }, [onResetExtra]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && file && !isProcessing && !result) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, isProcessing, result, handleReset]);

  const handleToggleSkipFirst = useCallback(() => {
    setSkipFirst((prev) => !prev);
  }, []);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const isPdf =
        selectedFile.type === 'application/pdf' ||
        selectedFile.name.toLowerCase().endsWith('.pdf');

      if (!isPdf) {
        setError(
          isFr
            ? 'Veuillez sélectionner un document au format PDF valide.'
            : 'Please select a valid PDF document.'
        );
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        setError(
          isFr
            ? 'Le document dépasse la taille maximale autorisée de 50 Mo.'
            : 'The document exceeds the maximum allowed size of 50 MB.'
        );
        return;
      }

      setError(null);
      setResult(null);
      setFiles([selectedFile]);
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

  const handleConvert = useCallback(async () => {
    if (!file) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-page-numbers', 'pdf');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('position', position);
      fd.append('startFrom', String(startNum));
      fd.append('fontSize', String(fontSize));
      fd.append('skipFirst', String(skipFirst));
      fd.append('format', format);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-page-numbers'), {
          method: 'POST',
          body: fd,
        }),
        new Promise((resolve) => setTimeout(resolve, 800)),
      ]);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({ error: tc.error }))) as {
          error?: string;
        };
        throw new Error(err.error ?? tc.error);
      }

      const blob = await res.blob();
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '_numbered.pdf'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('pdf-page-numbers', 'general-error');
      setError(e instanceof Error ? e.message : tc.error);
    } finally {
      setIsProcessing(false);
    }
  }, [file, fontSize, format, position, skipFirst, startNum, tc.error]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [result]);

  return {
    file,
    files,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    position,
    setPosition,
    startNum,
    setStartNum,
    fontSize,
    setFontSize,
    format,
    setFormat,
    skipFirst,
    setSkipFirst,
    handleToggleSkipFirst,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleConvert,
    handleDownload,
    handleReset,
  };
}
