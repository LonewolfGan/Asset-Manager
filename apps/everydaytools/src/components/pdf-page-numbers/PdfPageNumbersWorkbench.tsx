import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Loader2 } from 'lucide-react';
import { StudioCommandBar } from '@workspace/ui';
import { getFileFormatIcon } from '@/lib/file-format-icon';
import { PdfPageNumbersControls } from './PdfPageNumbersControls';
import { PdfPageNumbersLivePreview } from './PdfPageNumbersLivePreview';
import type {
  PdfNumberPosition,
  PositionOption,
  FormatOption,
} from '@/lib/pdf-page-numbers-logic';
import type { ConversionFormat } from '@/components/conversion';

export interface PdfPageNumbersWorkbenchProps {
  file: File;
  sourceFormat: ConversionFormat;
  totalPages: number | null;
  isProcessing: boolean;
  isFr: boolean;
  tc: Record<string, any>;
  onReset: () => void;
  onConvert: () => void;
  position: PdfNumberPosition;
  setPosition: (pos: PdfNumberPosition) => void;
  format: string;
  setFormat: (format: string) => void;
  startNum: number;
  setStartNum: (num: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  skipFirst: boolean;
  onToggleSkipFirst: () => void;
  positionOptions: PositionOption[];
  formatOptions: FormatOption[];
  pagePreviewUrl: string | null;
  previewPage: number;
  isLoadingPreview: boolean;
  onPageChange: (newPage: number) => void;
  stampLabel: string | null;
}

export const PdfPageNumbersWorkbench: React.FC<PdfPageNumbersWorkbenchProps> = ({
  file,
  sourceFormat,
  totalPages,
  isProcessing,
  isFr,
  tc,
  onReset,
  onConvert,
  position,
  setPosition,
  format,
  setFormat,
  startNum,
  setStartNum,
  fontSize,
  setFontSize,
  skipFirst,
  onToggleSkipFirst,
  positionOptions,
  formatOptions,
  pagePreviewUrl,
  previewPage,
  isLoadingPreview,
  onPageChange,
  stampLabel,
}) => {
  return (
    <motion.div
      key="staging-page-numbers-workbench"
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
          label: tc.applyBtn ?? (isFr ? 'Numéroter le PDF' : 'Number Pages & Download'),
          loadingLabel: tc.applying ?? (isFr ? 'Numérotation...' : 'Numbering...'),
          onClick: onConvert,
          isDisabled: isProcessing || !file,
          isLoading: isProcessing,
          icon: Hash,
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
                  {isFr ? 'Numérotation en cours' : 'Numbering in progress'}
                </span>
                <span className="text-zinc-400">·</span>
                <span className="text-zinc-500 dark:text-zinc-400">
                  {isFr
                    ? 'Calcul des coordonnées géométriques et apposition vectorielle'
                    : 'Calculating geometric coordinates and applying vector stamp'}
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
          <PdfPageNumbersControls
            position={position}
            setPosition={setPosition}
            format={format}
            setFormat={setFormat}
            startNum={startNum}
            setStartNum={setStartNum}
            fontSize={fontSize}
            setFontSize={setFontSize}
            skipFirst={skipFirst}
            onToggleSkipFirst={onToggleSkipFirst}
            positionOptions={positionOptions}
            formatOptions={formatOptions}
            isFr={isFr}
            tc={tc}
          />
        </div>

        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <PdfPageNumbersLivePreview
            pagePreviewUrl={pagePreviewUrl}
            previewPage={previewPage}
            totalPages={totalPages}
            isLoadingPreview={isLoadingPreview}
            position={position}
            fontSize={fontSize}
            skipFirst={skipFirst}
            isFr={isFr}
            onPageChange={onPageChange}
            stampLabel={stampLabel}
          />
        </div>
      </div>
    </motion.div>
  );
};
