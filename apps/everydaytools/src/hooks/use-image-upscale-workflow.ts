import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  calculateUpscaleDimensions,
  calculateMegapixels,
  getUpscaleOutputFilename,
  upscaleCanvasClientSide,
} from '@/lib/image-upscale-logic';

export interface UseImageUpscaleWorkflowOptions {
  isFr: boolean;
  onResetLoupe?: () => void;
}

export function useImageUpscaleWorkflow({ isFr, onResetLoupe }: UseImageUpscaleWorkflowOptions) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [origDims, setOrigDims] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const [scale, setScale] = useState<2 | 4>(2);
  const [sharpen, setSharpen] = useState<boolean>(true);

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const file = files[0] ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const handleFullReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFiles([]);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    setOrigDims(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
    onResetLoupe?.();
  }, [previewUrl, resultUrl, onResetLoupe]);

  const handleBackToEditor = useCallback(() => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setResultBlob(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, [resultUrl]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      if (!selectedFile.type.startsWith('image/')) {
        setError(
          isFr
            ? 'Veuillez sélectionner un fichier image valide (JPEG, PNG, WebP, AVIF, TIFF).'
            : 'Please select a valid image file (JPEG, PNG, WebP, AVIF, TIFF).'
        );
        return;
      }

      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);

      setError(null);
      setFiles([selectedFile]);
      setResultUrl(null);
      setResultBlob(null);
      onResetLoupe?.();

      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);

      const img = new Image();
      img.onload = () => {
        setOrigDims({ w: img.width, h: img.height });
      };
      img.onerror = () => {
        setOrigDims(null);
        setError(
          isFr
            ? "Impossible de lire les dimensions de l'image."
            : 'Unable to read image dimensions.'
        );
      };
      img.src = url;
    },
    [previewUrl, resultUrl, isFr, onResetLoupe]
  );

  useEffect(() => {
    const handoff = consumeHandoffFile();
    if (handoff && handoff.type.startsWith('image/')) {
      validateAndSetFile(handoff);
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
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) {
        validateAndSetFile(droppedFiles[0]);
      }
    },
    [validateAndSetFile]
  );

  const runClientFallback = useCallback(async (): Promise<Blob> => {
    if (!previewUrl || !origDims || !file) {
      throw new Error(
        isFr
          ? 'Données source manquantes pour le traitement.'
          : 'Missing source data for processing.'
      );
    }
    return upscaleCanvasClientSide(
      previewUrl,
      origDims.w,
      origDims.h,
      scale,
      file.type || 'image/png',
      isFr
    );
  }, [previewUrl, origDims, file, scale, isFr]);

  const handleUpscale = useCallback(async () => {
    if (!file || !origDims) return;
    setIsProcessing(true);
    setError(null);
    trackToolUsed('image-upscale', 'image');

    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('scale', String(scale));
      fd.append('sharpen', String(sharpen));

      const res = await fetch(apiUrl('/api/tools/image-upscale'), {
        method: 'POST',
        body: fd,
      });

      let blob: Blob;
      if (!res.ok) {
        blob = await runClientFallback();
      } else {
        blob = await res.blob();
      }

      const url = URL.createObjectURL(blob);
      setResultBlob(blob);
      setResultUrl(url);
    } catch (e) {
      try {
        const blob = await runClientFallback();
        const url = URL.createObjectURL(blob);
        setResultBlob(blob);
        setResultUrl(url);
      } catch {
        trackToolError('image-upscale', 'general-error');
        setError(
          e instanceof Error
            ? e.message
            : isFr
              ? "Échec de l'agrandissement de votre image."
              : 'Failed to upscale your image.'
        );
      }
    } finally {
      setIsProcessing(false);
    }
  }, [file, origDims, scale, sharpen, runClientFallback, isFr]);

  const outputFilename = useMemo(() => {
    if (!file) return 'image_2x.png';
    return getUpscaleOutputFilename(file.name, scale);
  }, [file, scale]);

  const handleDownload = useCallback(() => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = outputFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  }, [resultUrl, outputFilename]);

  const targetDims = useMemo(() => {
    if (!origDims) return { origW: 0, origH: 0, targetW: 0, targetH: 0, scale };
    return calculateUpscaleDimensions(origDims.w, origDims.h, scale);
  }, [origDims, scale]);

  const sourceMp = useMemo(() => {
    if (!origDims) return '';
    return calculateMegapixels(origDims.w, origDims.h);
  }, [origDims]);

  return {
    files,
    file,
    previewUrl,
    resultUrl,
    resultBlob,
    origDims,
    isDragging,
    scale,
    setScale,
    sharpen,
    setSharpen,
    isProcessing,
    error,
    setError,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleUpscale,
    handleDownload,
    handleFullReset,
    handleBackToEditor,
    outputFilename,
    targetDims,
    sourceMp,
  };
}
