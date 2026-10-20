import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  transformFlipRotate,
  type FlipRotateOptions,
} from "./flip-rotate-logic.js";

describe("Flip & Rotate Studio Engine (TDD)", () => {
  it("rotates image by 90 degrees swapping width and height", async () => {
    const sample = await sharp({
      create: {
        width: 300,
        height: 150,
        channels: 3,
        background: { r: 10, g: 150, b: 200 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await transformFlipRotate(sample, {
      rotation: 90,
      outputFormat: "image/png",
    });

    assert.strictEqual(mime, "image/png");
    assert.strictEqual(ext, "png");
    assert.strictEqual(buffer.length > 0, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 150);
    assert.strictEqual(meta.height, 300);
  });

  it("applies horizontal and vertical mirror flips", async () => {
    // 1. Flip horizontal sur image 2x1 (gauche rouge, droite bleu)
    const twoPixels = await sharp({
      create: {
        width: 2,
        height: 1,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .composite([
        {
          input: await sharp({
            create: { width: 1, height: 1, channels: 3, background: { r: 0, g: 0, b: 255 } },
          }).png().toBuffer(),
          left: 1,
          top: 0,
        },
      ])
      .png()
      .toBuffer();

    const { buffer: hBuf } = await transformFlipRotate(twoPixels, {
      flipH: true,
      outputFormat: "image/png",
    });

    const hMeta = await sharp(hBuf).metadata();
    const hStep = hMeta.channels || 3;
    const raw = await sharp(hBuf).raw().toBuffer();
    // Pixel 0 (gauche) devient bleu (0,0,255)
    assert.strictEqual(raw[0], 0);
    assert.strictEqual(raw[2], 255);
    // Pixel 1 (droite) devient rouge (255,0,0) à l'offset hStep
    assert.strictEqual(raw[hStep], 255);
    assert.strictEqual(raw[hStep + 2], 0);

    // 2. Flip vertical sur image 1x2 (haut vert, bas jaune)
    const vertSample = await sharp({
      create: {
        width: 1,
        height: 2,
        channels: 3,
        background: { r: 0, g: 255, b: 0 },
      },
    })
      .composite([
        {
          input: await sharp({
            create: { width: 1, height: 1, channels: 3, background: { r: 255, g: 255, b: 0 } },
          }).png().toBuffer(),
          left: 0,
          top: 1,
        },
      ])
      .png()
      .toBuffer();

    const { buffer: vBuf } = await transformFlipRotate(vertSample, {
      flipV: true,
      outputFormat: "image/png",
    });

    const vMeta = await sharp(vBuf).metadata();
    const vStep = vMeta.channels || 3;
    const vRaw = await sharp(vBuf).raw().toBuffer();
    // Pixel 0 (haut) devient jaune (255,255,0)
    assert.strictEqual(vRaw[0], 255);
    assert.strictEqual(vRaw[1], 255);
    // Pixel 1 (bas) devient vert (0,255,0) à l'offset vStep
    assert.strictEqual(vRaw[vStep], 0);
    assert.strictEqual(vRaw[vStep + 1], 255);
  });

  it("normalizes EXIF orientation before applying user rotation", async () => {
    // 400x200 with orientation 6 (portrait 200x400 after auto-orient)
    const exifSample = await sharp({
      create: {
        width: 400,
        height: 200,
        channels: 3,
        background: { r: 200, g: 80, b: 40 },
      },
    })
      .withMetadata({ orientation: 6 })
      .jpeg()
      .toBuffer();

    // User applies 90 degrees rotation clockwise on the portrait image
    const { buffer, mime } = await transformFlipRotate(exifSample, {
      rotation: 90,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    // 200x400 rotated 90 deg becomes 400x200
    assert.strictEqual(meta.width, 400);
    assert.strictEqual(meta.height, 200);
    assert.strictEqual(meta.space, "srgb");
  });

  it("handles free-angle rotation (e.g. 45 degrees) without black corners on PNG", async () => {
    const sample = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 255, g: 255, b: 0, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime } = await transformFlipRotate(sample, {
      rotation: 45,
      outputFormat: "image/png",
    });

    assert.strictEqual(mime, "image/png");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.hasAlpha, true);
    // At 45 degrees, bounded box expands to ~142x142
    assert.strictEqual(meta.width! > 100, true);
    assert.strictEqual(meta.height! > 100, true);
  });

  it("flattens to white background when saving rotated image to JPEG", async () => {
    const sample = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 200, b: 100, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime } = await transformFlipRotate(sample, {
      rotation: 45,
      outputFormat: "image/jpeg",
    });

    assert.strictEqual(mime, "image/jpeg");
    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.hasAlpha, false);

    // Verify corner pixel (0,0) is white background (not black 0,0,0)
    const raw = await sharp(buffer).raw().toBuffer();
    assert.strictEqual(raw[0] > 240, true); // R of corner
    assert.strictEqual(raw[1] > 240, true); // G of corner
    assert.strictEqual(raw[2] > 240, true); // B of corner
  });

  it("handles non-finite rotation values gracefully without crashing", async () => {
    const sample = await sharp({
      create: {
        width: 50,
        height: 50,
        channels: 3,
        background: { r: 100, g: 100, b: 100 },
      },
    })
      .png()
      .toBuffer();

    const { buffer } = await transformFlipRotate(sample, {
      rotation: Number.POSITIVE_INFINITY,
      outputFormat: "image/png",
    });

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.width, 50);
    assert.strictEqual(meta.height, 50);
  });

  it("encodes WebP with Pareto efficiency under 1000ms", async () => {
    const sample = await sharp({
      create: {
        width: 200,
        height: 200,
        channels: 3,
        background: { r: 70, g: 90, b: 130 },
      },
    })
      .png()
      .toBuffer();

    const start = Date.now();
    const { buffer, mime, ext } = await transformFlipRotate(sample, {
      rotation: 180,
      flipH: true,
      outputFormat: "image/webp",
      quality: 85,
    });
    const elapsed = Date.now() - start;

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    assert.strictEqual(elapsed < 1000, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.format, "webp");
  });
});
