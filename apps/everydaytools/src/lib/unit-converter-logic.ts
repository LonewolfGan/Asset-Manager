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
  const clean = val.replace(',', '.').trim();
  if (!clean) return '';
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
