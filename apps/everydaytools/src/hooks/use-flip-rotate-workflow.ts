import React, { useState, useEffect, useCallback } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  getSwappedDimensions,
  getOutputFilename,
} from '@/lib/flip-rotate-logic';
import {
  type OutputFormat,
  FORMAT_OPTIONS,
  resolveDefaultOutputFormat,
  buildFlipRotateFormData,
} from '@/lib/flip-rotate-format-logic';
import { useManualRotationDrag } from './use-manual-rotation-drag';

export function useFlipRotateWorkflow(isFr: boolean) {
  // File state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Transformation state
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/png');

  // Manual interactive rotation drag
  const {
    imgRef,
    isDraggingRotation,
    handleRotatePointerDown,
    handleRotatePointerMove,
    handleRotatePointerUp,
  } = useManualRotationDrag(rotation, setRotation);

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [exportedResult, setExportedResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  // Load preview and compute natural dimensions
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setOriginalDims(null);
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setError(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setError(null);

    setOutputFormat(resolveDefaultOutputFormat(file.type));

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFiles = useCallback((files: File[]) => {
    const valid = files.find((f) => f.type.startsWith('image/'));
    if (valid) {
      setFile(valid);
    }
  }, []);

  // Check for pending handoff file
  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFiles([staged]);
    }
  }, [handleFiles]);

  const handleResetTransform = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  };

  const handleFullReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    setOriginalDims(null);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
    setExportedResult(null);
  };

  // Rotation triggers
  const rotateLeft = () => {
    setRotation((r) => {
      let next = r - 90;
      while (next < -180) next += 360;
      return next;
    });
  };

  const rotateRight = () => {
    setRotation((r) => {
      let next = r + 90;
      while (next > 180) next -= 360;
      return next;
    });
  };

  const rotate180 = () => {
    setRotation((r) => {
      let next = r + 180;
      while (next > 180) next -= 360;
      return next;
    });
  };

  const toggleFlipH = () => setFlipH((v) => !v);
  const toggleFlipV = () => setFlipV((v) => !v);

  // Keyboard navigation shortcuts
  useEffect(() => {
    if (!file) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'ArrowLeft' || e.key === '[') {
        e.preventDefault();
        rotateLeft();
      } else if (e.key === 'ArrowRight' || e.key === ']') {
        e.preventDefault();
        rotateRight();
      } else if (e.key.toLowerCase() === 'h') {
        e.preventDefault();
        toggleFlipH();
      } else if (e.key.toLowerCase() === 'v') {
        e.preventDefault();
        toggleFlipV();
      } else if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        handleResetTransform();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleFullReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [file]);

  const handleDownload = async () => {
    if (!file) return;

    trackToolUsed('flip-rotate-image', 'images');
    setError(null);
    setIsProcessing(true);

    try {
      const fd = buildFlipRotateFormData(file, rotation, flipH, flipV, outputFormat);

      const res = await fetch(apiUrl('/api/tools/flip-rotate'), {
        method: 'POST',
        body: fd,
      });

      if (!res.ok) {
        let msg = isFr ? 'Échec de la transformation' : 'Transformation failed';
        try {
          const err = await res.json();
          if (err?.error) msg = err.error;
        } catch {}
        throw new Error(msg);
      }

      const blob = await res.blob();
      const currentOpt = FORMAT_OPTIONS.find((o) => o.value === outputFormat);
      const ext = currentOpt ? currentOpt.ext : 'png';
      const filename = getOutputFilename(file.name, ext);

      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(dlUrl), 2000);

      setExportedResult({ blob, filename });
      setTimeout(() => {
        setIsNextActionOpen(true);
      }, 450);
    } catch (e) {
      trackToolError('flip-rotate-image', 'general-error');
      setError(
        e instanceof Error
          ? e.message
          : isFr
          ? 'Une erreur est survenue lors de la transformation.'
          : 'An error occurred during transformation.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const hasTransform = rotation !== 0 || flipH || flipV;
  const currentDims = originalDims
    ? getSwappedDimensions(originalDims.w, originalDims.h, rotation)
    : null;

  return {
    file,
    previewUrl,
    isDragging,
    rotation,
    flipH,
    flipV,
    outputFormat,
    imgRef,
    isDraggingRotation,
    isProcessing,
    error,
    exportedResult,
    isNextActionOpen,
    hasTransform,
    currentDims,
    setIsDragging,
    setOutputFormat,
    setIsNextActionOpen,
    handleFiles,
    handleResetTransform,
    handleFullReset,
    rotateLeft,
    rotateRight,
    rotate180,
    toggleFlipH,
    toggleFlipV,
    handleRotatePointerDown,
    handleRotatePointerMove,
    handleRotatePointerUp,
    handleDownload,
  };
}
