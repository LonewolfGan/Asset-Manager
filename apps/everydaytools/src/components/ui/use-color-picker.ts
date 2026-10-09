import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsv,
  hsvToRgb,
  type HsvColor,
} from './color-math';

export function useColorPickerHsv(value: string, onChange: (hex: string) => void) {
  const initialRgb = useMemo(() => hexToRgb(value || '#FF6B35'), [value]);
  const initialHsv = useMemo(
    () => rgbToHsv(initialRgb.r, initialRgb.g, initialRgb.b),
    [initialRgb]
  );

  const [hsv, setHsv] = useState<HsvColor>(initialHsv);
  const [hexInput, setHexInput] = useState<string>(
    value ? (value.startsWith('#') ? value : `#${value}`).toUpperCase() : '#FF6B35'
  );

  useEffect(() => {
    if (value) {
      const rgb = hexToRgb(value);
      setHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
      setHexInput(value.startsWith('#') ? value.toUpperCase() : `#${value.toUpperCase()}`);
    }
  }, [value]);

  const satValRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const isDraggingSatVal = useRef(false);
  const isDraggingHue = useRef(false);

  const updateHsv = useCallback(
    (newHsv: HsvColor) => {
      setHsv(newHsv);
      const rgb = hsvToRgb(newHsv.h, newHsv.s, newHsv.v);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      setHexInput(hex);
      onChange(hex);
    },
    [onChange]
  );

  const handleSatValMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!satValRef.current) return;
      const rect = satValRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const y = Math.max(0, Math.min(rect.height, clientY - rect.top));

      const s = x / rect.width;
      const v = 1 - y / rect.height;

      updateHsv({ ...hsv, s, v });
    },
    [hsv, updateHsv]
  );

  const handleHueMove = useCallback(
    (clientX: number) => {
      if (!hueRef.current) return;
      const rect = hueRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const h = (x / rect.width) * 360;

      updateHsv({ ...hsv, h: Math.min(360, Math.max(0, h)) });
    },
    [hsv, updateHsv]
  );

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingSatVal.current) {
        handleSatValMove(e.clientX, e.clientY);
      } else if (isDraggingHue.current) {
        handleHueMove(e.clientX);
      }
    };

    const handlePointerUp = () => {
      isDraggingSatVal.current = false;
      isDraggingHue.current = false;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handleSatValMove, handleHueMove]);

  const hasEyeDropper = typeof window !== 'undefined' && 'EyeDropper' in window;

  const handleEyeDropper = async () => {
    if (!hasEyeDropper) return;
    try {
      // @ts-expect-error EyeDropper is supported in Chromium
      const eyeDropper = new window.EyeDropper();
      const result = await eyeDropper.open();
      if (result && result.sRGBHex) {
        const hex = result.sRGBHex.toUpperCase();
        const rgb = hexToRgb(hex);
        updateHsv(rgbToHsv(rgb.r, rgb.g, rgb.b));
      }
    } catch {
      // User cancelled
    }
  };

  return {
    hsv,
    hexInput,
    setHexInput,
    updateHsv,
    satValRef,
    hueRef,
    isDraggingSatVal,
    isDraggingHue,
    handleSatValMove,
    handleHueMove,
    hasEyeDropper,
    handleEyeDropper,
  };
}
