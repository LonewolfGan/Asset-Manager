import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { upscaleImageBuffer } from "./image-upscale-logic.js";

describe("Image Enhance & Upscale Endpoints (TDD)", () => {
  it("upscales buffer properly via pure engine", async () => {
    const sample = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 120, g: 60, b: 200 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await upscaleImageBuffer(sample, {
      scale: 2,
      sharpen: true,
      outputFormat: "image/png",
    });

    assert.strictEqual(mime, "image/png");
    assert.strictEqual(ext, "png");
    assert.strictEqual(buffer.length > 0, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 200);
    assert.strictEqual(meta.height, 200);
  });

  it("verifies cleanImageMetadata integrates cleanly", async () => {
    const { cleanImageMetadata } = await import("./image-filter-logic.js");
    const sample = await sharp({
      create: { width: 60, height: 60, channels: 3, background: { r: 50, g: 50, b: 50 } },
    }).png().toBuffer();

    const { buffer, mime, ext, originalSize, cleanedSize } = await cleanImageMetadata(sample, {
      outputFormat: "image/webp",
    });

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    assert.strictEqual(buffer.length > 0, true);
    assert.strictEqual(originalSize > 0, true);
    assert.strictEqual(cleanedSize > 0, true);
  });

  it("verifies applyImageFilter integrates cleanly with filters and formats", async () => {
    const { applyImageFilter } = await import("./image-filter-logic.js");
    const sample = await sharp({
      create: { width: 60, height: 60, channels: 3, background: { r: 200, g: 100, b: 50 } },
    }).png().toBuffer();

    const { buffer, mime, ext } = await applyImageFilter(sample, {
      filter: "grayscale",
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    assert.strictEqual(ext, "jpg");
    assert.strictEqual(buffer.length > 0, true);
  });
});

