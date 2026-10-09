import { useState, useCallback, useRef } from 'react';

export function useFilmstripScroll() {
  const filmstripRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<{ canLeft: boolean; canRight: boolean }>({
    canLeft: false,
    canRight: false,
  });

  const updateScrollState = useCallback(() => {
    const el = filmstripRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 2;
    const maxScrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    const canRight = maxScrollLeft > 2 && el.scrollLeft < maxScrollLeft - 2;
    setScrollState({ canLeft, canRight });
  }, []);

  const filmstripCleanupRef = useRef<(() => void) | null>(null);

  const setFilmstripRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (filmstripCleanupRef.current) {
        filmstripCleanupRef.current();
        filmstripCleanupRef.current = null;
      }

      filmstripRef.current = node;
      if (!node) return;

      const onScroll = () => {
        updateScrollState();
      };

      node.addEventListener('scroll', onScroll, { passive: true });
      node.addEventListener('scrollend', onScroll, { passive: true });

      const ro = new ResizeObserver(() => {
        updateScrollState();
      });
      ro.observe(node);

      updateScrollState();
      requestAnimationFrame(updateScrollState);
      const t1 = setTimeout(updateScrollState, 50);
      const t2 = setTimeout(updateScrollState, 200);

      filmstripCleanupRef.current = () => {
        node.removeEventListener('scroll', onScroll);
        node.removeEventListener('scrollend', onScroll);
        ro.disconnect();
        clearTimeout(t1);
        clearTimeout(t2);
      };
    },
    [updateScrollState]
  );

  const scrollFilmstrip = useCallback(
    (direction: 'left' | 'right') => {
      const el = filmstripRef.current;
      if (!el) return;
      const scrollAmount = Math.max(260, Math.floor(el.clientWidth * 0.75));
      const maxScroll = Math.max(0, el.scrollWidth - el.clientWidth);
      const target =
        direction === 'left'
          ? Math.max(0, el.scrollLeft - scrollAmount)
          : Math.min(maxScroll, el.scrollLeft + scrollAmount);

      el.scrollTo({
        left: target,
        behavior: 'smooth',
      });

      updateScrollState();
      setTimeout(updateScrollState, 80);
      setTimeout(updateScrollState, 200);
      setTimeout(updateScrollState, 450);
    },
    [updateScrollState]
  );

  return {
    filmstripRef,
    scrollState,
    setFilmstripRef,
    updateScrollState,
    scrollFilmstrip,
  };
}
