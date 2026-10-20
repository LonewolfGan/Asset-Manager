import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  cleanImageMetadata,
  applyImageFilter,
  type ImageFilterType,
} from "./image-filter-logic.js";

describe("Image Filter & Metadata Cleaning Studio Engine (TDD)", () => {
  describe("cleanImageMetadata", () => {
    it("strips EXIF metadata while maintaining visual orientation on portrait photos", async () => {
      // 400x200 with orientation 6 (portrait 200x400) and custom metadata
      const exifSample = await sharp({
        create: {
          width: 400,
          height: 200,
          channels: 3,
          background: { r: 180, g: 90, b: 30 },
        },
      })
        .withMetadata({ orientation: 6 })
        .jpeg()
        .toBuffer();

      const { buffer, mime, ext } = await cleanImageMetadata(exifSample, {
        outputFormat: "image/jpeg",
      });

      assert.strictEqual(mime, "image/jpeg");
      assert.strictEqual(ext, "jpg");
      assert.strictEqual(buffer.length > 0, true);

      const meta = await sharp(buffer).metadata();
      // Should be rotated to 200x400 physically and orientation/exif/icc stripped
      assert.strictEqual(meta.width, 200);
      assert.strictEqual(meta.height, 400);
      assert.strictEqual(meta.orientation, undefined);
      assert.strictEqual(meta.exif, undefined);
    });

    it("flattens transparent PNG to white background when cleaning to JPEG", async () => {
      const sample = await sharp({
        create: {
          width: 80,
          height: 80,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toBuffer();

      const { buffer, mime } = await cleanImageMetadata(sample, {
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
  });

  describe("applyImageFilter", () => {
    it("applies grayscale filter accurately converting RGB to gray values", async () => {
      const sample = await sharp({
        create: {
          width: 50,
          height: 50,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer();

      const { buffer, mime } = await applyImageFilter(sample, {
        filter: "grayscale",
        outputFormat: "image/png",
      });

      assert.strictEqual(mime, "image/png");
      const raw = await sharp(buffer).raw().toBuffer();
      // Gray channel values should be equal or 1 channel
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.channels === 1 || (raw[0] === raw[1] && raw[1] === raw[2]), true);
    });

    it("applies sepia color matrix accurately without clipping channels", async () => {
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

      const { buffer, mime } = await applyImageFilter(sample, {
        filter: "sepia",
        outputFormat: "image/png",
      });

      assert.strictEqual(mime, "image/png");
      const raw = await sharp(buffer).raw().toBuffer();
      // Sepia characteristic: R > G > B
      assert.strictEqual(raw[0] > raw[1], true);
      assert.strictEqual(raw[1] > raw[2], true);
    });

    it("applies invert / negative filter accurately", async () => {
      const sample = await sharp({
        create: {
          width: 50,
          height: 50,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .png()
        .toBuffer();

      const { buffer } = await applyImageFilter(sample, {
        filter: "invert",
        outputFormat: "image/png",
      });

      const raw = await sharp(buffer).raw().toBuffer();
      // Inverted red (255,0,0) becomes cyan (0,255,255)
      assert.strictEqual(raw[0], 0);
      assert.strictEqual(raw[1], 255);
      assert.strictEqual(raw[2], 255);
    });

    it("applies blur filter with safe sigma clamping", async () => {
      const sample = await sharp({
        create: {
          width: 60,
          height: 60,
          channels: 3,
          background: { r: 150, g: 150, b: 150 },
        },
      })
        .png()
        .toBuffer();

      const { buffer } = await applyImageFilter(sample, {
        filter: "blur",
        value: 100, // Should be clamped to safe maximum (e.g. 50 or 20)
        outputFormat: "image/png",
      });

      assert.strictEqual(buffer.length > 0, true);
    });

    it("encodes filtered WebP with Pareto efficiency under 1000ms", async () => {
      const sample = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 3,
          background: { r: 80, g: 120, b: 160 },
        },
      })
        .png()
        .toBuffer();

      const start = Date.now();
      const { buffer, mime, ext } = await applyImageFilter(sample, {
        filter: "sepia",
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

    it("applies sepia on 4-channel transparent PNG without libvips recomb crash and preserves alpha", async () => {
      const transparentSample = await sharp({
        create: {
          width: 50,
          height: 50,
          channels: 4,
          background: { r: 120, g: 80, b: 200, alpha: 0.5 },
        },
      })
        .png()
        .toBuffer();

      const { buffer, mime } = await applyImageFilter(transparentSample, {
        filter: "sepia",
        outputFormat: "image/png",
      });

      assert.strictEqual(mime, "image/png");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.hasAlpha, true);
      assert.strictEqual(meta.channels, 4);

      const raw = await sharp(buffer).raw().toBuffer();
      // Sepia characteristic: R > G > B
      assert.strictEqual(raw[0] > raw[1], true);
      assert.strictEqual(raw[1] > raw[2], true);
      // Alpha channel is preserved (~128)
      assert.strictEqual(raw[3] > 100 && raw[3] < 150, true);
    });

    it("applies sepia on 1-channel grayscale image without libvips recomb crash", async () => {
      const graySample = await sharp({
        create: {
          width: 40,
          height: 40,
          channels: 3,
          background: { r: 128, g: 128, b: 128 },
        },
      })
        .grayscale()
        .png()
        .toBuffer();

      const { buffer, mime } = await applyImageFilter(graySample, {
        filter: "sepia",
        outputFormat: "image/png",
      });

      assert.strictEqual(mime, "image/png");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.channels! >= 3, true);
    });

    it("applies brightness, contrast, and sharpen filters accurately", async () => {
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

      // Test brightness
      const { buffer: brightBuf } = await applyImageFilter(sample, {
        filter: "brightness",
        value: 1.5,
        outputFormat: "image/png",
      });
      const brightRaw = await sharp(brightBuf).raw().toBuffer();
      assert.strictEqual(brightRaw[0] > 100, true);

      // Test contrast
      const { buffer: contrastBuf } = await applyImageFilter(sample, {
        filter: "contrast",
        value: 1.4,
        outputFormat: "image/png",
      });
      assert.strictEqual(contrastBuf.length > 0, true);

      // Test sharpen
      const { buffer: sharpBuf } = await applyImageFilter(sample, {
        filter: "sharpen",
        value: 2.0,
        outputFormat: "image/png",
      });
      assert.strictEqual(sharpBuf.length > 0, true);
    });
  });
});

