import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import type {
  WatermarkPattern,
  WatermarkPagesScope,
  WatermarkAngle,
} from '@/lib/pdf-watermark-logic';

export interface UsePdfWatermarkWorkflowOptions {
  isFr: boolean;
  tc: Record<string, any>;
  onResetExtra?: () => void;
}

export function usePdfWatermarkWorkflow({
  isFr,
  tc,
  onResetExtra,
}: UsePdfWatermarkWorkflowOptions) {
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

  // Watermark parameters
  const [text, setText] = useState(isFr ? 'CONFIDENTIEL' : 'CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.25);
  const [colorHex, setColorHex] = useState('#888888');
  const [angle, setAngle] = useState<WatermarkAngle>(45);
  const [pagesScope, setPagesScope] = useState<WatermarkPagesScope>('all');
  const [pattern, setPattern] = useState<WatermarkPattern>('repeat');

  const file = files[0];

  const handleReset = useCallback(() => {
    setFiles([]);
    setResult(null);
    setError(null);
    setText(isFr ? 'CONFIDENTIEL' : 'CONFIDENTIAL');
    setFontSize(48);
    setOpacity(0.25);
    setColorHex('#888888');
    setAngle(45);
    setPagesScope('all');
    setPattern('repeat');
    setIsProcessing(false);
    setIsNextActionOpen(false);
    onResetExtra?.();
  }, [isFr, onResetExtra]);

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
    if (!file || !text.trim()) return;
    setError(null);
    setIsProcessing(true);

    try {
      trackToolUsed('pdf-watermark', 'pdf');
      const fd = new FormData();
      fd.append('file', file);
      fd.append('text', text.trim());
      fd.append('opacity', String(opacity));
      fd.append('fontSize', String(fontSize));
      fd.append('angle', String(angle));
      fd.append('color', colorHex);
      fd.append('pages', pagesScope);
      fd.append('pattern', pattern);

      const [res] = await Promise.all([
        fetch(apiUrl('/api/tools/pdf-watermark'), {
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
        filename: file.name.replace(/\.pdf$/i, '_watermarked.pdf'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
      });
    } catch (e) {
      trackToolError('pdf-watermark', 'general-error');
      setError(e instanceof Error ? e.message : tc.error);
    } finally {
      setIsProcessing(false);
    }
  }, [angle, colorHex, file, fontSize, opacity, pagesScope, pattern, tc.error, text]);

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
    text,
    setText,
    fontSize,
    setFontSize,
    opacity,
    setOpacity,
    colorHex,
    setColorHex,
    angle,
    setAngle,
    pagesScope,
    setPagesScope,
    pattern,
    setPattern,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleConvert,
    handleDownload,
    handleReset,
  };
}
