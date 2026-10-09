import {
  type FilterSettings,
  DEFAULT_FILTER_SETTINGS,
  type AestheticPreset,
} from './image-filters-logic';

export type OutputFormat = 'image/png' | 'image/jpeg' | 'image/webp';

export interface FormatOption {
  label: string;
  value: OutputFormat;
  ext: string;
  description: string;
}

export function getFilterFormatOptions(isFr: boolean): FormatOption[] {
  return [
    {
      label: 'PNG',
      value: 'image/png',
      ext: 'png',
      description: isFr ? 'Sans perte de qualité • Qualité max' : 'Lossless quality • Max quality',
    },
    {
      label: 'JPEG',
      value: 'image/jpeg',
      ext: 'jpg',
      description: isFr ? 'Léger & universel • Qualité 95%' : 'Light & universal • 95% quality',
    },
    {
      label: 'WebP',
      value: 'image/webp',
      ext: 'webp',
      description: isFr ? 'Compression moderne ultra-légère' : 'Modern lightweight compression',
    },
  ];
}

export function interpolatePresetSettings(
  preset: AestheticPreset,
  intensity: number
): FilterSettings {
  if (preset.id === 'original') {
    return { ...DEFAULT_FILTER_SETTINGS };
  }

  const t = Math.max(0, Math.min(100, intensity)) / 100;
  const base = DEFAULT_FILTER_SETTINGS;
  const target = { ...DEFAULT_FILTER_SETTINGS, ...preset.settings };

  return {
    brightness: Math.round(base.brightness + (target.brightness - base.brightness) * t),
    contrast: Math.round(base.contrast + (target.contrast - base.contrast) * t),
    saturation: Math.round(base.saturation + (target.saturation - base.saturation) * t),
    sepia: Math.round(base.sepia + (target.sepia - base.sepia) * t),
    grayscale: Math.round(base.grayscale + (target.grayscale - base.grayscale) * t),
    invert: Math.round(base.invert + (target.invert - base.invert) * t),
    hueRotate: Math.round(base.hueRotate + (target.hueRotate - base.hueRotate) * t),
    blur: Number((base.blur + (target.blur - base.blur) * t).toFixed(1)),
  };
}
