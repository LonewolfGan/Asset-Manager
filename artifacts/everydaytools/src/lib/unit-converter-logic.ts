import { unitsConfig, UnitCategory, convertUnit } from '@/config/unitsConfig';

/**
 * Convert a value between any two unit IDs.
 * Searches all categories automatically.
 */
export function convert(value: number, fromId: string, toId: string): number {
  for (const category of Object.keys(unitsConfig) as UnitCategory[]) {
    const cat = unitsConfig[category];
    const from = cat.units.find(u => u.id === fromId);
    const to = cat.units.find(u => u.id === toId);
    if (from && to) {
      return convertUnit(value, fromId, toId, category);
    }
  }
  return 0;
}

export { convertUnit };
