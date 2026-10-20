import { test, describe } from "node:test";
import assert from "node:assert/strict";
import {
  FALLBACK_RATES,
  getRatesWithCache,
  type RatesResponse,
} from "./rates.js";

describe("Currency Rates Engine & Cache (TDD)", () => {
  test("FALLBACK_RATES has valid structure and includes core reserve currencies", () => {
    assert.equal(FALLBACK_RATES["USD"], 1);
    assert.ok(typeof FALLBACK_RATES["EUR"] === "number" && FALLBACK_RATES["EUR"] > 0);
    assert.ok(typeof FALLBACK_RATES["GBP"] === "number" && FALLBACK_RATES["GBP"] > 0);
    assert.ok(typeof FALLBACK_RATES["JPY"] === "number" && FALLBACK_RATES["JPY"] > 0);
    assert.ok(typeof FALLBACK_RATES["CHF"] === "number" && FALLBACK_RATES["CHF"] > 0);
    assert.ok(typeof FALLBACK_RATES["CAD"] === "number" && FALLBACK_RATES["CAD"] > 0);
    assert.ok(typeof FALLBACK_RATES["AUD"] === "number" && FALLBACK_RATES["AUD"] > 0);
  });

  test("getRatesWithCache returns live rates when upstream fetch succeeds", async () => {
    const mockLiveRates = { USD: 1, EUR: 0.93, GBP: 0.8 };
    const mockFetcher = async () => ({ rates: mockLiveRates });

    const result = await getRatesWithCache(mockFetcher, 3600_000, null); // Force cold cache
    assert.equal(result.source, "Live rates");
    assert.equal(result.ageMinutes, 0);
    assert.deepEqual(result.rates, mockLiveRates);
  });

  test("getRatesWithCache returns cached rates when within TTL", async () => {
    const mockLiveRates = { USD: 1, EUR: 0.93 };
    const mockFetcher = async () => ({ rates: mockLiveRates });

    const pastTimestamp = Date.now() - 10 * 60_000; // 10 minutes ago
    const preheatedCache = { rates: mockLiveRates, timestamp: pastTimestamp };

    const result = await getRatesWithCache(mockFetcher, 3600_000, preheatedCache);
    assert.equal(result.source, "Live rates");
    assert.equal(result.ageMinutes, 10);
    assert.deepEqual(result.rates, mockLiveRates);
  });

  test("getRatesWithCache reuses stale cache if upstream fetcher fails", async () => {
    const mockLiveRates = { USD: 1, EUR: 0.93 };
    const failingFetcher = async () => {
      throw new Error("Network timeout or DNS failure");
    };

    const staleTimestamp = Date.now() - 120 * 60_000; // 2 hours ago (> 1 hour TTL)
    const staleCache = { rates: mockLiveRates, timestamp: staleTimestamp };

    const result = await getRatesWithCache(failingFetcher, 3600_000, staleCache);
    assert.equal(result.source, "Live rates");
    assert.equal(result.ageMinutes, 120);
    assert.deepEqual(result.rates, mockLiveRates);
  });

  test("getRatesWithCache falls back to FALLBACK_RATES when fetcher fails and cache is empty", async () => {
    const failingFetcher = async () => {
      throw new Error("Network timeout or DNS failure");
    };

    const result = await getRatesWithCache(failingFetcher, 3600_000, null);
    assert.equal(result.source, "Offline fallback rates");
    assert.equal(result.ageMinutes, 0);
    assert.equal(result.rates["USD"], 1);
    assert.ok(result.rates["EUR"] > 0);
  });

  test("getRatesWithCache rejects malformed payload from upstream and uses fallback", async () => {
    const malformedFetcher = async () => ({ error: "invalid key" } as any);

    const result = await getRatesWithCache(malformedFetcher, 3600_000, null);
    assert.equal(result.source, "Offline fallback rates");
    assert.equal(result.rates["USD"], 1);
  });
});
