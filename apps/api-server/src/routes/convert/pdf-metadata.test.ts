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
  updatePdfMetadataUnderPool,
  handlePdfMetadata,
} from "./pdf-metadata-handler.js";

async function createSamplePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const page = doc.addPage([595.28, 841.89]);
  page.drawText("Sample Document for Metadata Test", {
    x: 50,
    y: 800,
    size: 14,
    font,
    color: rgb(0.1, 0.1, 0.1),
  });
  doc.setTitle("Initial Title");
  doc.setAuthor("Initial Author");
  doc.setSubject("Initial Subject");
  doc.setKeywords(["InitTag1", "InitTag2"]);
  doc.setCreator("Initial Creator");
  doc.setProducer("Initial Producer");
  const bytes = await doc.save();
  return Buffer.from(bytes);
}

describe("PDF Metadata Engine & Handler (TDD RED)", () => {
  it("rejects empty or corrupt PDF buffers with 400 error", async () => {
    const emptyBuf = Buffer.alloc(0);
    const corruptBuf = Buffer.from("NOT_A_VALID_PDF_HEADER");

    await assert.rejects(
      async () => {
        await updatePdfMetadataUnderPool(emptyBuf, {});
      },
      /invalid|empty/i
    );

    await assert.rejects(
      async () => {
        await updatePdfMetadataUnderPool(corruptBuf, {});
      },
      /invalid|corrupt/i
    );
  });

  it("updates title, author, subject, keywords, creator and producer successfully", async () => {
    const sample = await createSamplePdf();
    const updated = await updatePdfMetadataUnderPool(sample, {
      title: "Antigravity Architecture 2026",
      author: "EverydayTools Core Team",
      subject: "Systems Engineering",
      keywords: ["Architecture", "2026", "Enterprise", "Linearized"],
      creator: "EverydayTools Studio",
      producer: "EverydayTools Hub 2.0",
    });

    assert.ok(updated.buffer.length > 0);
    assert.strictEqual(updated.pageCount, 1);

    // Verify metadata persisted in PDF
    const reloaded = await PDFDocument.load(updated.buffer);
    assert.strictEqual(reloaded.getTitle(), "Antigravity Architecture 2026");
    assert.strictEqual(reloaded.getAuthor(), "EverydayTools Core Team");
    assert.strictEqual(reloaded.getSubject(), "Systems Engineering");
    assert.strictEqual(reloaded.getKeywords(), "Architecture 2026 Enterprise Linearized");
    assert.strictEqual(reloaded.getCreator(), "EverydayTools Studio");
    assert.ok(reloaded.getProducer());
  });

  it("handlePdfMetadata sends correct Content-Type and RFC 5987 Content-Disposition", async () => {
    const sample = await createSamplePdf();
    const capturedHeaders: Record<string, string> = {};
    let capturedBody: Buffer | null = null;

    const req = {
      file: {
        buffer: sample,
        originalname: "dossier fiscal 2026.pdf",
      },
      body: {
        title: "Dossier Fiscal Modifié",
        author: "Jean Dupont",
        keywords: "fiscal, 2026, audit",
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

    await handlePdfMetadata(req, res);

    assert.strictEqual(capturedHeaders["Content-Type"], "application/pdf");
    assert.match(
      capturedHeaders["Content-Disposition"] || "",
      /attachment;.*dossier fiscal 2026_metadata\.pdf/i
    );
    assert.ok(capturedBody != null && (capturedBody as Buffer).length > 0);

    const reloaded = await PDFDocument.load(capturedBody as Buffer);
    assert.strictEqual(reloaded.getTitle(), "Dossier Fiscal Modifié");
    assert.strictEqual(reloaded.getAuthor(), "Jean Dupont");
  });

  it("ensures process isolation and cleans up ephemeral directories without leaks", async () => {
    const testTempDir = join(tmpdir(), "everydaytools-meta-test-" + randomUUID());
    const customPool = new ProcessPool({ baseTempDir: testTempDir });

    const sample = await createSamplePdf();
    const result = await updatePdfMetadataUnderPool(sample, {
      title: "Isolated Test",
      pool: customPool,
    });
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
