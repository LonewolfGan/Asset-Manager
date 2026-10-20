import { Router, type IRouter, type Request, type Response } from "express";
import { defaultRateLimit } from "../middlewares/rateLimit.js";

const router: IRouter = Router();

export const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.25,
  AUD: 1.57,
  CAD: 1.38,
  CHF: 0.91,
  CNY: 7.23,
  HKD: 7.83,
  NZD: 1.63,
  SEK: 10.45,
  KRW: 1320.0,
  SGD: 1.35,
  NOK: 10.55,
  MXN: 17.15,
  INR: 83.5,
  RUB: 91.0,
  ZAR: 18.6,
  TRY: 32.5,
  BRL: 5.1,
  DKK: 6.89,
  PLN: 3.98,
  THB: 36.2,
  IDR: 15600.0,
  ILS: 3.65,
  AED: 3.67,
  SAR: 3.75,
};

export interface RatesResponse {
  rates: Record<string, number>;
  source: "Live rates" | "Offline fallback rates";
  ageMinutes: number;
}

export interface CacheEntry {
  rates: Record<string, number>;
  timestamp: number;
}

let serverCache: CacheEntry | null = null;
const TTL_MS = 3_600_000; // 1 hour

let inFlightPromise: Promise<{ rates: Record<string, number> }> | null = null;

export async function fetchLiveRates(): Promise<{ rates: Record<string, number> }> {
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const response = await fetch("https://open.er-api.com/v6/latest/USD", {
        signal: AbortSignal.timeout(5_000),
        headers: {
          Accept: "application/json",
          "User-Agent": "EverydayTools-Hub/2.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Upstream exchange rate error: ${response.status}`);
      }

      const data = (await response.json()) as { rates?: Record<string, number> };
      if (!data?.rates || typeof data.rates !== "object" || typeof data.rates["USD"] !== "number") {
        throw new Error("Invalid exchange rates payload structure");
      }

      return { rates: data.rates };
    } finally {
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

export async function getRatesWithCache(
  fetcher: () => Promise<{ rates: Record<string, number> }>,
  ttlMs: number = TTL_MS,
  overrideCache?: CacheEntry | null,
): Promise<RatesResponse> {
  const activeCache = overrideCache !== undefined ? overrideCache : serverCache;

  if (activeCache && Date.now() - activeCache.timestamp < ttlMs) {
    const ageMinutes = Math.max(0, Math.round((Date.now() - activeCache.timestamp) / 60_000));
    return {
      rates: activeCache.rates,
      source: "Live rates",
      ageMinutes,
    };
  }

  try {
    const data = await fetcher();
    if (!data?.rates || typeof data.rates !== "object" || typeof data.rates["USD"] !== "number") {
      throw new Error("Invalid exchange rates payload structure");
    }
    if (overrideCache === undefined) {
      serverCache = { rates: data.rates, timestamp: Date.now() };
    }
    return {
      rates: data.rates,
      source: "Live rates",
      ageMinutes: 0,
    };
  } catch {
    return {
      rates: activeCache?.rates ?? FALLBACK_RATES,
      source: activeCache ? "Live rates" : "Offline fallback rates",
      ageMinutes: activeCache ? Math.max(0, Math.round((Date.now() - activeCache.timestamp) / 60_000)) : 0,
    };
  }
}

router.get("/rates", defaultRateLimit, async (_req: Request, res: Response) => {
  const result = await getRatesWithCache(fetchLiveRates);

  res.set("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.json(result);
});

export default router;
