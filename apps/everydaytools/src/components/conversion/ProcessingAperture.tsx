import React from 'react';
import { motion } from 'framer-motion';

export interface ProcessingApertureProps {
  /** Path to the authentic format vector icon (e.g. '/icons/pdf.svg') */
  formatIcon: string;
  /** Format accent color (e.g. '#EC1C24' for PDF). Defaults to format color or brand accent */
  formatColor?: string;
  /** Alt label for the icon (default: 'Format') */
  formatAlt?: string;
  /** High-level uppercase telemetry stage label (e.g. 'DÉCOUPE EN COURS') */
  stageLabel: string;
  /** Main dynamic status headline */
  title: string;
  /** Optional secondary subtitle or detail */
  detail?: string;
  /** Optional numeric progress percentage (0 to 100) */
  progress?: number;
  /** Optional additional CSS classes */
  className?: string;
}

/**
 * Optical Aperture processing view (EverydayTools Design System)
 * Mechanical concentric SVG calibration rings with continuous kinetic rotation and central icon.
 * Dynamically styled with the document's authentic format color.
 */
export const ProcessingAperture: React.FC<ProcessingApertureProps> = ({
  formatIcon,
  formatColor,
  formatAlt = 'Format',
  stageLabel,
  title,
  detail,
  progress,
  className = '',
}) => {
  const effectiveColor =
    formatColor ||
    (formatIcon?.toLowerCase().includes('pdf')
      ? '#EC1C24'
      : formatIcon?.toLowerCase().includes('png') || formatIcon?.toLowerCase().includes('bmp')
        ? '#0066FF'
        : formatIcon?.toLowerCase().includes('jpg') || formatIcon?.toLowerCase().includes('jpeg')
          ? '#22A654'
          : 'var(--accent)');

  return (
    <motion.div
      key="processing-aperture"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className={`w-full py-20 sm:py-32 flex flex-col items-center justify-center text-center select-none ${className}`}
    >
      {/* High-Precision Optical Aperture */}
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-10 flex items-center justify-center">
        {/* Outer Ring: Fine Optical Graduations */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_16s_linear_infinite]"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r="92"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="2 10"
            className="text-black/[0.08] dark:text-white/10"
          />
        </svg>

        {/* Intermediate Ring: Optical Guide Track */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-black/[0.05] dark:text-white/[0.06]"
          />
        </svg>

        {/* High-Precision Kinetic Arc: Dynamic Format Coloration */}
        <svg
          className="absolute inset-0 w-full h-full animate-[spin_1.8s_cubic-bezier(0.4,0,0.2,1)_infinite]"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke={effectiveColor}
            strokeWidth="2.5"
            strokeDasharray="90 380"
            strokeLinecap="round"
          />
        </svg>

        {/* Focal Center: Authentic Format Icon housed in subtle format-tinted enclosure */}
        <div
          className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center p-3 sm:p-4 shadow-sm"
          style={{
            backgroundColor: `${effectiveColor}0D`,
            borderColor: `${effectiveColor}33`,
            borderWidth: 1.5,
          }}
        >
          <img
            src={formatIcon}
            alt={formatAlt}
            className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
          />
        </div>
      </div>

      {/* Live Telemetry */}
      <div className="flex flex-col items-center gap-2 mb-3">
        <span className="text-xs font-mono uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
          {stageLabel}
        </span>
        <div className="text-3xl sm:text-4xl font-mono font-bold text-zinc-950 dark:text-zinc-50 tabular-nums tracking-tight">
          {title}
        </div>
      </div>

      {detail && (
        <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 tracking-wide mt-1">
          {detail}
        </p>
      )}

      {typeof progress === 'number' && (
        <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 mt-2">
          {`${Math.round(progress)}%`}
        </span>
      )}
    </motion.div>
  );
};

export default ProcessingAperture;
