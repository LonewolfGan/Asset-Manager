import { useState, useMemo, useCallback } from 'react';
import { trackToolUsed } from '@/lib/analytics';
import {
  type RGB,
  type HSL,
  type HSV,
  type CMYK,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  rgbToHsv,
  hsvToRgb,
  rgbToCmyk,
  cmykToRgb,
  getLuminance,
  generateTintsAndShades,
  parseHex,
  parseRgb,
  parseHsl,
  parseHsv,
  parseCmyk,
  parseAnyColor,
} from '@/lib/color-converter-logic';
import { getContrastTextColor } from '@/lib/color-palette-logic';
import {
  generateSpectrumStrip,
  getRandomRgb,
  updateRecentColorsList,
  buildColorFormatRows,
  type ColorFormatRow,
} from '@/lib/color-converter-export-logic';

const DEFAULT_RECENT_COLORS = [
  '#1A6BFF',
  '#059669',
  '#DC2626',
  '#D97706',
  '#7C3AED',
  '#18181B',
];

export function useColorConverterWorkflow(isFr: boolean) {
  const [rgb, setRgb] = useState<RGB>({ r: 26, g: 107, b: 255 }); // #1A6BFF
  const [colorInput, setColorInput] = useState<string>('#1A6BFF');
  const [controlMode, setControlMode] = useState<'rgb' | 'hsl'>('rgb');
  const [recentColors, setRecentColors] = useState<string[]>(DEFAULT_RECENT_COLORS);

  // Derived color models
  const hex = useMemo(() => rgbToHex(rgb), [rgb]);
  const hsl = useMemo(() => rgbToHsl(rgb), [rgb]);
  const hsv = useMemo(() => rgbToHsv(rgb), [rgb]);
  const cmyk = useMemo(() => rgbToCmyk(rgb), [rgb]);

  const addToRecent = useCallback((hexToAdd: string) => {
    setRecentColors((prev) => updateRecentColorsList(prev, hexToAdd, 8));
  }, []);

  const updateRgb = useCallback(
    (newRgb: RGB, syncInput = true, addToHistory = false) => {
      setRgb(newRgb);
      const newHex = rgbToHex(newRgb);
      if (syncInput) {
        setColorInput(newHex);
      }
      if (addToHistory) {
        addToRecent(newHex);
      }
      trackToolUsed('color-converter', 'color-updated');
    },
    [addToRecent]
  );

  const formats: ColorFormatRow[] = useMemo(() => {
    return buildColorFormatRows({
      hex,
      rgb,
      hsl,
      hsv,
      cmyk,
      isFr,
      onHexUpdate: (val) => {
        const parsed = parseHex(val);
        if (parsed) updateRgb(parsed, true, true);
      },
      onRgbUpdate: (val) => {
        const parsed = parseRgb(val);
        if (parsed) updateRgb(parsed, true, true);
      },
      onHslUpdate: (val) => {
        const parsed = parseHsl(val);
        if (parsed) updateRgb(hslToRgb(parsed), true, true);
      },
      onHsvUpdate: (val) => {
        const parsed = parseHsv(val);
        if (parsed) updateRgb(hsvToRgb(parsed), true, true);
      },
      onCmykUpdate: (val) => {
        const parsed = parseCmyk(val);
        if (parsed) updateRgb(cmykToRgb(parsed), true, true);
      },
      onCssUpdate: (val) => {
        const parsed = parseAnyColor(val);
        if (parsed) updateRgb(parsed, true, true);
      },
    });
  }, [hex, rgb, hsl, hsv, cmyk, updateRgb, isFr]);

  const handleColorInputChange = useCallback(
    (val: string) => {
      setColorInput(val);
      const parsed = parseAnyColor(val);
      if (parsed) {
        updateRgb(parsed, false, false);
      }
    },
    [updateRgb]
  );

  const handleInputBlurOrEnter = useCallback(() => {
    const parsed = parseAnyColor(colorInput);
    if (parsed) {
      addToRecent(rgbToHex(parsed));
    }
  }, [colorInput, addToRecent]);

  const handleRandomColor = useCallback(() => {
    updateRgb(getRandomRgb(), true, true);
  }, [updateRgb]);

  // Colorimetry calculations
  const { tints, shades } = useMemo(() => generateTintsAndShades(rgb, 6), [rgb]);
  const luminance = useMemo(() => getLuminance(rgb), [rgb]);
  const contrastTextColor = useMemo(() => getContrastTextColor(hex), [hex]);

  const spectrumStrip = useMemo(
    () => generateSpectrumStrip(tints, hex, shades),
    [tints, hex, shades]
  );

  return {
    rgb,
    hex,
    hsl,
    hsv,
    cmyk,
    colorInput,
    controlMode,
    setControlMode,
    recentColors,
    luminance,
    contrastTextColor,
    spectrumStrip,
    formats,
    updateRgb,
    addToRecent,
    handleColorInputChange,
    handleInputBlurOrEnter,
    handleRandomColor,
  };
}

export type ColorConverterWorkflow = ReturnType<typeof useColorConverterWorkflow>;
