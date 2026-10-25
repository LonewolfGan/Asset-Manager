import { useState, useCallback, useMemo } from 'react';
import type {
  WatermarkPattern,
  WatermarkPagesScope,
  WatermarkAngle,
} from '@/lib/pdf-watermark-logic';

export interface UsePdfWatermarkOptionsProps {
  initialText?: string;
  initialOpacity?: number;
  initialAngle?: WatermarkAngle | number;
  initialColor?: string;
  initialFontSize?: number;
  initialPosition?: string;
  initialPattern?: WatermarkPattern | string;
  initialPages?: WatermarkPagesScope | string;
  isFr?: boolean;
}

export function usePdfWatermarkOptions(props?: UsePdfWatermarkOptionsProps) {
  const defaultText = props?.initialText ?? 'CONFIDENTIAL';
  const defaultOpacity = props?.initialOpacity ?? 0.3;
  const defaultAngle = (props?.initialAngle as WatermarkAngle) ?? 45;
  const defaultColor = props?.initialColor ?? '#FF0000';
  const defaultFontSize = props?.initialFontSize ?? 48;
  const defaultPosition = props?.initialPosition ?? 'center';
  const defaultPattern = (props?.initialPattern as WatermarkPattern) ?? 'single';
  const defaultPages = (props?.initialPages as WatermarkPagesScope) ?? 'all';

  const [text, setText] = useState<string>(defaultText);
  const [opacity, setOpacity] = useState<number>(defaultOpacity);
  const [angle, setAngle] = useState<WatermarkAngle>(defaultAngle);
  const [color, setColor] = useState<string>(defaultColor);
  const [fontSize, setFontSize] = useState<number>(defaultFontSize);
  const [position, setPosition] = useState<string>(defaultPosition);
  const [pattern, setPattern] = useState<WatermarkPattern>(defaultPattern);
  const [pages, setPages] = useState<WatermarkPagesScope | string>(defaultPages);
  const [imageFile, setImageFileState] = useState<File | null>(null);

  const watermarkType = useMemo<'text' | 'image'>(() => {
    return imageFile ? 'image' : 'text';
  }, [imageFile]);

  const isValid = useMemo<boolean>(() => {
    return Boolean(imageFile || text.trim().length > 0);
  }, [imageFile, text]);

  const setImageFile = useCallback((file: File | null) => {
    setImageFileState(file);
  }, []);

  const resetOptions = useCallback(() => {
    setText(defaultText);
    setOpacity(defaultOpacity);
    setAngle(defaultAngle);
    setColor(defaultColor);
    setFontSize(defaultFontSize);
    setPosition(defaultPosition);
    setPattern(defaultPattern);
    setPages(defaultPages);
    setImageFileState(null);
  }, [
    defaultText,
    defaultOpacity,
    defaultAngle,
    defaultColor,
    defaultFontSize,
    defaultPosition,
    defaultPattern,
    defaultPages,
  ]);

  return {
    text,
    setText,
    opacity,
    setOpacity,
    angle,
    setAngle: setAngle as (val: any) => void,
    color,
    setColor,
    colorHex: color,
    setColorHex: setColor,
    fontSize,
    setFontSize,
    position,
    setPosition,
    pattern,
    setPattern: setPattern as (val: any) => void,
    pages,
    setPages: setPages as (val: any) => void,
    pagesScope: pages as WatermarkPagesScope,
    setPagesScope: setPages as (val: any) => void,
    imageFile,
    setImageFile,
    watermarkType,
    isValid,
    resetOptions,
  };
}
