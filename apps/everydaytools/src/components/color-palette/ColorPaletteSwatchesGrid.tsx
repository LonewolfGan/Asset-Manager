import React from 'react';
import type { PaletteColor } from '@/lib/color-palette-logic';
import type { ColorFormat } from '@/hooks/use-color-palette-workflow';
import { ColorPaletteSwatchColumn } from './ColorPaletteSwatchColumn';

interface ColorPaletteSwatchesGridProps {
  palette: PaletteColor[];
  format: ColorFormat;
  count: number;
  copiedIdx: number | null;
  onToggleLock: (idx: number) => void;
  onCustomHexChange: (idx: number, hex: string) => void;
  onCopyColor: (color: PaletteColor, idx: number) => void;
  onAdjustLightness: (idx: number, delta: number) => void;
  getColorValue: (color: PaletteColor) => string;
  getColorDisplayValue: (color: PaletteColor, format: ColorFormat) => string;
  getCodeFontSize: (format: ColorFormat, count: number) => string;
  isFr: boolean;
}

export function ColorPaletteSwatchesGrid({
  palette,
  format,
  count,
  copiedIdx,
  onToggleLock,
  onCustomHexChange,
  onCopyColor,
  onAdjustLightness,
  getColorValue,
  getColorDisplayValue,
  getCodeFontSize,
  isFr,
}: ColorPaletteSwatchesGridProps) {
  return (
    <div className="min-h-[460px] sm:min-h-[540px] flex flex-col md:flex-row w-full select-none overflow-hidden">
      {palette.map((color, idx) => (
        <ColorPaletteSwatchColumn
          key={color.id}
          color={color}
          idx={idx}
          format={format}
          count={count}
          copiedIdx={copiedIdx}
          onToggleLock={onToggleLock}
          onCustomHexChange={onCustomHexChange}
          onCopyColor={onCopyColor}
          onAdjustLightness={onAdjustLightness}
          getColorValue={getColorValue}
          getColorDisplayValue={getColorDisplayValue}
          getCodeFontSize={getCodeFontSize}
          isFr={isFr}
        />
      ))}
    </div>
  );
}
