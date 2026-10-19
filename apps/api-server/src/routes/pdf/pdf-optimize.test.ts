import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { compressPdfBuffer, repairPdfBuffer } from "./pdf-optimize-logic.js";
import { buildContentDisposition } from "../convert/convert-image.js";

describe("PDF Optimize Routes & Integration (TDD)", () => {
  it("verifies compressPdfBuffer integration and header generation", async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([100, 100]);
    page.drawText("Integration Test", { x: 10, y: 50 });
    const buffer = Buffer.from(await doc.save());

    const result = await compressPdfBuffer(buffer, { level: "recommended" });
    assert.strictEqual(result.buffer instanceof Buffer, true);
    assert.strictEqual(result.buffer.length > 0, true);

    const disposition = buildContentDisposition("report.final.2024_compressed.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="report.final.2024_compressed.pdf"'), true);
  });

  it("verifies repairPdfBuffer integration with damaged inputs", async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]);
    const buffer = Buffer.from(await doc.save());

    const repaired = await repairPdfBuffer(buffer);
    assert.strictEqual(repaired instanceof Buffer, true);
    assert.strictEqual(repaired.length > 0, true);

    const disposition = buildContentDisposition("damaged.document_repaired.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="damaged.document_repaired.pdf"'), true);
  });

  it("enforces compressedSize <= originalSize on already-compressed or small PDFs", async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([50, 50]);
    page.drawText("Minimal", { x: 5, y: 25 });
    const originalBuffer = Buffer.from(await doc.save());

    const result = await compressPdfBuffer(originalBuffer, { level: "prepress" });
    assert.strictEqual(result.compressedSize <= result.originalSize, true);
    assert.strictEqual(result.buffer.length, result.compressedSize);
    assert.strictEqual(result.originalSize, originalBuffer.length);
    assert.strictEqual(result.gain >= 0, true);
    assert.strictEqual(result.gain, Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100)));
  });

  it("guarantees accurate gain computation and returns valid output buffer", async () => {
    const doc = await PDFDocument.create();
    for (let i = 0; i < 3; i++) {
      const page = doc.addPage([300, 300]);
      page.drawText(`Page ${i + 1} content with multiple text lines to compress`, { x: 20, y: 200 });
    }
    const originalBuffer = Buffer.from(await doc.save());

    const result = await compressPdfBuffer(originalBuffer, { level: "screen" });
    assert.strictEqual(result.buffer instanceof Buffer, true);
    assert.strictEqual(result.buffer.length, result.compressedSize);
    assert.strictEqual(result.originalSize, originalBuffer.length);
    assert.strictEqual(result.compressedSize <= result.originalSize, true);
    const expectedGain = Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100));
    assert.strictEqual(result.gain, expectedGain);
  });
});
