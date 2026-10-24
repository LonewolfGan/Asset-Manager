import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ProcessPool } from "../../lib/process-pool.js";
import {
  splitPdf,
  handlePdfSplit,
  type SplitPdfHandlerOptions,
} from "./pdf-split-handler.js";

async function createSamplePdf(pageCount = 4): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`Page ${i} - PDF Split Test Document`, {
      x: 50,
      y: 800,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }

  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF Split High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers with descriptive error", async () => {
    const emptyBuf = Buffer.alloc(0);
    await assert.rejects(
      async () => {
        await splitPdf(emptyBuf, { mode: "extract", pages: [1] });
      },
      /invalid or empty/i
    );

    const corruptBuf = Buffer.from("NOT_A_VALID_PDF_STREAM");
    await assert.rejects(
      async () => {
        await splitPdf(corruptBuf, { mode: "extract", pages: [1] });
      },
      /invalid or corrupt/i
    );
  });

  it("extracts specific page range into a single merged PDF when mergeOutput is true", async () => {
    const pdfBuf = await createSamplePdf(5);
    const result = await splitPdf(pdfBuf, {
      mode: "range",
      ranges: "1-2, 4",
      mergeOutput: true,
    });

    assert.ok(Buffer.isBuffer(result.buffer));
    assert.strictEqual(result.isZip, false);
    assert.strictEqual(result.buffer.subarray(0, 4).toString(), "%PDF");
    assert.strictEqual(result.pageCount, 3);
  });

  it("splits pages into individual files inside a ZIP archive", async () => {
    const pdfBuf = await createSamplePdf(3);
    const result = await splitPdf(pdfBuf, {
      mode: "every",
    });

    assert.ok(Buffer.isBuffer(result.buffer));
    assert.strictEqual(result.isZip, true);
    // PK magic bytes for ZIP: 0x50, 0x4B
    assert.strictEqual(result.buffer[0], 0x50);
    assert.strictEqual(result.buffer[1], 0x4b);
    assert.strictEqual(result.segmentCount, 3);
  });

  it("executes inside an isolated ProcessPool workspace and evicts temp directory", async () => {
    const testTempDir = join(tmpdir(), `test-split-pool-${randomUUID()}`);
    const pool = new ProcessPool({
      concurrencyLimit: 1,
      defaultTimeoutMs: 15000,
      baseTempDir: testTempDir,
    });

    const pdfBuf = await createSamplePdf(3);
    const result = await pool.run(async (ctx) => {
      assert.ok(existsSync(ctx.workspaceDir));
      return await splitPdf(pdfBuf, { mode: "range", ranges: "1-2", mergeOutput: true, workDir: ctx.workspaceDir });
    });

    assert.ok(result.buffer.length > 0);
    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.strictEqual(remaining.length, 0);
  });

  it("handlePdfSplit sets Content-Disposition and telemetry headers", async () => {
    const pdfBuf = await createSamplePdf(4);

    let sentBuffer: Buffer | null = null;
    const headers: Record<string, string> = {};

    const req = {
      file: { buffer: pdfBuf, originalname: "report.pdf" },
      body: { mode: "range", ranges: "1-2", merge: "true" },
    } as any;

    const res = {
      set(newHeaders: Record<string, string>) {
        Object.assign(headers, newHeaders);
        return res;
      },
      send(buf: Buffer) {
        sentBuffer = buf;
        return res;
      },
    } as any;

    await handlePdfSplit(req, res);

    assert.ok(Buffer.isBuffer(sentBuffer));
    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("report_extracted.pdf"));
    assert.strictEqual(headers["X-Is-Zip"], "false");
  });

  it("handlePdfSplit returns 400 NO_FILE if no file uploaded", async () => {
    let statusCode = 0;
    let jsonBody: any = null;

    const req = { file: undefined, body: {} } as any;
    const res = {
      status(code: number) {
        statusCode = code;
        return res;
      },
      json(body: any) {
        jsonBody = body;
        return res;
      },
    } as any;

    await handlePdfSplit(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody?.code, "NO_FILE");
  });
});
