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
  convertPdfToMarkdown,
  handlePdfToMarkdown,
  MARKDOWN_MIME_TYPE,
} from "./pdf-to-markdown-handler.js";

/**
 * Generates an in-memory 2-page test PDF document using pdf-lib.
 */
async function createSamplePdfDocument(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Page 1: Header and list items
  const page1 = doc.addPage([595.28, 841.89]);
  page1.drawText("Architecture Whitepaper 2026", {
    x: 50,
    y: 780,
    size: 24,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page1.drawText("EverydayTools Hub High-Fidelity Markdown Engine", {
    x: 50,
    y: 740,
    size: 13,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
  page1.drawText("- High-throughput Markdown generation", {
    x: 50,
    y: 710,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });
  page1.drawText("- Structural table and hierarchy preservation", {
    x: 50,
    y: 690,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  // Page 2: Sub-section and details
  const page2 = doc.addPage([595.28, 841.89]);
  page2.drawText("Section 2: Engine Specifications", {
    x: 50,
    y: 780,
    size: 18,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
  });
  page2.drawText("Preserves GFM tables, headings (#), lists, and formatting.", {
    x: 50,
    y: 740,
    size: 12,
    font,
    color: rgb(0.2, 0.2, 0.2),
  });

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF to Markdown High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or non-PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await convertPdfToMarkdown(Buffer.alloc(0));
      },
      /Invalid or empty PDF input buffer/i
    );

    await assert.rejects(
      async () => {
        await convertPdfToMarkdown(Buffer.from("THIS_IS_NOT_A_VALID_PDF_BUFFER"));
      },
      /Invalid or corrupt PDF header/i
    );
  });

  it("converts a valid multi-page PDF into clean UTF-8 Markdown content with headers and lists", async () => {
    const pdfBuf = await createSamplePdfDocument();
    const result = await convertPdfToMarkdown(pdfBuf);

    assert.ok(result && result.length > 0, "Output Markdown buffer must not be empty");
    const markdown = result.toString("utf-8");

    // Markdown syntax assertions
    assert.match(markdown, /(#\s+|Architecture Whitepaper)/i, "Must contain heading markup or title");
    assert.match(markdown, /Engine Specifications/i, "Must extract second-page section title");
    assert.match(markdown, /(-|\*|Preserves)/i, "Must preserve list or structural text formatting");
  });

  it("handlePdfToMarkdown sets Content-Type text/markdown; charset=utf-8 and RFC 5987 Content-Disposition", async () => {
    const pdfBuf = await createSamplePdfDocument();
    const capturedHeaders: Record<string, string> = {};
    let capturedBody: Buffer | null = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "analysis report 2026.pdf",
      },
      headers: {},
    } as any;

    const res = {
      status() { return this; },
      set(key: string, value: string) {
        capturedHeaders[key] = value;
        return this;
      },
      send(data: Buffer) {
        capturedBody = data;
        return this;
      },
      json() { return this; },
    } as any;

    await handlePdfToMarkdown(req, res);

    assert.ok(capturedBody !== null, "Body must be returned");
    assert.equal(
      capturedHeaders["Content-Type"],
      MARKDOWN_MIME_TYPE,
      "Content-Type must be text/markdown; charset=utf-8"
    );
    assert.match(
      capturedHeaders["Content-Disposition"] ?? "",
      /analysis%20report%202026\.md/,
      "Content-Disposition must contain URL-encoded .md filename"
    );
    assert.match(
      capturedHeaders["Content-Disposition"] ?? "",
      /filename\*=UTF-8''/,
      "Content-Disposition must satisfy RFC 5987 filename* encoding"
    );
  });

  it("handlePdfToMarkdown with Accept: application/json returns JSON object { markdown: string }", async () => {
    const pdfBuf = await createSamplePdfDocument();
    let jsonResult: any = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "spec.pdf",
      },
      headers: {
        accept: "application/json",
      },
    } as any;

    const res = {
      status() { return this; },
      set() { return this; },
      send() { return this; },
      json(data: any) {
        jsonResult = data;
        return this;
      },
    } as any;

    await handlePdfToMarkdown(req, res);

    assert.ok(jsonResult !== null, "jsonResult must be populated");
    assert.equal(typeof jsonResult.markdown, "string", "JSON payload must have markdown string");
    assert.match(jsonResult.markdown, /Architecture Whitepaper 2026/);
  });

  it("handlePdfToMarkdown returns 400 NO_FILE if req.file is missing", async () => {
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

    await handlePdfToMarkdown(req, res);

    assert.equal(statusCode, 400);
    assert.equal(jsonPayload?.code, "NO_FILE");
  });

  it("handlePdfToMarkdown returns 400 INVALID_PDF if buffer does not have %PDF- header", async () => {
    let statusCode = 200;
    let jsonPayload: any = null;

    const req = {
      file: {
        buffer: Buffer.from("NOT_A_VALID_PDF_HEADER_CONTENT"),
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

    await handlePdfToMarkdown(req, res);

    assert.equal(statusCode, 400);
    assert.equal(jsonPayload?.code, "INVALID_PDF");
  });

  it("executes inside an isolated workspace and cleans up temporary directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-md-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuf = await createSamplePdfDocument();
    const result = await convertPdfToMarkdown(pdfBuf, { pool: testPool });
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
    const testTempDir = join(tmpdir(), "everydaytools-md-fail-test-" + randomUUID());
    const testPool = new ProcessPool({ baseTempDir: testTempDir });

    const badPdf = Buffer.from("%PDF-corrupted-stream-broken");

    await assert.rejects(async () => {
      await convertPdfToMarkdown(badPdf, { pool: testPool });
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
