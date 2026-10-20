import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import { unzipSync } from "fflate";
import {
  reorderPdfPages,
  mergePdfDocuments,
  splitPdfDocument,
  rotatePdfPages,
} from "./pdf-transform-logic.js";

async function createSamplePdf(numPages: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= numPages; i++) {
    const page = doc.addPage([200, 200]);
    page.drawText(`Page ${i}`, { x: 50, y: 100 });
  }
  return Buffer.from(await doc.save());
}

describe("PDF Transform Studio Engine (TDD)", () => {
  describe("reorderPdfPages", () => {
    it("reorders pages according to 1-based page indices array", async () => {
      const sample = await createSamplePdf(3);
      // Reorder 1,2,3 -> 3,1
      const reordered = await reorderPdfPages(sample, [3, 1]);
      assert.strictEqual(reordered.buffer instanceof Buffer, true);
      assert.strictEqual(reordered.pageCount, 2);

      const doc = await PDFDocument.load(reordered.buffer);
      assert.strictEqual(doc.getPageCount(), 2);
    });

    it("throws when page indices are empty or out of range", async () => {
      const sample = await createSamplePdf(2);
      await assert.rejects(
        async () => {
          await reorderPdfPages(sample, []);
        },
        {
          message: /No valid page indices/,
        }
      );
    });
  });

  describe("mergePdfDocuments", () => {
    it("merges multiple PDF documents into a single document with all pages", async () => {
      const pdf1 = await createSamplePdf(2);
      const pdf2 = await createSamplePdf(3);

      const merged = await mergePdfDocuments([pdf1, pdf2]);
      assert.strictEqual(merged.buffer instanceof Buffer, true);
      assert.strictEqual(merged.pageCount, 5);

      const doc = await PDFDocument.load(merged.buffer);
      assert.strictEqual(doc.getPageCount(), 5);
    });

    it("throws when less than 2 files are provided", async () => {
      const pdf1 = await createSamplePdf(1);
      await assert.rejects(
        async () => {
          await mergePdfDocuments([pdf1]);
        },
        {
          message: /At least 2 PDF documents/,
        }
      );
    });
  });

  describe("splitPdfDocument", () => {
    it("splits every page into individual PDFs inside a zip archive", async () => {
      const sample = await createSamplePdf(3);
      const result = await splitPdfDocument(sample, { mode: "every", baseName: "testdoc" });

      assert.strictEqual(result.isZip, true);
      assert.strictEqual(result.segmentCount, 3);
      assert.strictEqual(result.buffer instanceof Buffer, true);

      // Verify zip contains 3 PDF entries
      const unzipped = unzipSync(new Uint8Array(result.buffer));
      const fileNames = Object.keys(unzipped);
      assert.strictEqual(fileNames.length, 3);
      assert.strictEqual(fileNames.some((f) => f.includes("page_1.pdf")), true);
      assert.strictEqual(fileNames.some((f) => f.includes("page_2.pdf")), true);
      assert.strictEqual(fileNames.some((f) => f.includes("page_3.pdf")), true);
    });

    it("extracts specific page range into a single merged PDF when mergeOutput is true", async () => {
      const sample = await createSamplePdf(5);
      const result = await splitPdfDocument(sample, {
        mode: "ranges",
        rangesStr: "1-2, 4",
        mergeOutput: true,
        baseName: "sample",
      });

      assert.strictEqual(result.isZip, false);
      const doc = await PDFDocument.load(result.buffer);
      assert.strictEqual(doc.getPageCount(), 3);
    });

    it("throws when range syntax is invalid or empty", async () => {
      const sample = await createSamplePdf(3);
      await assert.rejects(
        async () => {
          await splitPdfDocument(sample, { mode: "ranges", rangesStr: "invalid-range" });
        },
        {
          message: /Invalid or empty page range/,
        }
      );
    });

    it("throws when range syntax is out of bounds like 10-20 for 3-page document", async () => {
      const sample = await createSamplePdf(3);
      await assert.rejects(
        async () => {
          await splitPdfDocument(sample, { mode: "ranges", rangesStr: "10-20" });
        },
        {
          message: /Invalid or empty page range/,
        }
      );
    });

    it("handles identical disjoint ranges without file collision in zip mode", async () => {
      const sample = await createSamplePdf(3);
      const result = await splitPdfDocument(sample, {
        mode: "ranges",
        rangesStr: "1, 1",
        baseName: "testdoc",
      });

      assert.strictEqual(result.isZip, true);
      assert.strictEqual(result.segmentCount, 2);
      const unzipped = unzipSync(new Uint8Array(result.buffer));
      const fileNames = Object.keys(unzipped);
      assert.strictEqual(fileNames.length, 2);
    });
  });

  describe("rotatePdfPages", () => {
    it("rotates all pages by 90 degrees", async () => {
      const sample = await createSamplePdf(2);
      const rotated = await rotatePdfPages(sample, { rotationDeg: 90, pages: "all" });
      assert.strictEqual(rotated.buffer instanceof Buffer, true);
      assert.strictEqual(rotated.pageCount, 2);

      const doc = await PDFDocument.load(rotated.buffer);
      const pages = doc.getPages();
      assert.strictEqual(pages[0].getRotation().angle, 90);
      assert.strictEqual(pages[1].getRotation().angle, 90);
    });

    it("preserves 0 degree rotation when rotationDeg is 0", async () => {
      const sample = await createSamplePdf(2);
      const rotated = await rotatePdfPages(sample, { rotationDeg: 0, pages: "all" });
      assert.strictEqual(rotated.buffer instanceof Buffer, true);

      const doc = await PDFDocument.load(rotated.buffer);
      const pages = doc.getPages();
      assert.strictEqual(pages[0].getRotation().angle, 0);
      assert.strictEqual(pages[1].getRotation().angle, 0);
    });

    it("does not fall back to 90 degrees when perPageRotations has zero rotations", async () => {
      const sample = await createSamplePdf(2);
      const rotated = await rotatePdfPages(sample, {
        perPageRotations: [0, 0],
      });
      assert.strictEqual(rotated.buffer instanceof Buffer, true);

      const doc = await PDFDocument.load(rotated.buffer);
      const pages = doc.getPages();
      assert.strictEqual(pages[0].getRotation().angle, 0);
      assert.strictEqual(pages[1].getRotation().angle, 0);
    });

    it("rotates individual pages with perPageRotations mapping", async () => {
      const sample = await createSamplePdf(3);
      // Rotate page index 1 by 180 degrees
      const rotated = await rotatePdfPages(sample, {
        perPageRotations: { 1: 180 },
      });
      assert.strictEqual(rotated.buffer instanceof Buffer, true);
      assert.strictEqual(rotated.pageCount, 3);

      const doc = await PDFDocument.load(rotated.buffer);
      const pages = doc.getPages();
      assert.strictEqual(pages[0].getRotation().angle, 0);
      assert.strictEqual(pages[1].getRotation().angle, 180);
      assert.strictEqual(pages[2].getRotation().angle, 0);
    });
  });
});

