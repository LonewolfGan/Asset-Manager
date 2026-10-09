import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, rm } from "fs/promises";
import { randomUUID } from "crypto";
import { extractPdfTextWithPython } from "./pdf-ocr.js";

describe("PDF OCR & Native Extraction (TDD)", () => {
  it("extractPdfTextWithPython safely handles arguments and returns empty array on invalid/missing file", async () => {
    const result = await extractPdfTextWithPython("/tmp/nonexistent-file-path-test.pdf");
    assert.deepStrictEqual(result, []);
  });

  it("extractPdfTextWithPython extracts text from a valid PDF containing text", async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([300, 300]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    page.drawText("Hello World EverydayTools", { x: 50, y: 150, size: 14, font });

    const pdfBytes = await doc.save();
    const tempFile = join(tmpdir(), `test-extract-${randomUUID()}.pdf`);
    await writeFile(tempFile, Buffer.from(pdfBytes));

    try {
      const result = await extractPdfTextWithPython(tempFile);
      assert.strictEqual(Array.isArray(result), true);
      assert.strictEqual(result.length, 1);
      assert.strictEqual(result[0].pageNum, 1);
      assert.strictEqual(result[0].text.includes("Hello World EverydayTools"), true);
    } finally {
      await rm(tempFile, { force: true }).catch(() => {});
    }
  });
});
