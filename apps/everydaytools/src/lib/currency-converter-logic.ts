/**
 * Currency Converter Core Logic
 * Real-time rates calculation, formatting, reverse conversion, and popular currency pairs.
 */

export interface CurrencyItem {
  code: string;
  name: string;
  symbol: string;
}

export interface PopularPair {
  from: string;
  to: string;
  label: string;
}

export const POPULAR_PAIRS: PopularPair[] = [
  { from: 'EUR', to: 'USD', label: 'EUR / USD' },
  { from: 'USD', to: 'EUR', label: 'USD / EUR' },
  { from: 'GBP', to: 'USD', label: 'GBP / USD' },
  { from: 'EUR', to: 'GBP', label: 'EUR / GBP' },
  { from: 'USD', to: 'JPY', label: 'USD / JPY' },
  { from: 'USD', to: 'CAD', label: 'USD / CAD' },
  { from: 'EUR', to: 'CHF', label: 'EUR / CHF' },
  { from: 'AUD', to: 'USD', label: 'AUD / USD' },
];

export const STANDARD_TIERS = [1, 5, 10, 25, 50, 100, 500, 1000, 5000, 10000];

/**
 * Calculates converted amount between any two currencies using a base rate mapping.
 */
export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number | null {
  if (isNaN(amount) || amount < 0) return null;
  if (fromCurrency === toCurrency) return amount;

  const rateFrom = rates[fromCurrency];
  const rateTo = rates[toCurrency];

  if (!rateFrom || !rateTo || rateFrom <= 0) return null;

  // Rates are usually pegged to USD (1 USD = rate X)
  const inUSD = amount / rateFrom;
  const converted = inUSD * rateTo;

  return Number(converted.toFixed(4));
}

/**
 * Calculates the direct exchange rate: 1 FROM = X TO
 */
export function getDirectRate(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number | null {
  if (fromCurrency === toCurrency) return 1;
  const rateFrom = rates[fromCurrency];
  const rateTo = rates[toCurrency];
  if (!rateFrom || !rateTo || rateFrom <= 0) return null;
  return Number((rateTo / rateFrom).toFixed(4));
}

/**
 * Generates an array of conversion tiers for quick reference
 */
export function generateQuickConversions(
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  tiers: number[] = STANDARD_TIERS
): Array<{ fromAmount: number; toAmount: number }> {
  const result: Array<{ fromAmount: number; toAmount: number }> = [];
  const rate = getDirectRate(fromCurrency, toCurrency, rates);

  if (rate === null) return [];

  for (const tier of tiers) {
    result.push({
      fromAmount: tier,
      toAmount: Number((tier * rate).toFixed(2)),
    });
  }

  return result;
}

/**
 * Formats a currency amount with localized separators and appropriate decimal precision
 */
export function formatCurrencyAmount(
  amount: number,
  locale: string = 'en-US',
  currencyCode?: string
): string {
  try {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
      style: currencyCode ? 'currency' : 'decimal',
      currency: currencyCode,
    }).format(amount);
  } catch {
    return amount.toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  }
}

/**
 * Parses raw text input into a valid positive number
 */
export function parseCurrencyAmount(input: string): number {
  if (!input) return 0;
  const clean = input.replace(',', '.').trim();
  const val = parseFloat(clean);
  return isNaN(val) || val < 0 ? 0 : val;
}

/**
 * Converts and formats the destination value
 */
export function formatConvertedValue(
  parsedAmount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
  locale: string = 'fr-FR',
  rawInput: string = ''
): string {
  if (parsedAmount <= 0 && rawInput.trim() === '') {
    return (0).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  const converted = convertCurrency(parsedAmount, fromCurrency, toCurrency, rates);
  if (converted === null) return '—';

  return converted.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

