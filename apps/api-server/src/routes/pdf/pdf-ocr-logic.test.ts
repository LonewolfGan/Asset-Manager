import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, StandardFonts } from "pdf-lib";
import {
  extractPdfTextWithPython,
  performPdfOcr,
  resolveTesseractLanguages,
} from "./pdf-ocr-logic.js";

async function createSampleTextPdf(text = "EverydayTools Automated Test"): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([300, 300]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  page.drawText(text, { x: 50, y: 150, size: 14, font });
  return Buffer.from(await doc.save());
}

describe("PDF OCR & Native Extraction Studio Engine (TDD)", () => {
  describe("resolveTesseractLanguages", () => {
    it("resolves multi-language combinations correctly", () => {
      assert.deepStrictEqual(resolveTesseractLanguages("fra+eng"), ["fra", "eng"]);
      assert.deepStrictEqual(resolveTesseractLanguages("spa+deu+eng"), ["deu", "spa", "eng"]);
      assert.deepStrictEqual(resolveTesseractLanguages("deu"), ["deu"]);
      assert.deepStrictEqual(resolveTesseractLanguages("unknown"), ["eng"]);
    });
  });

  describe("performPdfOcr", () => {
    it("extracts text using native fast path when vector text is present", async () => {
      const sample = await createSampleTextPdf("Confidential Financial Audit 2026");
      const result = await performPdfOcr(sample, { lang: "eng" });

      assert.strictEqual(result.method, "native");
      assert.strictEqual(result.totalPages, 1);
      assert.strictEqual(result.text.includes("Confidential Financial Audit 2026"), true);
    });

    it("rejects empty or invalid PDF buffer with descriptive error", async () => {
      await assert.rejects(
        () => performPdfOcr(Buffer.alloc(0), { lang: "eng" }),
        /empty or invalid/i
      );
    });
  });

  describe("extractPdfTextWithPython", () => {
    it("safely handles nonexistent file path and returns empty array", async () => {
      const result = await extractPdfTextWithPython("/tmp/nonexistent-pdf-path-xyz.pdf");
      assert.deepStrictEqual(result, []);
    });
  });
});
