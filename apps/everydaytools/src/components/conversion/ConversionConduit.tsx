import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { ActionTooltip } from '@/components/ui/tooltip';
import type { ConversionFormat } from './types';

export interface ConversionConduitProps {
  sourceFormat: ConversionFormat;
  targetFormat: ConversionFormat;
  fileName?: string;
  statusLabel: string;
}

const LEFT_WIRES = [
  'M 0,16 C 45,16 70,48 86,50',
  'M 0,33 C 45,33 70,49 86,50',
  'M 0,50 L 86,50',
  'M 0,67 C 45,67 70,51 86,50',
  'M 0,84 C 45,84 70,52 86,50',
];

const RIGHT_WIRES = [
  'M 114,50 C 130,48 155,16 200,16',
  'M 114,50 C 130,49 155,33 200,33',
  'M 114,50 L 200,50',
  'M 114,50 C 130,51 155,67 200,67',
  'M 114,50 C 130,52 155,84 200,84',
];

export const ConversionConduit: React.FC<ConversionConduitProps> = ({
  sourceFormat,
  targetFormat,
  fileName,
  statusLabel,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const leftGradId = React.useId();
  const rightGradId = React.useId();

  return (
    <motion.div
      key="processing-scene"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
      className="w-full py-14 sm:py-20 flex flex-col items-center text-center"
      role="status"
      aria-live="polite"
    >
      {/* Visual Stage: Perfect Optical Centering between Cards & Conduit */}
      <div className="w-full max-w-2xl sm:max-w-3xl mx-auto mb-12 px-4">
        {/* Row 1: Cards and Conduit share strict vertical center & height */}
        <div
          data-testid="cards-conduit-row"
          className="w-full flex items-center justify-between gap-3 sm:gap-6"
        >
          {/* Left: Source Format Origin Card */}
          <div
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-2 sm:p-2.5 shadow-lg flex-shrink-0"
            style={{
              backgroundColor: `${sourceFormat.color}12`,
              borderColor: `${sourceFormat.color}30`,
              borderWidth: 1.5,
            }}
          >
            <div className="w-full h-full rounded-2xl bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
              <img
                src={sourceFormat.icon}
                alt={sourceFormat.name}
                className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </div>
          </div>

          {/* Center: Synchronized Multi-Wire Streamline Conduit */}
          <div
            data-testid="flux-streamline"
            className="flex-1 h-32 sm:h-40 flex items-center justify-center relative min-w-[140px] sm:min-w-[200px] px-2 sm:px-4"
          >
            {/* SVG Multi-Wire Harness */}
            <svg
              className="w-full h-full absolute inset-0 overflow-visible pointer-events-none"
              viewBox="0 0 200 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <linearGradient id={leftGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={sourceFormat.color} stopOpacity="0.3" />
                  <stop offset="35%" stopColor={sourceFormat.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={sourceFormat.color} stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id={rightGradId} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={targetFormat.color} stopOpacity="0.8" />
                  <stop offset="65%" stopColor={targetFormat.color} stopOpacity="1" />
                  <stop offset="100%" stopColor={targetFormat.color} stopOpacity="0.3" />
                </linearGradient>
              </defs>

              {/* Left Wire Bundle (Source Coloration & Continuous Soft Wave) */}
              <g data-testid="left-wire-bundle">
                {LEFT_WIRES.map((d, index) => (
                  <g key={`left-wire-${index}`} data-testid={`left-wire-${index}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={sourceFormat.color}
                      strokeOpacity="0.2"
                      strokeWidth="1.5"
                    />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={sourceFormat.color}
                      strokeWidth="4"
                      strokeOpacity="0.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.32, pathOffset: -0.32 }}
                      animate={{ pathOffset: shouldReduceMotion ? 0.35 : [-0.32, 1.05] }}
                      transition={{ duration: 1.8, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={`url(#${leftGradId})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.32, pathOffset: -0.32 }}
                      animate={{ pathOffset: shouldReduceMotion ? 0.35 : [-0.32, 1.05] }}
                      transition={{ duration: 1.8, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'linear' }}
                    />
                  </g>
                ))}
              </g>

              {/* Right Wire Bundle (Target Coloration & Handover Wave) */}
              <g data-testid="right-wire-bundle">
                {RIGHT_WIRES.map((d, index) => (
                  <g key={`right-wire-${index}`} data-testid={`right-wire-${index}`}>
                    <path
                      d={d}
                      fill="none"
                      stroke={targetFormat.color}
                      strokeOpacity="0.2"
                      strokeWidth="1.5"
                    />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={targetFormat.color}
                      strokeWidth="4"
                      strokeOpacity="0.2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.32, pathOffset: -0.05 }}
                      animate={{ pathOffset: shouldReduceMotion ? 0.35 : [-0.05, 1.32] }}
                      transition={{ duration: 1.8, delay: shouldReduceMotion ? 0 : 0.9, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'linear' }}
                    />
                    <motion.path
                      d={d}
                      fill="none"
                      stroke={`url(#${rightGradId})`}
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0.32, pathOffset: -0.05 }}
                      animate={{ pathOffset: shouldReduceMotion ? 0.35 : [-0.05, 1.32] }}
                      transition={{ duration: 1.8, delay: shouldReduceMotion ? 0 : 0.9, repeat: shouldReduceMotion ? 0 : Infinity, ease: 'linear' }}
                    />
                  </g>
                ))}
              </g>
            </svg>

            {/* Center: Synchronized Transformation Hub */}
            <motion.div
              data-testid="central-transform-hub"
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      scale: [1, 1, 1.12, 1, 1],
                      borderColor: [
                        'rgba(228, 228, 231, 0.9)',
                        sourceFormat.color,
                        targetFormat.color,
                        'rgba(228, 228, 231, 0.9)',
                      ],
                    }
              }
              transition={{
                duration: 1.8,
                repeat: shouldReduceMotion ? 0 : Infinity,
                ease: 'easeInOut',
                times: [0, 0.45, 0.52, 0.62, 1],
              }}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 flex items-center justify-center shadow-md"
            >
              <motion.div
                animate={{
                  rotate: shouldReduceMotion ? 0 : 360,
                  color: shouldReduceMotion
                    ? targetFormat.color
                    : [
                        sourceFormat.color,
                        sourceFormat.color,
                        targetFormat.color,
                        targetFormat.color,
                      ],
                }}
                transition={{
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  duration: 1.8,
                  ease: 'linear',
                  times: [0, 0.48, 0.52, 1],
                }}
                className="flex items-center justify-center"
              >
                <ArrowRight size={18} strokeWidth={2.2} />
              </motion.div>
            </motion.div>
          </div>

          {/* Right: Target Format Destination Card */}
          <motion.div
            animate={{ scale: shouldReduceMotion ? 1 : [0.98, 1.02, 0.98] }}
            transition={{
              repeat: shouldReduceMotion ? 0 : Infinity,
              duration: 2.4,
              ease: 'easeInOut',
            }}
            className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-3xl p-2 sm:p-2.5 shadow-lg flex-shrink-0"
            style={{
              backgroundColor: `${targetFormat.color}1A`,
              borderColor: `${targetFormat.color}33`,
              borderWidth: 1.5,
              boxShadow: `0 4px 20px ${targetFormat.color}18`,
            }}
          >
            <div className="w-full h-full rounded-2xl bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-3 sm:p-4 relative overflow-hidden">
              <img
                src={targetFormat.icon}
                alt={targetFormat.name}
                className="relative w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </div>
          </motion.div>
        </div>

        {/* Row 2: Format Labels Aligned Under Each Card */}
        <div
          data-testid="format-labels-row"
          className="w-full flex items-center justify-between gap-3 sm:gap-6 mt-3"
        >
          <span
            className="w-32 sm:w-40 text-center text-xs sm:text-sm font-mono font-medium truncate flex-shrink-0"
            style={{ color: sourceFormat.color }}
          >
            {sourceFormat.name}
          </span>
          <div className="flex-1" />
          <span
            className="w-32 sm:w-40 text-center text-xs sm:text-sm font-mono font-medium truncate flex-shrink-0"
            style={{ color: targetFormat.color }}
          >
            {targetFormat.name}
          </span>
        </div>
      </div>

      {/* Direct Status Heading & Active File */}
      <h3 className="text-2xl sm:text-3xl font-semibold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
        {statusLabel}
      </h3>
      {fileName && (
        fileName.length > 30 ? (
          <ActionTooltip label={fileName} side="top">
            <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 max-w-sm truncate cursor-default">
              {fileName}
            </p>
          </ActionTooltip>
        ) : (
          <p className="text-xs font-mono text-zinc-400 dark:text-zinc-500 max-w-sm truncate">
            {fileName}
          </p>
        )
      )}
    </motion.div>
  );
};
