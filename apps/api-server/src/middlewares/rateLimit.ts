/**
 * Rate-limiting middleware factory.
 *
 * Distributed via Redis with automatic in-memory fallback.
 *
 * Tiers (per spec):
 *   heavy   — background-removal: max 10 req / min / IP
 *   medium  — LibreOffice routes:  max 20 req / min / IP
 *   default — everything else:     max 60 req / min / IP
 */

import type { Request, Response, NextFunction } from "express";
import { getRedisClient } from "../lib/queue.js";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const memoryStore = new Map<string, RateLimitEntry>();

// Purge stale in-memory entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryStore) {
    if (entry.resetAt < now) memoryStore.delete(key);
  }
}, 5 * 60 * 1000).unref();

function makeRateLimiter(maxRequests: number, windowMs: number) {
  return async function rateLimiter(req: Request, res: Response, next: NextFunction): Promise<void> {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = (
      (typeof forwarded === "string" ? forwarded : Array.isArray(forwarded) ? forwarded[0] : undefined)?.split(",")[0]?.trim() ??
      req.socket.remoteAddress ??
      "unknown"
    );
    const key = `${req.path}::${ip}`;
    const now = Date.now();

    // 1. Try Redis distributed rate limiting if available
    const redis = getRedisClient();
    if (redis) {
      try {
        const redisKey = `ratelimit:${key}`;
        const count = await redis.incr(redisKey);
        if (count === 1) {
          await redis.pexpire(redisKey, windowMs);
        }

        if (count > maxRequests) {
          const ttlMs = await redis.pttl(redisKey);
          const retryAfter = Math.max(1, Math.ceil((ttlMs > 0 ? ttlMs : windowMs) / 1000));
          res.set("Retry-After", String(retryAfter));
          res.status(429).json({
            error: true,
            code: "RATE_LIMIT_EXCEEDED",
            message: `Too many requests. Retry after ${retryAfter}s.`,
          });
          return;
        }

        next();
        return;
      } catch {
        // Fall through to in-memory rate limiting on Redis glitch
      }
    }

    // 2. Resilient in-memory fallback
    const entry = memoryStore.get(key);
    if (!entry || entry.resetAt < now) {
      memoryStore.set(key, { count: 1, resetAt: now + windowMs });
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
