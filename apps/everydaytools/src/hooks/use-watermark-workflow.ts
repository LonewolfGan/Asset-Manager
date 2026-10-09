import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type WatermarkConfig,
  DEFAULT_WATERMARK_CONFIG,
  type NinePointPosition,
  type OutputFormat,
  FONT_OPTIONS,
  type FontOption,
  COLOR_SWATCHES,
  renderWatermarkedBlob,
  getWatermarkedFilename,
} from '@/lib/watermark-logic';
import { useWatermarkCanvas } from './use-watermark-canvas';

export function useWatermarkWorkflow(isFr: boolean) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Configuration filigrane
  const [config, setConfig] = useState<WatermarkConfig>({ ...DEFAULT_WATERMARK_CONFIG });
  const [isHoldingOriginal, setIsHoldingOriginal] = useState(false);

  // États d'exportation
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportedResult, setExportedResult] = useState<{ blob: Blob; filename: string } | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState(false);

  // Hook dédié canvas & observateur de taille
  const { canvasRef, viewportContainerRef, redrawCanvas } = useWatermarkCanvas({
    imgElement,
    config,
    isHoldingOriginal,
    previewUrl,
  });

  // Chargement du fichier et calcul de police par défaut
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setImgElement(null);
      setOriginalDims(null);
      setConfig({ ...DEFAULT_WATERMARK_CONFIG });
      setError(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const img = new Image();
    img.onload = () => {
      setImgElement(img);
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });

      const autoFontSize = Math.max(
        18,
        Math.min(160, Math.round(Math.min(img.naturalWidth, img.naturalHeight) * 0.055))
      );
      setConfig((prev) => ({
        ...prev,
        fontSize: autoFontSize,
      }));
    };
    img.onerror = () => {
      setError(isFr ? 'Impossible de charger le fichier image sélectionné.' : 'Failed to load selected image file.');
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, isFr]);

  const handleFiles = useCallback((incomingFiles: File[]) => {
    if (!incomingFiles || incomingFiles.length === 0) return;
    const selected = incomingFiles[0];
    if (!selected.type.startsWith('image/')) {
      setError(isFr ? "Le fichier sélectionné n'est pas une image valide." : 'Selected file is not a valid image.');
      return;
    }
    setError(null);
    setFile(selected);
    trackToolUsed('watermark-image', 'image');
  }, [isFr]);

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged) {
      handleFiles([staged]);
    }
  }, [handleFiles]);

  const handleFullReset = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setImgElement(null);
    setOriginalDims(null);
    setConfig({ ...DEFAULT_WATERMARK_CONFIG });
    setError(null);
    setIsExportMenuOpen(false);
    setIsNextActionOpen(false);
    setExportedResult(null);
  }, []);

  const handleResetConfig = useCallback(() => {
    if (!imgElement) return;
    const autoFontSize = Math.max(
      18,
      Math.min(160, Math.round(Math.min(imgElement.naturalWidth, imgElement.naturalHeight) * 0.055))
    );
    setConfig({
      ...DEFAULT_WATERMARK_CONFIG,
      fontSize: autoFontSize,
    });
  }, [imgElement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setIsHoldingOriginal(true);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetConfig();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        if (isExportMenuOpen) {
          setIsExportMenuOpen(false);
        } else {
          handleFullReset();
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsHoldingOriginal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleResetConfig, handleFullReset, isExportMenuOpen]);

  const handleExportWithFormat = useCallback(
    async (format: OutputFormat) => {
      if (!file) return;

      try {
        setIsExporting(true);
        setIsExportMenuOpen(false);
        setError(null);

        const blob = await renderWatermarkedBlob(file, config, format, 0.94);
        const filename = getWatermarkedFilename(file.name, format);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
        trackToolUsed('watermark-image', 'image');

        setExportedResult({ blob, filename });
        setTimeout(() => {
          setIsNextActionOpen(true);
        }, 450);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : isFr
              ? "Erreur lors de l'export de l'image filigranée"
              : 'Error exporting watermarked image';
        setError(msg);
        trackToolError('watermark-image', msg);
      } finally {
        setIsExporting(false);
      }
    },
    [file, config, isFr]
  );

  const handleTogglePosition = useCallback((posId: NinePointPosition) => {
    setConfig((prev) => {
      const exists = prev.positions.includes(posId);
      if (exists) {
        if (prev.positions.length <= 1) return prev;
        return { ...prev, positions: prev.positions.filter((p) => p !== posId) };
      } else {
        return { ...prev, positions: [...prev.positions, posId] };
      }
    });
  }, []);

  const hasModifications = useMemo(() => {
    return (
      config.text !== DEFAULT_WATERMARK_CONFIG.text ||
      config.mode !== DEFAULT_WATERMARK_CONFIG.mode ||
      config.positions.join(',') !== DEFAULT_WATERMARK_CONFIG.positions.join(',') ||
      config.color !== DEFAULT_WATERMARK_CONFIG.color ||
      config.opacity !== DEFAULT_WATERMARK_CONFIG.opacity ||
      config.fontId !== DEFAULT_WATERMARK_CONFIG.fontId ||
      config.hasShadow !== DEFAULT_WATERMARK_CONFIG.hasShadow ||
      config.rotation !== DEFAULT_WATERMARK_CONFIG.rotation
    );
  }, [config]);

  const selectedFont: FontOption = useMemo(() => {
    return FONT_OPTIONS.find((f) => f.id === config.fontId) || FONT_OPTIONS[0];
  }, [config.fontId]);

  return {
    file,
    previewUrl,
    imgElement,
    originalDims,
    isDragging,
    setIsDragging,
    config,
    setConfig,
    isHoldingOriginal,
    setIsHoldingOriginal,
    isExportMenuOpen,
    setIsExportMenuOpen,
    isExporting,
    error,
    exportedResult,
    isNextActionOpen,
    setIsNextActionOpen,
    canvasRef,
    viewportContainerRef,
    redrawCanvas,
    handleFiles,
    handleFullReset,
    handleResetConfig,
    handleTogglePosition,
    handleExportWithFormat,
    hasModifications,
    selectedFont,
    colorSwatches: COLOR_SWATCHES,
  };
}
