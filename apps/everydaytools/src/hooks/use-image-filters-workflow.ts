import { useState, useEffect, useCallback, useMemo } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { consumeHandoffFile } from '@/lib/file-handoff';
import {
  type FilterSettings,
  DEFAULT_FILTER_SETTINGS,
  AESTHETIC_PRESETS,
  type AestheticPreset,
  isDefaultFilterSettings,
  buildCssFilterString,
  getFilteredFilename,
  renderFilteredBlob,
} from '@/lib/image-filters-logic';
import {
  type OutputFormat,
  getFilterFormatOptions,
  interpolatePresetSettings,
} from '@/lib/image-filters-export';
import { useFilmstripScroll } from './use-filmstrip-scroll';
import { useFiltersKeyboard } from './use-filters-keyboard';

export function useImageFiltersWorkflow(isFr: boolean) {
  const formatOptions = useMemo(() => getFilterFormatOptions(isFr), [isFr]);

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalDims, setOriginalDims] = useState<{ w: number; h: number } | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Réglages des filtres et presets
  const [settings, setSettings] = useState<FilterSettings>({ ...DEFAULT_FILTER_SETTINGS });
  const [activePresetId, setActivePresetId] = useState<string>('original');
  const [presetIntensity, setPresetIntensity] = useState<number>(100);

  // Onglet console : 'presets' ou 'adjust'
  const [consoleTab, setConsoleTab] = useState<'presets' | 'adjust'>('presets');

  // Mode viewport : 'split' (CompareReveal) ou 'direct' (pleine vue avec maintien espace)
  const [viewMode, setViewMode] = useState<'split' | 'direct'>('split');
  const [isHoldingOriginal, setIsHoldingOriginal] = useState<boolean>(false);

  // États d'export
  const [isExportMenuOpen, setIsExportMenuOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isNextActionOpen, setIsNextActionOpen] = useState<boolean>(false);
  const [downloadedFile, setDownloadedFile] = useState<File | null>(null);

  // Ruban de filmstrip via hook dédié
  const {
    filmstripRef,
    scrollState,
    setFilmstripRef,
    updateScrollState,
    scrollFilmstrip,
  } = useFilmstripScroll();

  const cssFilterString = useMemo(() => {
    return buildCssFilterString(settings);
  }, [settings]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      setOriginalDims(null);
      setSettings({ ...DEFAULT_FILTER_SETTINGS });
      setActivePresetId('original');
      setPresetIntensity(100);
      setError(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setSettings({ ...DEFAULT_FILTER_SETTINGS });
    setActivePresetId('original');
    setPresetIntensity(100);
    setError(null);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.naturalWidth, h: img.naturalHeight });
    };
    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  const handleFiles = useCallback(
    (incomingFiles: File[]) => {
      if (!incomingFiles || incomingFiles.length === 0) return;
      const selected = incomingFiles[0];
      if (!selected.type.startsWith('image/')) {
        setError(isFr ? "Le fichier sélectionné n'est pas une image valide." : 'Selected file is not a valid image.');
        return;
      }
      setError(null);
      setFile(selected);
      trackToolUsed('image-filters', 'image');
    },
    [isFr]
  );

  useEffect(() => {
    const handoff = consumeHandoffFile();
    if (handoff && handoff.type.startsWith('image/')) {
      handleFiles([handoff]);
    }
  }, [handleFiles]);

  const handleSelectPreset = useCallback((preset: AestheticPreset) => {
    setActivePresetId(preset.id);
    setPresetIntensity(100);

    if (preset.id === 'original') {
      setSettings({ ...DEFAULT_FILTER_SETTINGS });
      return;
    }

    setSettings({
      ...DEFAULT_FILTER_SETTINGS,
      ...preset.settings,
    });
  }, []);

  const handleIntensityChange = useCallback(
    (val: number) => {
      setPresetIntensity(val);
      const preset = AESTHETIC_PRESETS.find((p) => p.id === activePresetId);
      if (!preset || preset.id === 'original') return;

      const interpolated = interpolatePresetSettings(preset, val);
      setSettings(interpolated);
    },
    [activePresetId]
  );

  const handleAdjustChannel = useCallback(
    <K extends keyof FilterSettings>(channel: K, value: FilterSettings[K]) => {
      setSettings((prev) => ({
        ...prev,
        [channel]: value,
      }));
      setActivePresetId('custom');
    },
    []
  );

  const handleResetChannel = useCallback((channel: keyof FilterSettings) => {
    setSettings((prev) => ({ ...prev, [channel]: DEFAULT_FILTER_SETTINGS[channel] }));
    setActivePresetId('custom');
  }, []);

  const handleResetAll = useCallback(() => {
    setSettings({ ...DEFAULT_FILTER_SETTINGS });
    setActivePresetId('original');
    setPresetIntensity(100);
  }, []);

  const handleFullReset = useCallback(() => {
    setFile(null);
    setPreviewUrl(null);
    setOriginalDims(null);
    setSettings({ ...DEFAULT_FILTER_SETTINGS });
    setActivePresetId('original');
    setPresetIntensity(100);
    setError(null);
    setIsExportMenuOpen(false);
    setIsNextActionOpen(false);
    setDownloadedFile(null);
  }, []);

  useFiltersKeyboard({
    viewMode,
    isExportMenuOpen,
    setIsHoldingOriginal,
    setIsExportMenuOpen,
    onResetAll: handleResetAll,
    onFullReset: handleFullReset,
  });

  const handleExportWithFormat = useCallback(
    async (format: OutputFormat) => {
      if (!file) return;

      try {
        setIsExporting(true);
        setIsExportMenuOpen(false);
        setError(null);

        const targetExt = formatOptions.find((f) => f.value === format)?.ext || 'png';
        const blob = await renderFilteredBlob(file, settings, format, 0.95);

        const outName = getFilteredFilename(file.name, activePresetId, targetExt);
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = outName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(downloadUrl);
        trackToolUsed('image-filters', 'image');

        setDownloadedFile(new File([blob], outName, { type: format }));
        setTimeout(() => {
          setIsNextActionOpen(true);
        }, 450);
      } catch (err) {
        const msg =
          err instanceof Error
            ? err.message
            : isFr
              ? "Erreur lors de l'export de l'image filtrée"
              : 'Error exporting filtered image';
        setError(msg);
        trackToolError('image-filters', msg);
      } finally {
        setIsExporting(false);
      }
    },
    [file, settings, activePresetId, formatOptions, isFr]
  );

  const hasModifications = !isDefaultFilterSettings(settings);

  return {
    file,
    previewUrl,
    originalDims,
    isDragging,
    setIsDragging,
    settings,
    activePresetId,
    presetIntensity,
    consoleTab,
    setConsoleTab,
    viewMode,
    setViewMode,
    isHoldingOriginal,
    setIsHoldingOriginal,
    isExportMenuOpen,
    setIsExportMenuOpen,
    isExporting,
    error,
    isNextActionOpen,
    setIsNextActionOpen,
    downloadedFile,
    filmstripRef,
    scrollState,
    setFilmstripRef,
    updateScrollState,
    scrollFilmstrip,
    cssFilterString,
    formatOptions,
    hasModifications,
    handleFiles,
    handleSelectPreset,
    handleIntensityChange,
    handleAdjustChannel,
    handleResetChannel,
    handleResetAll,
    handleFullReset,
    handleExportWithFormat,
  };
}
