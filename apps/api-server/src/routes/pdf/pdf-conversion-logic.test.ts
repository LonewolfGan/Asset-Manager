import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import { unzipSync } from "fflate";
import {
  rasterizePdfToImages,
  convertPdfToPdfa,
  convertImagesToPdf,
} from "./pdf-conversion-logic.js";

async function createSamplePdf(numPages: number): Promise<Buffer> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= numPages; i++) {
    const page = doc.addPage([300, 300]);
    page.drawText(`Page ${i}`, { x: 50, y: 150 });
  }
  return Buffer.from(await doc.save());
}

async function createSampleImage(width = 100, height = 100, format: "png" | "jpeg" = "png"): Promise<Buffer> {
  if (format === "png") {
    return await sharp({
      create: {
        width,
        height,
        channels: 4,
        background: { r: 50, g: 150, b: 200, alpha: 1 },
      },
    })
      .png()
      .toBuffer();
  }
  return await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: { r: 200, g: 100, b: 50 },
    },
  })
    .jpeg()
    .toBuffer();
}

describe("PDF Conversion Studio Engine (TDD)", () => {
  describe("rasterizePdfToImages", () => {
    it("rasterizes a 1-page PDF to a single image without ZIP", async () => {
      const sample = await createSamplePdf(1);
      const result = await rasterizePdfToImages(sample, {
        format: "webp",
        dpi: 150,
        baseName: "single_doc",
      });

      assert.strictEqual(result.isZip, false);
      assert.strictEqual(result.pageCount, 1);
      assert.strictEqual(result.mime, "image/webp");
      assert.strictEqual(result.ext, "webp");
      assert.strictEqual(result.buffer instanceof Buffer, true);

      // Verify valid image buffer
      const meta = await sharp(result.buffer).metadata();
      assert.strictEqual(meta.format, "webp");
      assert.strictEqual((meta.width ?? 0) > 0, true);
    });

    it("rasterizes a multi-page PDF into a valid ZIP archive containing images", async () => {
      const sample = await createSamplePdf(2);
      const result = await rasterizePdfToImages(sample, {
        format: "png",
        dpi: 150,
        baseName: "multi_doc",
      });

      assert.strictEqual(result.isZip, true);
      assert.strictEqual(result.pageCount, 2);
      assert.strictEqual(result.mime, "application/zip");
      assert.strictEqual(result.ext, "zip");
      assert.strictEqual(result.buffer instanceof Buffer, true);

      // Verify unzipped entries
      const unzipped = unzipSync(new Uint8Array(result.buffer));
      const fileNames = Object.keys(unzipped);
      assert.strictEqual(fileNames.length, 2);
      assert.strictEqual(fileNames.some((f) => f.includes("page_1.png")), true);
      assert.strictEqual(fileNames.some((f) => f.includes("page_2.png")), true);
    });

    it("sanitizes baseName against zip-slip directory traversal", async () => {
      const sample = await createSamplePdf(2);
      const result = await rasterizePdfToImages(sample, {
        format: "png",
        dpi: 150,
        baseName: "../../etc/passwd",
      });

      assert.strictEqual(result.isZip, true);
      const unzipped = unzipSync(new Uint8Array(result.buffer));
      const fileNames = Object.keys(unzipped);
      assert.strictEqual(fileNames.every((f) => !f.includes("..") && !f.includes("/")), true);
    });

    it("throws descriptive error when input buffer is invalid or empty", async () => {
      await assert.rejects(
        async () => {
          await rasterizePdfToImages(Buffer.from([]), { format: "png" });
        },
        {
          message: /Invalid or empty PDF buffer/,
        }
      );
    });
  });

  describe("convertPdfToPdfa", () => {
    it("converts a PDF document to PDF/A-2b standard with linearization", async () => {
      const sample = await createSamplePdf(1);
      const result = await convertPdfToPdfa(sample, { conformance: "2b" });

      assert.strictEqual(result.buffer instanceof Buffer, true);
      assert.strictEqual(result.pageCount, 1);
      assert.strictEqual(result.buffer.length > 0, true);

      // Verify valid PDF structure
      const doc = await PDFDocument.load(result.buffer);
      assert.strictEqual(doc.getPageCount(), 1);
    });

    it("supports PDF/A-1b and PDF/A-3b conformance profiles", async () => {
      const sample = await createSamplePdf(1);
      const res1b = await convertPdfToPdfa(sample, { conformance: "1b" });
      assert.strictEqual(res1b.pageCount, 1);

      const res3b = await convertPdfToPdfa(sample, { conformance: "3b" });
      assert.strictEqual(res3b.pageCount, 1);
    });

    it("throws descriptive error when input is empty", async () => {
      await assert.rejects(
        async () => {
          await convertPdfToPdfa(Buffer.from([]), { conformance: "2b" });
        },
        {
          message: /Invalid or empty PDF buffer/,
        }
      );
    });
  });

  describe("convertImagesToPdf", () => {
    it("combines multiple image buffers into a single linearized PDF", async () => {
      const img1 = await createSampleImage(200, 300, "png");
      const img2 = await createSampleImage(400, 300, "jpeg");

      const result = await convertImagesToPdf([
        { buffer: img1, mime: "image/png", name: "photo1.png" },
        { buffer: img2, mime: "image/jpeg", name: "photo2.jpg" },
      ]);

      assert.strictEqual(result.pageCount, 2);
      assert.strictEqual(result.buffer instanceof Buffer, true);

      const doc = await PDFDocument.load(result.buffer);
      assert.strictEqual(doc.getPageCount(), 2);
    });

    it("throws when empty images array is provided", async () => {
      await assert.rejects(
        async () => {
          await convertImagesToPdf([]);
        },
        {
          message: /At least 1 image is required/,
        }
      );
    });
  });
});
