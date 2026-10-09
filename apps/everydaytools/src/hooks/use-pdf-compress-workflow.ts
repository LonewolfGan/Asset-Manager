import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { downloadBlob } from '@/lib/download';
import {
  type Level,
  type CompressionPreset,
  getPresets,
  validatePdfFile,
  formatResultFilename,
  calculateGain,
} from '@/lib/pdf-compress-logic';

export interface PdfCompressResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
  gain: number;
}

export interface UsePdfCompressWorkflowOptions {
  isFr: boolean;
}

export function usePdfCompressWorkflow({ isFr }: UsePdfCompressWorkflowOptions) {
  const presets: CompressionPreset[] = getPresets(isFr);

  const [files, setFiles] = useState<File[]>([]);
  const [level, setLevel] = useState<Level>('ebook');
  const [result, setResult] = useState<PdfCompressResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [liveBytes, setLiveBytes] = useState<number>(0);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0];

  // Fluid telemetry countdown during processing
  useEffect(() => {
    if (!isProcessing || !file) return;

    const startSize = file.size;
    const selectedPreset = presets.find((p) => p.id === level) ?? presets[1];
    const targetSize = Math.max(Math.round(startSize * selectedPreset.ratio), 1024);
    const duration = 2400;
    const startTime = performance.now();

    const interval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(startSize - (startSize - targetSize) * ease);
      setLiveBytes(current);

      if (progress >= 1) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [isProcessing, file, level, presets]);

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, []);

  // Keyboard shortcut: Esc to reset
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && file && !isProcessing && !result) {
        handleReset();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file, isProcessing, result, handleReset]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validation = validatePdfFile(selectedFile, isFr);
      if (!validation.isValid) {
        setError(validation.error ?? null);
        return;
      }

      setError(null);
      setResult(null);
      setFiles([selectedFile]);
    },
    [isFr]
  );

  // Auto-consume handoff file if transferred from another tool
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

  const handleCompress = async () => {
    if (!file || isProcessing) return;
    setError(null);
    setIsProcessing(true);
    setLiveBytes(file.size);

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('level', level);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-compress'), {
          method: 'POST',
          body: fd,
        }),
        new Promise((resolve) => setTimeout(resolve, 2400)),
      ]);

      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
          error?: string;
          message?: string;
        };
        throw new Error(
          err.message ??
            err.error ??
            (isFr ? 'Échec de la compression.' : 'Compression failed.')
        );
      }

      const blob = await res.blob();
      const originalSize = parseInt(
        res.headers.get('X-Original-Size') ?? String(file.size),
        10
      );
      const compressedSize = parseInt(
        res.headers.get('X-Compressed-Size') ?? String(blob.size),
        10
      );
      const gainHeader = res.headers.get('X-Compression-Gain');
      const calculatedGain = calculateGain(originalSize, compressedSize);
      const gain = gainHeader ? parseInt(gainHeader, 10) : calculatedGain;

      trackToolUsed('pdf-compress', 'pdf');
      setResult({
        blob,
        filename: formatResultFilename(file.name, isFr),
        sizeBefore: originalSize,
        sizeAfter: compressedSize,
        gain,
      });
    } catch (e) {
      trackToolError('pdf-compress', 'general-error');
      setError(
        e instanceof Error
          ? e.message
          : isFr
          ? 'La compression a échoué. Vérifiez votre document et réessayez.'
          : 'Compression failed. Check your document and try again.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  return {
    presets,
    file,
    files,
    level,
    setLevel,
    result,
    error,
    setError,
    isProcessing,
    isDragging,
    liveBytes,
    isNextActionOpen,
    setIsNextActionOpen,
    handleReset,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleCompress,
    handleDownload,
  };
}
