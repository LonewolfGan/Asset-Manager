import { useState, useCallback, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl, getResponseError } from '@/lib/apiBase';
import { downloadBlob } from '@/lib/download';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type ResizeResult,
  validateImageFile,
} from '@/lib/image-resize-logic';
import { useImageResizeDimensions } from './use-image-resize-dimensions';

export function useImageResizeWorkflow(isFr: boolean) {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  const [result, setResult] = useState<ResizeResult | null>(null);

  const dimensions = useImageResizeDimensions(origW, origH);
  const file = files[0] ?? null;

  // Cleanup object URLs on unmount or file reset
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    };
  }, [previewUrl, resultPreviewUrl]);

  // Load natural dimensions when a new file is uploaded
  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const validationError = validateImageFile(selectedFile, isFr);
      if (validationError) {
        setError(validationError);
        return;
      }

      setFiles([selectedFile]);
      setError(null);
      setResult(null);
      if (resultPreviewUrl) {
        URL.revokeObjectURL(resultPreviewUrl);
        setResultPreviewUrl(null);
      }

      const objectUrl = URL.createObjectURL(selectedFile);
      setPreviewUrl(objectUrl);

      const img = new Image();
      img.onload = () => {
        const nw = img.naturalWidth || 1000;
        const nh = img.naturalHeight || 1000;
        setOrigW(nw);
        setOrigH(nh);
        dimensions.setDimensionsFromImage(nw, nh);
      };
      img.onerror = () => {
        setError(
          isFr
            ? 'Impossible de lire les dimensions de cette image.'
            : 'Unable to read the dimensions of this image.'
        );
      };
      img.src = objectUrl;
    },
    [resultPreviewUrl, isFr, dimensions]
  );

  // Check for pending handoff file from previous workflow step
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

  const handleProcessResize = async () => {
    if (!file) return;

    const { targetW, targetH } = dimensions;

    if (targetW <= 0 || targetH <= 0 || targetW > 10000 || targetH > 10000) {
      setError(
        isFr
          ? 'Les dimensions doivent être comprises entre 1 et 10 000 px.'
          : 'Dimensions must be between 1 and 10,000 px.'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('width', String(targetW));
      formData.append('height', String(targetH));

      const response = await fetch(apiUrl('/api/tools/image-resize'), {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errMessage = await getResponseError(
          response,
          isFr ? 'Échec du redimensionnement.' : 'Resize failed.'
        );
        throw new Error(errMessage);
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition') || '';
      const filenameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
      const outputFilename = filenameMatch ? filenameMatch[1] : `resized_${file.name}`;
      const origSizeHeader = response.headers.get('X-Original-Size');
      const sizeBefore = origSizeHeader ? parseInt(origSizeHeader, 10) : file.size;

      const resObjUrl = URL.createObjectURL(blob);
      setResultPreviewUrl(resObjUrl);

      const resImg = new Image();
      resImg.onload = () => {
        setResult({
          blob,
          filename: outputFilename,
          sizeBefore,
          sizeAfter: blob.size,
          finalW: resImg.naturalWidth || targetW,
          finalH: resImg.naturalHeight || targetH,
        });
        setIsProcessing(false);
        trackToolUsed('image-resize', 'image');
      };
      resImg.onerror = () => {
        setResult({
          blob,
          filename: outputFilename,
          sizeBefore,
          sizeAfter: blob.size,
          finalW: targetW,
          finalH: targetH,
        });
        setIsProcessing(false);
        trackToolUsed('image-resize', 'image');
      };
      resImg.src = resObjUrl;
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : isFr
          ? 'Une erreur inattendue est survenue.'
          : 'An unexpected error occurred.';
      setError(msg);
      setIsProcessing(false);
      trackToolError('image-resize', msg);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    downloadBlob(result.blob, result.filename);
    setTimeout(() => {
      setIsNextActionOpen(true);
    }, 450);
  };

  const handleFullReset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    setPreviewUrl(null);
    setResultPreviewUrl(null);
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  };

  const handleBackToEditor = () => {
    setResult(null);
    if (resultPreviewUrl) {
      URL.revokeObjectURL(resultPreviewUrl);
      setResultPreviewUrl(null);
    }
  };

  return {
    file,
    files,
    previewUrl,
    resultPreviewUrl,
    origW,
    origH,
    isDragging,
    isProcessing,
    error,
    setError,
    result,
    isNextActionOpen,
    setIsNextActionOpen,
    dimensions,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleProcessResize,
    handleDownload,
    handleFullReset,
    handleBackToEditor,
  };
}
