import React, { useCallback } from 'react';
import { WrapText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ActionTooltip } from '@/components/ui/tooltip';
import { useLocale } from '@/hooks/use-locale';

export interface WrapButtonProps {
  /** Current wrap state: true = wrapped (soft wrap), false = unwrapped (no wrap) */
  wrapped: boolean;
  /** Callback fired when wrap state is toggled */
  onToggle?: (nextWrapped: boolean) => void;
  /** Standard onClick fallback */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Visible text label (e.g. "Wrap" or "Retour à la ligne"). Set to false or omit for icon-only mode if size="icon" */
  label?: React.ReactNode;
  /** Label shown when wrapped (defaults to label) */
  activeLabel?: React.ReactNode;
  /** Visual display variant */
  variant?: 'default' | 'ghost' | 'outline' | 'pill' | 'icon' | 'custom';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon';
  /** Additional CSS class names */
  className?: string;
  /** Tooltip / title when inactive */
  title?: string;
  /** Tooltip / title when active */
  activeTitle?: string;
  /** Whether to show a tiny active indicator dot */
  showIndicator?: boolean;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Optional React children as label */
  children?: React.ReactNode;
}

export const WrapButton: React.FC<WrapButtonProps> = ({
  wrapped,
  onToggle,
  onClick,
  label,
  activeLabel,
  variant = 'default',
  size = 'sm',
  className = '',
  title,
  activeTitle,
  showIndicator = false,
  disabled = false,
  children,
}) => {
  const { locale } = useLocale();

  const defaultTitle = locale === 'FR' ? 'Activer le retour à la ligne automatique' : 'Enable word wrap';
  const defaultActiveTitle = locale === 'FR' ? 'Désactiver le retour à la ligne automatique' : 'Disable word wrap';

  const resolvedTitle = title ?? defaultTitle;
  const resolvedActiveTitle = activeTitle ?? defaultActiveTitle;
  const displayTitle = wrapped ? resolvedActiveTitle : resolvedTitle;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      const next = !wrapped;
      onToggle?.(next);
      onClick?.(e);
    },
    [disabled, wrapped, onToggle, onClick]
  );

  // Resolved label
  const resolvedLabel = children !== undefined ? children : label;
  const isIconOnly = variant === 'icon' || size === 'icon' || (resolvedLabel === undefined && children === undefined);

  // Variant classes
  let variantClasses = '';
  if (variant === 'default') {
    variantClasses = wrapped
      ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 font-semibold shadow-2xs'
      : 'border-zinc-200/80 dark:border-white/10 bg-zinc-50/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-200';
  } else if (variant === 'outline') {
    variantClasses = wrapped
      ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-semibold shadow-2xs'
      : 'border-zinc-200/80 dark:border-white/10 bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-zinc-100';
  } else if (variant === 'ghost') {
    variantClasses = wrapped
      ? 'bg-zinc-200/80 dark:bg-zinc-800 text-zinc-950 dark:text-zinc-50 font-semibold border-transparent'
      : 'bg-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-200 border-transparent';
  } else if (variant === 'pill') {
    variantClasses = wrapped
      ? 'rounded-full bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 font-semibold shadow-2xs'
      : 'rounded-full border-zinc-200/80 dark:border-white/10 bg-zinc-50/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800';
  } else if (variant === 'icon') {
    variantClasses = wrapped
      ? 'bg-zinc-200/90 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-zinc-950 dark:text-zinc-50 font-semibold shadow-2xs'
      : 'border-zinc-200/80 dark:border-white/10 bg-zinc-50/60 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800';
  }

  // Size classes
  let sizeClasses = '';
  let iconSize = 13;
  if (size === 'xs') {
    sizeClasses = isIconOnly ? 'w-6 h-6 p-0 rounded-md shrink-0' : 'h-6 px-2 text-[11px] rounded-md gap-1';
    iconSize = 11;
  } else if (size === 'sm') {
    sizeClasses = isIconOnly ? 'w-7 h-7 p-0 rounded-lg shrink-0' : 'h-7 px-2.5 text-xs rounded-lg gap-1.5';
    iconSize = 13;
  } else if (size === 'md') {
    sizeClasses = isIconOnly ? 'w-8 h-8 p-0 rounded-lg shrink-0' : 'h-8 px-3 text-xs rounded-lg gap-1.5';
    iconSize = 14;
  } else if (size === 'lg') {
    sizeClasses = isIconOnly ? 'w-9 h-9 p-0 rounded-xl shrink-0' : 'h-9 px-3.5 text-sm rounded-xl gap-2';
    iconSize = 15;
  } else if (size === 'icon') {
    sizeClasses = 'w-7 h-7 p-0 rounded-lg shrink-0';
    iconSize = 13;
  }

  return (
    <ActionTooltip label={displayTitle} side="top">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={wrapped}
        aria-label={displayTitle}
        className={cn(
          'relative inline-flex items-center justify-center font-medium select-none cursor-pointer',
          'border transition-colors duration-150',
          'active:scale-[0.96]',
          'focus:outline-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 dark:focus-visible:ring-zinc-600 focus-visible:ring-offset-1',
          'disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed',
          variantClasses,
          sizeClasses,
          className
        )}
      >
        {/* Permanent, rock-solid icon: zero flicker, zero disappearing, purely monochrome */}
        <WrapText
          size={iconSize}
          strokeWidth={wrapped ? 2.2 : 1.75}
          className="shrink-0 transition-opacity duration-150"
        />

        {/* Optional visible text label */}
        {!isIconOnly && (
          <span className="font-mono tracking-tight select-none">
            {wrapped ? (activeLabel ?? resolvedLabel) : resolvedLabel}
          </span>
        )}

        {/* Optional subtle active indicator dot */}
        {showIndicator && wrapped && (
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-zinc-300 shrink-0" />
        )}
      </button>
    </ActionTooltip>
  );
};

export default WrapButton;
