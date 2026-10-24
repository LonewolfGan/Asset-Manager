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
  protectPdf,
  handlePdfProtect,
  type ProtectPdfOptions,
} from "./pdf-protect-handler.js";

async function createSamplePdf(pageCount = 2): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);

  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`EverydayTools PDF Protect Test - Page ${i}`, {
      x: 50,
      y: 800,
      size: 16,
      font,
      color: rgb(0.1, 0.1, 0.1),
    });
    page.drawText(
      "Classified document payload for AES-256 cryptographic protection benchmarking.",
      { x: 50, y: 750, size: 11, font, color: rgb(0.3, 0.3, 0.3) }
    );
  }

  return Buffer.from(await doc.save());
}

describe("PDF Protect High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await protectPdf(Buffer.alloc(0), { userPassword: "pass" });
      },
      /invalid or empty pdf/i
    );

    await assert.rejects(
      async () => {
        await protectPdf(Buffer.from("NOT_A_PDF"), { userPassword: "pass" });
      },
      /invalid or corrupt/i
    );
  });

  it("rejects when no passwords are provided", async () => {
    const pdfBuf = await createSamplePdf();
    await assert.rejects(
      async () => {
        await protectPdf(pdfBuf, { userPassword: "", ownerPassword: "" });
      },
      /at least one password/i
    );
  });

  it("rejects when userPassword and ownerPassword are identical", async () => {
    const pdfBuf = await createSamplePdf();
    await assert.rejects(
      async () => {
        await protectPdf(pdfBuf, {
          userPassword: "SamePassword123",
          ownerPassword: "SamePassword123",
        });
      },
      /identical/i
    );
  });

  it("rejects when password exceeds 128 characters", async () => {
    const pdfBuf = await createSamplePdf();
    const longPw = "x".repeat(129);
    await assert.rejects(
      async () => {
        await protectPdf(pdfBuf, { userPassword: longPw });
      },
      /128/i
    );
  });

  it("encrypts a valid PDF with AES-256 and returns linearized buffer", async () => {
    const pdfBuf = await createSamplePdf();
    const result = await protectPdf(pdfBuf, {
      userPassword: "UserSecret2026!",
      allowPrinting: true,
      allowCopying: false,
      allowModifying: false,
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.buffer.subarray(0, 4).toString(), "%PDF");
    assert.strictEqual(result.encryption, "AES-256");
    assert.strictEqual(result.isLinearized, true);
    assert.ok(result.originalSize === pdfBuf.length);
    assert.ok(result.protectedSize > 0);
  });

  it("detects already encrypted document and throws descriptive error", async () => {
    const pdfBuf = await createSamplePdf();
    const firstRun = await protectPdf(pdfBuf, { userPassword: "InitialPassword123" });

    await assert.rejects(
      async () => {
        await protectPdf(firstRun.buffer, { userPassword: "SecondPassword456" });
      },
      /already encrypted/i
    );
  });

  it("executes inside an isolated ProcessPool workspace and evicts temp directory", async () => {
    const pdfBuf = await createSamplePdf();
    const testTempDir = join(tmpdir(), "everydaytools-protect-test-" + randomUUID());
    const pool = new ProcessPool({
      concurrencyLimit: 2,
      baseTempDir: testTempDir,
    });

    try {
      const result = await protectPdf(pdfBuf, {
        userPassword: "PoolPassword123",
        pool,
      });
      assert.ok(result.buffer instanceof Buffer);

      const remainingDirs = existsSync(testTempDir) ? await readdir(testTempDir) : [];
      assert.strictEqual(remainingDirs.length, 0);
    } finally {
      await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("handlePdfProtect sets Content-Disposition and telemetry headers", async () => {
    const pdfBuf = await createSamplePdf();
    const headers: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const mockReq = {
      file: {
        buffer: pdfBuf,
        originalname: "financial-plan.pdf",
      },
      body: {
        userPassword: "ExecutivePassword2026!",
        allowPrinting: "true",
        allowCopying: "false",
        allowModifying: "false",
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

    await handlePdfProtect(mockReq, mockRes);

    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("financial-plan_protected.pdf"));
    assert.strictEqual(headers["X-Encryption"], "AES-256");
    assert.strictEqual(headers["X-Linearized"], "true");
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Encryption"));
    assert.ok(Buffer.isBuffer(sentBuffer));
  });

  it("handlePdfProtect returns 400 NO_FILE if no file uploaded", async () => {
    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = { body: { userPassword: "pass" } } as any;
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

    await handlePdfProtect(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "NO_FILE");
  });

  it("handlePdfProtect returns 400 MISSING_PARAM when passwords are blank", async () => {
    const pdfBuf = await createSamplePdf();
    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = {
      file: { buffer: pdfBuf, originalname: "doc.pdf" },
      body: { userPassword: "" },
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

    await handlePdfProtect(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "MISSING_PARAM");
  });

  it("handlePdfProtect returns 400 ALREADY_ENCRYPTED when document is already protected", async () => {
    const pdfBuf = await createSamplePdf();
    const protectedRes = await protectPdf(pdfBuf, { userPassword: "FirstPassword123" });

    let errorCode: string | null = null;
    let statusCode: number | null = null;

    const mockReq = {
      file: { buffer: protectedRes.buffer, originalname: "already_protected.pdf" },
      body: { userPassword: "SecondPassword456" },
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

    await handlePdfProtect(mockReq, mockRes);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(errorCode, "ALREADY_ENCRYPTED");
  });
});
