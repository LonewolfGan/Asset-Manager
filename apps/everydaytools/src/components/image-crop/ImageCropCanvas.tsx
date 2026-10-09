import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Focus, Loader2, Maximize2, RefreshCw } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { CropRect } from '../../lib/image-crop-logic';
import type { DragState } from '../../lib/image-crop-geometry';
import {
  computeResizedCrop,
  computeCreatedCrop,
} from '../../lib/image-crop-geometry';
import {
  computeCanvasMetrics,
  getHitTarget,
  getCursorForHit,
  drawCropCanvas,
} from '../../lib/image-crop-canvas-renderer';

interface ImageCropCanvasProps {
  imgObj: HTMLImageElement | null;
  crop: CropRect;
  setCrop: (crop: CropRect) => void;
  origW: number;
  origH: number;
  aspectRatio: number | null;
  isProcessing: boolean;
  onCenterCrop: () => void;
  onMaximizeCrop: () => void;
  onResetCrop: () => void;
}

export function ImageCropCanvas({
  imgObj,
  crop,
  setCrop,
  origW,
  origH,
  aspectRatio,
  isProcessing,
  onCenterCrop,
  onMaximizeCrop,
  onResetCrop,
}: ImageCropCanvasProps) {
  const { isFr } = useLocale();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef<DragState | null>(null);
  const [cursorStyle, setCursorStyle] = useState<string>('default');

  const getCanvasMetrics = useCallback(() => {
    if (!imgObj || !stageRef.current) return null;
    const stageWidth = Math.max(300, stageRef.current.clientWidth - 32);
    const maxH = window.innerWidth < 640 ? 380 : 540;
    return computeCanvasMetrics(imgObj.width, imgObj.height, stageWidth, maxH);
  }, [imgObj]);

  const renderCanvas = useCallback(() => {
    if (!imgObj || !canvasRef.current) return;
    const metrics = getCanvasMetrics();
    if (!metrics) return;

    const { displayW, displayH, scale } = metrics;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(displayW * dpr);
    canvas.height = Math.round(displayH * dpr);
    canvas.style.width = `${Math.round(displayW)}px`;
    canvas.style.height = `${Math.round(displayH)}px`;

    drawCropCanvas(ctx, imgObj, crop, displayW, displayH, scale, dpr);
  }, [imgObj, crop, getCanvasMetrics]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  useEffect(() => {
    const handleResize = () => renderCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [renderCanvas]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imgObj) return;
    const metrics = getCanvasMetrics();
    if (!metrics) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const nx = px / metrics.scale;
    const ny = py / metrics.scale;
    const hit = getHitTarget(px, py, crop, metrics.scale);

    e.currentTarget.setPointerCapture(e.pointerId);

    if (hit.type === 'handle') {
      dragStateRef.current = {
        mode: 'resize',
        handle: hit.handle,
        startX: nx,
        startY: ny,
        initialCrop: { ...crop },
      };
    } else if (hit.type === 'move') {
      dragStateRef.current = {
        mode: 'move',
        startX: nx,
        startY: ny,
        initialCrop: { ...crop },
      };
    } else {
      dragStateRef.current = {
        mode: 'create',
        startX: nx,
        startY: ny,
        initialCrop: { x: nx, y: ny, w: 0, h: 0 },
      };
      setCrop({ x: Math.round(nx), y: Math.round(ny), w: 1, h: 1 });
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !imgObj) return;
    const metrics = getCanvasMetrics();
    if (!metrics) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    const nx = px / metrics.scale;
    const ny = py / metrics.scale;

    if (!dragStateRef.current) {
      const hit = getHitTarget(px, py, crop, metrics.scale);
      setCursorStyle(getCursorForHit(hit));
      return;
    }

    const { mode, handle, startX, startY, initialCrop } = dragStateRef.current;

    if (mode === 'move') {
      const dx = nx - startX;
      const dy = ny - startY;
      const newX = Math.max(0, Math.min(initialCrop.x + dx, origW - initialCrop.w));
      const newY = Math.max(0, Math.min(initialCrop.y + dy, origH - initialCrop.h));
      setCrop({ ...initialCrop, x: Math.round(newX), y: Math.round(newY) });
    } else if (mode === 'resize' && handle) {
      const resized = computeResizedCrop(
        initialCrop,
        handle,
        { x: nx, y: ny },
        origW,
        origH,
        aspectRatio
      );
      setCrop(resized);
    } else if (mode === 'create') {
      const newBox = computeCreatedCrop(startX, startY, nx, ny, aspectRatio, origW, origH);
      setCrop(newBox);
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (dragStateRef.current) {
      dragStateRef.current = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Pointer capture release safety
      }
    }
  };

  return (
    <div className="lg:col-span-8 xl:col-span-9 flex flex-col items-center gap-3 w-full">
      <div
        ref={stageRef}
        className="relative w-full rounded-2xl sm:rounded-3xl bg-zinc-100/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 flex flex-col items-center justify-center select-none overflow-hidden py-6 px-4 shadow-xs min-h-[460px] sm:min-h-[520px] lg:min-h-[560px]"
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
              linear-gradient(-45deg, rgba(0,0,0,0.04) 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, rgba(0,0,0,0.04) 75%),
              linear-gradient(-45deg, transparent 75%, rgba(0,0,0,0.04) 75%)
            `,
            backgroundSize: '24px 24px',
            backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
          }}
        />

        <div className="relative inline-block max-w-full z-10">
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ cursor: cursorStyle, touchAction: 'none' }}
            className="block rounded-xl shadow-lg max-w-full"
          />

          {isProcessing && (
            <div className="absolute inset-0 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-xs rounded-xl flex flex-col items-center justify-center text-zinc-900 dark:text-zinc-100 gap-2.5 z-20">
              <Loader2 className="w-9 h-9 animate-spin text-[#FF6B35]" />
              <span className="text-xs font-mono font-medium tracking-wide">
                {isFr ? 'Recadrage en cours...' : 'Cropping in progress...'}
              </span>
            </div>
          )}
        </div>

        <div className="absolute top-3 right-3 z-20 flex items-center gap-1 p-1 rounded-xl bg-white/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 shadow-xs backdrop-blur-xs">
          <ActionTooltip label={isFr ? 'Centrer le cadre' : 'Center crop'}>
            <button
              type="button"
              onClick={onCenterCrop}
              className="h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Focus size={13} />
              <span>{isFr ? 'Centrer' : 'Center'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? 'Tout sélectionner' : 'Select all'}>
            <button
              type="button"
              onClick={onMaximizeCrop}
              className="h-7 px-2.5 rounded-lg text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Maximize2 size={13} />
              <span>{isFr ? 'Tout sélectionner' : 'Select all'}</span>
            </button>
          </ActionTooltip>

          <ActionTooltip label={isFr ? 'Réinitialiser' : 'Reset'}>
            <button
              type="button"
              onClick={onResetCrop}
              className="h-7 px-2 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-colors flex items-center cursor-pointer"
            >
              <RefreshCw size={12} />
            </button>
          </ActionTooltip>
        </div>
      </div>
    </div>
  );
}
