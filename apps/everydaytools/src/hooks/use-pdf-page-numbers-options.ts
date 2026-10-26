import { useState, useCallback, useMemo } from 'react';
import type { PdfNumberPosition } from '@/lib/pdf-page-numbers-logic';

export interface UsePdfPageNumbersOptionsProps {
  initialPosition?: PdfNumberPosition;
  initialFormat?: string;
  initialStartFrom?: number;
  initialSkipFirst?: boolean;
  initialFontSize?: number;
  initialMargin?: number;
  initialColor?: string;
}

export function usePdfPageNumbersOptions(props?: UsePdfPageNumbersOptionsProps) {
  const [position, setPosition] = useState<PdfNumberPosition>(props?.initialPosition ?? 'bottom-center');
  const [format, setFormat] = useState<string>(props?.initialFormat ?? '{n} / {total}');
  const [startFrom, setStartFrom] = useState<number>(props?.initialStartFrom ?? 1);
  const [skipFirst, setSkipFirst] = useState<boolean>(props?.initialSkipFirst ?? false);
  const [fontSize, setFontSize] = useState<number>(props?.initialFontSize ?? 11);
  const [margin, setMargin] = useState<number>(props?.initialMargin ?? 36);
  const [color, setColor] = useState<string>(props?.initialColor ?? '#000000');

  const toggleSkipFirst = useCallback(() => {
    setSkipFirst((prev) => !prev);
  }, []);

  const resetOptions = useCallback(() => {
    setPosition('bottom-center');
    setFormat('{n} / {total}');
    setStartFrom(1);
    setSkipFirst(false);
    setFontSize(11);
    setMargin(36);
    setColor('#000000');
  }, []);

  const isValid = useMemo(() => {
    return Boolean(format.trim() && startFrom >= 1 && fontSize > 0);
  }, [format, startFrom, fontSize]);

  return {
    position,
    setPosition,
    format,
    setFormat,
    startFrom,
    setStartFrom,
    skipFirst,
    setSkipFirst,
    fontSize,
    setFontSize,
    margin,
    setMargin,
    color,
    setColor,
    toggleSkipFirst,
    resetOptions,
    isValid,
  };
}

export type UsePdfPageNumbersOptionsReturn = ReturnType<typeof usePdfPageNumbersOptions>;
