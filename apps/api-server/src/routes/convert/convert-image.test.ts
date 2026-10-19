import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { convertImageBuffer, buildContentDisposition } from "./convert-image.js";
import { convertHeicBuffer } from "./heic-logic.js";

const makeImg = (w: number, h: number, ch: 3 | 4, bg: sharp.Color) =>
  sharp({ create: { width: w, height: h, channels: ch, background: bg } }).png().toBuffer();

describe("Universal Image Converter & Quality Optimization (TDD)", () => {
  describe("buildContentDisposition (RFC 5987 / RFC 6266)", () => {
    it("generates valid standard ASCII Content-Disposition", () => {
      const header = buildContentDisposition("simple_photo.png", "jpg");
      assert.strictEqual(header, 'attachment; filename="simple_photo.jpg"; filename*=UTF-8\'\'simple_photo.jpg');
    });

    it("handles accented and non-ASCII filenames with RFC 5987 UTF-8 encoding", () => {
      const header = buildContentDisposition("vacances_été_2024_à_la_plage.png", "webp");
      assert.match(header, /attachment; filename="vacances__t__2024___la_plage\.webp"/);
      assert.match(header, /filename\*=UTF-8''vacances_%C3%A9t%C3%A9_2024_%C3%A0_la_plage\.webp/);
    });

    it("neutralizes dangerous quotes, newlines, and control characters", () => {
      const header = buildContentDisposition('bad"file\r\nname\\test.jpg', "png");
      assert.doesNotMatch(header, /[\r\n]/);
      assert.match(header, /filename="bad_file__name_test\.png"/);
    });

    it("escapes single quotes in RFC 5987 encoding to prevent header truncation", () => {
      const header = buildContentDisposition("l'été_d'or.png", "jpg");
      assert.match(header, /filename\*=UTF-8''l%27%C3%A9t%C3%A9_d%27or\.jpg/);
    });
  });

  describe("convertImageBuffer Engine", () => {
    it("converts PNG to JPEG with sRGB normalization and progressive MozJPEG", async () => {
      const samplePng = await makeImg(80, 80, 3, { r: 220, g: 100, b: 50 });
      const { buffer, mime, ext } = await convertImageBuffer(samplePng, { format: "image/jpeg", quality: 85 });
      assert.strictEqual(mime, "image/jpeg");
      assert.strictEqual(ext, "jpg");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "jpeg");
      assert.strictEqual(meta.isProgressive, true);
      assert.strictEqual(meta.space, "srgb");
    });

    it("converts transparent PNG to JPEG by flattening to white background and removing alpha", async () => {
      const transparentPng = await makeImg(60, 60, 4, { r: 0, g: 0, b: 0, alpha: 0 });
      const { buffer } = await convertImageBuffer(transparentPng, { format: "image/jpeg", quality: 80 });
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.hasAlpha, false);
      const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
      assert.strictEqual(data[0], 255);
      assert.strictEqual(data[1], 255);
      assert.strictEqual(data[2], 255);
    });

    it("preserves alpha transparency when converting PNG to WebP", async () => {
      const transparentPng = await makeImg(40, 40, 4, { r: 10, g: 20, b: 30, alpha: 0.5 });
      const { buffer, mime, ext } = await convertImageBuffer(transparentPng, { format: "image/webp", quality: 80 });
      assert.strictEqual(mime, "image/webp");
      assert.strictEqual(ext, "webp");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "webp");
      assert.strictEqual(meta.hasAlpha, true);
    });

    it("preserves alpha transparency when converting PNG to AVIF", async () => {
      const transparentPng = await makeImg(40, 40, 4, { r: 10, g: 20, b: 30, alpha: 0.5 });
      const { buffer, mime, ext } = await convertImageBuffer(transparentPng, { format: "image/avif", quality: 65 });
      assert.strictEqual(mime, "image/avif");
      assert.strictEqual(ext, "avif");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.hasAlpha, true);
    });

    it("resizes with Lanczos3 kernel while preserving aspect ratio", async () => {
      const sample = await makeImg(400, 200, 3, { r: 10, g: 50, b: 120 });
      const { buffer } = await convertImageBuffer(sample, { format: "image/png", width: 200, height: 200 });
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.width, 200);
      assert.strictEqual(meta.height, 100);
    });

    it("converts to WebP with Pareto efficiency (< 1000ms)", async () => {
      const sample = await makeImg(100, 100, 3, { r: 120, g: 200, b: 80 });
      const start = Date.now();
      const { buffer, mime, ext } = await convertImageBuffer(sample, { format: "image/webp", quality: 80 });
      assert.strictEqual(Date.now() - start < 1000, true);
      assert.strictEqual(mime, "image/webp");
      assert.strictEqual(ext, "webp");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "webp");
    });

    it("converts to AVIF within Pareto time budget (< 2000ms)", async () => {
      const sample = await makeImg(100, 100, 3, { r: 80, g: 120, b: 220 });
      const start = Date.now();
      const { buffer, mime, ext } = await convertImageBuffer(sample, { format: "image/avif", quality: 65 });
      assert.strictEqual(Date.now() - start < 2000, true);
      assert.strictEqual(mime, "image/avif");
      assert.strictEqual(ext, "avif");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "heif");
    });

    it("converts bitmap to SVG vector using Potrace", async () => {
      const circleSvg = Buffer.from('<svg width="100" height="100"><circle cx="50" cy="50" r="30" fill="black"/></svg>');
      const sampleBmp = await sharp(circleSvg).png().toBuffer();
      const { buffer, mime, ext } = await convertImageBuffer(sampleBmp, { format: "image/svg+xml" });
      assert.strictEqual(mime, "image/svg+xml");
      assert.strictEqual(ext, "svg");
      const svgText = buffer.toString("utf8");
      assert.strictEqual(svgText.includes("<svg"), true);
      assert.strictEqual(svgText.includes("<path"), true);
    });

    it("converts to TIFF with deflate compression", async () => {
      const sample = await makeImg(40, 40, 3, { r: 50, g: 50, b: 50 });
      const { buffer, mime, ext } = await convertImageBuffer(sample, { format: "image/tiff" });
      assert.strictEqual(mime, "image/tiff");
      assert.strictEqual(ext, "tiff");
      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, "tiff");
      assert.strictEqual(meta.width, 40);
      assert.strictEqual(meta.height, 40);
    });

    it("rejects dimensions exceeding 10,000 px with INVALID_PARAM", async () => {
      const sample = await makeImg(10, 10, 3, { r: 0, g: 0, b: 0 });
      await assert.rejects(() => convertImageBuffer(sample, { format: "image/jpeg", width: 10001 }), /INVALID_PARAM/);
    });

    it("rejects negative or invalid dimensions with INVALID_PARAM", async () => {
      const sample = await makeImg(10, 10, 3, { r: 0, g: 0, b: 0 });
      await assert.rejects(() => convertImageBuffer(sample, { format: "image/jpeg", width: -50 }), /INVALID_PARAM/);
    });

    it("rejects unsupported format with informative error", async () => {
      const sample = await makeImg(10, 10, 3, { r: 0, g: 0, b: 0 });
      await assert.rejects(() => convertImageBuffer(sample, { format: "image/unknown-xyz" }), /UNSUPPORTED_FORMAT/);
    });
  });

  describe("convertHeicBuffer Modular Logic", () => {
    it("converts an image buffer to PDF via HEIC pipeline", async () => {
      const sample = await makeImg(100, 100, 3, { r: 100, g: 150, b: 200 });
      const { buffer, mime, ext } = await convertHeicBuffer(sample, { outputMime: "application/pdf" });
      assert.strictEqual(mime, "application/pdf");
      assert.strictEqual(ext, "pdf");
      assert.strictEqual(buffer.subarray(0, 4).toString(), "%PDF");
    });

    it("rejects invalid HEIC buffer or unsupported output format", async () => {
      const invalid = Buffer.from("not-an-image");
      await assert.rejects(() => convertHeicBuffer(invalid, { outputMime: "application/pdf" }));
    });
  });
});
