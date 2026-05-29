import { describe, it, expect } from 'vitest';
import { calculateTip } from '@/lib/tip-calculator-logic';

describe('Tip Calculator', () => {
  it('15% tip on $100 = $15 tip, $115 total', () => {
    const r = calculateTip(100, 15, 1);
    expect(r.tipAmount).toBe(15);
    expect(r.total).toBe(115);
    expect(r.perPerson).toBe(115);
  });

  it('splits correctly among 4 people', () => {
    const r = calculateTip(100, 20, 4);
    expect(r.perPerson).toBe(30); // ($100 + $20) / 4
    expect(r.tipPerPerson).toBe(5); // $20 / 4
  });

  it('handles $0 bill', () => {
    const r = calculateTip(0, 15, 1);
    expect(r.tipAmount).toBe(0);
    expect(r.total).toBe(0);
  });

  it('0% tip = bill equals total', () => {
    const r = calculateTip(50, 0, 1);
    expect(r.tipAmount).toBe(0);
    expect(r.total).toBe(50);
  });

  it('handles people = 0 gracefully (treats as 1)', () => {
    const r = calculateTip(100, 20, 0);
    expect(r.perPerson).toBe(120);
  });
});
