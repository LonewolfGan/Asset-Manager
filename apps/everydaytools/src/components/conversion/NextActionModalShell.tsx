import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { WorkflowCard } from '@/components/ui/workflow-card';

export interface WorkflowActionItem {
  id: string;
  shortTag: string;
  tagColor: string;
  title: string;
  description: string;
  ctaText: string;
  route: string;
  supportsHandoff: boolean;
  graphic: React.ReactNode;
  accentBorder: string;
  glowColor: string;
  tag?: string;
}

export interface NextActionModalShellProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitleMobile?: string;
  closeLabel?: string;
  moreActionsLabel?: (count: number) => string;
  actions: WorkflowActionItem[];
  onSelectAction: (action: WorkflowActionItem) => void;
}

/**
 * High-end architectural continuum modal shell (SSOT)
 * Preserves 100% double-bezel concentric radii, tonal closing, and mobile responsive grid.
 */
export function NextActionModalShell({
  isOpen,
  onClose,
  title,
  subtitleMobile,
  closeLabel = 'Fermer',
  moreActionsLabel,
  actions,
  onSelectAction,
}: NextActionModalShellProps) {
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!max-w-[1340px] w-[96vw] sm:w-[94vw] max-h-[92dvh] sm:h-[74vh] sm:min-h-[530px] sm:max-h-[690px] p-0 border-0 bg-transparent shadow-none [&>button]:hidden focus:outline-none">
        {/* ─── DOUBLE-BEZEL OUTER SHELL ─── */}
        <div className="relative w-full h-full rounded-[1.75rem] sm:rounded-[2.5rem] p-1.5 sm:p-2.5 bg-zinc-200/80 dark:bg-zinc-800/60 border border-zinc-300/80 dark:border-white/10 shadow-2xl backdrop-blur-2xl flex flex-col">
          {/* ─── INNER CORE ─── */}
          <div className="w-full h-full rounded-[calc(1.75rem-0.375rem)] sm:rounded-[calc(2.5rem-0.625rem)] bg-[#F6F7F9] dark:bg-[#0A0A0D] p-3.5 sm:p-7 flex flex-col justify-between text-left overflow-y-auto sm:overflow-hidden">
            
            {/* Header: Pure Refined Typography, Zero Badges, Zero Separator Lines */}
            <div className="flex items-center justify-between gap-4 shrink-0 pb-2 sm:pb-0">
              <div>
                <h3 className="text-base sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {title}
                </h3>
                {subtitleMobile && (
                  <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-0.5 sm:hidden">
                    {subtitleMobile}
                  </p>
                )}
              </div>

              {/* Tonal Close Button (Rule 40) */}
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-zinc-200/70 dark:bg-zinc-800 hover:bg-zinc-300/70 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-100 flex items-center justify-center transition-colors border border-zinc-300/70 dark:border-white/10 shadow-xs shrink-0 active:scale-[0.96]"
              >
                <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </div>

            {/* ─── 4 SUR MOBILE (2x2) / 6 SUR DESKTOP (3x2) ─── */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4.5 w-full flex-grow my-2 sm:my-3 items-stretch">
              {actions.map((action, idx) => (
                <div
                  key={action.id}
                  className={`h-full ${idx >= 4 && !showAllMobile ? 'hidden sm:block' : 'block'}`}
                >
                  <WorkflowCard
                    tag={action.tag ?? action.shortTag}
                    tagColor={action.tagColor}
                    title={action.title}
                    description={action.description}
                    ctaText={action.ctaText}
                    graphic={action.graphic}
                    accentBorder={action.accentBorder}
                    glowColor={action.glowColor}
                    onSelect={() => onSelectAction(action)}
                  />
                </div>
              ))}
            </div>

            {/* Mobile Expander for cards 5 & 6 if present */}
            {!showAllMobile && actions.length > 4 && (
              <div className="sm:hidden pt-1 pb-0.5 text-center shrink-0">
                <button
                  type="button"
                  onClick={() => setShowAllMobile(true)}
                  className="text-[11px] font-mono font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white py-1 px-3 rounded-full hover:bg-zinc-200/60 dark:hover:bg-white/5 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>
                    {moreActionsLabel
                      ? moreActionsLabel(actions.length - 4)
                      : `+ ${actions.length - 4} autres actions`}
                  </span>
                </button>
              </div>
            )}

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NextActionModalShell;
