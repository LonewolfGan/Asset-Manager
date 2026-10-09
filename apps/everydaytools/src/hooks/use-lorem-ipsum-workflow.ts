import { useState, useEffect, useMemo, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import {
  generateLoremText,
  generateLoremBlocks,
  calculateLoremStats,
  clampLoremCount,
  type LoremFlavor,
  type LoremUnit,
} from '@/lib/lorem-ipsum-logic';

export function useLoremIpsumWorkflow() {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [flavor, setFlavor] = useState<LoremFlavor>('classic');

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);

  const blocks = useMemo(() => {
    void seed;
    return generateLoremBlocks({
      flavor,
      unit,
      count,
      startWithClassic: true,
    });
  }, [flavor, unit, count, seed]);

  const fullText = useMemo(() => {
    void seed;
    return generateLoremText({
      flavor,
      unit,
      count,
      startWithClassic: true,
      format: 'plain',
    });
  }, [flavor, unit, count, seed]);

  const stats = useMemo(() => {
    return calculateLoremStats(fullText);
  }, [fullText]);

  const handleRegenerate = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 240);
    setSeed((prev) => prev + 1);
    trackToolUsed('lorem-ipsum', `regenerate-${unit}-${count}`);
  }, [unit, count]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
        e.preventDefault();
        if (target && target.tagName === 'BUTTON') {
          target.blur();
        }
        handleRegenerate();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRegenerate]);

  const handleCountChange = useCallback(
    (delta: number) => {
      setCount((prev) => clampLoremCount(prev + delta, unit));
    },
    [unit]
  );

  const handleUnitSelect = useCallback(
    (newUnit: LoremUnit) => {
      setUnit(newUnit);
      if (newUnit === 'words') {
        if (count < 15) setCount(50);
      } else {
        if (count > 15) setCount(3);
      }
    },
    [count]
  );

  return {
    unit,
    count,
    flavor,
    setCount,
    setFlavor,
    isRefreshing,
    blocks,
    fullText,
    stats,
    handleRegenerate,
    handleCountChange,
    handleUnitSelect,
  };
}
