import { describe, it } from "node:test";
// TDD GREEN: pdf-watermark-handler tests
import assert from "node:assert/strict";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ProcessPool } from "../../lib/process-pool.js";
import {
  applyWatermark,
  handlePdfWatermark,
  type WatermarkOptions,
  type WatermarkResult,
} from "./pdf-watermark-handler.js";

async function createSamplePdf(pageCount = 2): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`PDF Watermark Test Document - Page ${i}`, {
      x: 50,
      y: 800,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(
      "Classified document payload for watermark rendering benchmarking.",
      { x: 50, y: 750, size: 11, font, color: rgb(0.3, 0.3, 0.3) }
    );
  }
  return Buffer.from(await doc.save());
}

// 1x1 transparent PNG sample for image watermarking tests
const samplePngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";
const samplePngBuffer = Buffer.from(samplePngBase64, "base64");

describe("PDF Watermark High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await applyWatermark(Buffer.alloc(0), { text: "CONFIDENTIAL" });
      },
      /invalid or empty pdf/i
    );

    await assert.rejects(
      async () => {
        await applyWatermark(Buffer.from("NOT_A_PDF_BUFFER"), { text: "CONFIDENTIAL" });
      },
      /invalid or corrupt/i
    );
  });

  it("rejects when neither text nor image is provided (EMPTY_WATERMARK)", async () => {
    const pdfBuf = await createSamplePdf();
    await assert.rejects(
      async () => {
        await applyWatermark(pdfBuf, { text: "   " });
      },
      /empty.*watermark|neither text nor image/i
    );
  });

  it("clamps and normalizes opacity cleanly (< 0 or > 1)", async () => {
    const pdfBuf = await createSamplePdf(1);
    const resultLow = await applyWatermark(pdfBuf, {
      text: "LOW OPACITY",
      opacity: -0.5,
    });
    assert.ok(resultLow.buffer instanceof Buffer);
    assert.strictEqual(resultLow.watermarkType, "text");

    const resultHigh = await applyWatermark(pdfBuf, {
      text: "HIGH OPACITY",
      opacity: 2.5,
    });
    assert.ok(resultHigh.buffer instanceof Buffer);
  });

  it("sanitizes WinAnsi characters safely without crashing on emojis", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await applyWatermark(pdfBuf, {
      text: "CONFIDENTIAL 🔒 Top Secret 🚀",
      opacity: 0.3,
    });
    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.buffer.subarray(0, 4).toString(), "%PDF");
  });

  it("successfully applies centered diagonal text watermark (45 deg) with opacity", async () => {
    const pdfBuf = await createSamplePdf(2);
    const result: WatermarkResult = await applyWatermark(pdfBuf, {
      text: "CONFIDENTIAL",
      fontSize: 48,
      angle: 45,
      opacity: 0.35,
      color: "#FF0000",
      pattern: "single",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.watermarkType, "text");
    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.isLinearized, true);
    assert.ok(result.watermarkedSize > 0);
  });

  it("successfully applies repeated/tiled text watermark pattern across pages", async () => {
    const pdfBuf = await createSamplePdf(2);
    const result = await applyWatermark(pdfBuf, {
      text: "DRAFT REPEAT",
      pattern: "repeat",
      fontSize: 32,
      opacity: 0.2,
      angle: 45,
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.watermarkType, "text");
    assert.strictEqual(result.pageCount, 2);
  });

  it("successfully applies watermark to selective pages only", async () => {
    const pdfBuf = await createSamplePdf(3);
    const result = await applyWatermark(pdfBuf, {
      text: "PAGE 1 ONLY",
      pages: "1",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.pageCount, 3);
  });

  it("successfully applies image watermark with PNG buffer", async () => {
    const pdfBuf = await createSamplePdf(1);
    const result = await applyWatermark(pdfBuf, {
      imageBuffer: samplePngBuffer,
      imageMime: "image/png",
      opacity: 0.5,
      position: "center",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.watermarkType, "image");
    assert.strictEqual(result.pageCount, 1);
  });

  it("operates under ProcessPool isolation with ephemeral directory eviction", async () => {
    const pdfBuf = await createSamplePdf(1);
    const testTempDir = join(tmpdir(), "everydaytools-watermark-test-" + randomUUID());
    const pool = new ProcessPool({
      concurrencyLimit: 2,
      baseTempDir: testTempDir,
    });

    try {
      const result = await applyWatermark(pdfBuf, {
        text: "ISOLATED POOL",
        pool,
      });
      assert.ok(result.buffer instanceof Buffer);

      const remainingDirs = existsSync(testTempDir) ? await readdir(testTempDir) : [];
      assert.strictEqual(remainingDirs.length, 0);
    } finally {
      await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("handlePdfWatermark sets telemetry headers and Content-Disposition", async () => {
    const pdfBuf = await createSamplePdf(2);
    const headers: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const mockReq = {
      file: {
        buffer: pdfBuf,
        originalname: "financial-report.pdf",
      },
      body: {
        text: "CONFIDENTIAL",
        fontSize: "48",
        opacity: "0.3",
        angle: "45",
        color: "#EC1C24",
        pattern: "single",
        pages: "all",
      },
    } as any;

    const mockRes = {
      set(newHeaders: Record<string, string>) {
        Object.assign(headers, newHeaders);
        return mockRes;
      },
      send(buf: Buffer) {
        sentBuffer = buf;
        return mockRes;
      },
    } as any;

    await handlePdfWatermark(mockReq, mockRes);

    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("financial-report_watermarked.pdf"));
    assert.strictEqual(headers["X-Watermark-Type"], "text");
    assert.strictEqual(headers["X-Page-Count"], "2");
    assert.strictEqual(headers["X-Linearized"], "true");
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Watermark-Type"));
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Page-Count"));
    assert.ok(Buffer.isBuffer(sentBuffer));
  });

  it("handlePdfWatermark returns 400 NO_FILE if no file uploaded", async () => {
    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = { body: { text: "WATERMARK" } } as any;
    const mockRes = {
      status(code: number) {
        statusCode = code;
        return {
          json(payload: any) {
            errorCode = payload.code ?? payload.error;
          },
        };
      },
    } as any;

    await handlePdfWatermark(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "NO_FILE");
  });

  it("handlePdfWatermark returns 400 EMPTY_WATERMARK when parameters are blank", async () => {
    const pdfBuf = await createSamplePdf(1);
    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = {
      file: { buffer: pdfBuf, originalname: "sample.pdf" },
      body: { text: "" },
    } as any;
    const mockRes = {
      status(code: number) {
        statusCode = code;
        return {
          json(payload: any) {
            errorCode = payload.code ?? payload.error;
          },
        };
      },
    } as any;

    await handlePdfWatermark(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "EMPTY_WATERMARK");
  });
});
