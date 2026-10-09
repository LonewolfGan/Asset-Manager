import { useRef, useEffect, useCallback } from 'react';
import type { WatermarkConfig } from '@/lib/watermark-logic';
import { drawWatermarkOnContext } from '@/lib/watermark-logic';

interface UseWatermarkCanvasProps {
  imgElement: HTMLImageElement | null;
  config: WatermarkConfig;
  isHoldingOriginal: boolean;
  previewUrl: string | null;
}

export function useWatermarkCanvas({
  imgElement,
  config,
  isHoldingOriginal,
  previewUrl,
}: UseWatermarkCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportContainerRef = useRef<HTMLDivElement>(null);

  // Dynamic Google Fonts loading for typography options
  useEffect(() => {
    const linkId = 'watermark-google-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href =
        'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Caveat:wght@600&family=Cinzel:wght@700&family=Dancing+Script:wght@700&family=Inter:wght@600;700&family=JetBrains+Mono:wght@600&family=Merriweather:wght@700&family=Montserrat:wght@600;700&family=Playfair+Display:wght@700&family=Poppins:wght@600;700&family=Roboto:wght@700&display=swap';
      document.head.appendChild(link);
    }
  }, []);

  const redrawCanvas = useCallback(() => {
    if (!imgElement || !canvasRef.current || !viewportContainerRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const containerW = viewportContainerRef.current.clientWidth || 800;
    const containerH = viewportContainerRef.current.clientHeight || 560;

    const scaleX = (containerW - 32) / imgElement.naturalWidth;
    const scaleY = (containerH - 32) / imgElement.naturalHeight;
    const fitScale = Math.min(1, Math.min(scaleX, scaleY));

    const displayW = Math.max(100, Math.round(imgElement.naturalWidth * fitScale));
    const displayH = Math.max(100, Math.round(imgElement.naturalHeight * fitScale));

    canvas.width = displayW;
    canvas.height = displayH;

    ctx.drawImage(imgElement, 0, 0, displayW, displayH);

    if (!isHoldingOriginal && config.text.trim()) {
      drawWatermarkOnContext(ctx, displayW, displayH, config, fitScale);
    }
  }, [imgElement, config, isHoldingOriginal]);

  useEffect(() => {
    redrawCanvas();
    const rafId = requestAnimationFrame(redrawCanvas);
    const timers = [16, 60, 150, 300].map((ms) => setTimeout(redrawCanvas, ms));
    return () => {
      cancelAnimationFrame(rafId);
      timers.forEach(clearTimeout);
    };
  }, [redrawCanvas, imgElement]);

  useEffect(() => {
    const container = viewportContainerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => {
      redrawCanvas();
    });
    observer.observe(container);
    window.addEventListener('resize', redrawCanvas);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', redrawCanvas);
    };
  }, [redrawCanvas, previewUrl, imgElement]);

  useEffect(() => {
    document.fonts?.ready?.then(() => {
      redrawCanvas();
    });
  }, [config.fontId, redrawCanvas]);

  return {
    canvasRef,
    viewportContainerRef,
    redrawCanvas,
  };
}
