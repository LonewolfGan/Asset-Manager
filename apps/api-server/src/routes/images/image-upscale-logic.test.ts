import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  upscaleImageBuffer,
  type UpscaleOptions,
} from "./image-upscale-logic.js";

describe("Image Upscale Studio Engine (TDD)", () => {
  it("upscales 2x preserving aspect ratio and dimensions with Lanczos3", async () => {
    const sample = await sharp({
      create: {
        width: 150,
        height: 100,
        channels: 3,
        background: { r: 50, g: 120, b: 200 },
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
    assert.strictEqual(meta.width, 300);
    assert.strictEqual(meta.height, 200);
    assert.strictEqual(meta.format, "png");
  });

  it("upscales 4x with aspect ratio preservation when approaching maximum dimension limit", async () => {
    // 2500 x 1000: 4x would be 10000 x 4000, which exceeds 8000 maxDim
    const wideSample = await sharp({
      create: {
        width: 2500,
        height: 1000,
        channels: 3,
        background: { r: 80, g: 160, b: 90 },
      },
    })
      .jpeg()
      .toBuffer();

    const { buffer, mime } = await upscaleImageBuffer(wideSample, {
      scale: 4,
      sharpen: false,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 8000);
    assert.strictEqual(meta.height, 3200); // 8000 / 2.5 = 3200 (aspect ratio 2.5:1 strictly preserved!)
  });

  it("normalizes Display P3 / rotated EXIF photos to sRGB", async () => {
    const rotated = await sharp({
      create: {
        width: 300,
        height: 150,
        channels: 3,
        background: { r: 240, g: 80, b: 50 },
      },
    })
      .withMetadata({ orientation: 6 }) // 90 deg clockwise (portrait transposition -> 150x300)
      .jpeg()
      .toBuffer();

    const { buffer } = await upscaleImageBuffer(rotated, {
      scale: 2,
      outputFormat: "image/jpeg",
    });

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 300); // 150 * 2
    assert.strictEqual(meta.height, 600); // 300 * 2
    assert.strictEqual(meta.space, "srgb");
  });

  it("flattens transparent PNG to white background when upscaling to JPEG", async () => {
    const transparent = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime } = await upscaleImageBuffer(transparent, {
      scale: 2,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.hasAlpha, false);
    assert.strictEqual(meta.width, 200);
    assert.strictEqual(meta.height, 200);
  });

  it("supports WebP Pareto output encoding under 1000ms", async () => {
    const sample = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 30, g: 150, b: 220 },
      },
    })
      .png()
      .toBuffer();

    const start = Date.now();
    const { buffer, mime, ext } = await upscaleImageBuffer(sample, {
      scale: 2,
      outputFormat: "image/webp",
      quality: 85,
    });
    const elapsed = Date.now() - start;

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    assert.strictEqual(elapsed < 1000, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.format, "webp");
    assert.strictEqual(meta.width, 400);
    assert.strictEqual(meta.height, 400);
  });

  it("preserves alpha channel when upscaling transparent PNG to PNG", async () => {
    const transparent = await sharp({
      create: {
        width: 120,
        height: 80,
        channels: 4,
        background: { r: 120, g: 60, b: 200, alpha: 0.4 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await upscaleImageBuffer(transparent, {
      scale: 2,
      outputFormat: "image/png",
    });

    assert.strictEqual(mime, "image/png");
    assert.strictEqual(ext, "png");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.hasAlpha, true);
    assert.strictEqual(meta.channels, 4);
    assert.strictEqual(meta.width, 240);
    assert.strictEqual(meta.height, 160);
  });

  it("preserves alpha channel when upscaling transparent PNG to WebP", async () => {
    const transparent = await sharp({
      create: {
        width: 150,
        height: 150,
        channels: 4,
        background: { r: 10, g: 200, b: 100, alpha: 0.6 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await upscaleImageBuffer(transparent, {
      scale: 2,
      outputFormat: "image/webp",
    });

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.hasAlpha, true);
    assert.strictEqual(meta.channels, 4);
    assert.strictEqual(meta.width, 300);
    assert.strictEqual(meta.height, 300);
  });

  it("clamps vertical tall image to 8000px maximum dimension while strictly preserving aspect ratio", async () => {
    // 1000 x 2500: 4x would be 4000 x 10000, clamped by maxDim 8000 to 3200 x 8000
    const tallSample = await sharp({
      create: {
        width: 1000,
        height: 2500,
        channels: 3,
        background: { r: 40, g: 100, b: 220 },
      },
    })
      .jpeg()
      .toBuffer();

    const { buffer, mime } = await upscaleImageBuffer(tallSample, {
      scale: 4,
      sharpen: false,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.height, 8000);
    assert.strictEqual(meta.width, 3200); // 8000 * (1000 / 2500) = 3200
  });
});

