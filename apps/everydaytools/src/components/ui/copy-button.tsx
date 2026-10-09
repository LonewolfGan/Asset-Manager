import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';

export interface CopyButtonProps {
  /** Text or content string to copy to the clipboard (optional if copyFn is provided) */
  text?: string | (() => string | Promise<string>);
  /** Custom async copy action (e.g. copying binary image blobs to clipboard or custom payloads) */
  copyFn?: () => Promise<void> | void;
  /** Optional visible text label (e.g., "Copier") */
  label?: string;
  /** Label shown during copied state (e.g., "Copié !") */
  copiedLabel?: string;
  /** Visual display variant */
  variant?: 'default' | 'ghost' | 'icon' | 'pill' | 'outline' | 'custom';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'icon';
  /** Additional CSS class names */
  className?: string;
  /** Accessibility title / aria-label */
  title?: string;
  /** Callback fired upon successful copy */
  onCopy?: () => void;
  /** Optional message displayed via toast upon copy */
  toastMessage?: string;
  /** Duration in ms to display the copied state (default: 2000) */
  copiedDuration?: number;
  /** Optional React children as label */
  children?: React.ReactNode;
  /** Whether the copy button is disabled */
  disabled?: boolean;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  copyFn,
  label,
  children,
  copiedLabel,
  variant = 'default',
  size = 'md',
  className = '',
  title,
  onCopy,
  toastMessage,
  copiedDuration = 2000,
  disabled = false,
}) => {
  const { locale } = useLocale();
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const defaultTitle = locale === 'FR' ? 'Copier dans le presse-papier' : 'Copy to clipboard';
  const defaultCopiedLabel = locale === 'FR' ? 'Copié !' : 'Copied!';

  const resolvedTitle = title ?? defaultTitle;
  const resolvedCopiedLabel = copiedLabel ?? defaultCopiedLabel;

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      try {
        if (copyFn) {
          await copyFn();
        } else if (text !== undefined) {
          const textToCopy = typeof text === 'function' ? await text() : text;
          if (!textToCopy && textToCopy !== '') return;

          if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(textToCopy);
          } else {
            // Robust fallback for non-secure contexts or iframe restrictions
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
          }
        }

        setCopied(true);
        if (toastMessage) {
          toast.success(toastMessage);
        }
        if (onCopy) onCopy();

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setCopied(false);
        }, copiedDuration);
      } catch (err) {
        console.error('Failed to copy to clipboard:', err);
      }
    },
    [text, copyFn, onCopy, toastMessage, copiedDuration, disabled]
  );

  // Variant styles
  const baseClasses =
    'relative inline-flex items-center justify-center gap-1.5 font-mono select-none cursor-pointer active:scale-[0.96] transition-all duration-150 focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-1 disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed';

  let variantClasses = '';
  if (variant === 'default') {
    variantClasses =
      'rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:text-zinc-950 dark:hover:text-zinc-100 border border-zinc-200/70 dark:border-white/10 shadow-2xs';
  } else if (variant === 'ghost') {
    variantClasses =
      'rounded-lg bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100';
  } else if (variant === 'outline') {
    variantClasses =
      'rounded-lg bg-transparent text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100 border border-zinc-200/80 dark:border-white/10';
  } else if (variant === 'icon') {
    variantClasses =
      'rounded-lg bg-zinc-100 dark:bg-zinc-800/70 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-100 border border-zinc-200/70 dark:border-white/10';
  } else if (variant === 'pill') {
    variantClasses =
      'rounded-full bg-zinc-100 dark:bg-zinc-800/90 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-950 dark:hover:text-zinc-50 border border-zinc-200/80 dark:border-white/10 shadow-2xs';
  } else if (variant === 'custom') {
    variantClasses = '';
  }

  let sizeClasses = '';
  if (variant === 'icon' || size === 'icon') {
    sizeClasses = 'w-8 h-8 p-0 shrink-0';
  } else if (size === 'sm') {
    sizeClasses = 'h-7 px-2.5 text-[11px] font-medium';
  } else if (size === 'lg') {
    sizeClasses = 'h-11 px-5 text-xs font-semibold';
  } else {
    sizeClasses = 'h-8 px-3 text-xs font-medium';
  }

  const iconSize = size === 'sm' ? 12 : size === 'lg' ? 15 : 13;

  const tooltipText = copied ? resolvedCopiedLabel : resolvedTitle;

  return (
    <ActionTooltip label={tooltipText} side="top">
      <button
        type="button"
        onClick={handleCopy}
        disabled={disabled}
        aria-label={copied ? resolvedCopiedLabel : resolvedTitle}
        className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span
              key="check"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.25, bounce: 0.2 }}
              className={`flex items-center gap-1.5 font-semibold ${
                variant === 'custom' ? '' : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              <Check size={iconSize} strokeWidth={2.2} />
              {(label || children) && <span>{resolvedCopiedLabel}</span>}
            </motion.span>
          ) : (
            <motion.span
              key="copy"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.2, bounce: 0 }}
              className="flex items-center gap-1.5"
            >
              <Copy size={iconSize} strokeWidth={1.8} className="opacity-70 group-hover:opacity-100" />
              {label ? <span>{label}</span> : children}
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </ActionTooltip>
  );
};

export default CopyButton;
