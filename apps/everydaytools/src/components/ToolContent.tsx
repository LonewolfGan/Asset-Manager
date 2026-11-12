import type { ReactNode } from 'react';

// ─── ToolWorkspace ───────────────────────────────────────
/** Wraps the tool content area, with optional grid background */
export function ToolWorkspace({
  children,
  noGrid = false,
}: {
  children: ReactNode;
  noGrid?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 24,
        width: '100%',
        position: 'relative',
      }}
    >
      {/* Subtle workspace texture */}
      {!noGrid && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.3,
            backgroundImage: `
              linear-gradient(var(--border) 1px, transparent 1px),
              linear-gradient(90deg, var(--border) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {children}
      </div>
    </div>
  );
}
