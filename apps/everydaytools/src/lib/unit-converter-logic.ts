import type { ComponentType } from 'react';
import {
  Ruler,
  Scale,
  Thermometer,
  Box,
  Square,
  Gauge,
  CircleGauge,
  Flame,
  Zap,
  HardDrive,
  Clock,
  Compass,
  Activity,
} from 'lucide-react';
import type { UnitDef } from '@/config/units.config';
import {
  unitsConfig,
  type UnitCategory as LegacyUnitCategory,
  convertUnit,
} from '@/config/unitsConfig';

export const CATEGORY_ICONS: Record<
  string,
  ComponentType<{ className?: string }>
> = {
  length: Ruler,
  weight: Scale,
  temperature: Thermometer,
  volume: Box,
  area: Square,
  speed: Gauge,
  pressure: CircleGauge,
  energy: Flame,
  power: Zap,
  data: HardDrive,
  time: Clock,
  angle: Compass,
  frequency: Activity,
};

/**
 * Legacy numeric converter used across unit-converter test suite
 */
export function convert(value: number, fromId: string, toId: string): number {
  for (const category of Object.keys(unitsConfig) as LegacyUnitCategory[]) {
    const cat = unitsConfig[category];
    const from = cat.units.find((u) => u.id === fromId);
    const to = cat.units.find((u) => u.id === toId);
    if (from && to) {
      return convertUnit(value, fromId, toId, category);
    }
  }
  return 0;
}

export { convertUnit };

export function convertUnits(
  val: string,
  sourceId: string,
  targetId: string,
  units: UnitDef[],
  locale: string = 'fr-FR'
): string {
  // Strip normal and non-breaking spaces (e.g. French thousand separators)
  let clean = val.replace(/[\s\u00A0\u202F]/g, '').trim();
  if (!clean) return '';

  // Disambiguate comma: thousand separator (e.g. "1,000" or "1,234,567.89") vs decimal separator
  if ((clean.match(/,/g) || []).length > 1 || /^\d{1,3}(,\d{3})+(\.\d+)?$/.test(clean)) {
    clean = clean.replace(/,/g, '');
  } else {
    clean = clean.replace(',', '.');
  }
  const num = parseFloat(clean);
  if (isNaN(num)) return '—';

  const sourceDef = units.find((u) => u.id === sourceId);
  const targetDef = units.find((u) => u.id === targetId);
  if (!sourceDef || !targetDef) return '—';

  const baseValue = sourceDef.toBase(num);
  const resultValue = targetDef.fromBase(baseValue);

  if (resultValue === 0) return '0';

  if (Math.abs(resultValue) < 0.000001 || Math.abs(resultValue) > 1000000) {
    return resultValue.toExponential(5);
  }

  const rounded = parseFloat(resultValue.toFixed(6));
  return rounded.toLocaleString(locale || 'fr-FR', {
    maximumFractionDigits: 6,
  });
}

export function getFormulaExplanation(
  activeCategory: string,
  fromUnit: string,
  toUnit: string,
  fromSymbol: string,
  toSymbol: string,
  directRateStr: string
): string {
  if (activeCategory === 'temperature') {
    if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
      return '°F = (°C × 9/5) + 32';
    }
    if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
      return '°C = (°F - 32) × 5/9';
    }
    if (fromUnit === 'celsius' && toUnit === 'kelvin') {
      return 'K = °C + 273.15';
    }
    if (fromUnit === 'kelvin' && toUnit === 'celsius') {
      return '°C = K - 273.15';
    }
    if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
      return 'K = (°F - 32) × 5/9 + 273.15';
    }
    if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
      return '°F = (K - 273.15) × 9/5 + 32';
    }
  }
  return `1 ${fromSymbol} = ${directRateStr} ${toSymbol}`;
}

export interface PopularUnitPreset {
  id: string;
  label: string;
  labelFr?: string;
  fromUnit: string;
  toUnit: string;
}

const LENGTH_PRESETS: PopularUnitPreset[] = [
  { id: 'km-to-mi', label: 'Kilometers to Miles (km ➔ mi)', labelFr: 'Kilomètres en Miles (km ➔ mi)', fromUnit: 'kilometer', toUnit: 'mile' },
  { id: 'm-ft', label: 'Meters to Feet (m ➔ ft)', labelFr: 'Mètres en Pieds (m ➔ ft)', fromUnit: 'meter', toUnit: 'foot' },
  { id: 'cm-in', label: 'Centimeters to Inches (cm ➔ in)', labelFr: 'Centimètres en Pouces (cm ➔ in)', fromUnit: 'centimeter', toUnit: 'inch' },
  { id: 'mi-km', label: 'Miles to Kilometers (mi ➔ km)', labelFr: 'Miles en Kilomètres (mi ➔ km)', fromUnit: 'mile', toUnit: 'kilometer' },
];

