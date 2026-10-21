import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ProcessPool } from "../../lib/process-pool.js";
import {
  convertPdfToHtml,
  handlePdfToHtml,
  HTML_MIME_TYPE,
} from "./pdf-to-html-handler.js";

/**
 * Generates an in-memory 2-page test PDF document using pdf-lib.
 */
async function createSamplePdfDocument(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Standard A4
  const page1 = doc.addPage([595.28, 841.89]);

  // Page 1 Title
  page1.drawText("Architecture Whitepaper 2026", {
    x: 50,
    y: 780,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  // Page 1 Paragraph
  page1.drawText("EverydayTools Hub High-Fidelity SVG Vector Engine", {
    x: 50,
    y: 740,
    size: 13,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Page 1 decorative line
  page1.drawLine({
    start: { x: 50, y: 720 },
    end: { x: 545, y: 720 },
    thickness: 1.5,
    color: rgb(0.88, 0.31, 0.15),
  });

  // Page 2: Second page
  const page2 = doc.addPage([595.28, 841.89]);
  page2.drawText("Section 2: Performance & Benchmarking", {
    x: 50,
    y: 780,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });

  page2.drawText("Sub-millisecond latency per page with 100% crisp vector rendering.", {
    x: 50,
    y: 740,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}

describe("PDF to HTML High-Fidelity Engine — Unit & Integration (TDD RED)", () => {
  it("converts a valid multi-page PDF into a responsive, self-contained HTML5 buffer", async () => {
    const pdfBuf = await createSamplePdfDocument();
    const htmlBuf = await convertPdfToHtml(pdfBuf, { title: "Whitepaper Sample" });

    assert.ok(htmlBuf && htmlBuf.length > 0, "Output HTML buffer must not be empty");
    const htmlString = htmlBuf.toString("utf-8");

    // HTML5 structure assertions
    assert.match(htmlString, /<!DOCTYPE html>/i, "Must have HTML5 DOCTYPE");
    assert.match(htmlString, /<meta charset="utf-8">/i, "Must declare UTF-8 charset");
    assert.match(htmlString, /<meta name="viewport"/i, "Must declare mobile viewport");
    assert.match(htmlString, /Whitepaper Sample/, "Must include safe document title");

    // SVG container assertions
    assert.match(htmlString, /<svg\b/i, "Must contain embedded SVG markup");
    assert.match(htmlString, /viewBox=/i, "SVG must have viewBox for responsive scaling");

    // Native selectable text assertions
    assert.match(htmlString, /<text\b/i, "Must contain native SVG <text> elements for selectability");
    assert.match(htmlString, /Architecture Whitepaper 2026/, "Page 1 title text must be present");
    assert.match(htmlString, /Performance (?:&amp;|&|&#x0026;) Benchmarking/, "Page 2 text must be present");

    // Multi-page wrapper assertions
    assert.match(htmlString, /class="pages-container"/, "Must contain pages-container wrapper");
    assert.match(htmlString, /id="page-1"/, "Must contain page-1 container");
    assert.match(htmlString, /id="page-2"/, "Must contain page-2 container");
  });

  it("rejects cleanly with a descriptive error when input buffer is empty", async () => {
    await assert.rejects(
      async () => {
        await convertPdfToHtml(Buffer.alloc(0));
      },
      {
        message: /invalid or empty/i,
      }
    );
  });

  it("rejects cleanly with a descriptive error when input buffer is corrupted", async () => {
    const corruptBuffer = Buffer.from("NOT_A_VALID_PDF_HEADER_CONTENT_AT_ALL");
    await assert.rejects(
      async () => {
        await convertPdfToHtml(corruptBuffer);
      },
      {
        message: /invalid or corrupt/i,
      }
    );
  });

  it("handlePdfToHtml returns 400 with INVALID_PDF for corrupted file upload", async () => {
    let statusCode = 0;
    let jsonPayload: any = null;

    const fakeReq: any = {
      file: {
        buffer: Buffer.from("CORRUPTED_GARBAGE"),
        originalname: "corrupt.pdf",
      },
    };

    const fakeRes: any = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonPayload = data;
        return this;
      },
      set() {
        return this;
      },
      send() {
        return this;
      },
    };

    await handlePdfToHtml(fakeReq, fakeRes);

    assert.equal(statusCode, 400, "Should respond with HTTP 400");
    assert.equal(jsonPayload?.code, "INVALID_PDF", "Should return INVALID_PDF error code");
  });

  it("handlePdfToHtml sends HTML with correct MIME type and Content-Disposition headers", async () => {
    const pdfBuf = await createSamplePdfDocument();
    let capturedHeaders: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const fakeReq: any = {
      file: {
        buffer: pdfBuf,
        originalname: "presentation doc.pdf",
      },
    };

    const fakeRes: any = {
      status() {
        return this;
      },
      json() {
        return this;
      },
      set(fieldOrHeaders: any, val?: any) {
        if (typeof fieldOrHeaders === "string") {
          capturedHeaders[fieldOrHeaders] = val;
        } else if (fieldOrHeaders && typeof fieldOrHeaders === "object") {
          capturedHeaders = { ...capturedHeaders, ...fieldOrHeaders };
        }
        return this;
      },
      send(data: Buffer) {
        sentBuffer = data;
        return this;
      },
    };

    await handlePdfToHtml(fakeReq, fakeRes);

    assert.ok(sentBuffer && (sentBuffer as Buffer).length > 0, "Sent buffer must not be empty");
    assert.equal(capturedHeaders["Content-Type"], HTML_MIME_TYPE, "Content-Type must be text/html; charset=utf-8");
    assert.match(
      capturedHeaders["Content-Disposition"] ?? "",
      /presentation%20doc\.html/,
      "Content-Disposition must contain properly encoded .html filename"
    );
  });

  it("executes inside an isolated workspace and cleans up temporary directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-html-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuf = await createSamplePdfDocument();
    const result = await convertPdfToHtml(pdfBuf, { pool: testPool });
    assert.ok(result.length > 0);

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned immediately upon success"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });

  it("cleans up isolated ephemeral workspace even if conversion fails", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-html-fail-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const badPdf = Buffer.from("%PDF-corrupted-stream-broken");

    await assert.rejects(async () => {
      await convertPdfToHtml(badPdf, { pool: testPool });
    });

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Ephemeral workspace directory must be cleaned up on failure"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });
});
