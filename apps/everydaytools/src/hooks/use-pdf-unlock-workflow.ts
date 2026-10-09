import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getPdfUnlockSourceFormat,
  getPdfUnlockTargetFormat,
  validatePdfUnlockFile,
  buildUnlockedPdfFilename,
  unlockPdfDocument,
} from '@/lib/pdf-unlock-logic';

export interface PdfUnlockResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore?: number;
}

export function usePdfUnlockWorkflow(isFr: boolean, errorMessageFallback?: string) {
  const sourceFormat = getPdfUnlockSourceFormat(isFr);
  const targetFormat = getPdfUnlockTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [result, setResult] = useState<PdfUnlockResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setPassword('');
    setShowPassword(false);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && files.length > 0 && !isProcessing) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [files.length, isProcessing, handleReset]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validatePdfUnlockFile(selectedFile);
      if (!validation.valid) {
        if (validation.error === 'unsupported_format') {
          setError(
            isFr
              ? 'Veuillez sélectionner un document au format PDF valide.'
              : 'Please select a valid PDF document.'
          );
        } else if (validation.error === 'file_too_large') {
          setError(
            isFr
              ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
              : 'The file exceeds the maximum allowed size of 50 MB.'
          );
        }
        return;
      }

      setError(null);
      setResult(null);
      setPassword('');
      setFiles([selectedFile]);
    },
    [isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (
      staged &&
      (staged.type === 'application/pdf' || staged.name.toLowerCase().endsWith('.pdf'))
    ) {
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
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-unlock', 'pdf');
      const endpoint = apiUrl('/api/tools/pdf-unlock');

      const [blob] = await Promise.all([
        unlockPdfDocument(file, password, endpoint),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      setResult({
        blob,
        filename: buildUnlockedPdfFilename(file.name),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('pdf-unlock', 'general-error');
      setError(e instanceof Error ? e.message : errorMessageFallback ?? null);
    } finally {
      setIsProcessing(false);
    }
  }, [file, isProcessing, password, errorMessageFallback]);

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
    sourceFormat,
    targetFormat,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleConvert,
    handleDownload,
  };
}

export type PdfUnlockWorkflow = ReturnType<typeof usePdfUnlockWorkflow>;
