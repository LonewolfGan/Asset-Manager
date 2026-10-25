import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { ProcessPool } from "../../lib/process-pool.js";
import { protectPdf } from "./pdf-protect-handler.js";
import {
  unlockPdf,
  handlePdfUnlock,
  type UnlockPdfOptions,
  type UnlockPdfResult,
} from "./pdf-unlock-handler.js";

async function createSamplePdf(pageCount = 2): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pageCount; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`PDF Unlock Test - Page ${i}`, { x: 50, y: 800, size: 16, font, color: rgb(0.1, 0.1, 0.1) });
  }
  return Buffer.from(await doc.save());
}

describe("PDF Unlock High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await unlockPdf(Buffer.alloc(0), { password: "pass" });
      },
      /invalid or empty pdf/i
    );

    await assert.rejects(
      async () => {
        await unlockPdf(Buffer.from("NOT_A_PDF"), { password: "pass" });
      },
      /invalid or corrupt/i
    );

    await assert.rejects(
      async () => {
        await unlockPdf(Buffer.from("%PDF"), { password: "pass" });
      },
      /invalid or corrupt/i
    );
  });

  it("rejects unencrypted PDFs with 400 NOT_ENCRYPTED", async () => {
    const unencryptedPdf = await createSamplePdf();

    await assert.rejects(
      async () => {
        await unlockPdf(unencryptedPdf, { password: "anyPassword" });
      },
      (err: any) => {
        return (
          err.code === "NOT_ENCRYPTED" &&
          /document is not encrypted/i.test(err.message)
        );
      }
    );
  });

  it("rejects incorrect password with 400 INVALID_PASSWORD", async () => {
    const plainPdf = await createSamplePdf();
    const encrypted = await protectPdf(plainPdf, {
      userPassword: "CorrectPassword123",
    });

    await assert.rejects(
      async () => {
        await unlockPdf(encrypted.buffer, { password: "WrongPassword999" });
      },
      (err: any) => {
        return (
          err.code === "INVALID_PASSWORD" &&
          /incorrect password/i.test(err.message)
        );
      }
    );
  });

  it("rejects password exceeding 128 characters with 400 INVALID_PARAM", async () => {
    const plainPdf = await createSamplePdf();
    const encrypted = await protectPdf(plainPdf, {
      userPassword: "CorrectPassword123",
    });
    const longPassword = "a".repeat(129);

    await assert.rejects(
      async () => {
        await unlockPdf(encrypted.buffer, { password: longPassword });
      },
      (err: any) => {
        return err.code === "INVALID_PARAM" && /128/i.test(err.message);
      }
    );
  });

  it("successfully decrypts user-password protected PDF with correct password", async () => {
    const plainPdf = await createSamplePdf();
    const encrypted = await protectPdf(plainPdf, {
      userPassword: "SecretPassphrase2026!",
    });

    const result = await unlockPdf(encrypted.buffer, {
      password: "SecretPassphrase2026!",
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.buffer.subarray(0, 5).toString(), "%PDF-");
    assert.strictEqual(result.isDecrypted, true);
    assert.strictEqual(result.isLinearized, true);
    assert.ok(result.originalSize === encrypted.buffer.length);
    assert.ok(result.unlockedSize > 0);

    const parsedDoc = await PDFDocument.load(result.buffer);
    assert.strictEqual(parsedDoc.getPageCount(), 2);
  });

  it("successfully decrypts owner-restricted PDF with empty password or no password", async () => {
    const plainPdf = await createSamplePdf();
    const ownerProtected = await protectPdf(plainPdf, {
      ownerPassword: "OwnerMasterKey2026!",
      userPassword: "",
      allowPrinting: false,
      allowCopying: false,
    });

    const resultEmpty = await unlockPdf(ownerProtected.buffer, {
      password: "",
    });
    assert.ok(resultEmpty.buffer instanceof Buffer);
    assert.strictEqual(resultEmpty.isDecrypted, true);

    const resultNone = await unlockPdf(ownerProtected.buffer);
    assert.ok(resultNone.buffer instanceof Buffer);
    assert.strictEqual(resultNone.isDecrypted, true);

    const parsed = await PDFDocument.load(resultNone.buffer);
    assert.strictEqual(parsed.getPageCount(), 2);
  });

  it("supports UTF-8 and special characters in passwords", async () => {
    const plainPdf = await createSamplePdf();
    const utf8Password = "P@ssw0rd_éè_ç_2026!#$🚀";
    const encrypted = await protectPdf(plainPdf, {
      userPassword: utf8Password,
    });

    const result = await unlockPdf(encrypted.buffer, {
      password: utf8Password,
    });

    assert.ok(result.buffer instanceof Buffer);
    assert.strictEqual(result.isDecrypted, true);
    const parsed = await PDFDocument.load(result.buffer);
    assert.strictEqual(parsed.getPageCount(), 2);
  });

  it("executes inside an isolated ProcessPool workspace and evicts temp directory", async () => {
    const plainPdf = await createSamplePdf();
    const encrypted = await protectPdf(plainPdf, {
      userPassword: "PoolIsolationTest2026!",
    });

    const testTempDir = join(
      tmpdir(),
      "everydaytools-unlock-test-" + randomUUID()
    );
    const pool = new ProcessPool({
      concurrencyLimit: 2,
      baseTempDir: testTempDir,
    });

    try {
      const result = await unlockPdf(encrypted.buffer, {
        password: "PoolIsolationTest2026!",
        pool,
      });
      assert.ok(result.buffer instanceof Buffer);

      const remainingDirs = existsSync(testTempDir)
        ? await readdir(testTempDir)
        : [];
      assert.strictEqual(remainingDirs.length, 0);
    } finally {
      await rm(testTempDir, { recursive: true, force: true }).catch(() => {});
    }
  });

  it("handlePdfUnlock sets Content-Disposition and telemetry headers", async () => {
    const plainPdf = await createSamplePdf();
    const encrypted = await protectPdf(plainPdf, {
      userPassword: "ApiHeaderTestPassword!",
    });

    const headers: Record<string, string> = {};
    let sentBuffer: Buffer | null = null;

    const mockReq = {
      file: {
        buffer: encrypted.buffer,
        originalname: "encrypted-contract.pdf",
      },
      body: {
        password: "ApiHeaderTestPassword!",
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

    await handlePdfUnlock(mockReq, mockRes);

    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("encrypted-contract_unlocked.pdf"));
    assert.strictEqual(headers["X-Decrypted"], "true");
    assert.strictEqual(headers["X-Linearized"], "true");
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Decrypted"));
    assert.ok(headers["Access-Control-Expose-Headers"].includes("X-Linearized"));
    assert.ok(Buffer.isBuffer(sentBuffer));
  });

  function createMockRes() {
    let statusCode: number | null = null;
    let errorCode: string | null = null;
    const res = {
      status(code: number) {
        statusCode = code;
        return {
          json(payload: any) {
            errorCode = payload.code ?? payload.error;
          },
        };
      },
    } as any;
    return { res, getStatus: () => statusCode, getCode: () => errorCode };
  }

  it("handlePdfUnlock returns 400 NO_FILE if no file uploaded", async () => {
    const { res, getStatus, getCode } = createMockRes();
    await handlePdfUnlock({ body: { password: "pass" } } as any, res);
    assert.strictEqual(getStatus(), 400);
    assert.strictEqual(getCode(), "NO_FILE");
  });

  it("handlePdfUnlock returns 400 NOT_ENCRYPTED when document is not encrypted", async () => {
    const plainPdf = await createSamplePdf();
    const { res, getStatus, getCode } = createMockRes();
    await handlePdfUnlock({ file: { buffer: plainPdf, originalname: "unencrypted.pdf" }, body: { password: "pass" } } as any, res);
    assert.strictEqual(getStatus(), 400);
    assert.strictEqual(getCode(), "NOT_ENCRYPTED");
  });

  it("handlePdfUnlock returns 400 INVALID_PASSWORD when password is incorrect", async () => {
    const plainPdf = await createSamplePdf();
    const encrypted = await protectPdf(plainPdf, { userPassword: "RealPassword123" });
    const { res, getStatus, getCode } = createMockRes();
    await handlePdfUnlock({ file: { buffer: encrypted.buffer, originalname: "locked.pdf" }, body: { password: "FalsePassword456" } } as any, res);
    assert.strictEqual(getStatus(), 400);
    assert.strictEqual(getCode(), "INVALID_PASSWORD");
  });
});
