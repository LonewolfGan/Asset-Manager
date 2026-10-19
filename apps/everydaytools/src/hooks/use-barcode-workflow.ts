import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import JsBarcode from 'jsbarcode';
import { toast } from 'sonner';
import { trackToolUsed } from '@/lib/analytics';
import { consumeHandoffText } from '@/lib/file-handoff';
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

export interface BarcodeHistorySnapshot {
  value: string;
  symbologyId: string;
}

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

  // Paramètres d'encre et support (Anti-Slop: Zero Pure Black #000000 -> #18181b)
  const [inkColor, setInkColor] = useState<string>('#18181b');
  const [backgroundMode, setBackgroundMode] = useState<BarcodeBackgroundMode>('paper');

  // État de l'atelier
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showDownloadMenu, setShowDownloadMenu] = useState<boolean>(false);
  const [history, setHistory] = useState<BarcodeHistorySnapshot[]>([]);
  const [redoStack, setRedoStack] = useState<BarcodeHistorySnapshot[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);
  const lastHistoryPushRef = useRef<number>(0);

  const symbologies = useMemo(() => getSymbologies(isFr), [isFr]);

  const activeSymbology = useMemo(() => {
    return symbologies.find((s) => s.id === symbologyId) || symbologies[0];
  }, [symbologies, symbologyId]);

  const validation = useMemo(() => {
    return validateBarcode(symbologyId, value, isFr);
  }, [symbologyId, value, isFr]);

  // Valeur assainie pour JsBarcode et exports (suppression des espaces pour les codes numériques GS1)
  const sanitizedBarcodeValue = useMemo(() => {
    return ['EAN13', 'UPC', 'EAN8', 'ITF14'].includes(symbologyId)
      ? value.replace(/\s+/g, '')
      : value.trim();
  }, [symbologyId, value]);

  // Rendu vectoriel du code-barres à 60 FPS
  useEffect(() => {
    if (!svgRef.current || !sanitizedBarcodeValue || !validation.isValid) return;

    try {
      JsBarcode(svgRef.current, sanitizedBarcodeValue, {
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
    } catch (e) {
      console.warn('JsBarcode render error:', e);
    }
  }, [
    sanitizedBarcodeValue,
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
    const now = Date.now();
    if (now - lastHistoryPushRef.current > 1000) {
      setHistory((prev) => [...prev.slice(-30), { value, symbologyId }]);
      setRedoStack([]);
      lastHistoryPushRef.current = now;
    }
    setValue(newVal);
  }, [value, symbologyId]);

  const handleUndo = useCallback(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [...prev.slice(-30), { value, symbologyId }]);
    setHistory((prev) => prev.slice(0, -1));
    setValue(last.value);
    setSymbologyId(last.symbologyId);
    lastHistoryPushRef.current = 0;
  }, [history, value, symbologyId]);

  const handleRedo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((prev) => [...prev.slice(-30), { value, symbologyId }]);
    setRedoStack((prev) => prev.slice(0, -1));
    setValue(next.value);
    setSymbologyId(next.symbologyId);
    lastHistoryPushRef.current = 0;
  }, [redoStack, value, symbologyId]);

  useEffect(() => {
    const handoff = consumeHandoffText();
    if (handoff && typeof handoff === 'string' && handoff.trim()) {
      setValue(handoff.trim());
      toast.info(isFr ? 'Code-barres importé depuis le handoff' : 'Barcode imported from handoff');
    }
  }, [isFr]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInputFocused = activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInputFocused) {
          if (e.shiftKey) {
            e.preventDefault();
            handleRedo();
          } else {
            e.preventDefault();
            handleUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInputFocused) {
          e.preventDefault();
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  const handleSelectSymbology = useCallback((symbology: BarcodeSymbology) => {
    setHistory((prev) => [...prev.slice(-30), { value, symbologyId }]);
    setRedoStack([]);
    lastHistoryPushRef.current = 0;
    setSymbologyId(symbology.id);
    setValue(symbology.sample);
  }, [value, symbologyId]);

  const handleApplyAutoFix = useCallback((fixedValue: string) => {
    setHistory((prev) => [...prev.slice(-30), { value, symbologyId }]);
    setRedoStack([]);
    lastHistoryPushRef.current = 0;
    setValue(fixedValue);
    toast.success(isFr ? 'Clé de contrôle corrigée' : 'Checksum fixed');
  }, [value, symbologyId, isFr]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgRef.current || !validation.isValid) return;
    trackToolUsed('barcode-generator', 'download-svg');
    downloadSvgBarcode(svgRef.current, symbologyId, sanitizedBarcodeValue);
    toast.success(isFr ? 'Fichier SVG téléchargé' : 'SVG file downloaded');
  }, [symbologyId, sanitizedBarcodeValue, validation.isValid, isFr]);

  const handleDownloadPng = useCallback(async () => {
    if (!svgRef.current || !validation.isValid) return;
    trackToolUsed('barcode-generator', 'download-png');
    await downloadPngBarcode(svgRef.current, symbologyId, sanitizedBarcodeValue, backgroundMode === 'paper');
    toast.success(isFr ? 'Image PNG téléchargée' : 'PNG image downloaded');
  }, [symbologyId, sanitizedBarcodeValue, backgroundMode, validation.isValid, isFr]);

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
    printBarcodeLabel(svgRef.current, activeSymbology.name, sanitizedBarcodeValue);
  }, [activeSymbology.name, sanitizedBarcodeValue, validation.isValid]);

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
    redoStack,
    canRedo: redoStack.length > 0,
    svgRef,
    symbologies,
    activeSymbology,
    validation,
    handleValueChange,
    handleUndo,
    handleRedo,
    handleSelectSymbology,
    handleApplyAutoFix,
    handleDownloadSvg,
    handleDownloadPng,
    handleCopyPng,
    handlePrint,
    getSvgString,
  };
}
