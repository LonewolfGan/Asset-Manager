import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getPdfRepairSourceFormat,
  getPdfRepairTargetFormat,
  validatePdfRepairFile,
  buildRepairedPdfFilename,
  repairPdfDocument,
} from '@/lib/pdf-repair-logic';

export interface PdfRepairResult {
  blob: Blob;
  filename: string;
  sizeAfter: number;
  sizeBefore: number;
  recoveredPages?: number;
}

export function usePdfRepairWorkflow(isFr: boolean, errorMessageFallback?: string) {
  const sourceFormat = getPdfRepairSourceFormat(isFr);
  const targetFormat = getPdfRepairTargetFormat(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<PdfRepairResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState<boolean>(false);

  const file = files[0];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
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
      const validation = validatePdfRepairFile(selectedFile);
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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        validateAndSetFile(e.dataTransfer.files[0]);
      }
    },
    [validateAndSetFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleRepair = useCallback(async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-repair', 'pdf');
      const endpoint = apiUrl('/api/tools/pdf-repair');
      const { blob: repairedBlob, pageCount } = await repairPdfDocument(
        file,
        endpoint
      );

      const repairedFilename = buildRepairedPdfFilename(file.name);

      setResult({
        blob: repairedBlob,
        filename: repairedFilename,
        sizeAfter: repairedBlob.size,
        sizeBefore: file.size,
        recoveredPages: pageCount,
      });
      setIsProcessing(false);
    } catch (e) {
      trackToolError('pdf-repair', 'general-error');
      const msg = e instanceof Error ? e.message : errorMessageFallback;
      setError(msg === 'true' ? errorMessageFallback ?? null : msg ?? null);
      setIsProcessing(false);
    }
  }, [file, isProcessing, errorMessageFallback]);

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
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    isNextActionOpen,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleRepair,
    handleDownload,
  };
}

export type PdfRepairWorkflow = ReturnType<typeof usePdfRepairWorkflow>;
