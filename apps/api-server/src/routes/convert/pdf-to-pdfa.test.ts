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
  convertPdfToPdfa,
  handlePdfToPdfa,
} from "./pdf-to-pdfa-handler.js";

/**
 * Creates an in-memory test PDF with specified number of pages.
 */
async function createSamplePdf(pageCount = 1): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`Archival Test Document - Page ${i}`, {
      x: 50,
      y: 780,
      size: 20,
      font,
      color: rgb(0.1, 0.2, 0.4),
    });
    page.drawRectangle({
      x: 50,
      y: 300,
      width: 495,
      height: 350,
      borderColor: rgb(0.2, 0.6, 0.2),
      borderWidth: 2,
    });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF to PDF/A High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or non-PDF buffers with descriptive error", async () => {
    const emptyBuf = Buffer.alloc(0);
    await assert.rejects(
      async () => {
        await convertPdfToPdfa(emptyBuf);
      },
      /invalid or empty pdf/i
    );

    const corruptBuf = Buffer.from("NOT_A_PDF_DOCUMENT_CONTENT");
    await assert.rejects(
      async () => {
        await convertPdfToPdfa(corruptBuf);
      },
      /invalid or corrupt pdf/i
    );
  });

  it("converts a single-page PDF to ISO 19005-2 PDF/A-2b with valid XMP metadata", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await convertPdfToPdfa(pdfBuf, { conformance: "2b" });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.pageCount, 1);
    assert.equal(result.mimeType, "application/pdf");
    assert.equal(result.conformance, "2b");

    // Check %PDF- header
    const strHeader = result.buffer.subarray(0, 5).toString();
    assert.equal(strHeader, "%PDF-");

    // Check XMP pdfaid:part 2 marker
    const fullContent = result.buffer.toString("binary");
    assert.ok(
      fullContent.includes("pdfaid:part='2'") ||
      fullContent.includes('pdfaid:part="2"') ||
      fullContent.includes("<pdfaid:part>2</pdfaid:part>")
    );
    assert.ok(
      fullContent.includes("pdfaid:conformance='B'") ||
      fullContent.includes('pdfaid:conformance="B"') ||
      fullContent.includes("<pdfaid:conformance>B</pdfaid:conformance>")
    );
  });

  it("converts a PDF to ISO 19005-1 PDF/A-1b with valid XMP metadata", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await convertPdfToPdfa(pdfBuf, { conformance: "1b" });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.conformance, "1b");

    const fullContent = result.buffer.toString("binary");
    assert.ok(
      fullContent.includes("pdfaid:part='1'") ||
      fullContent.includes('pdfaid:part="1"') ||
      fullContent.includes("<pdfaid:part>1</pdfaid:part>")
    );
  });

  it("converts a multi-page PDF to PDF/A-3b preserving all pages", async () => {
    const pdfBuf = await createSamplePdf(3);
    const result = await convertPdfToPdfa(pdfBuf, { conformance: "3b" });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.pageCount, 3);
    assert.equal(result.conformance, "3b");

    const doc = await PDFDocument.load(result.buffer);
    assert.equal(doc.getPageCount(), 3);
  });

  it("handlePdfToPdfa responds with correct Content-Type and RFC 5987 Content-Disposition", async () => {
    const pdfBuf = await createSamplePdf(1);
    const capturedHeaders: Record<string, string> = {};
    let capturedBody: Buffer | null = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "dossier fiscal 2026.pdf",
      },
      body: {
        conformance: "2b",
      },
      headers: {},
    } as any;

    const res = {
      status() { return this; },
      set(headersOrKey: any, value?: string) {
        if (typeof headersOrKey === "object") {
          Object.assign(capturedHeaders, headersOrKey);
        } else if (value) {
          capturedHeaders[headersOrKey] = value;
        }
        return this;
      },
      send(data: Buffer) {
        capturedBody = data;
        return this;
      },
      json() { return this; },
    } as any;

    await handlePdfToPdfa(req, res);

    assert.equal(capturedHeaders["Content-Type"], "application/pdf");
    assert.match(
      capturedHeaders["Content-Disposition"] || "",
      /attachment;.*dossier fiscal 2026_pdfa2b\.pdf/i
    );
    assert.ok(capturedBody != null && (capturedBody as Buffer).length > 0);
  });

  it("ensures process isolation and cleans up ephemeral directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-pdfa-test-" + randomUUID());
    const customPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuf = await createSamplePdf(2);
    const result = await convertPdfToPdfa(pdfBuf, { pool: customPool });
    assert.ok(result.buffer.length > 0);

    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.deepStrictEqual(
      remaining,
      [],
      "Temporary workspace directory must be pruned immediately upon success"
    );
    await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
  });
});
