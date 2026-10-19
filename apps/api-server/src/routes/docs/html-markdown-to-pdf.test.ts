import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { htmlToPdfBuffer } from "../../lib/html-to-pdf.js";
import { buildContentDisposition } from "../convert/convert-image.js";

describe("HTML & Markdown to PDF & Presentation Routes (TDD)", () => {
  describe("htmlToPdfBuffer engine", () => {
    it("converts simple HTML into a valid PDF buffer starting with %PDF-", async () => {
      const html = "<h1>Test Heading</h1><p>This is a paragraph with <strong>bold</strong> text.</p>";
      const buf = await htmlToPdfBuffer(html);
      assert.ok(Buffer.isBuffer(buf));
      assert.ok(buf.length > 100);
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("sanitizes script and style tags while preserving text content", async () => {
      const html = "<div><h2>Safe Title</h2><script>alert('xss')</script><style>body { color: red; }</style><p>Content preserved</p></div>";
      const buf = await htmlToPdfBuffer(html);
      assert.ok(Buffer.isBuffer(buf));
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("handles table and list structures gracefully", async () => {
      const html = "<ul><li>Item 1</li><li>Item 2</li></ul><table><tr><th>Col 1</th><th>Col 2</th></tr><tr><td>Val 1</td><td>Val 2</td></tr></table>";
      const buf = await htmlToPdfBuffer(html);
      assert.ok(Buffer.isBuffer(buf));
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
    });
  });

  describe("RFC 5987 / RFC 6266 Header Formatting", () => {
    it("formats safe attachment header for webpage to PDF with accented characters", () => {
      const disposition = buildContentDisposition("page_accueil_sécurisée.html", "pdf");
      assert.strictEqual(disposition.includes('filename="page_accueil_s_curis_e.pdf"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''page_accueil_s%C3%A9curis%C3%A9e.pdf"), true);
    });

    it("formats safe attachment header for PDF to HTML conversion", () => {
      const disposition = buildContentDisposition("spécification_technique.v2.pdf", "html");
      assert.strictEqual(disposition.includes('filename="sp_cification_technique.v2.html"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''sp%C3%A9cification_technique.v2.html"), true);
    });

    it("formats safe attachment header for PDF to PPTX conversion", () => {
      const disposition = buildContentDisposition("présentation_mensuelle.final.pdf", "pptx");
      assert.strictEqual(disposition.includes('filename="pr_sentation_mensuelle.final.pptx"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''pr%C3%A9sentation_mensuelle.final.pptx"), true);
    });
  });
});

import http from "node:http";
import express from "express";
import {
  convertHtmlWithGotenberg,
  getGotenbergUrl,
} from "../../lib/gotenberg.js";
import htmlMarkdownRouter from "./html-markdown-to-pdf.js";

function startTestServer(): Promise<{ server: http.Server; port: number }> {
  const app = express();
  app.use(express.json());
  app.use(htmlMarkdownRouter);
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const addr = server.address() as { port: number };
      resolve({ server, port: addr.port });
    });
  });
}

function postJson(port: number, path: string, body: unknown): Promise<{ status: number; body: Buffer }> {
  return new Promise((resolve, reject) => {
    const data = Buffer.from(JSON.stringify(body));
    const req = http.request(
      {
        hostname: "127.0.0.1",
        port,
        path,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length,
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
        res.on("end", () => {
          resolve({
            status: res.statusCode ?? 500,
            body: Buffer.concat(chunks),
          });
        });
      },
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

describe("Gotenberg Chromium HTML to PDF Engine (TDD)", () => {
  const originalFetch = globalThis.fetch;

  describe("convertHtmlWithGotenberg", () => {
    afterEach(() => {
      globalThis.fetch = originalFetch;
    });

    it("sends multipart form data with index.html to /forms/chromium/convert/html and returns PDF buffer", async () => {
      let requestedUrl = "";
      let requestedMethod = "";
      let sentFormData: any = null;

      globalThis.fetch = (async (url: any, opts: any) => {
        requestedUrl = String(url);
        requestedMethod = opts?.method;
        sentFormData = opts?.body;
        return {
          ok: true,
          arrayBuffer: async () => new TextEncoder().encode("%PDF-1.4 GOTENBERG_OUTPUT").buffer,
        } as any;
      }) as any;

      const html = "<html><body><h1>Hello Gotenberg</h1></body></html>";
      const result = await convertHtmlWithGotenberg(html, {
        landscape: true,
        emulatedMediaType: "screen",
      });

      assert.strictEqual(requestedUrl, `${getGotenbergUrl()}/forms/chromium/convert/html`);
      assert.strictEqual(requestedMethod, "POST");
      assert.ok(sentFormData instanceof FormData);
      const file = (sentFormData as FormData).get("files") as File;
      assert.strictEqual(file.name, "index.html");
      assert.strictEqual((sentFormData as FormData).get("printBackground"), "true");
      assert.strictEqual((sentFormData as FormData).get("preferCssPageSize"), "true");
      assert.strictEqual((sentFormData as FormData).get("landscape"), "true");
      assert.strictEqual((sentFormData as FormData).get("emulatedMediaType"), "screen");
      assert.strictEqual(result.toString("utf-8"), "%PDF-1.4 GOTENBERG_OUTPUT");
    });

    it("throws an error when Gotenberg responds with a non-ok status", async () => {
      globalThis.fetch = (async () => ({
        ok: false,
        status: 500,
        text: async () => "Chromium rendering failed",
      })) as any;

      await assert.rejects(
        convertHtmlWithGotenberg("<p>Fail</p>"),
        /Gotenberg.*500/,
      );
    });
  });

  describe("POST /tools/html-to-pdf Route Engine Selection", () => {
    let testServer: http.Server | null = null;
    let testPort = 0;

    beforeEach(async () => {
      const started = await startTestServer();
      testServer = started.server;
      testPort = started.port;
    });

    afterEach(() => {
      globalThis.fetch = originalFetch;
      testServer?.close();
    });

    it("uses Gotenberg Chromium engine when available and healthy", async () => {
      globalThis.fetch = (async (url: any) => {
        const u = String(url);
        if (u.includes("/health")) {
          return { ok: true } as any;
        }
        if (u.includes("/forms/chromium/convert/html")) {
          return {
            ok: true,
            arrayBuffer: async () => Buffer.from("%PDF-1.4 GOTENBERG_STREAM").buffer,
          } as any;
        }
        throw new Error(`Unexpected fetch URL: ${u}`);
      }) as any;

      const res = await postJson(testPort, "/tools/html-to-pdf", {
        html: "<h1>Modern CSS3 Design</h1>",
      });

      assert.strictEqual(res.status, 200);
      assert.ok(res.body.toString("utf-8").includes("GOTENBERG_STREAM"));
    });

    it("falls back to PDFKit when Gotenberg service is unhealthy or offline", async () => {
      globalThis.fetch = (async (url: any) => {
        const u = String(url);
        if (u.includes("/health")) {
          return { ok: false } as any;
        }
        throw new Error("Offline");
      }) as any;

      const res = await postJson(testPort, "/tools/html-to-pdf", {
        html: "<h1>Offline Fallback Test</h1>",
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("falls back to PDFKit when Gotenberg throws an error during conversion", async () => {
      globalThis.fetch = (async (url: any) => {
        const u = String(url);
        if (u.includes("/health")) {
          return { ok: true } as any;
        }
        if (u.includes("/forms/chromium/convert/html")) {
          return {
            ok: false,
            status: 502,
            text: async () => "Bad Gateway",
          } as any;
        }
        throw new Error("Unexpected fetch");
      }) as any;

      const res = await postJson(testPort, "/tools/html-to-pdf", {
        html: "<h1>Conversion Failure Fallback</h1>",
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.subarray(0, 5).toString("ascii"), "%PDF-");
    });
  });
});

