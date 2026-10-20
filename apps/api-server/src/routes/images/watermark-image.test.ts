import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  applyWatermarkToImage,
  generateWatermarkSvg,
  type WatermarkOptions,
} from "./watermark-logic.js";

describe("Watermark Image Studio & Engine (TDD)", () => {
  describe("generateWatermarkSvg", () => {
    it("escapes special characters to prevent SVG XML injection", () => {
      const svg = generateWatermarkSvg(800, 600, {
        text: 'Confidential & "Secret" <Sample> \'2024\'',
        fontSize: 32,
        color: "#ffffff",
        opacity: 0.8,
        mode: "points",
        position: "center",
      });

      const svgStr = svg.toString("utf8");
      assert.strictEqual(svgStr.includes("&amp;"), true);
      assert.strictEqual(svgStr.includes("&quot;"), true);
      assert.strictEqual(svgStr.includes("&lt;"), true);
      assert.strictEqual(svgStr.includes("&gt;"), true);
      assert.strictEqual(svgStr.includes("<Sample>"), false);
    });

    it("creates SVG with correct dimensions matching image size", () => {
      const svg = generateWatermarkSvg(1200, 800, {
        text: "© EverydayTools",
        position: "bottom-right",
      });

      const svgStr = svg.toString("utf8");
      assert.strictEqual(svgStr.includes('width="1200"'), true);
      assert.strictEqual(svgStr.includes('height="800"'), true);
    });

    it("generates anti-theft diagonal pattern in tile mode", () => {
      const svg = generateWatermarkSvg(1000, 1000, {
        text: "DRAFT / CONFIDENTIAL",
        mode: "tile",
        rotation: -30,
        opacity: 0.25,
      });

      const svgStr = svg.toString("utf8");
      assert.strictEqual(svgStr.includes("<pattern"), true);
      assert.strictEqual(svgStr.includes("rotate(-30"), true);
      assert.strictEqual(svgStr.includes("<rect width=\"100%\" height=\"100%\" fill=\"url(#"), true);
    });

    it("supports multi-point positioning in a single SVG overlay", () => {
      const svg = generateWatermarkSvg(1000, 800, {
        text: "WATERMARK",
        mode: "points",
        position: ["top-left", "bottom-right"],
      });

      const svgStr = svg.toString("utf8");
      const textTags = svgStr.match(/<text/g) || [];
      // Should contain at least 2 text nodes (or 4 if shadow stroke is rendered)
      assert.strictEqual(textTags.length >= 2, true);
    });

    it("correctly maps 9-point position aliases (top, bottom, left, right)", () => {
      const svg = generateWatermarkSvg(1000, 600, {
        text: "ALIAS_TEST",
        mode: "points",
        position: "top",
      });
      const svgStr = svg.toString("utf8");
      assert.strictEqual(svgStr.includes('x="500"'), true);
      assert.strictEqual(svgStr.includes('text-anchor="middle"'), true);

      const svgLeft = generateWatermarkSvg(1000, 600, {
        text: "ALIAS_TEST",
        mode: "points",
        position: "left",
      });
      const svgLeftStr = svgLeft.toString("utf8");
      assert.strictEqual(svgLeftStr.includes('y="300"'), true);
      assert.strictEqual(svgLeftStr.includes('text-anchor="start"'), true);
    });

    it("omits shadow stroke when hasShadow is false", () => {
      const svgWithoutShadow = generateWatermarkSvg(800, 600, {
        text: "NO_SHADOW",
        hasShadow: false,
      });
      const svgStr = svgWithoutShadow.toString("utf8");
      assert.strictEqual(svgStr.includes("stroke="), false);

      const svgWithShadow = generateWatermarkSvg(800, 600, {
        text: "WITH_SHADOW",
        hasShadow: true,
      });
      assert.strictEqual(svgWithShadow.toString("utf8").includes("stroke="), true);
    });
  });

  describe("applyWatermarkToImage Engine", () => {
    it("applies watermark to JPEG with sRGB normalization and progressive MozJPEG", async () => {
      const sample = await sharp({
        create: {
          width: 300,
          height: 200,
          channels: 3,
          background: { r: 40, g: 80, b: 160 },
        },
      })
        .jpeg()
        .toBuffer();

      const { buffer, mime, ext } = await applyWatermarkToImage(sample, {
        text: "© Photography 2024",
        position: "bottom-right",
        color: "#ffffff",
        opacity: 0.85,
        outputFormat: "image/jpeg",
        quality: 85,
      });

      assert.strictEqual(mime, "image/jpeg");
      assert.strictEqual(ext, "jpg");
      assert.strictEqual(buffer.length > 0, true);

      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "jpeg");
      assert.strictEqual(meta.isProgressive, true);
      assert.strictEqual(meta.space, "srgb");
      assert.strictEqual(meta.width, 300);
      assert.strictEqual(meta.height, 200);
    });

    it("applies watermark to transparent PNG without background distortion", async () => {
      const transparentPng = await sharp({
        create: {
          width: 200,
          height: 200,
          channels: 4,
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        },
      })
        .png()
        .toBuffer();

      const { buffer, mime } = await applyWatermarkToImage(transparentPng, {
        text: "TRANSPARENT WATERMARK",
        position: "center",
        outputFormat: "image/png",
      });

      assert.strictEqual(mime, "image/png");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "png");
      assert.strictEqual(meta.hasAlpha, true);
    });

    it("applies tiled diagonal watermark across the entire image", async () => {
      const sample = await sharp({
        create: {
          width: 400,
          height: 300,
          channels: 3,
          background: { r: 240, g: 240, b: 240 },
        },
      })
        .png()
        .toBuffer();

      const { buffer, mime } = await applyWatermarkToImage(sample, {
        text: "PROTECTED SAMPLE",
        mode: "tile",
        rotation: -45,
        opacity: 0.3,
        color: "#ef4444",
        outputFormat: "image/png",
      });

      assert.strictEqual(mime, "image/png");
      assert.strictEqual(buffer.length > 0, true);

      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.width, 400);
      assert.strictEqual(meta.height, 300);
    });

    it("supports WebP output with Pareto sweet spot configuration (< 1000ms)", async () => {
      const sample = await sharp({
        create: {
          width: 250,
          height: 250,
          channels: 3,
          background: { r: 60, g: 140, b: 90 },
        },
      })
        .png()
        .toBuffer();

      const start = Date.now();
      const { buffer, mime, ext } = await applyWatermarkToImage(sample, {
        text: "WEBP WATERMARK",
        position: "top-center",
        outputFormat: "image/webp",
        quality: 80,
      });
      const elapsed = Date.now() - start;

      assert.strictEqual(mime, "image/webp");
      assert.strictEqual(ext, "webp");
      assert.strictEqual(elapsed < 1000, true);

      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "webp");
    });

    it("handles images with EXIF orientation (e.g. orientation 6) without composite dimension crash", async () => {
      // 400x200 with orientation 6 (portrait transposition -> 200x400 after auto-rotate)
      const rotatedSample = await sharp({
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

      const { buffer, mime } = await applyWatermarkToImage(rotatedSample, {
        text: "EXIF PORTRAIT TEST",
        position: "center",
        outputFormat: "image/jpeg",
      });

      assert.strictEqual(mime, "image/jpeg");
      const meta = await sharp(buffer).metadata();
      // After auto-rotation, width is 200 and height is 400
      assert.strictEqual(meta.width, 200);
      assert.strictEqual(meta.height, 400);
    });
  });
});

