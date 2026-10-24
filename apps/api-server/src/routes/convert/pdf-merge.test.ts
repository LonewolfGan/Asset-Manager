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
  mergePdf,
  handlePdfMerge,
  type MergePdfOptions,
} from "./pdf-merge-handler.js";

async function createDoc(pages = 2, label = "Doc"): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([595.28, 841.89]);
    page.drawText(`${label} - Page ${i}`, {
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

describe("PDF Merge High-Fidelity Engine & Handler (TDD RED)", () => {
  it("rejects fewer than 2 documents with descriptive error", async () => {
    await assert.rejects(
      async () => {
        await mergePdf([]);
      },
      /at least 2/i
    );

    const single = await createDoc(1);
    await assert.rejects(
      async () => {
        await mergePdf([single]);
      },
      /at least 2/i
    );
  });

  it("rejects corrupted or empty PDF buffers", async () => {
    const valid = await createDoc(1);
    const empty = Buffer.alloc(0);
    await assert.rejects(
      async () => {
        await mergePdf([valid, empty]);
      },
      /invalid or empty/i
    );
  });

  it("merges 2 and 3 PDF documents with correct page count and valid PDF structure", async () => {
    const doc1 = await createDoc(2, "Document 1");
    const doc2 = await createDoc(3, "Document 2");

    const result = await mergePdf([doc1, doc2]);
    assert.ok(Buffer.isBuffer(result.buffer));
    assert.strictEqual(result.buffer.subarray(0, 4).toString(), "%PDF");
    assert.strictEqual(result.pageCount, 5);
    assert.strictEqual(result.mergedCount, 2);

    // Verify 3 documents
    const doc3 = await createDoc(1, "Document 3");
    const result3 = await mergePdf([doc1, doc2, doc3]);
    assert.strictEqual(result3.pageCount, 6);
    assert.strictEqual(result3.mergedCount, 3);
  });

  it("executes inside an isolated ProcessPool workspace and evicts temp directory", async () => {
    const testTempDir = join(tmpdir(), `test-merge-pool-${randomUUID()}`);
    const pool = new ProcessPool({
      concurrencyLimit: 1,
      defaultTimeoutMs: 15000,
      baseTempDir: testTempDir,
    });

    const doc1 = await createDoc(1);
    const doc2 = await createDoc(1);

    const result = await pool.run(async (ctx) => {
      assert.ok(existsSync(ctx.workspaceDir));
      return await mergePdf([doc1, doc2], { workDir: ctx.workspaceDir });
    });

    assert.ok(result.buffer.length > 0);
    const remaining = existsSync(testTempDir) ? await readdir(testTempDir) : [];
    assert.strictEqual(remaining.length, 0);
  });

  it("handlePdfMerge sets Content-Disposition and telemetry headers", async () => {
    const doc1 = await createDoc(2);
    const doc2 = await createDoc(1);

    let sentBuffer: Buffer | null = null;
    const headers: Record<string, string> = {};

    const req = {
      files: [
        { buffer: doc1, originalname: "first.pdf" },
        { buffer: doc2, originalname: "second.pdf" },
      ],
      body: { filename: "final_report.pdf" },
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

    await handlePdfMerge(req, res);

    assert.ok(Buffer.isBuffer(sentBuffer));
    assert.strictEqual(headers["Content-Type"], "application/pdf");
    assert.ok(headers["Content-Disposition"].includes("final_report.pdf"));
    assert.strictEqual(headers["X-Page-Count"], "3");
    assert.strictEqual(headers["X-Merged-Count"], "2");
  });

  it("handlePdfMerge returns 400 MISSING_FILES if fewer than 2 files uploaded", async () => {
    let statusCode = 0;
    let jsonBody: any = null;

    const req = {
      files: [{ buffer: await createDoc(1), originalname: "alone.pdf" }],
      body: {},
    } as any;

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

    await handlePdfMerge(req, res);
    assert.strictEqual(statusCode, 400);
    assert.strictEqual(jsonBody?.code, "MISSING_FILES");
  });
});
