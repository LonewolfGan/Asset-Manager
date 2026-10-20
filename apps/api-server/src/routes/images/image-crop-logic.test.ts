import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  cropImageBuffer,
  type ImageCropOptions,
} from "./image-crop-logic.js";

describe("Image Crop Studio Engine (TDD)", () => {
  it("crops image with exact coordinates and dimensions", async () => {
    // 200x200 image with 4 quadrant colors
    // top-left (0,0): red
    const sample = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .composite([
        {
          input: await sharp({
            create: { width: 100, height: 100, channels: 3, background: { r: 0, g: 255, b: 0 } },
          }).png().toBuffer(),
          left: 100,
          top: 0,
        },
      ])
      .png()
      .toBuffer();

    // Crop top-right green quadrant (left: 100, top: 0, width: 100, height: 100)
    const { buffer, mime, ext } = await cropImageBuffer(sample, {
      left: 100,
      top: 0,
      width: 100,
      height: 100,
      outputFormat: "image/png",
    });

    assert.strictEqual(mime, "image/png");
    assert.strictEqual(ext, "png");
    assert.strictEqual(buffer.length > 0, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 100);
    assert.strictEqual(meta.height, 100);

    const raw = await sharp(buffer).raw().toBuffer();
    assert.strictEqual(raw[0], 0);   // R is 0
    assert.strictEqual(raw[1], 255); // G is 255 (Green quadrant)
    assert.strictEqual(raw[2], 0);   // B is 0
  });

  it("normalizes EXIF orientation before cropping so portrait photos crop accurately", async () => {
    // 400x200 landscape raw with orientation 6 (portrait 200x400 after auto-orient)
    const exifSample = await sharp({
      create: {
        width: 400,
        height: 200,
        channels: 3,
        background: { r: 120, g: 60, b: 180 },
      },
    })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toBuffer();

    // Crop box based on the oriented 200x400 image (e.g. 150x250)
    const { buffer, mime } = await cropImageBuffer(exifSample, {
      left: 20,
      top: 50,
      width: 150,
      height: 250,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 150);
    assert.strictEqual(meta.height, 250);
    assert.strictEqual(meta.space, "srgb");
  });

  it("safely clamps boundary-exceeding coordinates without throwing Sharp errors", async () => {
    const sample = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 3,
        background: { r: 50, g: 100, b: 150 },
      },
    })
      .png()
      .toBuffer();

    // Request crop extending past image edge (left: 80, width: 50 -> total 130 > 100)
    const { buffer } = await cropImageBuffer(sample, {
      left: 80,
      top: 70,
      width: 50,
      height: 60,
      outputFormat: "image/png",
    });

    const meta = await sharp(buffer).metadata();
    // Clamped width: 100 - 80 = 20
    assert.strictEqual(meta.width, 20);
    // Clamped height: 100 - 70 = 30
    assert.strictEqual(meta.height, 30);
  });

  it("flattens transparent background to white when cropping PNG to JPEG", async () => {
    const sample = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }, // fully transparent
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime } = await cropImageBuffer(sample, {
      left: 10,
      top: 10,
      width: 50,
      height: 50,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.hasAlpha, false);

    const raw = await sharp(buffer).raw().toBuffer();
    assert.strictEqual(raw[0] > 240, true); // White R
    assert.strictEqual(raw[1] > 240, true); // White G
    assert.strictEqual(raw[2] > 240, true); // White B
  });

  it("encodes WebP cropped output with Pareto efficiency under 1000ms", async () => {
    const sample = await sharp({
      create: {
        width: 300,
        height: 300,
        channels: 3,
        background: { r: 200, g: 100, b: 50 },
      },
    })
      .png()
      .toBuffer();

    const start = Date.now();
    const { buffer, mime, ext } = await cropImageBuffer(sample, {
      left: 50,
      top: 50,
      width: 150,
      height: 150,
      outputFormat: "image/webp",
      quality: 85,
    });
    const elapsed = Date.now() - start;

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    assert.strictEqual(elapsed < 1000, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 150);
    assert.strictEqual(meta.height, 150);
    assert.strictEqual(meta.format, "webp");
  });

  it("throws descriptive error when width or height is invalid or non-positive", async () => {
    const sample = await sharp({
      create: { width: 50, height: 50, channels: 3, background: { r: 10, g: 10, b: 10 } },
    }).png().toBuffer();

    await assert.rejects(
      async () => {
        await cropImageBuffer(sample, {
          left: 0,
          top: 0,
          width: 0,
          height: 50,
        });
      },
      {
        message: /Invalid crop dimensions/,
      }
    );
  });
});
