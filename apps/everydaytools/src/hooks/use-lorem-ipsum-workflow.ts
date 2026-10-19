import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import { downloadText } from '@/lib/download';
import { consumeHandoffText } from '@/lib/file-handoff';
import {
  generateLoremText,
  generateLoremBlocks,
  calculateLoremStats,
  clampLoremCount,
  type LoremFlavor,
  type LoremUnit,
} from '@/lib/lorem-ipsum-logic';
import type { LoremPreset } from '@/lib/lorem-samples';

export type LoremFormat = 'plain' | 'html' | 'markdown' | 'json';

export function useLoremIpsumWorkflow() {
  const [unit, setUnit] = useState<LoremUnit>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [flavor, setFlavor] = useState<LoremFlavor>('classic');
  const [format, setFormat] = useState<LoremFormat>('plain');
  const [startWithClassic, setStartWithClassic] = useState<boolean>(true);

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [seed, setSeed] = useState<number>(0);
  const refreshTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  // Consume text handoff if directed from another tool
  useEffect(() => {
    const text = consumeHandoffText();
    if (text && text.trim()) {
      const wordCount = text.trim().split(/\s+/).length;
      if (wordCount > 30) {
        setUnit('words');
        setCount(clampLoremCount(wordCount, 'words'));
      }
    }
  }, []);

  const blocks = useMemo(() => {
    void seed;
    return generateLoremBlocks({
      flavor,
      unit,
      count,
      startWithClassic,
    });
  }, [flavor, unit, count, startWithClassic, seed]);

  const fullText = useMemo(() => {
    void seed;
    return generateLoremText({
      flavor,
      unit,
      count,
      startWithClassic,
      format,
    });
  }, [flavor, unit, count, startWithClassic, format, seed]);

  const stats = useMemo(() => {
    return calculateLoremStats(fullText);
  }, [fullText]);

  const handleRegenerate = useCallback(() => {
    setIsRefreshing(true);
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }
    refreshTimerRef.current = setTimeout(() => setIsRefreshing(false), 240);
    setSeed((prev) => prev + 1);
    trackToolUsed('lorem-ipsum', `regenerate-${unit}-${count}-${flavor}-${format}`);
  }, [unit, count, flavor, format]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        const target = e.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
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

  const handleApplyPreset = useCallback((preset: LoremPreset) => {
    setUnit(preset.unit);
    setCount(clampLoremCount(preset.count, preset.unit));
    setFlavor(preset.flavor);
    if (preset.format) {
      setFormat(preset.format);
    }
    setSeed((prev) => prev + 1);
    trackToolUsed('lorem-ipsum', `preset-${preset.id}`);
  }, []);

  const handleDownload = useCallback(() => {
    const ext = format === 'html' ? 'html' : format === 'markdown' ? 'md' : format === 'json' ? 'json' : 'txt';
    const mime =
      format === 'html'
        ? 'text/html;charset=utf-8'
        : format === 'json'
        ? 'application/json;charset=utf-8'
        : 'text/plain;charset=utf-8';
    downloadText(fullText, `lorem-ipsum-${flavor}-${unit}.${ext}`, mime);
    trackToolUsed('lorem-ipsum', `download-${format}`);
  }, [fullText, format, flavor, unit]);

  return {
    unit,
    count,
    flavor,
    format,
    startWithClassic,
    setCount,
    setFlavor,
    setFormat,
    setStartWithClassic,
    isRefreshing,
    blocks,
    fullText,
    stats,
    handleRegenerate,
    handleCountChange,
    handleUnitSelect,
    handleApplyPreset,
    handleDownload,
  };
}
