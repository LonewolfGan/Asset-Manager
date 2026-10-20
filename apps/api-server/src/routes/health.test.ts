import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HealthCheckResponse } from "@workspace/api-zod";
import {
  getMemoryInfo,
  getDiskInfo,
  checkServiceHealth,
} from "./health.js";

describe("Health & Diagnostics Engine (TDD)", () => {
  it("validates lightweight liveness schema with HealthCheckResponse", () => {
    const raw = { status: "ok" };
    const parsed = HealthCheckResponse.parse(raw);
    assert.strictEqual(parsed.status, "ok");
  });

  it("calculates memory diagnostics accurately in MB", () => {
    const mockMem = {
      rss: 100 * 1024 * 1024,
      heapUsed: 50 * 1024 * 1024,
      heapTotal: 80 * 1024 * 1024,
      external: 0,
      arrayBuffers: 0,
    };
    const info = getMemoryInfo(mockMem);
    assert.strictEqual(info.rssMb, 100);
    assert.strictEqual(info.heapUsedMb, 50);
    assert.strictEqual(info.heapTotalMb, 80);
  });

  it("calculates disk info correctly and detects low disk under 2GB", async () => {
    const mockStatfsLow = async () => ({
      bavail: BigInt(1024 * 1024), // 1 GB / 1024
      blocks: BigInt(10 * 1024 * 1024),
      bsize: BigInt(1024),
      bfree: BigInt(1024 * 1024),
      files: BigInt(100),
      ffree: BigInt(50),
      type: BigInt(1),
      flags: BigInt(0),
      namemax: BigInt(255),
    });

    const lowDisk = await getDiskInfo(mockStatfsLow as any, "/tmp");
    assert.strictEqual(lowDisk.isLowDisk, true);
    assert.strictEqual(lowDisk.freeGb, "1.0 GB");

    const mockStatfsHealthy = async () => ({
      bavail: BigInt(20 * 1024 * 1024), // 20 GB
      blocks: BigInt(100 * 1024 * 1024),
      bsize: BigInt(1024),
      bfree: BigInt(20 * 1024 * 1024),
      files: BigInt(100),
      ffree: BigInt(50),
      type: BigInt(1),
      flags: BigInt(0),
      namemax: BigInt(255),
    });

    const healthyDisk = await getDiskInfo(mockStatfsHealthy as any, "/tmp");
    assert.strictEqual(healthyDisk.isLowDisk, false);
    assert.strictEqual(healthyDisk.freeGb, "20.0 GB");
  });

  it("handles disk statfs errors gracefully without throwing", async () => {
    const mockFailingStatfs = async () => {
      throw new Error("Permission denied or unsupported filesystem");
    };

    const fallbackDisk = await getDiskInfo(mockFailingStatfs as any, "/tmp");
    assert.strictEqual(fallbackDisk.freeGb, "unknown");
    assert.strictEqual(fallbackDisk.isLowDisk, false);
  });

  it("checks service health with timeout and returns boolean status", async () => {
    const mockSuccessFetch = async () => ({ ok: true } as Response);
    const healthy = await checkServiceHealth("http://localhost:3000", 500, mockSuccessFetch as any);
    assert.strictEqual(healthy, true);

    const mockFailFetch = async () => {
      throw new Error("Connection refused");
    };
    const offline = await checkServiceHealth("http://localhost:3000", 500, mockFailFetch as any);
    assert.strictEqual(offline, false);
  });
});
