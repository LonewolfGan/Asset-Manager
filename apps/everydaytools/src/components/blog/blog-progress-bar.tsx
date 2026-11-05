import React, { useState, useEffect } from 'react';

/**
 * Editorial reading progress indicator clamped strictly to [0, 1].
 * Attaches passive scroll and resize listeners with cleanup on unmount.
 */
export function BlogProgressBar(): React.JSX.Element {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || 0;
      const clientHeight = doc.clientHeight || 0;
      const maxScroll = scrollHeight - clientHeight;

      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }

      const raw = scrollTop / maxScroll;
      const clamped = Math.min(1, Math.max(0, raw));
      setProgress(Number.isFinite(clamped) ? clamped : 0);
    };

    updateProgress();

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  return (
    <div
      role="progressbar"
      data-testid="blog-progress-bar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
      className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-[2px] origin-left bg-[var(--accent)]"
      style={{
        transform: `scaleX(${progress})`,
        transformOrigin: 'left',
        transition: 'transform 60ms linear',
      }}
    />
  );
}
