import React from 'react';
import { cn } from '../utils';

export interface StudioViewportProps {
  children: React.ReactNode;
  overlaySlot?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export const StudioViewport: React.FC<StudioViewportProps> = ({
  children,
  overlaySlot,
  className,
  minHeight = 'min-h-[420px]',
}) => {
  return (
    <div
      data-testid="studio-viewport"
      className={cn(
        'relative w-full rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-zinc-100 dark:bg-zinc-950/80 overflow-hidden flex items-center justify-center p-4 sm:p-8 select-none',
        minHeight,
        className
      )}
    >
      {/* Texture d'arrière-plan damier subtile pour la transparence */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-25"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Contenu principal de travail (Canvas, Image, SVG) */}
      <div className="relative z-10 flex items-center justify-center max-w-full max-h-full">
        {children}
      </div>

      {/* Overlay flottant (Badges de dimensions, angle, zoom) */}
      {overlaySlot && (
        <div className="absolute top-3 right-3 z-20 pointer-events-auto">
          {overlaySlot}
        </div>
      )}
    </div>
  );
};
