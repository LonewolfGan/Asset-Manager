import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from '@/hooks/use-toast';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { runAsyncDocumentConversion } from '@/lib/async-conversion';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  validateWordFile,
  generatePdfFileName,
  getSourceFormat,
  getTargetFormat,
} from '@/lib/word-to-pdf-logic';
import type { ConversionFormat } from '@/components/conversion/types';

export interface WordToPdfResult {
  blob: Blob;
  filename: string;
  sizeBefore?: number;
  sizeAfter: number;
}

export interface UseWordToPdfWorkflowOptions {
  isFr: boolean;
}

export interface UseWordToPdfWorkflowReturn {
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  file: File | null;
  result: WordToPdfResult | null;
  setResult: React.Dispatch<React.SetStateAction<WordToPdfResult | null>>;
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
  handleOpenPreview: () => void;
}

export function useWordToPdfWorkflow({
  isFr,
}: UseWordToPdfWorkflowOptions): UseWordToPdfWorkflowReturn {
  const sourceFormat = getSourceFormat(isFr);
  const targetFormat = getTargetFormat(isFr);

  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<WordToPdfResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const hasConsumedHandoffRef = useRef(false);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validateWordFile(selectedFile, isFr);
      if (!validation.valid) {
        toast({
          variant: 'destructive',
          title: isFr ? 'Fichier non supporté' : 'Unsupported file',
          description: validation.error,
        });
        return;
      }
      setFile(selectedFile);
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
    setFile(null);
    setResult(null);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing) {
        const activeTag = document.activeElement?.tagName.toLowerCase();
        if (activeTag === 'input' || activeTag === 'textarea') return;
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProcessing, handleReset]);

  const handleConvert = async () => {
    if (!file || isProcessing) return;
    setIsProcessing(true);

    try {
      trackToolUsed('word-to-pdf', 'documents');

      const res = await runAsyncDocumentConversion({
        taskType: 'word-to-pdf',
        file,
        targetFormat: 'pdf',
        fallbackSyncUrl: '/api/tools/word-to-pdf',
      });

      setResult({
        blob: res.blob,
        filename: res.filename || generatePdfFileName(file.name),
        sizeAfter: res.sizeAfter || res.blob.size,
        sizeBefore: file.size,
      });
    } catch (err) {
      console.error('Word to PDF conversion error:', err);
      trackToolError('word-to-pdf', 'conversion-error');
      const message =
        err instanceof Error
          ? err.message
          : isFr
            ? 'Échec de la conversion en PDF. Veuillez réessayer.'
            : 'Failed to convert to PDF. Please try again.';
      toast({
        variant: 'destructive',
        title: isFr ? 'Erreur de conversion' : 'Conversion error',
        description: message,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  };

  const handleOpenPreview = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const win = window.open(url, '_blank');
    if (!win) {
      toast({
        variant: 'destructive',
        title: isFr ? 'Popup bloquée' : 'Popup blocked',
        description: isFr
          ? "Veuillez autoriser les fenêtres surgissantes pour afficher l'aperçu PDF."
          : 'Please allow popups to view the PDF preview.',
      });
    }
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000);
  };

  return {
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
