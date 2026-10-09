import { useState, useMemo, useCallback } from 'react';
import {
  type Mode,
  type StandardPreset,
  calculateVisualScaleFactor,
  getAspectRatioLabel,
} from '@/lib/image-resize-logic';

export function useImageResizeDimensions(origW: number, origH: number) {
  const [mode, setMode] = useState<Mode>('pixels');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [percentage, setPercentage] = useState<number>(50);
  const [lockRatio, setLockRatio] = useState(true);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);

  const setDimensionsFromImage = useCallback((nw: number, nh: number) => {
    setWidth(nw);
    setHeight(nh);
    setPercentage(50);
    setSelectedPresetId(null);
  }, []);

  const handleWidthChange = useCallback((val: number) => {
    setWidth(val);
    setSelectedPresetId(null);
    if (lockRatio && origW > 0 && origH > 0 && val > 0) {
      const calculatedH = Math.max(1, Math.round((val * origH) / origW));
      setHeight(calculatedH);
    }
  }, [lockRatio, origW, origH]);

  const handleHeightChange = useCallback((val: number) => {
    setHeight(val);
    setSelectedPresetId(null);
    if (lockRatio && origW > 0 && origH > 0 && val > 0) {
      const calculatedW = Math.max(1, Math.round((val * origW) / origH));
      setWidth(calculatedW);
    }
  }, [lockRatio, origW, origH]);

  const handlePercentageChange = useCallback((pct: number) => {
    setPercentage(pct);
    setSelectedPresetId(null);
    if (origW > 0 && origH > 0) {
      const calculatedW = Math.max(1, Math.round((origW * pct) / 100));
      const calculatedH = Math.max(1, Math.round((origH * pct) / 100));
      setWidth(calculatedW);
      setHeight(calculatedH);
    }
  }, [origW, origH]);

  const handlePresetSelect = useCallback((preset: StandardPreset) => {
    setSelectedPresetId(preset.id);
    setWidth(preset.w);
    setHeight(preset.h);
    setLockRatio(false);
  }, []);

  const handleResetDimensions = useCallback(() => {
    if (origW > 0 && origH > 0) {
      setMode('pixels');
      setWidth(origW);
      setHeight(origH);
      setPercentage(100);
      setSelectedPresetId(null);
      setLockRatio(true);
    }
  }, [origW, origH]);

  const targetW = useMemo(() => {
    if (mode === 'percentage') {
      return Math.max(1, Math.round((origW * percentage) / 100));
    }
    return width > 0 ? width : origW;
  }, [mode, percentage, origW, width]);

  const targetH = useMemo(() => {
    if (mode === 'percentage') {
      return Math.max(1, Math.round((origH * percentage) / 100));
    }
    return height > 0 ? height : origH;
  }, [mode, percentage, origH, height]);

  const isModified = useMemo(() => {
    if (origW <= 0 || origH <= 0) return false;
    return (
      targetW !== origW ||
      targetH !== origH ||
      percentage !== 100 ||
      mode !== 'pixels' ||
      selectedPresetId !== null
    );
  }, [origW, origH, targetW, targetH, percentage, mode, selectedPresetId]);

  const visualScaleFactor = useMemo(() => {
    return calculateVisualScaleFactor(targetW, origW);
  }, [targetW, origW]);

  const targetRatioLabel = useMemo(() => {
    return getAspectRatioLabel(targetW, targetH);
  }, [targetW, targetH]);

  const originalRatioLabel = useMemo(() => {
    return getAspectRatioLabel(origW, origH);
  }, [origW, origH]);

  return {
    mode,
    setMode,
    width,
    height,
    percentage,
    lockRatio,
    setLockRatio,
    selectedPresetId,
    setDimensionsFromImage,
    handleWidthChange,
    handleHeightChange,
    handlePercentageChange,
    handlePresetSelect,
    handleResetDimensions,
    targetW,
    targetH,
    isModified,
    visualScaleFactor,
    targetRatioLabel,
    originalRatioLabel,
  };
}
