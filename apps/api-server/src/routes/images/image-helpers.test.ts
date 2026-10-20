import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  createColorManagedPipeline,
  sharpFormatFromMime,
  extFromFormat,
  getOptimizedJpegOptions,
  getOptimizedWebpOptions,
  getOptimizedAvifOptions,
  getOptimizedTiffOptions,
} from "./image-helpers.js";

function create2FrameGif(): Buffer {
  return Buffer.from([
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
    0x02, 0x00, 0x02, 0x00, 0x80, 0x00, 0x00,
    0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF,
    0x21, 0xFF, 0x0B,
    0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30,
    0x03, 0x01, 0x00, 0x00, 0x00,
    0x21, 0xF9, 0x04, 0x00, 0x0A, 0x00, 0x00, 0x00,
    0x2C, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00,
    0x02, 0x02, 0x44, 0x01, 0x00,
    0x21, 0xF9, 0x04, 0x00, 0x0A, 0x00, 0x00, 0x00,
    0x2C, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00,
    0x02, 0x02, 0x4C, 0x01, 0x00,
    0x3B,
  ]);
}

describe("image-helpers unit tests", () => {
  it("sharpFormatFromMime maps MIME types correctly", () => {
    assert.strictEqual(sharpFormatFromMime("image/jpeg"), "jpeg");
    assert.strictEqual(sharpFormatFromMime("image/jpg"), "jpeg");
    assert.strictEqual(sharpFormatFromMime("image/png"), "png");
    assert.strictEqual(sharpFormatFromMime("image/webp"), "webp");
    assert.strictEqual(sharpFormatFromMime("image/avif"), "avif");
    assert.strictEqual(sharpFormatFromMime("image/gif"), "gif");
    assert.strictEqual(sharpFormatFromMime("image/tiff"), "tiff");
    assert.strictEqual(sharpFormatFromMime("unknown"), "jpeg");
  });

  it("extFromFormat maps jpeg to jpg and others as-is", () => {
    assert.strictEqual(extFromFormat("jpeg"), "jpg");
    assert.strictEqual(extFromFormat("png"), "png");
  });

  it("getOptimizedJpegOptions returns valid sharp options", () => {
    const opts = getOptimizedJpegOptions(85, false);
    assert.strictEqual(opts.quality, 85);
    assert.strictEqual(opts.progressive, true);
    assert.strictEqual(opts.chromaSubsampling, "4:2:0");
  });

  it("getOptimizedWebpOptions returns valid sharp options", () => {
    const opts = getOptimizedWebpOptions(80, true);
    assert.strictEqual(opts.quality, 80);
    assert.strictEqual(opts.nearLossless, true);
  });

  it("getOptimizedAvifOptions clamps quality at 75", () => {
    const opts = getOptimizedAvifOptions(90);
    assert.strictEqual(opts.quality, 75);
  });

  it("getOptimizedTiffOptions returns valid options", () => {
    const opts = getOptimizedTiffOptions(90);
    assert.strictEqual(opts.quality, 90);
    assert.strictEqual(opts.compression, "deflate");
  });

  it("createColorManagedPipeline supports animated option for multi-frame preservation", async () => {
    const gifBuf = create2FrameGif();
    // Default / false: collapses to 1 page on output
    const bufStatic = await createColorManagedPipeline(gifBuf).gif().toBuffer();
    const metaStatic = await sharp(bufStatic, { animated: true }).metadata();
    assert.strictEqual(metaStatic.pages, 1);

    // Animated: true: preserves 2 pages on output
    const bufAnimated = await createColorManagedPipeline(gifBuf, true).gif().toBuffer();
    const metaAnimated = await sharp(bufAnimated, { animated: true }).metadata();
    assert.strictEqual(metaAnimated.pages, 2);
  });
});
