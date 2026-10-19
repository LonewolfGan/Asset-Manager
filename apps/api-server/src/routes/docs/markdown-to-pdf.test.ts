import { describe, it, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import express from "express";
import { buildMarkdownHtmlDocument, renderMarkdownToPdfBuffer } from "./markdown-to-pdf-logic.js";
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

describe("Markdown to PDF Logic & Gotenberg Modern Pipeline (TDD)", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("buildMarkdownHtmlDocument", () => {
    it("wraps HTML in an HTML5 document with editorial GitHub print stylesheet", () => {
      const doc = buildMarkdownHtmlDocument("<h1>Title</h1><p>Body</p>", "Test Title");
      assert.ok(doc.includes("<!DOCTYPE html>"));
      assert.ok(doc.includes("<title>Test Title</title>"));
      assert.ok(doc.includes("@page { size: A4; margin: 20mm 15mm; }"));
      assert.ok(doc.includes("-apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif"));
      assert.ok(doc.includes("#f6f8fa"));
      assert.ok(doc.includes("border-left"));
      assert.ok(doc.includes("border-collapse"));
      assert.ok(doc.includes("<h1>Title</h1><p>Body</p>"));
    });

    it("uses default title when omitted or empty", () => {
      const doc = buildMarkdownHtmlDocument("<p>No title</p>");
      assert.ok(doc.includes("<title>Document</title>"));
    });
  });

  describe("renderMarkdownToPdfBuffer", () => {
    it("renders markdown via Gotenberg Chromium when service is healthy", async () => {
      globalThis.fetch = (async (url: any) => {
        const u = String(url);
        if (u.includes("/health")) return { ok: true } as any;
        if (u.includes("/forms/chromium/convert/html")) {
          return {
            ok: true,
            arrayBuffer: async () => new TextEncoder().encode("%PDF-1.4 GOTENBERG_MARKDOWN").buffer,
          } as any;
        }
        throw new Error(`Unexpected URL: ${u}`);
      }) as any;

      const buf = await renderMarkdownToPdfBuffer("# Hello Gotenberg", "Gotenberg Test");
      assert.ok(Buffer.isBuffer(buf));
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
      assert.ok(buf.toString("utf-8").includes("GOTENBERG_MARKDOWN"));
    });

    it("falls back to PDFKit when Gotenberg service is offline or throws", async () => {
      globalThis.fetch = (async () => {
        throw new Error("Gotenberg daemon offline");
      }) as any;

      const buf = await renderMarkdownToPdfBuffer("# Fallback Markdown\n\nContent", "Fallback");
      assert.ok(Buffer.isBuffer(buf));
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
    });
  });

  describe("POST /tools/markdown-to-pdf Route", () => {
    let testServer: http.Server | null = null;
    let testPort = 0;

    beforeEach(async () => {
      const started = await startTestServer();
      testServer = started.server;
      testPort = started.port;
    });

    afterEach(() => {
      testServer?.close();
    });

    it("converts JSON markdown body to PDF with 200 status", async () => {
      globalThis.fetch = (async (url: any, opts: any) => {
        const u = String(url);
        if (u.includes(`127.0.0.1:${testPort}`)) return originalFetch(url, opts);
        if (u.includes("/health")) return { ok: false } as any;
        throw new Error("Offline");
      }) as any;

      const res = await fetch(`http://127.0.0.1:${testPort}/tools/markdown-to-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown: "## Subtitle\n\n- item 1\n- item 2" }),
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get("content-type"), "application/pdf");
      const disposition = res.headers.get("content-disposition") ?? "";
      assert.ok(disposition.includes('filename="document.pdf"'));
      const buf = Buffer.from(await res.arrayBuffer());
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("converts multipart markdown file upload with RFC 5987 Content-Disposition", async () => {
      globalThis.fetch = (async (url: any, opts: any) => {
        const u = String(url);
        if (u.includes(`127.0.0.1:${testPort}`)) return originalFetch(url, opts);
        if (u.includes("/health")) return { ok: false } as any;
        throw new Error("Offline");
      }) as any;

      const formData = new FormData();
      const blob = new Blob(["# Rapport Annuel\n\nTexte de synthèse."], { type: "text/markdown" });
      formData.append("file", blob, "rapport_d'activité_2024.md");

      const res = await fetch(`http://127.0.0.1:${testPort}/tools/markdown-to-pdf`, {
        method: "POST",
        body: formData,
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.headers.get("content-type"), "application/pdf");
      const disposition = res.headers.get("content-disposition") ?? "";
      assert.ok(disposition.includes("filename="));
      assert.ok(disposition.includes("filename*="));
      assert.ok(disposition.includes("UTF-8''"));
      const buf = Buffer.from(await res.arrayBuffer());
      assert.strictEqual(buf.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("returns 400 when neither file nor markdown body field is provided", async () => {
      const res = await fetch(`http://127.0.0.1:${testPort}/tools/markdown-to-pdf`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      assert.strictEqual(res.status, 400);
      const json = await res.json() as any;
      assert.strictEqual(json.code, "MISSING_FILE");
    });
  });
});
