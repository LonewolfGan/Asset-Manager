import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale } from './use-locale';
import { trackToolUsed, trackToolError } from '../lib/analytics';
import { consumeHandoffFile } from '../lib/file-handoff';
import {
  type CropRect,
  getDefaultCropRect,
  adjustCropWithRatio,
  getAspectRatioLabel,
  computeSwapOrientation,
  centerCropRect,
  maximizeCropRect,
} from '../lib/image-crop-logic';
import {
  type CropResult,
  cropImageOnServer,
  downloadCropResult,
} from '../services/image-crop-api';

export function useImageCropWorkflow() {
  const { isFr } = useLocale();

  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);

  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);

  const [crop, setCrop] = useState<CropRect>({ x: 0, y: 0, w: 100, h: 100 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);
  const [result, setResult] = useState<CropResult | null>(null);

  const file = files[0] ?? null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    };
  }, [previewUrl, resultPreviewUrl]);

  const validateAndSetFile = useCallback(
    (selectedFile: File) => {
      const isImage =
        selectedFile.type.startsWith('image/') ||
        /\.(jpe?g|png|webp|avif)$/i.test(selectedFile.name);

      if (!isImage) {
        setError(
          isFr
            ? 'Veuillez sélectionner un fichier image valide (JPEG, PNG, WebP, AVIF).'
            : 'Please select a valid image file (JPEG, PNG, WebP, AVIF).'
        );
        return;
      }

      if (selectedFile.size > 50 * 1024 * 1024) {
        setError(
          isFr
            ? 'Le fichier dépasse la taille maximale autorisée de 50 Mo.'
            : 'The file exceeds the maximum allowed size of 50 MB.'
        );
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
        const nw = img.naturalWidth || 800;
        const nh = img.naturalHeight || 600;
        setImgObj(img);
        setOrigW(nw);
        setOrigH(nh);
        setCrop(getDefaultCropRect(nw, nh, null));
        setAspectRatio(null);
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
    [resultPreviewUrl, isFr]
  );

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) validateAndSetFile(staged);
  }, [validateAndSetFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files);
      if (droppedFiles.length > 0) validateAndSetFile(droppedFiles[0]);
    },
    [validateAndSetFile]
  );

  const handleSelectAspectPreset = useCallback(
    (presetRatio: number | null) => {
      setAspectRatio(presetRatio);
      if (origW <= 0 || origH <= 0 || presetRatio === null) return;
      setCrop(adjustCropWithRatio(crop, presetRatio, origW, origH));
    },
    [crop, origW, origH]
  );

  const handleSwapOrientation = useCallback(() => {
    const swapped = computeSwapOrientation(crop, aspectRatio, origW, origH);
    if (!swapped) return;
    setAspectRatio(swapped.aspectRatio);
    setCrop(swapped.crop);
  }, [crop, aspectRatio, origW, origH]);

  const handleCenterCrop = useCallback(() => {
    if (origW <= 0 || origH <= 0) return;
    setCrop(centerCropRect(crop, origW, origH));
  }, [crop, origW, origH]);

  const handleMaximizeCrop = useCallback(() => {
    if (origW <= 0 || origH <= 0) return;
    setCrop(maximizeCropRect(origW, origH, aspectRatio));
  }, [origW, origH, aspectRatio]);

  const handleResetCrop = useCallback(() => {
    if (origW <= 0 || origH <= 0) return;
    setAspectRatio(null);
    setCrop(getDefaultCropRect(origW, origH, null));
  }, [origW, origH]);

  const isModified = useMemo(() => {
    if (origW <= 0 || origH <= 0) return false;
    const defaultRect = getDefaultCropRect(origW, origH, null);
    return (
      aspectRatio !== null ||
      Math.abs(crop.x - defaultRect.x) > 1 ||
      Math.abs(crop.y - defaultRect.y) > 1 ||
      Math.abs(crop.w - defaultRect.w) > 1 ||
      Math.abs(crop.h - defaultRect.h) > 1
    );
  }, [origW, origH, aspectRatio, crop]);

  const handleProcessCrop = useCallback(async () => {
    trackToolUsed('image-crop', 'images');
    if (!file || crop.w <= 0 || crop.h <= 0) return;

    setError(null);
    setIsProcessing(true);

    try {
      const cropRes = await cropImageOnServer(file, crop, isFr);
      setResult(cropRes);
      setResultPreviewUrl(URL.createObjectURL(cropRes.blob));
      setIsProcessing(false);
    } catch (e) {
      trackToolError('image-crop', 'general-error');
      setError(
        e instanceof Error
          ? e.message
          : isFr
          ? 'Une erreur inattendue est survenue.'
          : 'An unexpected error occurred.'
      );
      setIsProcessing(false);
    }
  }, [file, crop, isFr]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    downloadCropResult(result);
    setTimeout(() => setIsNextActionOpen(true), 450);
  }, [result]);

  const handleFullReset = useCallback(() => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    setPreviewUrl(null);
    setResultPreviewUrl(null);
    setImgObj(null);
    setFiles([]);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    setIsNextActionOpen(false);
  }, [previewUrl, resultPreviewUrl]);

  const handleBackToEditor = useCallback(() => {
    setResult(null);
    if (resultPreviewUrl) {
      URL.revokeObjectURL(resultPreviewUrl);
      setResultPreviewUrl(null);
    }
  }, [resultPreviewUrl]);

  const originalRatioLabel = useMemo(() => getAspectRatioLabel(origW, origH), [origW, origH]);
  const croppedRatioLabel = useMemo(() => getAspectRatioLabel(crop.w, crop.h), [crop.w, crop.h]);
  const surfaceRetainedPct = useMemo(() => {
    if (origW <= 0 || origH <= 0) return 100;
    return Math.max(1, Math.min(100, Math.round((crop.w * crop.h * 100) / (origW * origH))));
  }, [crop.w, crop.h, origW, origH]);

  return {
    file,
    files,
    crop,
    setCrop,
    origW,
    origH,
    aspectRatio,
    imgObj,
    previewUrl,
    resultPreviewUrl,
    result,
    isDragging,
    isProcessing,
    error,
    setError,
    isModified,
    isNextActionOpen,
    setIsNextActionOpen,
    validateAndSetFile,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleSelectAspectPreset,
    handleSwapOrientation,
    handleCenterCrop,
    handleMaximizeCrop,
    handleResetCrop,
    handleProcessCrop,
    handleDownload,
    handleFullReset,
    handleBackToEditor,
    originalRatioLabel,
    croppedRatioLabel,
    surfaceRetainedPct,
  };
}
