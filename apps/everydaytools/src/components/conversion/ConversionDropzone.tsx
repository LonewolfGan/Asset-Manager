import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';
import type { ConversionFormat } from './types';

export interface ConversionDropzoneProps {
  sourceFormat: ConversionFormat;
  title: string;
  description: string;
  buttonLabel?: string;
  accept?: string;
  multiple?: boolean;
  isDragging: boolean;
  onFileSelected?: (file: File) => void;
  onFilesSelected?: (files: File[]) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
}

export const ConversionDropzone: React.FC<ConversionDropzoneProps> = ({
  sourceFormat,
  title,
  description,
  buttonLabel,
  accept,
  multiple = false,
  isDragging,
  onFileSelected,
  onFilesSelected,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  const { locale } = useLocale();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileAccept = accept ?? `.${sourceFormat.extension},application/${sourceFormat.extension}`;

  const defaultButtonLabel = multiple
    ? (locale === 'FR' ? 'Sélectionner des fichiers' : 'Choose files')
    : (locale === 'FR' ? 'Sélectionner un fichier' : 'Choose a file');

  const resolvedButtonLabel = buttonLabel
    ? (locale === 'EN' && (buttonLabel === 'Sélectionner un fichier' || buttonLabel === 'Sélectionner un document')
        ? (multiple ? 'Choose files' : 'Choose a file')
        : (locale === 'EN' && buttonLabel === 'Sélectionner des fichiers' ? 'Choose files' : buttonLabel))
    : defaultButtonLabel;

  return (
    <motion.div
      key="dropzone-scene"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
      className="w-full"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={fileAccept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            const fileList = Array.from(e.target.files);
            if (onFilesSelected) {
              onFilesSelected(fileList);
            } else if (onFileSelected) {
              onFileSelected(fileList[0]);
            }
          }
        }}
      />

      {/* Outer Bezel (Expansive Width, Zero Glow) */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer select-none rounded-[2.5rem] p-2 sm:p-2.5 transition-all duration-300 ${
          isDragging
            ? 'bg-red-500/10 ring-2 ring-red-500/50 scale-[1.005]'
            : 'bg-neutral-200/50 dark:bg-white/[0.04] hover:bg-neutral-200/80 dark:hover:bg-white/[0.07] border border-black/5 dark:border-white/10'
        }`}
      >
        {/* Inner Bezel */}
        <div className="rounded-[calc(2.5rem-8px)] bg-white dark:bg-zinc-950/85 border border-black/5 dark:border-white/5 px-8 sm:px-16 py-20 sm:py-28 flex flex-col items-center text-center backdrop-blur-xl transition-colors">
          {/* Free-Standing Authentic Vector Artwork (Unboxed, Enlarged, Zero Sub-Card Wrapper) */}
          <div className="relative mb-8 flex items-center justify-center">
            <img
              src={sourceFormat.icon}
              alt={sourceFormat.name}
              className={`relative w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                sourceFormat.icon.includes('/file.svg') || sourceFormat.icon.includes('/image.svg')
                  ? 'dark:brightness-0 dark:invert'
                  : ''
              }`}
            />
          </div>

          {/* Canonical Typography */}
          <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2.5">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mb-8 leading-relaxed">
            {description}
          </p>

          {/* Button-in-Button Trigger ("Sélectionner un fichier" / "Choose a file") */}
          <div className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-950 font-medium text-sm shadow-md active:scale-[0.98] transition-all duration-200">
            <span>{resolvedButtonLabel}</span>
            <span className="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 flex items-center justify-center">
              <ArrowRight size={13} strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
