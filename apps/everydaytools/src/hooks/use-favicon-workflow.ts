import { useState, useEffect, useCallback, useMemo } from 'react';
import { consumeHandoffFile } from '@/lib/file-handoff';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { apiUrl } from '@/lib/apiBase';
import {
  type IconShape,
  generateHtmlSnippet,
  generateWebManifestSnippet,
  generateNextJsSnippet,
  buildClientIco,
} from '@/lib/favicon-logic';
import { renderCompositedCanvas, canvasToPngBytes } from '@/lib/favicon-canvas-renderer';

export type StageView = 'browser' | 'mobile' | 'search' | 'manifest' | 'code';

export interface FaviconWorkflowResult {
  blob: Blob;
  filename: string;
  sizeBefore: number;
  sizeAfter: number;
}

export function useFaviconWorkflow(isFr: boolean) {
  const [file, setFile] = useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [dimensions, setDimensions] = useState<{ width: number; height: number } | null>(null);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Studio parameters
  const [padding, setPadding] = useState<number>(10);
  const [bgColor, setBgColor] = useState<string>('transparent');
  const [previewShape, setPreviewShape] = useState<IconShape>('squircle');
  const [stageView, setStageView] = useState<StageView>('browser');
  const [browserTheme, setBrowserTheme] = useState<'light' | 'dark'>('light');

  // Composited live preview state
  const [compositedUrl, setCompositedUrl] = useState<string>('');
  const [compositedBlob, setCompositedBlob] = useState<Blob | null>(null);

  // Generation & Async state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FaviconWorkflowResult | null>(null);
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'manifest' | 'nextjs'>('html');

  const isModified = padding !== 10 || bgColor !== 'transparent' || previewShape !== 'squircle';

  const handleFiles = useCallback((selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    const selected = selectedFiles[0];
    if (!selected.type.startsWith('image/') && !selected.name.endsWith('.svg')) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setSourceUrl(url);
    setResult(null);
    setError(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageElement(img);
      setDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = url;
  }, []);

  useEffect(() => {
    const staged = consumeHandoffFile();
    if (staged && (staged.type.startsWith('image/') || staged.name.endsWith('.svg'))) {
      handleFiles([staged]);
    }
  }, [handleFiles]);

  useEffect(() => {
    return () => {
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (compositedUrl) URL.revokeObjectURL(compositedUrl);
    };
  }, [sourceUrl, compositedUrl]);

  const handleResetAdjustments = useCallback(() => {
    setPadding(10);
    setBgColor('transparent');
    setPreviewShape('squircle');
  }, []);

  const handleFullReset = useCallback(() => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl);
    if (compositedUrl) URL.revokeObjectURL(compositedUrl);
    setFile(null);
    setSourceUrl('');
    setImageElement(null);
    setDimensions(null);
    setCompositedUrl('');
    setCompositedBlob(null);
    setResult(null);
    setError(null);
    setIsProcessing(false);
    handleResetAdjustments();
  }, [sourceUrl, compositedUrl, handleResetAdjustments]);

  useEffect(() => {
    if (!imageElement) return;
    const baseSize = Math.max(512, Math.min(1024, imageElement.naturalWidth || 512));
    const canvas = renderCompositedCanvas(imageElement, padding, bgColor, previewShape, baseSize);

    canvas.toBlob((blob) => {
      if (!blob) return;
      setCompositedBlob(blob);
      const url = URL.createObjectURL(blob);
      setCompositedUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
    }, 'image/png');
  }, [imageElement, padding, bgColor, previewShape]);

  const handleGenerateZip = useCallback(async () => {
    if (!file) return;
    trackToolUsed('favicon-generator', 'images');
    setError(null);
    setIsProcessing(true);

    try {
      const fd = new FormData();
      if (compositedBlob && (padding !== 0 || bgColor !== 'transparent' || previewShape !== 'square')) {
        fd.append('file', compositedBlob, 'icon-source.png');
      } else {
        fd.append('file', file);
      }

      const res = await fetch(apiUrl('/api/tools/favicon-generate'), { method: 'POST', body: fd });
      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        throw new Error(err.error ?? (isFr ? 'Échec de la génération des favicons' : 'Failed to generate favicons'));
      }

      const blob = await res.blob();
      setResult({ blob, filename: 'favicons.zip', sizeBefore: file.size, sizeAfter: blob.size });

      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = 'favicons.zip';
      a.click();
      URL.revokeObjectURL(dlUrl);
    } catch (e) {
      trackToolError('favicon-generator', 'general-error');
      setError(e instanceof Error ? e.message : (isFr ? 'Erreur lors de la génération. Veuillez réessayer.' : 'Generation failed. Please try again.'));
    } finally {
      setIsProcessing(false);
    }
  }, [file, compositedBlob, padding, bgColor, previewShape, isFr]);

  const handleDownloadSingle = useCallback(
    async (size: number, filename: string) => {
      if (!imageElement) return;

      if (filename === 'favicon.ico') {
        const c16 = renderCompositedCanvas(imageElement, padding, bgColor, previewShape, 16, true);
        const c32 = renderCompositedCanvas(imageElement, padding, bgColor, previewShape, 32, true);
        const c48 = renderCompositedCanvas(imageElement, padding, bgColor, previewShape, 48, true);

        const [b16, b32, b48] = await Promise.all([
          canvasToPngBytes(c16),
          canvasToPngBytes(c32),
          canvasToPngBytes(c48),
        ]);

        const icoBlob = buildClientIco([
          { size: 16, bytes: b16 },
          { size: 32, bytes: b32 },
          { size: 48, bytes: b48 },
        ]);

        const url = URL.createObjectURL(icoBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'favicon.ico';
        a.click();
        URL.revokeObjectURL(url);
        return;
      }

      const canvas = renderCompositedCanvas(imageElement, padding, bgColor, previewShape, size, true);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    },
    [imageElement, padding, bgColor, previewShape]
  );

  const handleDownloadCachedZip = useCallback(() => {
    if (!result) {
      handleGenerateZip();
      return;
    }
    const dlUrl = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = dlUrl;
    a.download = result.filename;
    a.click();
    URL.revokeObjectURL(dlUrl);
  }, [result, handleGenerateZip]);

  const htmlSnippet = useMemo(() => generateHtmlSnippet(bgColor, isFr), [bgColor, isFr]);
  const webmanifestSnippet = useMemo(() => generateWebManifestSnippet(bgColor, isFr), [bgColor, isFr]);
  const nextjsSnippet = useMemo(() => generateNextJsSnippet(), []);

  const activeCodeSnippet = useMemo(() => {
    if (activeCodeTab === 'manifest') return webmanifestSnippet;
    if (activeCodeTab === 'nextjs') return nextjsSnippet;
    return htmlSnippet;
  }, [activeCodeTab, htmlSnippet, webmanifestSnippet, nextjsSnippet]);

  const handleDownloadManifestFile = useCallback(() => {
    const blob = new Blob([webmanifestSnippet], { type: 'application/manifest+json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'site.webmanifest';
    a.click();
    URL.revokeObjectURL(url);
  }, [webmanifestSnippet]);

  return {
    file,
    sourceUrl,
    dimensions,
    isDragging,
    setIsDragging,
    handleFiles,
    padding,
    setPadding,
    bgColor,
    setBgColor,
    previewShape,
    setPreviewShape,
    stageView,
    setStageView,
    browserTheme,
    setBrowserTheme,
    compositedUrl,
    isProcessing,
    error,
    result,
    activeCodeTab,
    setActiveCodeTab,
    isModified,
    handleResetAdjustments,
    handleFullReset,
    handleGenerateZip,
    handleDownloadSingle,
    handleDownloadCachedZip,
    activeCodeSnippet,
    handleDownloadManifestFile,
  };
}
