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
  compressPdf,
  handlePdfCompress,
  type CompressPdfOptions,
} from "./pdf-compress-handler.js";

async function createSamplePdf(withImages = false): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= 3; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`EverydayTools Compression Test - Page ${i}`, {
      x: 50,
      y: 800,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    for (let j = 0; j < 30; j++) {
      page.drawText(
        `Row ${j}: High-density document vector content stream for compression benchmarking and layout fidelity.`,
        { x: 50, y: 750 - j * 20, size: 10, font, color: rgb(0.2, 0.2, 0.2) }
      );
    }
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF Compress High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or non-PDF buffers with descriptive error", async () => {
    const emptyBuf = Buffer.alloc(0);
    await assert.rejects(
      async () => {
        await compressPdf(emptyBuf);
      },
      /invalid or empty pdf/i
    );

    const corruptBuf = Buffer.from("NOT_A_VALID_PDF_STREAM");
    await assert.rejects(
      async () => {
        await compressPdf(corruptBuf);
      },
      /invalid or corrupt pdf/i
    );
  });

  it("compresses a valid multi-page PDF and returns linearized buffer with accurate telemetry", async () => {
    const inputBuffer = await createSamplePdf();
    const result = await compressPdf(inputBuffer, { level: "recommended" });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.buffer.subarray(0, 4).toString(), "%PDF");
    assert.strictEqual(result.originalSize, inputBuffer.length);
    assert.ok(result.compressedSize <= result.originalSize);
    assert.ok(result.gain >= 0);
  });

  it("enforces strict non-regression: returns original buffer when compression expands file size", async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([200, 200]);
    page.drawText("Tiny", { x: 10, y: 100, size: 12 });
    doc.setTitle("");
    doc.setAuthor("");
    doc.setSubject("");
    doc.setKeywords([]);
    doc.setProducer("EverydayTools");
    doc.setCreator("EverydayTools");
    const tinyBuffer = Buffer.from(await doc.save({ useObjectStreams: true }));

    const result = await compressPdf(tinyBuffer, { level: "prepress" });

    assert.strictEqual(result.compressedSize, result.originalSize);
    assert.strictEqual(result.gain, 0);
    assert.strictEqual(result.buffer.length, tinyBuffer.length);
  });

  it("supports all standard compression presets: extreme, recommended, low, prepress", async () => {
    const inputBuffer = await createSamplePdf();

    for (const preset of ["extreme", "recommended", "low", "prepress"] as const) {
      const res = await compressPdf(inputBuffer, { level: preset });
      assert.ok(res.buffer instanceof Buffer);
      assert.ok(res.compressedSize <= res.originalSize);
    }
  });

  it("handlePdfCompress sets Content-Disposition and telemetry headers", async () => {
    const inputBuffer = await createSamplePdf();
    const headers: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const mockReq = {
      file: {
        buffer: inputBuffer,
        originalname: "financial-report.pdf",
      },
      body: {
        level: "recommended",
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

    await handlePdfCompress(mockReq, mockRes);

    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("financial-report_compressed.pdf"));
    assert.ok(headers["X-Original-Size"]);
    assert.ok(headers["X-Compressed-Size"]);
    assert.ok(headers["X-Compression-Gain"] !== undefined);
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Compression-Gain"));
    assert.ok(Buffer.isBuffer(sentBuffer));
  });

  it("handlePdfCompress returns 400 NO_FILE if no file is uploaded", async () => {
    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = { body: {} } as any;
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

    await handlePdfCompress(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "NO_FILE");
  });

  it("executes inside an isolated ProcessPool workspace and evicts temp directory", async () => {
    const inputBuffer = await createSamplePdf();
    const testTempDir = join(tmpdir(), "everydaytools-compress-test-" + randomUUID());
    const pool = new ProcessPool({
      concurrencyLimit: 2,
      baseTempDir: testTempDir,
    });

    try {
      const result = await compressPdf(inputBuffer, { level: "recommended", pool });
      assert.ok(result.buffer instanceof Buffer);

      const remainingDirs = existsSync(testTempDir) ? await readdir(testTempDir) : [];
      assert.strictEqual(remainingDirs.length, 0);
    } finally {
      await rm(testTempDir, {
        recursive: true,
        force: true,
      }).catch(() => {});
    }
  });
});
