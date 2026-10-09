import React from 'react';
import { ActionTooltip } from '@/components/ui/tooltip';

export interface CssResizeHandleProps {
  isFr: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export const CssResizeHandle: React.FC<CssResizeHandleProps> = ({
  isFr,
  onMouseDown,
}) => {
  return (
    <ActionTooltip
      label={
        isFr
          ? 'Glisser verticalement pour ajuster la hauteur'
          : 'Drag vertically to adjust height'
      }
      side="bottom"
    >
      <div
        onMouseDown={onMouseDown}
        className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
      >
        <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
      </div>
    </ActionTooltip>
  );
};