const WEIGHT_PRESETS: PopularUnitPreset[] = [
  { id: 'kg-lb', label: 'Kilograms to Pounds (kg ➔ lb)', labelFr: 'Kilogrammes en Livres (kg ➔ lb)', fromUnit: 'kilogram', toUnit: 'pound' },
  { id: 'g-oz', label: 'Grams to Ounces (g ➔ oz)', labelFr: 'Grammes en Onces (g ➔ oz)', fromUnit: 'gram', toUnit: 'ounce' },
  { id: 'lb-kg', label: 'Pounds to Kilograms (lb ➔ kg)', labelFr: 'Livres en Kilogrammes (lb ➔ kg)', fromUnit: 'pound', toUnit: 'kilogram' },
  { id: 't-kg', label: 'Tonnes to Kilograms (t ➔ kg)', labelFr: 'Tonnes en Kilogrammes (t ➔ kg)', fromUnit: 'ton-metric', toUnit: 'kilogram' },
];

const TEMP_PRESETS: PopularUnitPreset[] = [
  { id: 'c-to-f', label: 'Celsius to Fahrenheit (°C ➔ °F)', labelFr: 'Celsius en Fahrenheit (°C ➔ °F)', fromUnit: 'celsius', toUnit: 'fahrenheit' },
  { id: 'f-to-c', label: 'Fahrenheit to Celsius (°F ➔ °C)', labelFr: 'Fahrenheit en Celsius (°F ➔ °C)', fromUnit: 'fahrenheit', toUnit: 'celsius' },
  { id: 'c-k', label: 'Celsius to Kelvin (°C ➔ K)', labelFr: 'Celsius en Kelvin (°C ➔ K)', fromUnit: 'celsius', toUnit: 'kelvin' },
];

const SPEED_PRESETS: PopularUnitPreset[] = [
  { id: 'kmh-mph', label: 'km/h ➔ mph', fromUnit: 'kilometer-hour', toUnit: 'mile-hour' },
  { id: 'mph-kmh', label: 'mph ➔ km/h', fromUnit: 'mile-hour', toUnit: 'kilometer-hour' },
  { id: 'ms-kmh', label: 'm/s ➔ km/h', fromUnit: 'meter-second', toUnit: 'kilometer-hour' },
];

const DATA_PRESETS: PopularUnitPreset[] = [
  { id: 'mb-gb', label: 'MB ➔ GB', fromUnit: 'megabyte', toUnit: 'gigabyte' },
  { id: 'gb-tb', label: 'GB ➔ TB', fromUnit: 'gigabyte', toUnit: 'terabyte' },
  { id: 'kb-mb', label: 'KB ➔ MB', fromUnit: 'kilobyte', toUnit: 'megabyte' },
];

const AREA_PRESETS: PopularUnitPreset[] = [
  { id: 'm2-sqft', label: 'm² ➔ ft²', fromUnit: 'square-meter', toUnit: 'square-foot' },
  { id: 'ha-acre', label: 'ha ➔ ac', fromUnit: 'hectare', toUnit: 'acre' },
  { id: 'km2-mi2', label: 'km² ➔ mi²', fromUnit: 'square-kilometer', toUnit: 'square-mile' },
];

const VOLUME_PRESETS: PopularUnitPreset[] = [
  { id: 'l-gal', label: 'L ➔ gal', fromUnit: 'liter', toUnit: 'gallon-us' },
  { id: 'ml-floz', label: 'mL ➔ fl oz', fromUnit: 'milliliter', toUnit: 'fluid-ounce' },
  { id: 'm3-l', label: 'm³ ➔ L', fromUnit: 'cubic-meter', toUnit: 'liter' },
];

export const POPULAR_UNIT_PRESETS: Record<string, PopularUnitPreset[]> = {
  length: LENGTH_PRESETS,
  weight: WEIGHT_PRESETS,
  mass: WEIGHT_PRESETS,
  temperature: TEMP_PRESETS,
  speed: SPEED_PRESETS,
  data: DATA_PRESETS,
  digital: DATA_PRESETS,
  area: AREA_PRESETS,
  volume: VOLUME_PRESETS,
};

export function getPopularPresetsForCategory(categoryId: string): PopularUnitPreset[] {
  return POPULAR_UNIT_PRESETS[categoryId] || [];
}
