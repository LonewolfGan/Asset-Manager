/**
 * Classification of units into physical measurement systems
 * (Metric SI, Imperial/US Customary, Specialist/Scientific)
 */

export type MeasurementSystem = 'metric' | 'imperial' | 'special';

export interface SystemGroup {
  id: MeasurementSystem;
  label: string;
  badge: string;
}

export const SYSTEM_GROUPS: Record<MeasurementSystem, SystemGroup> = {
  metric: {
    id: 'metric',
    label: 'Système Métrique (SI)',
    badge: 'Métrique',
  },
  imperial: {
    id: 'imperial',
    label: 'Système Impérial & US',
    badge: 'Impérial / US',
  },
  special: {
    id: 'special',
    label: 'Scientifique & Spécialiste',
    badge: 'Spécial',
  },
};

const IMPERIAL_UNITS = new Set([
  'mile',
  'yard',
  'foot',
  'inch',
  'pound',
  'ounce',
  'stone',
  'ton-imperial',
  'ton-us',
  'fahrenheit',
  'gallon-us',
  'gallon-uk',
  'quart',
  'pint',
  'cup',
  'fluid-ounce',
  'tablespoon',
  'teaspoon',
  'square-mile',
  'square-yard',
  'square-foot',
  'square-inch',
  'acre',
  'mile-hour',
  'foot-second',
  'psi',
  'horsepower-imperial',
  'btu',
  'btu-hour',
]);

const SPECIAL_UNITS = new Set([
  'nautical-mile',
  'light-year',
  'kelvin',
  'knot',
  'atm',
  'torr',
  'mmhg',
  'electron-volt',
  'calorie',
  'kilocalorie',
  'watt-hour',
  'kilowatt-hour',
  'kibibyte',
  'mebibyte',
  'gibibyte',
  'tebibyte',
  'radian',
  'gradian',
  'arcminute',
  'arcsecond',
  'rpm',
]);

export function getUnitSystem(unitId: string): MeasurementSystem {
  if (IMPERIAL_UNITS.has(unitId)) return 'imperial';
  if (SPECIAL_UNITS.has(unitId)) return 'special';
  return 'metric';
}
