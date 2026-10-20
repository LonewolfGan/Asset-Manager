import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import {
  reorderPdfPages,
  mergePdfDocuments,
  splitPdfDocument,
  rotatePdfPages,
} from "./pdf-transform-logic.js";
import { buildContentDisposition } from "../convert/convert-image.js";

describe("PDF Transform Routes & Integration (TDD)", () => {
  it("verifies reorder disposition and execution", async () => {
    const doc = await PDFDocument.create();
    doc.addPage([200, 200]);
    doc.addPage([200, 200]);
    const srcBuf = Buffer.from(await doc.save());

    const result = await reorderPdfPages(srcBuf, [2, 1]);
    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.buffer instanceof Buffer, true);

    const disposition = buildContentDisposition("contract.v2_reordered.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="contract.v2_reordered.pdf"'), true);
  });

  it("verifies merge disposition and execution", async () => {
    const doc1 = await PDFDocument.create();
    doc1.addPage([100, 100]);
    const buf1 = Buffer.from(await doc1.save());

    const doc2 = await PDFDocument.create();
    doc2.addPage([100, 100]);
    const buf2 = Buffer.from(await doc2.save());

    const result = await mergePdfDocuments([buf1, buf2]);
    assert.strictEqual(result.pageCount, 2);
    assert.strictEqual(result.buffer instanceof Buffer, true);

    const disposition = buildContentDisposition("merged_document.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="merged_document.pdf"'), true);
  });

  it("verifies split disposition and execution for both zip and single pdf", async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]);
    doc.addPage([100, 100]);
    doc.addPage([100, 100]);
    const buf = Buffer.from(await doc.save());

    const zipResult = await splitPdfDocument(buf, {
      baseName: "archive.v1",
      mode: "every",
      mergeOutput: false,
    });
    assert.strictEqual(zipResult.isZip, true);
    assert.strictEqual(zipResult.buffer instanceof Buffer, true);

    const zipDisposition = buildContentDisposition("archive.v1_split.zip", "zip");
    assert.strictEqual(zipDisposition.includes('filename="archive.v1_split.zip"'), true);

    const pdfResult = await splitPdfDocument(buf, {
      baseName: "archive.v1",
      mode: "ranges",
      rangesStr: "1-2",
      mergeOutput: true,
    });
    assert.strictEqual(pdfResult.isZip, false);
    assert.strictEqual(pdfResult.buffer instanceof Buffer, true);

    const pdfDisposition = buildContentDisposition("archive.v1_extracted.pdf", "pdf");
    assert.strictEqual(pdfDisposition.includes('filename="archive.v1_extracted.pdf"'), true);
  });

  it("verifies rotate disposition and execution", async () => {
    const doc = await PDFDocument.create();
    doc.addPage([100, 100]);
    const buf = Buffer.from(await doc.save());

    const result = await rotatePdfPages(buf, { rotationDeg: 180 });
    assert.strictEqual(result.pageCount, 1);
    assert.strictEqual(result.buffer instanceof Buffer, true);

    const disposition = buildContentDisposition("invoice.final_rotated.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="invoice.final_rotated.pdf"'), true);
  });
});
