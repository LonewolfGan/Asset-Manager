import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stamp, Loader2 } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { PdfWatermarkControls } from './PdfWatermarkControls';
import { PdfWatermarkLivePreview } from './PdfWatermarkLivePreview';
import type {
  WatermarkPattern,
  WatermarkPagesScope,
  WatermarkAngle,
} from '@/lib/pdf-watermark-logic';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfWatermarkWorkbenchProps {
  file: File;
  sourceFormat: ConversionFormat;
  totalPages: number | null;
  isProcessing: boolean;
  isFr: boolean;
  tc: Record<string, any>;
  onReset: () => void;
  onConvert: () => void;
  text: string;
  setText: (val: string) => void;
  presetTexts: readonly string[];
  pattern: WatermarkPattern;
  setPattern: (p: WatermarkPattern) => void;
  colorHex: string;
  setColorHex: (color: string) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  opacity: number;
  setOpacity: (op: number) => void;
  angle: WatermarkAngle;
  setAngle: (angle: WatermarkAngle) => void;
  pagesScope: WatermarkPagesScope;
  setPagesScope: (scope: WatermarkPagesScope) => void;
  pagePreviewUrl: string | null;
  previewPage: number;
  isLoadingPreview: boolean;
  onPageChange: (newPage: number) => void;
}

export const PdfWatermarkWorkbench: React.FC<PdfWatermarkWorkbenchProps> = ({
  file,
  sourceFormat,
  totalPages,
  isProcessing,
  isFr,
  tc,
  onReset,
  onConvert,
  text,
  setText,
  presetTexts,
  pattern,
  setPattern,
  colorHex,
  setColorHex,
  fontSize,
  setFontSize,
  opacity,
  setOpacity,
  angle,
  setAngle,
  pagesScope,
  setPagesScope,
  pagePreviewUrl,
  previewPage,
  isLoadingPreview,
  onPageChange,
}) => {
  const hasText = !!text.trim();

  return (
    <motion.div
      key="staging-watermark-workbench"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-4 sm:py-8 flex flex-col"
    >
      <StudioCommandBar
        meta={{
          name: file.name,
          size: file.size,
          icon: getFileFormatIcon(file, sourceFormat.icon),
          pageCount: totalPages ?? undefined,
        }}
        onReset={onReset}
        resetLabel={isFr ? 'Changer de document' : 'Change document'}
        primaryAction={{
          label: tc.applyBtn ?? (isFr ? 'Appliquer le filigrane' : 'Apply Watermark'),
          loadingLabel: tc.applying ?? (isFr ? 'Incrustation...' : 'Applying...'),
          onClick: onConvert,
          isDisabled: isProcessing || !file || !hasText,
          isLoading: isProcessing,
          icon: Stamp,
        }}
      />

      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden pt-4 pb-2 space-y-2.5"
          >
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Loader2 size={13} className="animate-spin text-[#FF6B35] shrink-0" />
                <span className="font-semibold">
                  {isFr ? 'Incrustation du filigrane en cours' : 'Watermark application in progress'}
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {pattern === 'repeat'
                    ? isFr
                      ? 'Application du motif répété sur toute la page'
                      : 'Applying repeated pattern across page'
                    : isFr
                    ? 'Application du filigrane central'
                    : 'Applying centered watermark'}
                </span>
              </div>
              <span className="text-[11px] text-[#FF6B35] font-semibold tracking-wide">
                ISO 32000-1
              </span>
            </div>
            <div className="h-0.5 w-full bg-black/[0.06] dark:bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-[#FF6B35]"
                initial={{ x: '-100%', width: '40%' }}
                animate={{ x: '300%', width: '40%' }}
                transition={{ repeat: Infinity, duration: 1.1, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 transition-opacity duration-200 ${
          isProcessing ? 'opacity-40 pointer-events-none select-none' : ''
        }`}
      >
        <div className="lg:col-span-7">
          <PdfWatermarkControls
            text={text}
            setText={setText}
            presetTexts={presetTexts}
            pattern={pattern}
            setPattern={setPattern}
            colorHex={colorHex}
            setColorHex={setColorHex}
            fontSize={fontSize}
            setFontSize={setFontSize}
            opacity={opacity}
            setOpacity={setOpacity}
            angle={angle}
            setAngle={setAngle}
            pagesScope={pagesScope}
            setPagesScope={setPagesScope}
            isFr={isFr}
            tc={tc}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <PdfWatermarkLivePreview
            pagePreviewUrl={pagePreviewUrl}
            previewPage={previewPage}
            totalPages={totalPages}
            isLoadingPreview={isLoadingPreview}
            text={text}
            fontSize={fontSize}
            opacity={opacity}
            colorHex={colorHex}
            angle={angle}
            pattern={pattern}
            pagesScope={pagesScope}
            isFr={isFr}
            tc={tc}
            onPageChange={onPageChange}
          />
        </div>
      </div>
    </motion.div>
  );
};
