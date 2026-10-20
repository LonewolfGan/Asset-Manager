import { test, describe } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { preprocessImageForOcr } from "./extract-tools.js";
import { resolveTesseractLanguages } from "./pdf/pdf-ocr-logic.js";

describe("Extract Tools & OCR Engine (TDD)", () => {
  test("preprocessImageForOcr normalizes orientation, grayscale, and returns valid PNG", async () => {
    const initialBuf = await sharp({
      create: {
        width: 300,
        height: 150,
        channels: 3,
        background: { r: 240, g: 200, b: 100 },
      },
    })
      .jpeg()
      .toBuffer();

    const preprocessed = await preprocessImageForOcr(initialBuf);
    assert.ok(preprocessed.length > 0);

    const meta = await sharp(preprocessed).metadata();
    assert.equal(meta.format, "png");
    assert.equal(meta.width, 300);
    assert.equal(meta.height, 150);
    assert.equal(meta.channels, 1); // Grayscale
  });

  test("preprocessImageForOcr scales down oversized images (> 4000px) safely", async () => {
    const hugeBuf = await sharp({
      create: {
        width: 5000,
        height: 2500,
        channels: 3,
        background: { r: 255, g: 255, b: 255 },
      },
    })
      .png()
      .toBuffer();

    const preprocessed = await preprocessImageForOcr(hugeBuf);
    const meta = await sharp(preprocessed).metadata();

    assert.ok(meta.width && meta.width <= 4000);
    assert.ok(meta.height && meta.height <= 2500);
    assert.equal(meta.format, "png");
  });

  test("resolveTesseractLanguages formats languages correctly for Tesseract CLI", () => {
    assert.deepEqual(resolveTesseractLanguages("fr"), ["fra"]);
    assert.deepEqual(resolveTesseractLanguages("en"), ["eng"]);
    assert.deepEqual(resolveTesseractLanguages("fr+en"), ["fra", "eng"]);
    assert.deepEqual(resolveTesseractLanguages("deu"), ["deu"]);
    assert.deepEqual(resolveTesseractLanguages(""), ["eng"]);
  });

  test("rejects invalid or empty buffers gracefully", async () => {
    await assert.rejects(
      async () => {
        await preprocessImageForOcr(Buffer.alloc(0));
      },
      /Input buffer has corrupt header or is empty|empty/i,
    );
  });
});
