import React from 'react';
import { useLocale } from '@/hooks/use-locale';
import { ActionTooltip } from '@/components/ui/tooltip';

interface JsResizeHandleProps {
  onMouseDownResize: (e: React.MouseEvent) => void;
}

export function JsResizeHandle({ onMouseDownResize }: JsResizeHandleProps) {
  const { isFr } = useLocale();

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
        onMouseDown={onMouseDownResize}
        className="h-3.5 w-full bg-zinc-50/80 dark:bg-zinc-900/40 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 cursor-row-resize flex items-center justify-center border-t border-zinc-200 dark:border-white/10 select-none group transition-colors"
      >
        <div className="w-10 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500 transition-colors" />
      </div>
    </ActionTooltip>
  );
}
