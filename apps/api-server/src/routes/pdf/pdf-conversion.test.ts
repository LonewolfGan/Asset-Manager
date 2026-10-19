import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PDFDocument } from "pdf-lib";
import sharp from "sharp";
import {
  rasterizePdfToImages,
  convertPdfToPdfa,
  convertImagesToPdf,
} from "./pdf-conversion-logic.js";
import { buildContentDisposition } from "../convert/convert-image.js";

async function createSamplePdf(): Promise<Buffer> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([200, 200]);
  page.drawText("Route Integration Test", { x: 20, y: 100 });
  return Buffer.from(await doc.save());
}

describe("PDF Conversion Routes & Integration (TDD)", () => {
  it("verifies pdf-to-images single page disposition and execution", async () => {
    const pdfBuf = await createSamplePdf();
    const result = await rasterizePdfToImages(pdfBuf, {
      format: "webp",
      dpi: 150,
      baseName: "contract.v1.0",
    });

    assert.strictEqual(result.isZip, false);
    assert.strictEqual(result.mime, "image/webp");

    const disposition = buildContentDisposition("contract.v1.0_page_1.webp", "webp");
    assert.strictEqual(disposition.includes('filename="contract.v1.0_page_1.webp"'), true);
    assert.strictEqual(disposition.includes("filename*="), true);
  });

  it("verifies pdf-to-images multi-page zip disposition and execution", async () => {
    const doc = await PDFDocument.create();
    doc.addPage([200, 200]);
    doc.addPage([200, 200]);
    const pdfBuf = Buffer.from(await doc.save());

    const result = await rasterizePdfToImages(pdfBuf, {
      format: "png",
      dpi: 150,
      baseName: "scan.2024",
    });

    assert.strictEqual(result.isZip, true);
    assert.strictEqual(result.pageCount, 2);

    const disposition = buildContentDisposition("scan.2024_images_png.zip", "zip");
    assert.strictEqual(disposition.includes('filename="scan.2024_images_png.zip"'), true);
    assert.strictEqual(disposition.includes("filename*="), true);
  });

  it("verifies pdf-to-pdfa disposition and execution", async () => {
    const pdfBuf = await createSamplePdf();
    const result = await convertPdfToPdfa(pdfBuf, { conformance: "2b" });

    assert.strictEqual(result.buffer instanceof Buffer, true);
    assert.strictEqual(result.pageCount, 1);
    assert.strictEqual(result.buffer.length > 0, true);

    const disposition = buildContentDisposition("archive.final_pdfa2b.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="archive.final_pdfa2b.pdf"'), true);
  });

  it("verifies pdf-to-pdfa throws on invalid or empty buffer", async () => {
    await assert.rejects(
      () => convertPdfToPdfa(Buffer.alloc(0)),
      /Invalid or empty PDF buffer/
    );
    await assert.rejects(
      () => convertPdfToPdfa(Buffer.from("123")),
      /Invalid or empty PDF buffer/
    );
    await assert.rejects(
      () => convertPdfToPdfa(null as unknown as Buffer),
      /Invalid or empty PDF buffer/
    );
  });

  it("verifies pdf-to-pdfa with conformance 2b produces a valid %PDF- buffer and correct page count", async () => {
    const pdfBuf = await createSamplePdf();
    const result = await convertPdfToPdfa(pdfBuf, { conformance: "2b" });

    assert.strictEqual(result.buffer instanceof Buffer, true);
    assert.strictEqual(result.pageCount, 1);
    assert.strictEqual(result.buffer.subarray(0, 5).toString(), "%PDF-");
  });

  it("verifies pdf-to-pdfa with conformance 1b and 3b works properly", async () => {
    const pdfBuf = await createSamplePdf();

    const res1b = await convertPdfToPdfa(pdfBuf, { conformance: "1b" });
    assert.strictEqual(res1b.buffer instanceof Buffer, true);
    assert.strictEqual(res1b.pageCount, 1);
    assert.strictEqual(res1b.buffer.subarray(0, 5).toString(), "%PDF-");

    const res3b = await convertPdfToPdfa(pdfBuf, { conformance: "3b" });
    assert.strictEqual(res3b.buffer instanceof Buffer, true);
    assert.strictEqual(res3b.pageCount, 1);
    assert.strictEqual(res3b.buffer.subarray(0, 5).toString(), "%PDF-");
  });

  it("verifies images-to-pdf disposition and execution", async () => {
    const imgBuf = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 3,
        background: { r: 10, g: 200, b: 100 },
      },
    })
      .jpeg()
      .toBuffer();

    const result = await convertImagesToPdf([
      { buffer: imgBuf, mime: "image/jpeg", name: "page1.jpg" },
    ]);

    assert.strictEqual(result.pageCount, 1);
    assert.strictEqual(result.buffer instanceof Buffer, true);

    const disposition = buildContentDisposition("photos_combined.pdf", "pdf");
    assert.strictEqual(disposition.includes('filename="photos_combined.pdf"'), true);
  });
});
