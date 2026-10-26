import { describe, it } from "node:test";
// TDD RED Phase: pdf-page-numbers-handler tests
import assert from "node:assert/strict";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
import { ProcessPool } from "../../lib/process-pool.js";
import {
  addPageNumbers,
  handlePdfPageNumbers,
  type PageNumbersOptions,
  type PageNumbersResult,
} from "./pdf-page-numbers-handler.js";

async function createSamplePdf(pageCount = 3, rotated = false): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    if (rotated && i === 2) {
      page.setRotation(degrees(90));
    } else if (rotated && i === 3) {
      page.setRotation(degrees(180));
    }
    page.drawText(`Page Numbers Test Document - Page ${i}`, {
      x: 50,
      y: 780,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
  }
  return Buffer.from(await doc.save());
}

describe("PDF Page Numbers High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers missing %PDF- header", async () => {
    await assert.rejects(
      async () => {
        await addPageNumbers(Buffer.alloc(0), { position: "bottom-center" });
      },
      /invalid or empty pdf/i
    );

    await assert.rejects(
      async () => {
        await addPageNumbers(Buffer.from("NOT_A_PDF_STREAM"), { position: "bottom-center" });
      },
      /invalid or corrupt/i
    );
  });

  it("successfully numbers pages across all 6 canonical positions", async () => {
    const positions: NonNullable<PageNumbersOptions["position"]>[] = [
      "bottom-center",
      "bottom-left",
      "bottom-right",
      "top-center",
      "top-left",
      "top-right",
    ];

    const pdfBuf = await createSamplePdf(2);

    for (const position of positions) {
      const result: PageNumbersResult = await addPageNumbers(pdfBuf, {
        position,
        format: "{n}/{total}",
      });

      assert.ok(result.buffer instanceof Buffer);
      assert.strictEqual(result.buffer.subarray(0, 4).toString(), "%PDF");
      assert.strictEqual(result.pageCount, 2);
      assert.strictEqual(result.numberedCount, 2);
      assert.strictEqual(result.isLinearized, true);
    }
  });

  it("supports multiple pagination formats including roman numerals", async () => {
    const pdfBuf = await createSamplePdf(3);

    const formats = [
      "{n}",
      "{n}/{total}",
      "Page {n} of {total}",
      "{roman}",
      "{ROMAN}",
    ];

    for (const format of formats) {
      const result = await addPageNumbers(pdfBuf, {
        format,
        position: "bottom-center",
      });
      assert.ok(result.buffer instanceof Buffer);
      assert.strictEqual(result.pageCount, 3);
      assert.strictEqual(result.numberedCount, 3);
    }
  });

  it("supports skipFirst: true to exclude cover page from numbering", async () => {
    const pdfBuf = await createSamplePdf(3);
    const result = await addPageNumbers(pdfBuf, {
      skipFirst: true,
      format: "{n}/{total}",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.pageCount, 3);
    assert.strictEqual(result.numberedCount, 2);
  });

  it("supports custom startFrom offset for chapters and continuous pagination", async () => {
    const pdfBuf = await createSamplePdf(2);
    const result = await addPageNumbers(pdfBuf, {
      startFrom: 5,
      format: "Page {n}",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.numberedCount, 2);
  });

  it("respects page rotation (/Rotate 90, 180, 270) without coordinate corruption", async () => {
    const pdfBuf = await createSamplePdf(3, true);
    const result = await addPageNumbers(pdfBuf, {
      position: "bottom-right",
      format: "{n}",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.pageCount, 3);

    const loadedDoc = await PDFDocument.load(result.buffer);
    assert.strictEqual(loadedDoc.getPage(0).getRotation().angle, 0);
    assert.strictEqual(loadedDoc.getPage(1).getRotation().angle, 90);
    assert.strictEqual(loadedDoc.getPage(2).getRotation().angle, 180);
  });

  it("operates under ProcessPool isolation with ephemeral directory eviction", async () => {
    const pdfBuf = await createSamplePdf(1);
    const testTempDir = join(tmpdir(), "everydaytools-page-numbers-test-" + randomUUID());
    const pool = new ProcessPool({
      concurrencyLimit: 2,
      baseTempDir: testTempDir,
    });

    try {
      const result = await addPageNumbers(pdfBuf, {
        position: "bottom-center",
        pool,
      });
      assert.ok(result.buffer instanceof Buffer);

      const remainingDirs = existsSync(testTempDir) ? await readdir(testTempDir) : [];
      assert.strictEqual(remainingDirs.length, 0);
    } finally {
      await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("handlePdfPageNumbers sets telemetry headers and Content-Disposition", async () => {
    const pdfBuf = await createSamplePdf(2);
    const headers: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const mockReq = {
      file: {
        buffer: pdfBuf,
        originalname: "annual-report.pdf",
      },
      body: {
        position: "bottom-center",
        format: "{n} / {total}",
        startFrom: "1",
        skipFirst: "false",
        fontSize: "11",
        margin: "36",
        color: "#000000",
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

    await handlePdfPageNumbers(mockReq, mockRes);

    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("annual-report_numbered.pdf"));
    assert.strictEqual(headers["X-Page-Count"], "2");
    assert.strictEqual(headers["X-Numbered-Pages-Count"], "2");
    assert.strictEqual(headers["X-Linearized"], "true");
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Page-Count"));
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Numbered-Pages-Count"));
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Linearized"));
    assert.ok(Buffer.isBuffer(sentBuffer));
  });

  it("handlePdfPageNumbers returns 400 NO_FILE if no file uploaded", async () => {
    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = { body: { position: "bottom-center" } } as any;
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

    await handlePdfPageNumbers(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "NO_FILE");
  });
});
