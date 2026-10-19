import React from 'react';
import { useLocation } from 'wouter';
import { ArrowLeftRight } from 'lucide-react';
import { getReciprocalTool, getReciprocalPath } from '@/lib/reciprocal-tools';
import { setHandoffFile, setHandoffText } from '@/lib/file-handoff';
import { ActionTooltip, TooltipProvider } from '@/components/ui/tooltip';

export interface ReciprocalTitleProps {
  currentSlug: string;
  isFr: boolean;
  getCurrentFile?: () => File | null | undefined;
  getCurrentText?: () => string | null | undefined;
  onSwap?: (targetSlug: string) => void;
  fallbackTitle?: string;
  className?: string;
}

export function ReciprocalTitle({
  currentSlug,
  isFr,
  getCurrentFile,
  getCurrentText,
  onSwap,
  fallbackTitle,
  className = '',
}: ReciprocalTitleProps) {
  const [location, navigate] = useLocation();
  const toolInfo = getReciprocalTool(currentSlug);

  if (!toolInfo) {
    return <span className={className}>{fallbackTitle ?? currentSlug}</span>;
  }

  const lang = isFr ? 'fr' : 'en';
  const sourceLabel = toolInfo.sourceLabel[lang];
  const targetLabel = toolInfo.targetLabel[lang];
  const mirrorSlug = toolInfo.mirrorSlug;

  const swapAriaLabel = isFr
    ? `Inverser : ${targetLabel} en ${sourceLabel}`
    : `Swap: ${targetLabel} to ${sourceLabel}`;

  const handleSwap = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1. Stage in-memory file if present
    const file = getCurrentFile?.();
    if (file) {
      setHandoffFile(file, file.name);
    }

    // 2. Stage in-memory raw text if present
    const text = getCurrentText?.();
    if (text && text.trim()) {
      setHandoffText(text);
    }

    // 3. Optional in-page callback (e.g. for CsvToJson internal state)
    if (onSwap) {
      onSwap(mirrorSlug);
    }

    // 4. Seamless SPA navigation to target tool
    const targetPath = getReciprocalPath(location, mirrorSlug);
    navigate(targetPath);
  };

  const connector = isFr ? ' en ' : ' to ';

  return (
    <span className={`inline-flex items-center gap-2 sm:gap-3 flex-wrap align-middle ${className}`}>
      <span>{sourceLabel}</span>
      <TooltipProvider delayDuration={150}>
        <ActionTooltip
          label={swapAriaLabel}
          side="top"
          align="center"
          sideOffset={6}
        >
          <button
            type="button"
            onClick={handleSwap}
            aria-label={swapAriaLabel}
            className="group relative inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-zinc-100 dark:bg-zinc-800/90 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:text-zinc-950 dark:hover:text-zinc-50 border border-zinc-200/90 dark:border-white/10 active:scale-[0.92] transition-[color,background-color,border-color,transform] duration-150 cursor-pointer shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
          >
            <ArrowLeftRight
              size={15}
              aria-hidden="true"
              className="transition-transform duration-300 ease-out group-hover:rotate-180 shrink-0"
            />
          </button>
        </ActionTooltip>
      </TooltipProvider>
      <span className="sr-only">{connector}</span>
      <span>{targetLabel}</span>
    </span>
  );
}
