import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { extractPdfTextWithPython } from "./pdf-ocr.js";
import { linearizePdf } from "../../lib/pdf-linearize.js";

describe("PDF Hardening & Security (TDD - P4)", () => {
  it("extractPdfTextWithPython safely handles arguments and returns empty array on invalid/missing file", async () => {
    // Should gracefully return [] without crashing or failing to parse
    const result = await extractPdfTextWithPython("/tmp/nonexistent-file-path-test.pdf");
    assert.deepStrictEqual(result, []);
  });

  it("linearizes merged PDF documents properly without corruption", async () => {
    const doc1 = await PDFDocument.create();
    doc1.addPage([200, 200]);
    const doc2 = await PDFDocument.create();
    doc2.addPage([200, 200]);

    const merged = await PDFDocument.create();
    const p1 = await merged.copyPages(doc1, [0]);
    const p2 = await merged.copyPages(doc2, [0]);
    merged.addPage(p1[0]);
    merged.addPage(p2[0]);

    const mergedBytes = await merged.save();
    const linearized = await linearizePdf(Buffer.from(mergedBytes));

    assert.strictEqual(linearized instanceof Buffer, true);
    assert.strictEqual(linearized.length > 0, true);
    // Reload linearized document to ensure validity
    const reloaded = await PDFDocument.load(linearized);
    assert.strictEqual(reloaded.getPageCount(), 2);
  });
});
