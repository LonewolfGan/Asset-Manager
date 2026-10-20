import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { buildContentDisposition } from "../convert/convert-image.js";

async function createMinimalPdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  doc.addPage([200, 200]);
  return Buffer.from(await doc.save());
}

describe("PDF Annotate Routes & Integration (TDD)", () => {
  describe("Content-Disposition formatting for annotate endpoints", () => {
    it("generates RFC 5987 header for watermarked PDF with accented name", () => {
      const disposition = buildContentDisposition("contrat_confidentialité.pdf", "pdf");
      assert.strictEqual(disposition.includes('filename="contrat_confidentialit_.pdf"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''contrat_confidentialit%C3%A9.pdf"), true);
    });

    it("generates RFC 5987 header for numbered PDF with multi-dot name", () => {
      const disposition = buildContentDisposition("rapport.q4.final_numbered.pdf", "pdf");
      assert.strictEqual(disposition.includes('filename="rapport.q4.final_numbered.pdf"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''rapport.q4.final_numbered.pdf"), true);
    });

    it("generates RFC 5987 header for updated metadata PDF", () => {
      const disposition = buildContentDisposition("présentation_executive_metadata.pdf", "pdf");
      assert.strictEqual(disposition.includes('filename="pr_sentation_executive_metadata.pdf"'), true);
      assert.strictEqual(disposition.includes("filename*=UTF-8''pr%C3%A9sentation_executive_metadata.pdf"), true);
    });
  });

  describe("Engine execution validation", () => {
    it("executes watermark, page numbers, and metadata updates seamlessly", async () => {
      const {
        applyPdfWatermark,
        addPdfPageNumbers,
        updatePdfMetadata,
      } = await import("./pdf-annotate-logic.js");

      const basePdf = await createMinimalPdf();

      const watermarked = await applyPdfWatermark(basePdf, { text: "APPROVED" });
      assert.strictEqual(watermarked.subarray(0, 5).toString("ascii"), "%PDF-");

      const numbered = await addPdfPageNumbers(watermarked, { position: "bottom-right" });
      assert.strictEqual(numbered.subarray(0, 5).toString("ascii"), "%PDF-");

      const finalPdf = await updatePdfMetadata(numbered, { title: "Approved Document" });
      assert.strictEqual(finalPdf.subarray(0, 5).toString("ascii"), "%PDF-");

      const doc = await PDFDocument.load(finalPdf);
      assert.strictEqual(doc.getTitle(), "Approved Document");
      assert.strictEqual(doc.getPageCount(), 1);
    });
  });
});
