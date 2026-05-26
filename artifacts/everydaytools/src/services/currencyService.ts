export interface CurrencyRates {
  rates: Record<string, number>;
  timestamp: number;
  base: string;
}

const CACHE_KEY = "currency_rates_cache";
const TTL_MS = 3600000; // 1 hour

const FALLBACK_RATES: Record<string, number> = {
  "USD": 1,
  "EUR": 0.92,
  "GBP": 0.79,
  "JPY": 0.79,
  "AUD": 150.25,
  "CAD": 1.52,
  "CHF": 1.35,
  "CNY": 7.23,
  "HKD": 7.23,
  "NZD": 1.35,
  "SEK": 1.63,
  "KRW": 10.45,
  "SGD": 1.63,
  "NOK": 10.45,
  "MXN": 10.45,
  "INR": 1300.45,
  "RUB": 10.45,
  "ZAR": 10.45,
  "TRY": 18.45,
  "BRL": 18.45,
};

export const getCurrencyRates = async (): Promise<{ rates: Record<string, number>; source: string; ageMinutes: number }> => {
  try {
    const cachedStr = localStorage.getItem(CACHE_KEY);
    if (cachedStr) {
      const cached: CurrencyRates = JSON.parse(cachedStr);
      const ageMs = Date.now() - cached.timestamp;
      if (ageMs < TTL_MS) {
        return { 
          rates: cached.rates, 
          source: "Live rates", 
          ageMinutes: Math.round(ageMs / 60000) 
        };
      }
    }
  } catch (e) {
    // Ignore storage errors
  }

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) throw new Error("Failed to fetch rates");
    const data = await response.json();
    
    const ratesData: CurrencyRates = {
      rates: data.rates,
      timestamp: Date.now(),
      base: "USD",
    };
    
    localStorage.setItem(CACHE_KEY, JSON.stringify(ratesData));
    
    return { rates: data.rates, source: "Live rates", ageMinutes: 0 };
  } catch (err) {
    return { rates: FALLBACK_RATES, source: "Offline fallback rates", ageMinutes: 0 };
  }
};
