import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import {
  applyPdfWatermark,
  addPdfPageNumbers,
  updatePdfMetadata,
} from "./pdf-annotate-logic.js";

async function createSamplePdf(pageCount = 3): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`Sample Page ${i + 1}`, { x: 50, y: 550 });
  }
  return Buffer.from(await doc.save());
}

describe("PDF Annotate Studio Engine (TDD)", () => {
  describe("applyPdfWatermark", () => {
    it("applies single watermark to center of pages", async () => {
      const sample = await createSamplePdf(2);
      const watermarked = await applyPdfWatermark(sample, {
        text: "CONFIDENTIAL",
        pattern: "single",
        fontSize: 40,
        opacity: 0.5,
        color: "red",
        angle: 45,
        pages: "all",
      });

      assert.strictEqual(watermarked.subarray(0, 5).toString("ascii"), "%PDF-");
      const doc = await PDFDocument.load(watermarked);
      assert.strictEqual(doc.getPageCount(), 2);
    });

    it("applies repeated diagonal watermark pattern across pages", async () => {
      const sample = await createSamplePdf(1);
      const watermarked = await applyPdfWatermark(sample, {
        text: "DRAFT",
        pattern: "repeat",
        color: "#ff0000",
        pages: "all",
      });

      assert.strictEqual(watermarked.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("applies watermark to first page only", async () => {
      const sample = await createSamplePdf(3);
      const watermarked = await applyPdfWatermark(sample, {
        text: "FIRST PAGE ONLY",
        pages: "first",
      });

      const doc = await PDFDocument.load(watermarked);
      assert.strictEqual(doc.getPageCount(), 3);
    });

    it("handles reversed and overlapping page ranges gracefully without crashing", async () => {
      const sample = await createSamplePdf(4);
      const watermarked = await applyPdfWatermark(sample, {
        text: "REVERSED",
        pages: "3-1, 2",
      });

      assert.strictEqual(watermarked.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("tolerates NaN and invalid numeric inputs by falling back to defaults", async () => {
      const sample = await createSamplePdf(1);
      const watermarked = await applyPdfWatermark(sample, {
        text: "SAFE",
        opacity: NaN,
        fontSize: NaN,
        angle: NaN,
      });

      assert.strictEqual(watermarked.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("throws descriptive error on empty buffer", async () => {
      await assert.rejects(
        () => applyPdfWatermark(Buffer.alloc(0), { text: "FAIL" }),
        /empty or invalid/i
      );
    });
  });

  describe("addPdfPageNumbers", () => {
    it("numbers pages with default format {n}", async () => {
      const sample = await createSamplePdf(3);
      const numbered = await addPdfPageNumbers(sample, {
        position: "bottom-center",
        startFrom: 1,
        skipFirst: false,
        format: "{n}",
      });

      assert.strictEqual(numbered.subarray(0, 5).toString("ascii"), "%PDF-");
      const doc = await PDFDocument.load(numbered);
      assert.strictEqual(doc.getPageCount(), 3);
    });

    it("numbers pages skipping first page with custom format {n} of {total}", async () => {
      const sample = await createSamplePdf(4);
      const numbered = await addPdfPageNumbers(sample, {
        position: "bottom-right",
        startFrom: 1,
        skipFirst: true,
        format: "Page {n} of {total}",
      });

      assert.strictEqual(numbered.subarray(0, 5).toString("ascii"), "%PDF-");
    });

    it("supports all pagination positions and custom startFrom offset", async () => {
      const sample = await createSamplePdf(2);
      const positions = ["bottom-left", "top-left", "top-center", "top-right"] as const;

      for (const pos of positions) {
        const numbered = await addPdfPageNumbers(sample, {
          position: pos,
          startFrom: 10,
          fontSize: NaN,
        });
        assert.strictEqual(numbered.subarray(0, 5).toString("ascii"), "%PDF-");
      }
    });

    it("throws descriptive error on invalid empty buffer", async () => {
      await assert.rejects(
        () => addPdfPageNumbers(Buffer.alloc(0), {}),
        /empty or invalid/i
      );
    });
  });

  describe("updatePdfMetadata", () => {
    it("updates title, author, and keywords with linearization", async () => {
      const sample = await createSamplePdf(1);
      const updated = await updatePdfMetadata(sample, {
        title: "Annual Report 2024",
        author: "Finance Team",
        keywords: ["finance", "annual", "audit"],
        subject: "Fiscal Q4",
      });

      assert.strictEqual(updated.subarray(0, 5).toString("ascii"), "%PDF-");
      const doc = await PDFDocument.load(updated);
      assert.strictEqual(doc.getTitle(), "Annual Report 2024");
      assert.strictEqual(doc.getAuthor(), "Finance Team");
      assert.strictEqual(doc.getSubject(), "Fiscal Q4");
      assert.strictEqual(doc.getKeywords(), "finance annual audit");
    });

    it("throws descriptive error on empty buffer", async () => {
      await assert.rejects(
        () => updatePdfMetadata(Buffer.alloc(0), { title: "Test" }),
        /empty or invalid/i
      );
    });
  });
});
