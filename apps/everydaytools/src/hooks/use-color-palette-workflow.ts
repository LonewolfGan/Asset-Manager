import { useState, useEffect, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { toast } from 'sonner';
import { downloadText } from '@/lib/download';
import { consumeHandoffText } from '@/lib/file-handoff';
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

const MAX_HISTORY = 30;

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
  const [history, setHistory] = useState<PaletteColor[][]>(() => [
    generateHarmonyPalette('trending', [], 5),
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isMockupModalOpen, setIsMockupModalOpen] = useState<boolean>(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const palette = history[historyIndex] ?? history[0];

  const pushHistory = useCallback((nextPalette: PaletteColor[]) => {
    setHistory((prev) => {
      const sliced = prev.slice(0, historyIndex + 1);
      const updated = [...sliced, nextPalette];
      return updated.length > MAX_HISTORY ? updated.slice(updated.length - MAX_HISTORY) : updated;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  useEffect(() => {
    const handoffText = consumeHandoffText();
    if (handoffText && handoffText.trim()) {
      const hexMatches = handoffText.match(/#[0-9A-Fa-f]{6}/g);
      if (hexMatches && hexMatches.length > 0) {
        const uniqueHexes = Array.from(new Set(hexMatches));
        const seeded: PaletteColor[] = uniqueHexes.slice(0, 8).map((hex, i) => {
          const base = generateHarmonyPalette('trending', [], 1)[0];
          return updateColorFromHex(hex, { ...base, id: `seed-${i}-${hex}` });
        });
        const targetCount = Math.max(3, Math.min(8, seeded.length < 3 ? 5 : seeded.length));
        let fullPalette = seeded;
        if (fullPalette.length < targetCount) {
          const needed = targetCount - fullPalette.length;
          const additions = generateHarmonyPalette('trending', fullPalette, targetCount).slice(-needed);
          fullPalette = [...fullPalette, ...additions];
        }
        setCount(fullPalette.length);
        setHistory([fullPalette]);
        setHistoryIndex(0);
        toast.success(isFr ? 'Palette importée depuis le transfert' : 'Palette imported from handoff');
      }
    }
  }, [isFr]);

  const handleRegenerate = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 260);
    const next = generateHarmonyPalette(mode, palette, count);
    pushHistory(next);
    trackToolUsed('color-palette', `regenerate-${mode}-${count}`);
  }, [mode, palette, count, pushHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
    }
  }, [historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
    }
  }, [historyIndex, history.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        if (target && target.tagName === 'BUTTON') {
          target.blur();
        }
        handleRegenerate();
      } else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        handleUndo();
      } else if (
        ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'z' || e.key === 'Z'))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRegenerate, handleUndo, handleRedo]);

  const handleModeChange = useCallback((newMode: HarmonyMode) => {
    setMode(newMode);
    const next = generateHarmonyPalette(newMode, palette, count);
    pushHistory(next);
  }, [palette, count, pushHistory]);

  const handleCountChange = useCallback((newCount: number) => {
    const validCount = Math.max(3, Math.min(8, newCount));
    setCount(validCount);
    const next = generateHarmonyPalette(mode, palette, validCount);
    pushHistory(next);
  }, [mode, palette, pushHistory]);

  const toggleLock = useCallback((idx: number) => {
    setHistory((prev) => {
      const current = prev[historyIndex];
      if (!current) return prev;
      const updated = [...prev];
      updated[historyIndex] = current.map((c, i) => (i === idx ? { ...c, isLocked: !c.isLocked } : c));
      return updated;
    });
  }, [historyIndex]);

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
    downloadText(content, filename, mimeType);
    toast.success(isFr ? `Fichier ${filename} téléchargé` : `File ${filename} downloaded`);
    trackToolUsed('color-palette', 'download');
  }, [isFr]);

  const handleAdjustLightness = useCallback((idx: number, delta: number) => {
    const next = palette.map((c, i) => (i === idx ? adjustColorLightness(c, delta) : c));
    pushHistory(next);
  }, [palette, pushHistory]);

  const handleCustomHexChange = useCallback((idx: number, newHex: string) => {
    const next = palette.map((c, i) => (i === idx ? updateColorFromHex(newHex, c) : c));
    pushHistory(next);
  }, [palette, pushHistory]);

  const lockedCount = palette.filter((c) => c.isLocked).length;
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

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
    canUndo,
    canRedo,
    handleUndo,
    handleRedo,
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
