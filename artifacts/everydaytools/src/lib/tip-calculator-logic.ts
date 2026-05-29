export interface TipResult {
  tipAmount: number;
  total: number;
  perPerson: number;
  tipPerPerson: number;
}

/**
 * Calculate tip, total, and per-person amounts.
 * @param bill       Bill amount before tip
 * @param tipPercent Tip percentage (0-100)
 * @param people     Number of people splitting (>= 1)
 */
export function calculateTip(bill: number, tipPercent: number, people: number): TipResult {
  const tipAmount = bill * (tipPercent / 100);
  const total = bill + tipAmount;
  const count = people > 0 ? people : 1;
  const perPerson = total / count;
  const tipPerPerson = tipAmount / count;
  return { tipAmount, total, perPerson, tipPerPerson };
}
