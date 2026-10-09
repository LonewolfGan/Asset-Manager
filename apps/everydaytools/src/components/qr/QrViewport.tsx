import React from 'react';
import { Download, AlertCircle } from 'lucide-react';
import { CopyButton } from '@/components/ui/copy-button';
import { trackToolUsed } from '@/lib/analytics';

export interface QrViewportProps {
  isFr: boolean;
  tq: any;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  bgColor: string;
  isEmpty: boolean;
  genError: string | null;
  content: string;
  size: number;
  downloadPng: () => void;
  downloadSvg: () => void;
  copyImage: () => Promise<void>;
}

export function QrViewport({
  isFr,
  tq,
  canvasRef,
  bgColor,
  isEmpty,
  genError,
  content,
  size,
  downloadPng,
  downloadSvg,
  copyImage,
}: QrViewportProps) {
  return (
    <div className="lg:col-span-6 xl:col-span-7 flex flex-col gap-6 lg:sticky lg:top-24">
      {/* Viewport Canvas Frame (Single Clean Surface, Zero Nested Box Slop) */}
      <div className="w-full flex flex-col items-center justify-center min-h-[420px] sm:min-h-[500px] p-6 sm:p-10 rounded-2xl bg-zinc-50 dark:bg-zinc-900/30 border border-zinc-200/80 dark:border-white/10 relative overflow-hidden">
        {/* Calibration Markers */}
        <div className="absolute top-4 left-5 font-mono text-[10px] text-zinc-400/80 uppercase tracking-widest pointer-events-none">
          MATRIX VIEWPORT · {size}×{size}PX
        </div>

        <div className="absolute top-4 right-5 font-mono text-[10px] text-zinc-400/80 uppercase tracking-widest pointer-events-none">
          ECC-H · 30% RECOVERY
        </div>

        <div
          className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[350px] md:h-[350px] rounded-2xl flex items-center justify-center p-7 sm:p-9 md:p-10 shadow-sm border border-zinc-200/80 dark:border-white/10 transition-colors"
          style={{ backgroundColor: bgColor }}
        >
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center text-center p-4">
              <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                {isFr ? 'Saisissez du contenu pour générer le code QR' : 'Enter payload to render matrix'}
              </p>
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full aspect-square object-contain rounded-sm"
              style={{ imageRendering: 'pixelated' }}
            />
          )}
        </div>

        {/* Viewport Error Display */}
        {genError && (
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{genError}</span>
          </div>
        )}

        {/* Bottom Live Telemetry */}
        <div className="absolute bottom-3 left-5 right-5 flex items-center justify-between text-[10px] font-mono text-zinc-400/70 pointer-events-none">
          <span>{content.length} {isFr ? 'OCTETS' : 'BYTES'}</span>
          <span>HD 1024 PX · ECC 30%</span>
        </div>
      </div>

      {/* Direct Export Action Dock */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={downloadPng}
          disabled={isEmpty || !!genError}
          className="h-11 flex-1 px-5 rounded-xl inline-flex items-center justify-center gap-2 text-xs font-mono font-semibold text-white bg-[#FF6B35] hover:bg-[#e85a24] active:scale-[0.98] shadow-xs transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isFr ? 'Télécharger PNG' : 'Download PNG'}</span>
        </button>

        <button
          type="button"
          onClick={downloadSvg}
          disabled={isEmpty || !!genError}
          className="h-11 px-5 rounded-xl inline-flex items-center justify-center gap-2 text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 active:scale-[0.98] border border-zinc-200/80 dark:border-white/10 transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isFr ? 'Télécharger SVG' : 'Download SVG'}</span>
        </button>

        <CopyButton
          copyFn={copyImage}
          disabled={isEmpty || !!genError}
          label={tq.copyImage}
          copiedLabel={tq.copied}
          variant="default"
          size="lg"
          className="h-11 px-4 rounded-xl text-xs font-mono font-medium text-zinc-900 dark:text-zinc-100"
          onCopy={() => trackToolUsed('qr-code-generator', 'copy-image')}
        />
      </div>
    </div>
  );
}
