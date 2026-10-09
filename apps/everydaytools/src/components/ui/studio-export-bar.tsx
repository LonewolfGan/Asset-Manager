import React from 'react';
import { Download, Loader2 } from 'lucide-react';

export interface StudioExportFormat {
  id: string;
  label: string;
  badge?: string;
}

export interface StudioExportBarProps {
  /** Main download handler */
  onDownload: () => void;
  /** Primary label for the download action */
  downloadLabel: string;
  /** Secondary optional detail (e.g. 'PNG · 1024x1024') */
  downloadSubLabel?: string;
  /** Whether the download process is currently running */
  isDownloading?: boolean;
  /** List of selectable output formats */
  formats?: StudioExportFormat[];
  /** Currently selected format id */
  selectedFormat?: string;
  /** Callback when format selection changes */
  onFormatChange?: (formatId: string) => void;
  /** Optional secondary actions positioned on the left (e.g. Reset, Undo) */
  leftActions?: React.ReactNode;
  /** Additional custom classes */
  className?: string;
}

/**
 * StudioExportBar: Canonical bottom export command bar for Studio workbench tools.
 * Conforms strictly to AGENTS.md Rules 8, 25, 38, 40 (h-11 height, download rightmost, tonal contrast).
 */
export const StudioExportBar: React.FC<StudioExportBarProps> = ({
  onDownload,
  downloadLabel,
  downloadSubLabel,
  isDownloading = false,
  formats,
  selectedFormat,
  onFormatChange,
  leftActions,
  className = '',
}) => {
  return (
    <div
      className={`w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-black/5 dark:border-white/10 ${className}`}
    >
      {/* Left side: Secondary actions & contextual controls */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-start">
        {leftActions}
      </div>

      {/* Right side: Formats + Canonical Rightmost Download Button */}
      <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
        {formats && formats.length > 0 && (
          <div
            role="radiogroup"
            aria-label="Format d'exportation"
            className="flex items-center p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 border border-zinc-200/80 dark:border-white/10 text-xs font-mono select-none"
          >
            {formats.map((fmt) => {
              const isSelected = selectedFormat === fmt.id;
              return (
                <button
                  key={fmt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => onFormatChange?.(fmt.id)}
                  className={`h-9 px-3 rounded-lg font-medium transition-colors ${
                    isSelected
                      ? 'bg-white dark:bg-zinc-900 text-zinc-950 dark:text-zinc-50 shadow-sm'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100'
                  }`}
                >
                  {fmt.label}
                  {fmt.badge && (
                    <span className="ml-1 text-[10px] text-zinc-400 dark:text-zinc-500">
                      {fmt.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          onClick={onDownload}
          disabled={isDownloading}
          className="h-11 px-5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 bg-[#FF6B35] hover:bg-[#ff5517] text-white shadow-sm transition-transform active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer"
        >
          {isDownloading ? (
            <Loader2 className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Download className="w-4 h-4 text-white" strokeWidth={2.2} />
          )}
          <span>{downloadLabel}</span>
          {downloadSubLabel && (
            <span className="text-xs text-white/80 font-mono hidden md:inline ml-1">
              ({downloadSubLabel})
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export default StudioExportBar;
