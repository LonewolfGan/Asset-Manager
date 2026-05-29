/** Returns X% of Y — e.g. percentageOf(20, 150) = 30 */
export function percentageOf(pct: number, value: number): number {
  return (pct / 100) * value;
}

/** Returns what % X is of Y — e.g. calculatePercentage(30, 150) = 20 */
export function calculatePercentage(x: number, y: number): number | null {
  if (y === 0) return null;
  return (x / y) * 100;
}

/** Returns % change from `from` to `to` — e.g. percentageChange(100, 150) = 50 */
export function percentageChange(from: number, to: number): number {
  if (from === 0) return 0;
  return ((to - from) / from) * 100;
}
