/**
 * Rate-limiting middleware factory.
 *
 * Uses a simple in-memory store (suitable for single-process deployments).
 * For multi-process/cluster deployments, swap the store for Redis.
 *
 * Tiers (per spec):
 *   heavy   — background-removal: max 10 req / min / IP
 *   medium  — LibreOffice routes:  max 20 req / min / IP
 *   default — everything else:     max 60 req / min / IP
 */

import type { Request, Response, NextFunction } from "express";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Purge stale entries every 5 minutes to avoid unbounded growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000).unref();

function makeRateLimiter(maxRequests: number, windowMs: number) {
  return function rateLimiter(req: Request, res: Response, next: NextFunction): void {
    const ip = (
      (req.headers["x-forwarded-for"] as string | undefined)?.split(",")[0]?.trim() ??
      req.socket.remoteAddress ??
      "unknown"
    );
    const key = `${req.path}::${ip}`;
    const now = Date.now();

    const entry = store.get(key);
    if (!entry || entry.resetAt < now) {
      store.set(key, { count: 1, resetAt: now + windowMs });
      next();
      return;
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      res.status(429).json({
        error: true,
        code: "RATE_LIMIT_EXCEEDED",
        message: `Too many requests. Retry after ${retryAfter}s.`,
      });
      return;
    }

    next();
  };
}

const WINDOW_MS = parseInt(process.env["RATE_LIMIT_WINDOW_MS"] ?? "60000", 10);

/** Background removal: 10 req / min / IP */
export const heavyRateLimit = makeRateLimiter(10, WINDOW_MS);

/** LibreOffice conversions: 20 req / min / IP */
export const mediumRateLimit = makeRateLimiter(20, WINDOW_MS);

/** All other processing routes: 60 req / min / IP */
export const defaultRateLimit = makeRateLimiter(60, WINDOW_MS);
