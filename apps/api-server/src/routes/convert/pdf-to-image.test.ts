import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { unzipSync } from "fflate";
import { ProcessPool } from "../../lib/process-pool.js";
import {
  convertPdfToImage,
  handlePdfToImage,
} from "./pdf-to-image-handler.js";

/**
 * Creates an in-memory test PDF with specified number of pages.
 */
async function createSamplePdf(pageCount = 1): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`High-Resolution Test Document - Page ${i}`, {
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
      borderColor: rgb(0.8, 0.2, 0.2),
      borderWidth: 2,
    });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF to Image High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or non-PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await convertPdfToImage(Buffer.alloc(0));
      },
      /Invalid or empty PDF input buffer/i
    );

    await assert.rejects(
      async () => {
        await convertPdfToImage(Buffer.from("NOT_A_VALID_PDF_STREAM"));
      },
      /Invalid or corrupt PDF header/i
    );
  });

  it("converts a single-page PDF to PNG with valid magic bytes", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await convertPdfToImage(pdfBuf, { format: "png", dpi: 150 });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.isArchive, false);
    assert.equal(result.mimeType, "image/png");
    assert.equal(result.extension, "png");

    // Verify PNG magic signature \x89PNG\r\n\x1a\n
    assert.equal(result.buffer[0], 0x89);
    assert.equal(result.buffer[1], 0x50); // 'P'
    assert.equal(result.buffer[2], 0x4e); // 'N'
    assert.equal(result.buffer[3], 0x47); // 'G'
  });

  it("converts a single-page PDF to JPEG with valid SOI marker", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await convertPdfToImage(pdfBuf, { format: "jpeg", dpi: 150 });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.isArchive, false);
    assert.equal(result.mimeType, "image/jpeg");
    assert.equal(result.extension, "jpeg");

    // Verify JPEG SOI marker 0xFF 0xD8
    assert.equal(result.buffer[0], 0xff);
    assert.equal(result.buffer[1], 0xd8);
  });

  it("converts a single-page PDF to WebP with valid RIFF/WEBP magic header", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await convertPdfToImage(pdfBuf, { format: "webp", dpi: 150 });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.isArchive, false);
    assert.equal(result.mimeType, "image/webp");
    assert.equal(result.extension, "webp");

    // Verify WebP magic header RIFF....WEBP
    assert.equal(result.buffer.subarray(0, 4).toString(), "RIFF");
    assert.equal(result.buffer.subarray(8, 12).toString(), "WEBP");
  });

  it("converts a multi-page PDF to a ZIP archive containing individual page images", async () => {
    const pdfBuf = await createSamplePdf(3);
    const result = await convertPdfToImage(pdfBuf, { format: "png", dpi: 150 });

    assert.ok(result.buffer && result.buffer.length > 0);
    assert.equal(result.isArchive, true);
    assert.equal(result.mimeType, "application/zip");
    assert.equal(result.extension, "zip");

    // Verify ZIP magic PK\x03\x04
    assert.equal(result.buffer[0], 0x50);
    assert.equal(result.buffer[1], 0x4b);

    // Unzip and inspect entries
    const unzipped = unzipSync(new Uint8Array(result.buffer));
    const entries = Object.keys(unzipped).sort();

    assert.equal(entries.length, 3, "ZIP must contain 3 page images");
    assert.ok(entries.includes("page_001.png"));
    assert.ok(entries.includes("page_002.png"));
    assert.ok(entries.includes("page_003.png"));
  });

  it("handlePdfToImage responds with correct Content-Type and Content-Disposition", async () => {
    const pdfBuf = await createSamplePdf(1);
    const capturedHeaders: Record<string, string> = {};
    let capturedBody: Buffer | null = null;

    const req = {
      file: {
        buffer: pdfBuf,
        originalname: "presentation chart.pdf",
      },
      body: {
        format: "png",
        dpi: "150",
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

    await handlePdfToImage(req, res);

    assert.equal(capturedHeaders["Content-Type"], "image/png");
    assert.match(
      capturedHeaders["Content-Disposition"] || "",
      /attachment;\s*filename="presentation chart\.png"/i
    );
    assert.ok(capturedBody != null && (capturedBody as Buffer).length > 0);
  });

  it("ensures process isolation and cleans up ephemeral directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-img-test-" + randomUUID());
    const customPool = new ProcessPool({ baseTempDir: testTempDir });

    const pdfBuf = await createSamplePdf(2);
    const result = await convertPdfToImage(pdfBuf, { pool: customPool });
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
