import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { makeRateLimiter } from "./rateLimit.js";
import type { Request, Response, NextFunction } from "express";

function createMockReq(ip: string, path = "/test"): Partial<Request> {
  return {
    ip,
    path,
    socket: { remoteAddress: ip } as any,
    headers: {},
  };
}

function createMockRes(): { res: Partial<Response>; statusMock: number | null; jsonBody: any; headersSent: Record<string, string> } {
  const result = {
    statusMock: null as number | null,
    jsonBody: null as any,
    headersSent: {} as Record<string, string>,
    res: {} as Partial<Response>,
  };

  result.res = {
    set(header: any, val?: any) {
      if (typeof header === "string" && val) {
        result.headersSent[header] = String(val);
      }
      return result.res as Response;
    },
    status(code: number) {
      result.statusMock = code;
      return result.res as Response;
    },
    json(body: any) {
      result.jsonBody = body;
      return result.res as Response;
    },
  };

  return result;
}

describe("Rate Limiter Security & IP Handling (TDD)", () => {
  it("uses req.ip to enforce rate limiting", async () => {
    const limiter = makeRateLimiter(2, 60_000);
    const ip = "192.168.1.100";

    let nextCalled = 0;
    const next: NextFunction = () => { nextCalled++; };

    // Request 1: OK
    const req1 = createMockReq(ip) as Request;
    const res1 = createMockRes();
    await limiter(req1, res1.res as Response, next);
    assert.strictEqual(nextCalled, 1);

    // Request 2: OK
    const req2 = createMockReq(ip) as Request;
    const res2 = createMockRes();
    await limiter(req2, res2.res as Response, next);
    assert.strictEqual(nextCalled, 2);

    // Request 3: Exceeded -> 429
    const req3 = createMockReq(ip) as Request;
    const res3 = createMockRes();
    await limiter(req3, res3.res as Response, next);
    assert.strictEqual(nextCalled, 2);
    assert.strictEqual(res3.statusMock, 429);
    assert.strictEqual(res3.jsonBody?.code, "RATE_LIMIT_EXCEEDED");
  });

  it("falls back to req.socket.remoteAddress when req.ip is undefined", async () => {
    const limiter = makeRateLimiter(1, 60_000);
    const req = {
      path: "/fallback",
      socket: { remoteAddress: "10.0.0.5" },
    } as unknown as Request;
    const res = createMockRes();
    let nextCalled = 0;
    const next: NextFunction = () => { nextCalled++; };

    await limiter(req, res.res as Response, next);
    assert.strictEqual(nextCalled, 1);
  });

  it("maintains separate limits for different client IPs", async () => {
    const limiter = makeRateLimiter(1, 60_000);
    let nextCount = 0;
    const next: NextFunction = () => { nextCount++; };

    const reqA = createMockReq("1.1.1.1", "/shared") as Request;
    const resA = createMockRes();
    await limiter(reqA, resA.res as Response, next);
    assert.strictEqual(nextCount, 1);

    const reqB = createMockReq("2.2.2.2", "/shared") as Request;
    const resB = createMockRes();
    await limiter(reqB, resB.res as Response, next);
    assert.strictEqual(nextCount, 2);
  });
});
