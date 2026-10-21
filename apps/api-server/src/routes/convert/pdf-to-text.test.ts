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
  convertPdfToText,
  handlePdfToText,
  TEXT_MIME_TYPE,
} from "./pdf-to-text-handler.js";

/**
 * Generates an in-memory 2-page test PDF document using pdf-lib.
 */
async function createSamplePdfDocument(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Page 1
  const page1 = doc.addPage([595.28, 841.89]);
  page1.drawText("Architecture Whitepaper 2026", {
    x: 50,
    y: 780,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page1.drawText("EverydayTools Hub High-Fidelity Text Engine", {
    x: 50,
    y: 740,
    size: 13,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Page 2
  const page2 = doc.addPage([595.28, 841.89]);
  page2.drawText("Second Page Appendix", {
    x: 50,
    y: 780,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page2.drawText("Technical details regarding multi-column parsing.", {
    x: 50,
    y: 740,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF to Text High-Fidelity Engine & Handler (TDD)", () => {
  it("rejects empty or non-PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await convertPdfToText(Buffer.alloc(0));
      },
      /Invalid or empty PDF input buffer/i
    );

    await assert.rejects(
      async () => {
        await convertPdfToText(Buffer.from("THIS_IS_NOT_A_VALID_PDF_BUFFER"));
      },
      /Invalid or corrupt PDF header/i
    );
  });

  it("converts a valid multi-page PDF into clean UTF-8 text with de-hyphenation and column sorting", async () => {
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const page = doc.addPage([595.28, 841.89]);

    // Paragraph with word hyphenated across line break within a block
    page.drawText("This text has de-hyphen-\nation tested cleanly.", {
      x: 50,
      y: 750,
      size: 12,
      font,
      lineHeight: 14,
    });

    // Second column / sidebar
    page.drawText("Column Two Sidebar Notes", {
      x: 320,
      y: 750,
      size: 12,
      font,
    });

    const pdfBuf = Buffer.from(await doc.save());

    const result = await convertPdfToText(pdfBuf);
    const text = result.toString("utf-8");
    assert.match(text, /de-hyphenation/i, "Hyphenated word across line break must be rejoined");
    assert.match(text, /Column Two Sidebar Notes/i);
    assert.ok(
      text.indexOf("de-hyphenation") < text.indexOf("Column Two Sidebar Notes"),
      "Column 1 content must precede Column 2 in reading order"
    );
  });

  it("handlePdfToText sets Content-Disposition and text/plain MIME type by default", async () => {
    const pdfBuf = await createSamplePdfDocument();
    const capturedHeaders: Record<string, string> = {};
    let capturedBody: Buffer | null = null;
    let capturedStatus: number | null = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "analysis whitepaper.pdf",
      },
      headers: {},
    } as any;

    const res = {
      status(code: number) {
        capturedStatus = code;
        return this;
      },
      set(key: string, value: string) {
        capturedHeaders[key] = value;
        return this;
      },
      setHeader(key: string, value: string) {
        capturedHeaders[key] = value;
        return this;
      },
      send(data: Buffer) {
        capturedBody = data;
        return this;
      },
      json() {
        return this;
      },
    } as any;

    await handlePdfToText(req, res);

    assert.ok(capturedBody !== null, "Body must be returned");
    assert.equal(capturedHeaders["Content-Type"], TEXT_MIME_TYPE, "Content-Type must be text/plain; charset=utf-8");
    assert.match(
      capturedHeaders["Content-Disposition"] ?? "",
      /analysis%20whitepaper\.txt/,
      "Content-Disposition must contain properly encoded .txt filename"
    );
  });

  it("handlePdfToText supports Accept: application/json for backward compatibility", async () => {
    const pdfBuf = await createSamplePdfDocument();
    let jsonResult: any = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "report.pdf",
      },
      headers: {
        accept: "application/json",
      },
    } as any;

    const res = {
      status() { return this; },
      set() { return this; },
      setHeader() { return this; },
      send() { return this; },
      json(data: any) {
        jsonResult = data;
        return this;
      },
    } as any;

    await handlePdfToText(req, res);

    assert.ok(jsonResult !== null, "jsonResult must be populated");
    assert.equal(typeof jsonResult.text, "string");
    assert.match(jsonResult.text, /Architecture Whitepaper 2026/);
  });

  it("handlePdfToText returns 400 NO_FILE if no file is uploaded", async () => {
    let statusCode = 200;
    let jsonPayload: any = null;

    const req = { headers: {} } as any;
    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonPayload = data;
        return this;
      },
    } as any;

    await handlePdfToText(req, res);

    assert.equal(statusCode, 400);
    assert.equal(jsonPayload?.code, "NO_FILE");
  });

  it("handlePdfToText returns 400 INVALID_PDF on corrupt or invalid PDF input", async () => {
    let statusCode = 200;
    let jsonPayload: any = null;

    const req = {
      file: {
        buffer: Buffer.from("%PDF-corrupted-stream-failure"),
        originalname: "damaged.pdf",
      },
      headers: {},
    } as any;

    const res = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonPayload = data;
        return this;
      },
    } as any;

    await handlePdfToText(req, res);

    assert.equal(statusCode, 400);
    assert.equal(jsonPayload?.code, "INVALID_PDF");
  });

  it("executes inside an isolated workspace and cleans up temporary directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-text-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuf = await createSamplePdfDocument();
    const result = await convertPdfToText(pdfBuf, { pool: testPool });
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
    const testTempDir = join(tmpdir(), "everydaytools-text-fail-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const badPdf = Buffer.from("%PDF-corrupted-stream-broken");

    await assert.rejects(async () => {
      await convertPdfToText(badPdf, { pool: testPool });
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
