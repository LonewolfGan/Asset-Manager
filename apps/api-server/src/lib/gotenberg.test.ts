import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { isGotenbergHealthy, convertHtmlWithGotenberg, convertWithGotenberg } from "./gotenberg.js";

describe("Gotenberg Client Module (TDD)", () => {
  it("isGotenbergHealthy returns false and safely clears timeout on fetch network failure", async () => {
    const originalFetch = globalThis.fetch;
    const originalClearTimeout = globalThis.clearTimeout;
    let clearedTimer = false;

    globalThis.clearTimeout = ((timer: any) => {
      clearedTimer = true;
      return originalClearTimeout(timer);
    }) as any;

    globalThis.fetch = async () => {
      throw new Error("ECONNREFUSED");
    };

    try {
      const healthy = await isGotenbergHealthy();
      assert.strictEqual(healthy, false);
      assert.strictEqual(clearedTimer, true, "clearTimeout must be called in finally block even on failure");
    } finally {
      globalThis.fetch = originalFetch;
      globalThis.clearTimeout = originalClearTimeout;
    }
  });

  it("isGotenbergHealthy returns true and clears timeout on healthy 200 response", async () => {
    const originalFetch = globalThis.fetch;
    let clearedTimer = false;
    const originalClearTimeout = globalThis.clearTimeout;

    globalThis.clearTimeout = ((timer: any) => {
      clearedTimer = true;
      return originalClearTimeout(timer);
    }) as any;

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ status: "up" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });

    try {
      const healthy = await isGotenbergHealthy();
      assert.strictEqual(healthy, true);
      assert.strictEqual(clearedTimer, true);
    } finally {
      globalThis.fetch = originalFetch;
      globalThis.clearTimeout = originalClearTimeout;
    }
  });

  it("convertHtmlWithGotenberg constructs multipart form data and returns pdf buffer", async () => {
    const originalFetch = globalThis.fetch;
    let interceptedUrl = "";
    let interceptedMethod = "";
    let hasIndexHtml = false;

    globalThis.fetch = (async (url: string, init?: RequestInit) => {
      interceptedUrl = url;
      interceptedMethod = init?.method ?? "";
      const body = init?.body as FormData;
      if (body) {
        const file = body.get("files") as any;
        if (file && (file.name === "index.html" || file.name === "index.htm")) {
          hasIndexHtml = true;
        }
      }
      return new Response(Buffer.from("%PDF-1.4 mock chromium pdf"), {
        status: 200,
        headers: { "Content-Type": "application/pdf" },
      });
    }) as any;

    try {
      const result = await convertHtmlWithGotenberg("<h1>Hello world</h1>", { landscape: true });
      assert.ok(interceptedUrl.includes("/forms/chromium/convert/html"));
      assert.strictEqual(interceptedMethod, "POST");
      assert.ok(result.toString().startsWith("%PDF-"));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
