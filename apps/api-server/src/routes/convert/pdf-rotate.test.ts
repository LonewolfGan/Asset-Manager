import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ProcessPool } from "../../lib/process-pool.js";
import { rotatePdf, handlePdfRotate } from "./pdf-rotate-handler.js";

async function createSamplePdf(pageCount = 3): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`Page ${i} - PDF Rotate Test Document`, {
      x: 50,
      y: 800,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }
  return Buffer.from(await doc.save());
}

describe("PDF Rotate High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => { await rotatePdf(Buffer.alloc(0), { rotationDeg: 90 }); },
      /invalid or empty/i
    );
    await assert.rejects(
      async () => { await rotatePdf(Buffer.from("NOT_A_VALID_PDF_STREAM"), { rotationDeg: 90 }); },
      /invalid or corrupt/i
    );
  });

  it("performs uniform global rotation across all pages", async () => {
    const pdfBuf = await createSamplePdf(3);
    for (const deg of [90, 180, 270] as const) {
      const res = await rotatePdf(pdfBuf, { rotationDeg: deg });
      assert.strictEqual(res.buffer.subarray(0, 4).toString(), "%PDF");
      assert.strictEqual(res.pageCount, 3);
      assert.strictEqual(res.rotatedCount, 3);

      const doc = await PDFDocument.load(res.buffer);
      for (const page of doc.getPages()) {
        assert.strictEqual(page.getRotation().angle, deg);
      }
    }
  });

  it("performs selective per-page rotation with custom angles", async () => {
    const pdfBuf = await createSamplePdf(3);
    const res = await rotatePdf(pdfBuf, {
      perPageRotations: { 0: 90, 2: 180 },
    });

    assert.strictEqual(res.pageCount, 3);
    assert.strictEqual(res.rotatedCount, 2);

    const doc = await PDFDocument.load(res.buffer);
    const pages = doc.getPages();
    assert.strictEqual(pages[0].getRotation().angle, 90);
    assert.strictEqual(pages[1].getRotation().angle, 0);
    assert.strictEqual(pages[2].getRotation().angle, 180);
  });

  it("executes inside an isolated ProcessPool workspace and evicts temp directory", async () => {
    const testTempDir = join(tmpdir(), `test-rotate-pool-${randomUUID()}`);
    const pool = new ProcessPool({
      concurrencyLimit: 1,
      defaultTimeoutMs: 15000,
      baseTempDir: testTempDir,
    });

    const pdfBuf = await createSamplePdf(2);
    const result = await pool.run(async (ctx) => {
      assert.ok(existsSync(ctx.workspaceDir));
      return await rotatePdf(pdfBuf, { rotationDeg: 90, workDir: ctx.workspaceDir });
    });

    assert.ok(result.buffer.length > 0);
    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.strictEqual(remaining.length, 0);
  });

  it("handlePdfRotate sets Content-Disposition and telemetry headers", async () => {
    const pdfBuf = await createSamplePdf(3);
    let sentBuffer: Buffer | null = null;
    const headers: Record<string, string> = {};

    const req = {
      file: { buffer: pdfBuf, originalname: "contracts.pdf" },
      body: { rotation: "90" },
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

    await handlePdfRotate(req, res);

    assert.ok(Buffer.isBuffer(sentBuffer));
    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("contracts_rotated.pdf"));
    assert.strictEqual(headers["X-Page-Count"], "3");
    assert.strictEqual(headers["X-Rotated-Count"], "3");
    assert.ok(headers["Access-Control-Expose-Headers"]?.includes("X-Rotated-Count"));
  });

  it("handlePdfRotate correctly counts partial pages filter (e.g. pages: '1')", async () => {
    const multiPdf = await createSamplePdf(3);
    const headers: Record<string, string> = {};

    const req = {
      file: {
        buffer: multiPdf,
        originalname: "test.pdf",
      },
      body: {
        rotationDeg: "90",
        pages: "1",
      },
    } as any;

    const res = {
      set(newHeaders: Record<string, string>) {
        Object.assign(headers, newHeaders);
        return res;
      },
      send() {
        return res;
      },
    } as any;

    await handlePdfRotate(req, res);
    assert.strictEqual(headers["X-Page-Count"], "3");
    assert.strictEqual(headers["X-Rotated-Count"], "1");
  });

  it("handlePdfRotate returns 400 NO_FILE if no file uploaded", async () => {
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

    await handlePdfRotate(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody?.code, "NO_FILE");
  });
});
