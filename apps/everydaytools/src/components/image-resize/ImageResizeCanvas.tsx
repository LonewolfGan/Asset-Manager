import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { StudioViewport } from '@workspace/ui';

interface ImageResizeCanvasProps {
  previewUrl: string | null;
  targetW: number;
  targetH: number;
  visualScaleFactor: number;
  isProcessing: boolean;
  isFr: boolean;
}

export function ImageResizeCanvas({
  previewUrl,
  targetW,
  targetH,
  visualScaleFactor,
  isProcessing,
  isFr,
}: ImageResizeCanvasProps) {
  return (
    <StudioViewport
      className="lg:col-span-7 xl:col-span-8 flex flex-col items-center justify-center relative py-8 select-none"
      minHeight="min-h-[440px] sm:min-h-[500px]"
    >
      {/* Wireframe fantôme discret quand l'image est réduite */}
      {previewUrl && visualScaleFactor < 0.95 && (
        <div
          className="absolute pointer-events-none border border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg transition-all duration-200"
          style={{
            width: '100%',
            height: '100%',
            maxWidth: '480px',
            maxHeight: '400px',
          }}
        />
      )}

      {/* Image Vivante réactive en direct avec repères L et H */}
      <div
        className="relative transition-transform duration-150 ease-out origin-center flex items-center justify-center max-w-full"
        style={{
          transform: `scale(${visualScaleFactor})`,
        }}
      >
        {/* Repère Largeur (L) */}
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 tracking-wider whitespace-nowrap z-10 select-none">
          <span>{isFr ? 'L :' : 'W:'} {targetW} px</span>
        </div>

        {/* Repère Hauteur (H) */}
        <div className="absolute top-1/2 -right-5 translate-x-full -translate-y-1/2 text-xs font-mono font-medium text-zinc-500 dark:text-zinc-400 tracking-wider whitespace-nowrap z-10 select-none">
          <span>{isFr ? 'H :' : 'H:'} {targetH} px</span>
        </div>

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Visual Preview"
            className="max-h-[320px] sm:max-h-[380px] w-auto max-w-full object-contain rounded-lg drop-shadow-md"
          />
        )}

        {/* Processing Overlay discret sur l'image */}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-[2px] rounded-lg flex flex-col items-center justify-center gap-2.5 z-20"
          >
            <Loader2 size={28} className="animate-spin text-[#FF6B35]" />
            <span className="text-xs font-mono uppercase tracking-wider text-zinc-900 dark:text-zinc-100 font-medium">
              {isFr ? 'Redimensionnement en cours...' : 'Resizing in progress...'}
            </span>
          </motion.div>
        )}
      </div>
    </StudioViewport>
  );
}
