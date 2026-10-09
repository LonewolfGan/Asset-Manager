import { apiFetch } from "@/lib/apiBase";

export interface CurrencyRates {
  rates: Record<string, number>;
  timestamp: number;
  base: string;
}

export const getCurrencyRates = async (): Promise<{
  rates: Record<string, number>;
  source: string;
  ageMinutes: number;
}> => {
  try {
    const res = await apiFetch("/rates");
    if (!res.ok) throw new Error("Failed to fetch rates");
    return res.json();
  } catch {
    return {
      rates: {
        USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150.25, AUD: 1.57,
        CAD: 1.38, CHF: 0.91, CNY: 7.23, HKD: 7.83, NZD: 1.63,
        SEK: 10.45, KRW: 1320.0, SGD: 1.35, NOK: 10.55, MXN: 17.15,
        INR: 83.5, RUB: 91.0, ZAR: 18.6, TRY: 32.5, BRL: 5.1,
      },
      source: "Offline fallback rates",
      ageMinutes: 0,
    };
  }
};
