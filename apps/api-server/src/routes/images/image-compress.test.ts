import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { compressAtQuality, compressToTargetBytes } from "./image-compress.js";

describe("Image Compression Optimization (TDD)", () => {
  it("compresses PNG with target bytes without redundant loops", async () => {
    // Generate a 100x100 PNG test image
    const samplePng = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const start = Date.now();
    const compressed = await compressToTargetBytes(samplePng, "image/png", 1000);
    const elapsed = Date.now() - start;

    assert.strictEqual(compressed instanceof Buffer, true);
    assert.strictEqual(compressed.length > 0, true);
    // Should complete in well under 2 seconds (not blocked by 28x heavy loops)
    assert.strictEqual(elapsed < 2000, true);
  });

  it("compresses at quality properly for JPEG and PNG", async () => {
    const sampleJpeg = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 0, g: 0, b: 0 },
        noise: { type: "gaussian", mean: 128, sigma: 30 },
      },
    })
      .jpeg()
      .toBuffer();

    const { output: highQ } = await compressAtQuality(sampleJpeg, "image/jpeg", 90);
    const { output: lowQ } = await compressAtQuality(sampleJpeg, "image/jpeg", 20);

    assert.strictEqual(lowQ.length < highQ.length, true);
  });

  it("compresses complex PNG with palette quantization binary search when deflate exceeds targetBytes", async () => {
    const noisePng = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 4,
        background: { r: 120, g: 120, b: 120, alpha: 1 },
        noise: { type: "gaussian", mean: 128, sigma: 50 },
      },
    })
      .png()
      .toBuffer();

    const lossless = await sharp(noisePng).png({ compressionLevel: 9, effort: 7 }).toBuffer();
    assert.strictEqual(lossless.length > 15000, true);

    // Target 70% of lossless size to force binary search quantization
    const targetBytes = Math.round(lossless.length * 0.7);
    const compressed = await compressToTargetBytes(noisePng, "image/png", targetBytes);

    assert.strictEqual(compressed instanceof Buffer, true);
    assert.strictEqual(compressed.length <= targetBytes || compressed.length < lossless.length, true);
  });
});
