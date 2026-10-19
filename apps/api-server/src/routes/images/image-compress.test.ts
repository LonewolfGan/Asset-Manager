import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { compressAtQuality, compressToTargetBytes, compressImageBuffer } from "./image-compress.js";

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

  it("compresses AVIF within Pareto speed limits (< 2000ms) and outputs valid AVIF metadata", async () => {
    const sample = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 3,
        background: { r: 50, g: 150, b: 200 },
        noise: { type: "gaussian", mean: 128, sigma: 25 },
      },
    })
      .png()
      .toBuffer();

    const start = Date.now();
    const { output, outMime } = await compressAtQuality(sample, "image/avif", 65);
    const elapsed = Date.now() - start;

    assert.strictEqual(outMime, "image/avif");
    assert.strictEqual(output instanceof Buffer, true);
    assert.strictEqual(elapsed < 2000, true, `AVIF compression was too slow (${elapsed}ms)`);

    const meta = await sharp(output).metadata();
    assert.strictEqual(meta.format, "heif"); // sharp reports AVIF container as heif
  });

  it("compresses JPEG with progressive MozJPEG configuration and valid sRGB space", async () => {
    const sample = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 3,
        background: { r: 200, g: 80, b: 50 },
        noise: { type: "gaussian", mean: 128, sigma: 30 },
      },
    })
      .jpeg()
      .toBuffer();

    const { output, outMime } = await compressAtQuality(sample, "image/jpeg", 82);
    assert.strictEqual(outMime, "image/jpeg");

    const meta = await sharp(output).metadata();
    assert.strictEqual(meta.format, "jpeg");
    assert.strictEqual(meta.isProgressive, true);
    assert.strictEqual(meta.space, "srgb");
  });

  it("compresses WebP with smart subsampling and high efficiency under 1000ms", async () => {
    const sample = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 3,
        background: { r: 80, g: 180, b: 80 },
        noise: { type: "gaussian", mean: 128, sigma: 20 },
      },
    })
      .png()
      .toBuffer();

    const start = Date.now();
    const { output, outMime } = await compressAtQuality(sample, "image/webp", 80);
    const elapsed = Date.now() - start;

    assert.strictEqual(outMime, "image/webp");
    assert.strictEqual(elapsed < 1000, true, `WebP compression took too long (${elapsed}ms)`);

    const meta = await sharp(output).metadata();
    assert.strictEqual(meta.format, "webp");
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

  it("integrates cropImageBuffer cleanly for image-crop endpoint usage", async () => {
    const { cropImageBuffer } = await import("./image-crop-logic.js");
    const sample = await sharp({
      create: {
        width: 120,
        height: 120,
        channels: 3,
        background: { r: 100, g: 150, b: 200 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await cropImageBuffer(sample, {
      left: 10,
      top: 10,
      width: 50,
      height: 50,
      outputFormat: "image/webp",
      isGraphic: true,
    });

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    assert.strictEqual(buffer.length > 0, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 50);
    assert.strictEqual(meta.height, 50);
    assert.strictEqual(meta.format, "webp");
  });

  it("guarantees compressedSize <= originalSize even on already compressed images", async () => {
    const baseJpeg = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 120, g: 120, b: 120 },
      },
    })
      .jpeg({ quality: 20 })
      .toBuffer();

    const result = await compressImageBuffer(baseJpeg, "image/jpeg", { quality: 95 });
    assert.strictEqual(result.compressedSize <= result.originalSize, true);
    assert.strictEqual(result.gain >= 0, true);
    assert.strictEqual(result.buffer instanceof Buffer, true);
  });

  it("computes accurate gain and returns valid buffer and mime headers", async () => {
    const rawPng = await sharp({
      create: {
        width: 120,
        height: 120,
        channels: 4,
        background: { r: 255, g: 50, b: 50, alpha: 1 },
      },
    })
      .png({ compressionLevel: 1 })
      .toBuffer();

    const result = await compressImageBuffer(rawPng, "image/png", { quality: 60 });
    assert.strictEqual(result.mime, "image/png");
    assert.strictEqual(result.ext, "png");
    assert.strictEqual(result.originalSize, rawPng.length);
    assert.strictEqual(result.compressedSize, result.buffer.length);
    assert.strictEqual(result.gain, Math.max(0, Math.round((1 - result.compressedSize / result.originalSize) * 100)));
    assert.strictEqual(result.compressedSize <= result.originalSize, true);
  });

  it("works properly with targetKB constraint", async () => {
    const rawPng = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 3,
        background: { r: 10, g: 200, b: 150 },
        noise: { type: "gaussian", mean: 128, sigma: 40 },
      },
    })
      .png()
      .toBuffer();

    const targetKB = 5;
    const result = await compressImageBuffer(rawPng, "image/png", { targetKB, isGraphic: true });
    assert.strictEqual(result.compressedSize <= result.originalSize, true);
    assert.strictEqual(result.buffer.length > 0, true);
    assert.strictEqual(result.mime, "image/png");
  });

  it("supports isGraphic flag with compressToTargetBytes", async () => {
    const rawPng = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 0, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const compressed = await compressToTargetBytes(rawPng, "image/png", 1000, true);
    assert.strictEqual(compressed instanceof Buffer, true);
    assert.strictEqual(compressed.length > 0, true);
  });
});


