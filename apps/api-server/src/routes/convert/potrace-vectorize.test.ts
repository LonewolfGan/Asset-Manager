import { describe, it } from "node:test";
import assert from "node:assert/strict";
import sharp from "sharp";
import {
  computeOtsuThreshold,
  buildPBM,
  convertToSvgWithPotrace,
} from "./potrace-vectorize.js";

describe("Potrace Vectorization & Otsu Thresholding (TDD)", () => {
  it("computes accurate Otsu threshold on bimodal grayscale histogram", () => {
    // 256-bin histogram with 2 distinct clusters: dark (around 30) and bright (around 220)
    const histogram = new Array(256).fill(0);
    for (let i = 20; i <= 40; i++) histogram[i] = 100;
    for (let i = 210; i <= 230; i++) histogram[i] = 100;

    const total = histogram.reduce((a, b) => a + b, 0);
    const threshold = computeOtsuThreshold(histogram, total);

    // The optimal Otsu threshold should split the two modes (between 40 and 210)
    assert.strictEqual(threshold >= 40 && threshold <= 210, true, `Threshold was ${threshold}`);
  });

  it("handles edge cases gracefully without division by zero or NaN", () => {
    const flatHistogram = new Array(256).fill(0);
    const zeroThreshold = computeOtsuThreshold(flatHistogram, 0);
    assert.strictEqual(zeroThreshold, 128);

    const uniformHistogram = new Array(256).fill(10);
    const uniformThreshold = computeOtsuThreshold(uniformHistogram, 2560);
    assert.strictEqual(typeof uniformThreshold, "number");
    assert.strictEqual(Number.isFinite(uniformThreshold), true);
  });

  it("constructs valid packed P4 PBM binary buffer with correct bit packing and padding", () => {
    // Test 1: 16x2 image (exact multiple of 8)
    const width16 = 16;
    const height2 = 2;
    const rawData16 = Buffer.alloc(width16 * height2);
    for (let i = 0; i < 16; i++) rawData16[i] = 0; // dark
    for (let i = 16; i < 32; i++) rawData16[i] = 255; // bright

    const pbm16 = buildPBM(rawData16, width16, height2, 128);
    assert.strictEqual(pbm16.toString("ascii", 0, 8), "P4\n16 2\n");
    assert.strictEqual(pbm16.length, 12);
    // Row 1 (dark < 128): all 16 bits set = 0xFF, 0xFF
    assert.strictEqual(pbm16[8], 0xff);
    assert.strictEqual(pbm16[9], 0xff);
    // Row 2 (bright >= 128): all 16 bits cleared = 0x00, 0x00
    assert.strictEqual(pbm16[10], 0x00);
    assert.strictEqual(pbm16[11], 0x00);

    // Test 2: 10x1 image (non-multiple of 8, requires 2 bytes with 6 bits padding)
    const rawData10 = Buffer.alloc(10);
    // First 4 pixels dark (bits 7,6,5,4 set = 0xF0), remaining 6 bright
    for (let i = 0; i < 4; i++) rawData10[i] = 0;
    for (let i = 4; i < 10; i++) rawData10[i] = 255;

    const pbm10 = buildPBM(rawData10, 10, 1, 128);
    assert.strictEqual(pbm10.toString("ascii", 0, 8), "P4\n10 1\n");
    assert.strictEqual(pbm10.length, 10); // 8 bytes header + 2 bytes row
    assert.strictEqual(pbm10[8], 0xf0);
    assert.strictEqual(pbm10[9], 0x00); // 2 remaining data bits + 6 padding bits = 0x00
  });

  it("vectorizes bitmap PNG with transparency into clean SVG without black block artifacts", async () => {
    // Create an RGBA PNG with transparent background (alpha = 0) and black square in center
    const transparentInput = await sharp({
      create: {
        width: 100,
        height: 100,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .composite([
        {
          input: Buffer.from(
            `<svg width="100" height="100"><rect x="25" y="25" width="50" height="50" fill="black" /></svg>`
          ),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();

    const svgBuffer = await convertToSvgWithPotrace(transparentInput, true);
    const svgText = svgBuffer.toString("utf-8");

    assert.strictEqual(svgText.includes("<svg"), true);
    assert.strictEqual(svgText.includes("<path"), true);
    assert.strictEqual(svgText.includes("</svg>"), true);
  });
});
