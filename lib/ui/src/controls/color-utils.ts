import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HsvColor {
  h: number;
  s: number;
  v: number;
}

export function hexToRgb(hex: string): RgbColor {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(clean, 16);
  if (isNaN(num) || clean.length !== 6) {
    return { r: 128, g: 128, b: 128 };
  }
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clampR = Math.max(0, Math.min(255, Math.round(r)));
  const clampG = Math.max(0, Math.min(255, Math.round(g)));
  const clampB = Math.max(0, Math.min(255, Math.round(b)));
  return (
    '#' +
    [clampR, clampG, clampB]
      .map((x) => x.toString(16).padStart(2, '0'))
      .join('')
  ).toUpperCase();
}

export function rgbToHsv(r: number, g: number, b: number): HsvColor {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  const s = max === 0 ? 0 : d / max;
  const v = max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s, v };
}

export function hsvToRgb(h: number, s: number, v: number): RgbColor {
  let r = 0,
    g = 0,
    b = 0;
  const i = Math.floor((h / 60) % 6);
  const f = h / 60 - Math.floor(h / 60);
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
      break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

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

export function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  if (clean.length < 6) return false;
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150;
}

export const CURATED_STUDIO_SWATCHES = [
  '#000000', '#18181B', '#3F3F46', '#71717A', '#A1A1AA', '#FFFFFF',
  '#EF4444', '#DC2626', '#F97316', '#FF6B35', '#F59E0B', '#EAB308',
  '#84CC16', '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
  '#3B82F6', '#2563EB', '#6366F1', '#8B5CF6', '#A855F7', '#EC4899',
];

