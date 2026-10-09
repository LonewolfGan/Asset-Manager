import { useState, useEffect, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { toast } from 'sonner';
import {
  generateHarmonyPalette,
  adjustColorLightness,
  updateColorFromHex,
  type PaletteColor,
  type HarmonyMode,
} from '@/lib/color-palette-logic';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

export interface HarmonyOption {
  id: HarmonyMode;
  label: string;
  desc: string;
}

export function useColorPaletteWorkflow(isFr: boolean) {
  const harmonyModes: HarmonyOption[] = [
    { id: 'trending', label: isFr ? 'Tendance' : 'Trending', desc: isFr ? 'Équilibre chromatique contemporain' : 'Contemporary chromatic balance' },
    { id: 'monochromatic', label: isFr ? 'Monochrome' : 'Monochromatic', desc: isFr ? 'Nuances et contrastes d’une même teinte' : 'Shades and tints of a single hue' },
    { id: 'analogous', label: isFr ? 'Analogue' : 'Analogous', desc: isFr ? 'Teintes voisines sur le cercle chromatique' : 'Adjacent hues on the color wheel' },
    { id: 'complementary', label: isFr ? 'Complémentaire' : 'Complementary', desc: isFr ? 'Opposés chromatiques à fort impact' : 'High-impact chromatic opposites' },
    { id: 'triadic', label: isFr ? 'Triadique' : 'Triadic', desc: isFr ? 'Harmonie à trois pôles équidistants' : 'Equidistant three-pole harmony' },
    { id: 'pastel', label: isFr ? 'Pastel' : 'Pastel', desc: isFr ? 'Teintes douces et désaturées' : 'Soft, desaturated pastel hues' },
    { id: 'dark-ui', label: 'Dark UI', desc: isFr ? 'Palette calibrée pour interfaces sombres' : 'Calibrated for dark mode interfaces' },
  ];

  const [mode, setMode] = useState<HarmonyMode>('trending');
  const [count, setCount] = useState<number>(5);
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [palette, setPalette] = useState<PaletteColor[]>(() => generateHarmonyPalette('trending', [], 5));
  const [isMockupModalOpen, setIsMockupModalOpen] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRegenerate = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 260);
    setPalette((prev) => generateHarmonyPalette(mode, prev, count));
    trackToolUsed('color-palette', `regenerate-${mode}-${count}`);
  }, [mode, count]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
          return;
        }
        e.preventDefault();
        if (target && target.tagName === 'BUTTON') {
          target.blur();
        }
        handleRegenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRegenerate]);

  const handleModeChange = useCallback((newMode: HarmonyMode) => {
    setMode(newMode);
    setPalette((prev) => generateHarmonyPalette(newMode, prev, count));
  }, [count]);

  const handleCountChange = useCallback((newCount: number) => {
    const validCount = Math.max(3, Math.min(8, newCount));
    setCount(validCount);
    setPalette((prev) => generateHarmonyPalette(mode, prev, validCount));
  }, [mode]);

  const toggleLock = useCallback((idx: number) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, isLocked: !c.isLocked } : c))
    );
  }, []);

  const getColorValue = useCallback((color: PaletteColor): string => {
    if (format === 'rgb') {
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    }
    if (format === 'hsl') {
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    }
    return color.hex;
  }, [format]);

  const getColorDisplayValue = useCallback((color: PaletteColor, fmt: ColorFormat): string => {
    if (fmt === 'rgb') {
      return `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`;
    }
    if (fmt === 'hsl') {
      return `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
    }
    return color.hex;
  }, []);

  const getCodeFontSize = useCallback((fmt: ColorFormat, totalCount: number) => {
    if (fmt === 'hex') {
      if (totalCount >= 7) return 'text-xs sm:text-sm md:text-base lg:text-lg';
      if (totalCount >= 5) return 'text-sm sm:text-base md:text-lg lg:text-xl';
      return 'text-base sm:text-lg md:text-xl lg:text-2xl';
    }
    if (fmt === 'rgb') {
      if (totalCount >= 7) return 'text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs';
      if (totalCount >= 5) return 'text-[10px] sm:text-[11px] md:text-xs lg:text-sm';
      return 'text-xs sm:text-sm md:text-base lg:text-lg';
    }
    if (totalCount >= 7) return 'text-[9px] sm:text-[10px] md:text-[11px] lg:text-xs';
    if (totalCount >= 5) return 'text-[10px] sm:text-[11px] md:text-xs lg:text-xs';
    return 'text-xs sm:text-sm md:text-sm lg:text-base';
  }, []);

  const handleCopyColor = useCallback(async (color: PaletteColor, idx: number) => {
    try {
      const val = getColorValue(color);
      await navigator.clipboard.writeText(val);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1500);
      toast.success(isFr ? `${val} copié dans le presse-papier` : `${val} copied to clipboard`);
      trackToolUsed('color-palette', 'copy-single');
    } catch {
      toast.error(isFr ? 'Impossible d’accéder au presse-papier' : 'Could not access clipboard');
    }
  }, [getColorValue, isFr]);

  const handleCopyCode = useCallback(async (code: string, label: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success(isFr ? `${label} copié dans le presse-papier` : `${label} copied to clipboard`);
      trackToolUsed('color-palette', `copy-${label}`);
    } catch {
      toast.error(isFr ? 'Impossible d’accéder au presse-papier' : 'Could not access clipboard');
    }
  }, [isFr]);

  const handleDownload = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(isFr ? `Fichier ${filename} téléchargé` : `File ${filename} downloaded`);
    trackToolUsed('color-palette', 'download');
  }, [isFr]);

  const handleAdjustLightness = useCallback((idx: number, delta: number) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === idx ? adjustColorLightness(c, delta) : c))
    );
  }, []);

  const handleCustomHexChange = useCallback((idx: number, newHex: string) => {
    setPalette((prev) =>
      prev.map((c, i) => (i === idx ? updateColorFromHex(newHex, c) : c))
    );
  }, []);

  const lockedCount = palette.filter((c) => c.isLocked).length;

  return {
    mode,
    count,
    format,
    setFormat,
    palette,
    harmonyModes,
    isMockupModalOpen,
    setIsMockupModalOpen,
    copiedIdx,
    isRefreshing,
    lockedCount,
    handleRegenerate,
    handleModeChange,
    handleCountChange,
    toggleLock,
    getColorValue,
    getColorDisplayValue,
    getCodeFontSize,
    handleCopyColor,
    handleCopyCode,
    handleDownload,
    handleAdjustLightness,
    handleCustomHexChange,
  };
}
