import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { applyWatermarkToImage } from "./watermark-logic.js";

describe("Image Transform Routes & Handlers (TDD)", () => {
  it("verifies watermark logic executes properly without shadow when hasShadow is false", async () => {
    const sample = await sharp({
      create: {
        width: 120,
        height: 120,
        channels: 3,
        background: { r: 50, g: 100, b: 150 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await applyWatermarkToImage(sample, {
      text: "NO_SHADOW_HANDLER",
      hasShadow: false,
      outputFormat: "image/png",
    });

    assert.strictEqual(mime, "image/png");
    assert.strictEqual(ext, "png");
    assert.strictEqual(buffer.length > 0, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.format, "png");
    assert.strictEqual(meta.width, 120);
    assert.strictEqual(meta.height, 120);
  });

  it("verifies favicon logic generates valid zip buffer with favicon.ico and manifest", async () => {
    const { generateFaviconPack } = await import("./favicon-logic.js");
    const sample = await sharp({
      create: {
        width: 128,
        height: 128,
        channels: 4,
        background: { r: 10, g: 120, b: 200, alpha: 1 },
      },
    })
      .png()
      .toBuffer();

    const zipBuffer = await generateFaviconPack(sample, {
      name: "TransformTest",
      themeColor: "#0a78c8",
    });

    assert.strictEqual(zipBuffer.length > 0, true);
    assert.strictEqual(zipBuffer.slice(0, 4).toString("hex"), "504b0304"); // PK zip magic number
  });

  it("verifies transformFlipRotate executes correctly with rotation, flips and formats", async () => {
    const { transformFlipRotate } = await import("./flip-rotate-logic.js");
    const sample = await sharp({
      create: {
        width: 100,
        height: 60,
        channels: 3,
        background: { r: 255, g: 0, b: 0 },
      },
    })
      .png()
      .toBuffer();

    const { buffer, mime, ext } = await transformFlipRotate(sample, {
      rotation: 90,
      flipH: true,
      flipV: false,
      outputFormat: "image/webp",
      quality: 85,
    });

    assert.strictEqual(mime, "image/webp");
    assert.strictEqual(ext, "webp");
    assert.strictEqual(buffer.length > 0, true);

    const meta = await sharp(buffer).metadata();
    assert.strictEqual(meta.format, "webp");
    assert.strictEqual(meta.width, 60);
    assert.strictEqual(meta.height, 100);
  });

  it("verifies filename with multiple dots preserves suffix when using buildContentDisposition", async () => {
    const { buildContentDisposition } = await import("../convert/convert-image.js");
    const originalName = "my.photo.2024.final.jpg";
    const rawBase = originalName.replace(/\.[^.]+$/, "");
    const ext = "png";
    const disposition = buildContentDisposition(`${rawBase}_edited.${ext}`, ext);

    assert.strictEqual(disposition.includes('filename="my.photo.2024.final_edited.png"'), true);
  });
});

