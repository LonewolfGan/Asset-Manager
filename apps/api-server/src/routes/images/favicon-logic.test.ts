import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import { unzipSync } from "fflate";
import {
  buildIcoMulti,
  generateFaviconPack,
  type FaviconPackOptions,
} from "./favicon-logic.js";

describe("Favicon Generator & Studio Engine (TDD)", () => {
  describe("buildIcoMulti binary encoder", () => {
    it("generates valid ICO file header and directory structure", async () => {
      const png16 = await sharp({
        create: { width: 16, height: 16, channels: 4, background: { r: 255, g: 0, b: 0, alpha: 1 } },
      }).png().toBuffer();

      const png32 = await sharp({
        create: { width: 32, height: 32, channels: 4, background: { r: 0, g: 255, b: 0, alpha: 1 } },
      }).png().toBuffer();

      const icoBuf = buildIcoMulti([
        { size: 16, buf: png16 },
        { size: 32, buf: png32 },
      ]);

      assert.strictEqual(icoBuf.length > 0, true);
      // ICO Header: Reserved (0), Type (1 = ICO), ImageCount (2)
      assert.strictEqual(icoBuf.readUInt16LE(0), 0);
      assert.strictEqual(icoBuf.readUInt16LE(2), 1);
      assert.strictEqual(icoBuf.readUInt16LE(4), 2);

      // Entry 1 (16x16)
      assert.strictEqual(icoBuf.readUInt8(6), 16); // Width
      assert.strictEqual(icoBuf.readUInt8(7), 16); // Height
      assert.strictEqual(icoBuf.readUInt16LE(10), 1); // Color planes
      assert.strictEqual(icoBuf.readUInt16LE(12), 32); // Bits per pixel
      assert.strictEqual(icoBuf.readUInt32LE(14), png16.length); // Size
      assert.strictEqual(icoBuf.readUInt32LE(18), 6 + 16 * 2); // Data offset (38)

      // Entry 2 (32x32)
      assert.strictEqual(icoBuf.readUInt8(22), 32); // Width
      assert.strictEqual(icoBuf.readUInt8(23), 32); // Height
    });
  });

  describe("generateFaviconPack", () => {
    it("generates full production favicon package with all standard assets", async () => {
      const sourceImage = await sharp({
        create: {
          width: 512,
          height: 512,
          channels: 4,
          background: { r: 24, g: 119, b: 242, alpha: 1 },
        },
      })
        .png()
        .toBuffer();

      const options: FaviconPackOptions = {
        name: "EverydayTools",
        shortName: "EverydayTools",
        themeColor: "#1877f2",
        backgroundColor: "#ffffff",
      };

      const zipBuffer = await generateFaviconPack(sourceImage, options);
      assert.strictEqual(zipBuffer.length > 0, true);

      // Unzip to inspect contents
      const unzipped = unzipSync(new Uint8Array(zipBuffer));
      const fileNames = Object.keys(unzipped);

      // Must include standard browser favicons
      assert.strictEqual(fileNames.includes("favicon.ico"), true);
      assert.strictEqual(fileNames.includes("favicon-16x16.png"), true);
      assert.strictEqual(fileNames.includes("favicon-32x32.png"), true);
      assert.strictEqual(fileNames.includes("favicon-48x48.png"), true);

      // Must include Apple Touch icon
      assert.strictEqual(fileNames.includes("apple-touch-icon.png"), true);
      const appleIconMeta = await sharp(Buffer.from(unzipped["apple-touch-icon.png"])).metadata();
      assert.strictEqual(appleIconMeta.width, 180);
      assert.strictEqual(appleIconMeta.height, 180);

      // Must include Android / PWA Chrome icons
      assert.strictEqual(fileNames.includes("android-chrome-192x192.png"), true);
      assert.strictEqual(fileNames.includes("android-chrome-512x512.png"), true);
      const pwa192Meta = await sharp(Buffer.from(unzipped["android-chrome-192x192.png"])).metadata();
      assert.strictEqual(pwa192Meta.width, 192);
      assert.strictEqual(pwa192Meta.height, 192);

      // Must include site.webmanifest
      assert.strictEqual(fileNames.includes("site.webmanifest"), true);
      const manifestStr = Buffer.from(unzipped["site.webmanifest"]).toString("utf8");
      const manifestJson = JSON.parse(manifestStr);
      assert.strictEqual(manifestJson.name, "EverydayTools");
      assert.strictEqual(manifestJson.theme_color, "#1877f2");
      assert.strictEqual(manifestJson.icons.length >= 2, true);

      // Must include HTML embed snippet
      assert.strictEqual(fileNames.includes("favicon-snippet.html"), true);
      const htmlSnippet = Buffer.from(unzipped["favicon-snippet.html"]).toString("utf8");
      assert.strictEqual(htmlSnippet.includes('rel="icon"'), true);
      assert.strictEqual(htmlSnippet.includes('rel="apple-touch-icon"'), true);
      assert.strictEqual(htmlSnippet.includes('rel="manifest"'), true);
    });

    it("normalizes colors to sRGB and auto-rotates EXIF orientations", async () => {
      // 512x256 image with EXIF orientation 6 (transposed to 256x512)
      const rotatedInput = await sharp({
        create: {
          width: 512,
          height: 256,
          channels: 3,
          background: { r: 220, g: 60, b: 60 },
        },
      })
        .withMetadata({ orientation: 6 })
        .jpeg()
        .toBuffer();

      const zipBuffer = await generateFaviconPack(rotatedInput);
      const unzipped = unzipSync(new Uint8Array(zipBuffer));

      // Each generated square icon must be strictly square and sRGB
      const icon32 = Buffer.from(unzipped["favicon-32x32.png"]);
      const meta32 = await sharp(icon32).metadata();
      assert.strictEqual(meta32.width, 32);
      assert.strictEqual(meta32.height, 32);
      assert.strictEqual(meta32.space, "srgb");
    });
  });
});
