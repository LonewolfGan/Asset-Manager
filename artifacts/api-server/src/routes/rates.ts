import { Router, type IRouter } from "express";

const router: IRouter = Router();

const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, JPY: 150.25, AUD: 1.57,
  CAD: 1.38, CHF: 0.91, CNY: 7.23, HKD: 7.83, NZD: 1.63,
  SEK: 10.45, KRW: 1320.0, SGD: 1.35, NOK: 10.55, MXN: 17.15,
  INR: 83.5, RUB: 91.0, ZAR: 18.6, TRY: 32.5, BRL: 5.1,
};

let cache: { rates: Record<string, number>; timestamp: number } | null = null;
const TTL_MS = 3_600_000;

router.get("/rates", async (_req, res) => {
  if (cache && Date.now() - cache.timestamp < TTL_MS) {
    const ageMinutes = Math.round((Date.now() - cache.timestamp) / 60_000);
    res.json({ rates: cache.rates, source: "Live rates", ageMinutes });
    return;
  }

  try {
    const response = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!response.ok) throw new Error("Upstream error");
    const data = (await response.json()) as { rates: Record<string, number> };
    cache = { rates: data.rates, timestamp: Date.now() };
    res.json({ rates: data.rates, source: "Live rates", ageMinutes: 0 });
  } catch {
    res.json({ rates: FALLBACK_RATES, source: "Offline fallback rates", ageMinutes: 0 });
  }
});

export default router;
