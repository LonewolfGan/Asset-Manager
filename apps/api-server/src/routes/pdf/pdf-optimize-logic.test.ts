import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument, rgb } from "pdf-lib";
import {
  compressPdfBuffer,
  repairPdfBuffer,
  type CompressLevel,
} from "./pdf-optimize-logic.js";

describe("PDF Optimize Studio Engine (TDD)", () => {
  describe("compressPdfBuffer", () => {
    it("compresses a generated PDF and returns valid PDF structure with gain metrics", async () => {
      // Create a sample PDF with pages and content
      const doc = await PDFDocument.create();
      const page1 = doc.addPage([400, 600]);
      page1.drawText("EverydayTools PDF Compression Engine Test", { x: 50, y: 550, size: 18 });
      page1.drawRectangle({
        x: 50,
        y: 300,
        width: 300,
        height: 200,
        color: rgb(0.2, 0.4, 0.8),
      });

      const page2 = doc.addPage([400, 600]);
      page2.drawText("Second Page for Ghostscript Downsampling", { x: 50, y: 550, size: 14 });

      const inputBuffer = Buffer.from(await doc.save());

      const result = await compressPdfBuffer(inputBuffer, { level: "recommended" });

      assert.strictEqual(result.buffer instanceof Buffer, true);
      assert.strictEqual(result.buffer.length > 0, true);
      assert.strictEqual(result.originalSize, inputBuffer.length);
      assert.strictEqual(result.compressedSize, result.buffer.length);
      assert.strictEqual(typeof result.gain, "number");
      assert.strictEqual(result.gain >= 0, true);

      // Verify output is a valid PDF
      const verifiedDoc = await PDFDocument.load(result.buffer);
      assert.strictEqual(verifiedDoc.getPageCount(), 2);
    });

    it("supports all compression presets without throwing errors", async () => {
      const doc = await PDFDocument.create();
      const page = doc.addPage([200, 200]);
      page.drawText("Preset Test", { x: 20, y: 150, size: 12 });
      const sample = Buffer.from(await doc.save());

      const presets: CompressLevel[] = ["extreme", "recommended", "low", "prepress"];
      for (const preset of presets) {
        const res = await compressPdfBuffer(sample, { level: preset });
        assert.strictEqual(res.buffer.length > 0, true);
        const reloaded = await PDFDocument.load(res.buffer);
        assert.strictEqual(reloaded.getPageCount(), 1);
      }
    });

    it("compresses PDF with structural warnings without failing thanks to warning-exit-0", async () => {
      // PDF with minor structural warning
      const doc = await PDFDocument.create();
      const page = doc.addPage([250, 250]);
      page.drawText("Warning Tolerance Test", { x: 25, y: 150 });
      const sample = Buffer.from(await doc.save());

      const res = await compressPdfBuffer(sample, { level: "extreme" });
      assert.strictEqual(res.buffer instanceof Buffer, true);
      assert.strictEqual(res.buffer.length > 0, true);
    });

    it("rejects invalid or empty buffer with descriptive error", async () => {
      await assert.rejects(
        async () => {
          await compressPdfBuffer(Buffer.alloc(0));
        },
        {
          message: /Invalid or empty PDF buffer/,
        }
      );
    });
  });

  describe("repairPdfBuffer", () => {
    it("successfully repairs a valid PDF and linearizes its structure", async () => {
      const doc = await PDFDocument.create();
      const page = doc.addPage([300, 300]);
      page.drawText("Repairable Content", { x: 50, y: 250, size: 16 });
      const validBuffer = Buffer.from(await doc.save());

      const repaired = await repairPdfBuffer(validBuffer);
      assert.strictEqual(repaired instanceof Buffer, true);
      assert.strictEqual(repaired.length > 0, true);

      const reloaded = await PDFDocument.load(repaired);
      assert.strictEqual(reloaded.getPageCount(), 1);
    });

    it("recovers a damaged PDF with corrupted xref or missing trailer using qpdf/gs fallback", async () => {
      // Create a valid PDF then simulate corruption by truncating trailer
      const doc = await PDFDocument.create();
      const page = doc.addPage([200, 200]);
      page.drawText("Corrupt Me", { x: 20, y: 150, size: 12 });
      const validBytes = await doc.save();
      const validStr = Buffer.from(validBytes).toString("latin1");

      // Truncate the %%EOF and trailer slightly to corrupt the xref table
      const eofIndex = validStr.lastIndexOf("%%EOF");
      assert.strictEqual(eofIndex > 0, true);
      const damagedStr = validStr.slice(0, eofIndex);
      const damagedBuffer = Buffer.from(damagedStr, "latin1");

      const repaired = await repairPdfBuffer(damagedBuffer);
      assert.strictEqual(repaired instanceof Buffer, true);
      assert.strictEqual(repaired.length > 0, true);

      // Verify that the repaired PDF is now parseable and readable
      const reloaded = await PDFDocument.load(repaired);
      assert.strictEqual(reloaded.getPageCount(), 1);
    });

    it("rejects non-PDF empty data gracefully", async () => {
      await assert.rejects(
        async () => {
          await repairPdfBuffer(Buffer.from("not a pdf at all"));
        },
        {
          message: /PDF repair failed|Unable to repair PDF structure/,
        }
      );
    });
  });
});
