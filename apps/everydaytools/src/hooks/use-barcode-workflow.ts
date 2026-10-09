import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import JsBarcode from 'jsbarcode';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import {
  type BarcodeSymbology,
  getSymbologies,
  validateBarcode,
} from '@/lib/barcode-logic';
import {
  serializeSvgToString,
  downloadSvgBarcode,
  downloadPngBarcode,
  copyPngBarcodeToClipboard,
  printBarcodeLabel,
} from '@/lib/barcode-export';

export type BarcodeBackgroundMode = 'paper' | 'transparent';
export type BarcodeTextPosition = 'bottom' | 'top';

export function useBarcodeWorkflow(isFr: boolean) {
  // Format et données
  const [symbologyId, setSymbologyId] = useState<string>('EAN13');
  const [value, setValue] = useState<string>('4006381333931');

  // Paramètres géométriques
  const [barWidth, setBarWidth] = useState<number>(2);
  const [barHeight, setBarHeight] = useState<number>(85);
  const [quietZone, setQuietZone] = useState<number>(14);

  // Paramètres typographiques
  const [displayValue, setDisplayValue] = useState<boolean>(true);
  const [fontSize, setFontSize] = useState<number>(15);
  const [textPosition, setTextPosition] = useState<BarcodeTextPosition>('bottom');

  // Paramètres d'encre et support
  const [inkColor, setInkColor] = useState<string>('#000000');
  const [backgroundMode, setBackgroundMode] = useState<BarcodeBackgroundMode>('paper');

  // État de l'atelier
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);

  const symbologies = useMemo(() => getSymbologies(isFr), [isFr]);

  const activeSymbology = useMemo(() => {
    return symbologies.find((s) => s.id === symbologyId) || symbologies[0];
  }, [symbologies, symbologyId]);

  const validation = useMemo(() => {
    return validateBarcode(symbologyId, value, isFr);
  }, [symbologyId, value, isFr]);

  // Rendu vectoriel du code-barres à 60 FPS
  useEffect(() => {
    if (!svgRef.current || !value.trim() || !validation.isValid) return;

    try {
      JsBarcode(svgRef.current, value.trim(), {
        format: symbologyId,
        lineColor: inkColor,
        width: barWidth,
        height: barHeight,
        displayValue,
        textPosition,
        font: 'monospace',
        fontSize,
        textMargin: 4,
        margin: quietZone,
        background: backgroundMode === 'transparent' ? 'transparent' : '#ffffff',
      });
      trackToolUsed('barcode-generator', 'render');
    } catch (e) {
      console.warn('JsBarcode render error:', e);
    }
  }, [
    value,
    symbologyId,
    inkColor,
    barWidth,
    barHeight,
    displayValue,
    textPosition,
    fontSize,
    quietZone,
    backgroundMode,
    validation.isValid,
  ]);

  const handleValueChange = useCallback((newVal: string) => {
    setHistory((prev) => [...prev.slice(-30), value]);
    setValue(newVal);
  }, [value]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setValue(last);
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        if (document.activeElement?.tagName !== 'INPUT' && history.length > 0) {
          e.preventDefault();
          handleUndo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, history.length]);

  const handleSelectSymbology = useCallback((symbology: BarcodeSymbology) => {
    setHistory((prev) => [...prev.slice(-30), value]);
    setSymbologyId(symbology.id);
    setValue(symbology.sample);
  }, [value]);

  const handleApplyAutoFix = useCallback((fixedValue: string) => {
    setHistory((prev) => [...prev.slice(-30), value]);
    setValue(fixedValue);
    toast.success(isFr ? 'Clé de contrôle corrigée' : 'Checksum fixed');
  }, [value, isFr]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgRef.current || !validation.isValid) return;
    trackToolUsed('barcode-generator', 'download-svg');
    downloadSvgBarcode(svgRef.current, symbologyId, value);
    toast.success(isFr ? 'Fichier SVG téléchargé' : 'SVG file downloaded');
  }, [symbologyId, value, validation.isValid, isFr]);

  const handleDownloadPng = useCallback(async () => {
    if (!svgRef.current || !validation.isValid) return;
    trackToolUsed('barcode-generator', 'download-png');
    await downloadPngBarcode(svgRef.current, symbologyId, value, backgroundMode === 'paper');
    toast.success(isFr ? 'Image PNG téléchargée' : 'PNG image downloaded');
  }, [symbologyId, value, backgroundMode, validation.isValid, isFr]);

  const handleCopyPng = useCallback(async () => {
    if (!svgRef.current || !validation.isValid) return;
    try {
      await copyPngBarcodeToClipboard(svgRef.current, backgroundMode === 'paper');
      trackToolUsed('barcode-generator', 'copy-image');
      toast.success(isFr ? 'Image PNG copiée dans le presse-papier' : 'PNG image copied to clipboard');
    } catch {
      toast.error(isFr ? 'Échec de la copie de l’image' : 'Failed to copy image');
    }
  }, [backgroundMode, validation.isValid, isFr]);

  const handlePrint = useCallback(() => {
    if (!svgRef.current || !validation.isValid) return;
    trackToolUsed('barcode-generator', 'print');
    printBarcodeLabel(svgRef.current, activeSymbology.name, value);
  }, [activeSymbology.name, value, validation.isValid]);

  const getSvgString = useCallback(() => {
    if (!svgRef.current || !validation.isValid) return '';
    return serializeSvgToString(svgRef.current);
  }, [validation.isValid]);

  return {
    symbologyId,
    value,
    setValue,
    barWidth,
    setBarWidth,
    barHeight,
    setBarHeight,
    quietZone,
    setQuietZone,
    displayValue,
    setDisplayValue,
    fontSize,
    setFontSize,
    textPosition,
    setTextPosition,
    inkColor,
    setInkColor,
    backgroundMode,
    setBackgroundMode,
    zoomLevel,
    setZoomLevel,
    showDownloadMenu,
    setShowDownloadMenu,
    history,
    svgRef,
    symbologies,
    activeSymbology,
    validation,
    handleValueChange,
    handleUndo,
    handleSelectSymbology,
    handleApplyAutoFix,
    handleDownloadSvg,
    handleDownloadPng,
    handleCopyPng,
    handlePrint,
    getSvgString,
  };
}
