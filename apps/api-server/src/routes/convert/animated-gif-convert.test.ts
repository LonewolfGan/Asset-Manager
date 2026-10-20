import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { convertImageBuffer } from './convert-image.js';

/**
 * Creates a valid minimal 2-frame animated GIF89a buffer (2x2 px, 2 frames with delay).
 */
function createMinimalAnimatedGifBuffer(): Buffer {
  return Buffer.from([
    // GIF89a Header
    0x47, 0x49, 0x46, 0x38, 0x39, 0x61,
    // Logical Screen Descriptor: 2x2 px, GCT follows (2 colors)
    0x02, 0x00, 0x02, 0x00, 0x80, 0x00, 0x00,
    // Global Color Table (Red & Blue)
    0xFF, 0x00, 0x00, 0x00, 0x00, 0xFF,
    // Netscape 2.0 Loop Block
    0x21, 0xFF, 0x0B,
    0x4E, 0x45, 0x54, 0x53, 0x43, 0x41, 0x50, 0x45, 0x32, 0x2E, 0x30,
    0x03, 0x01, 0x00, 0x00, 0x00,
    // Frame 1: Graphics Control Extension (delay 10 = 100ms)
    0x21, 0xF9, 0x04, 0x00, 0x0A, 0x00, 0x00, 0x00,
    // Frame 1: Image Descriptor (0,0 2x2)
    0x2C, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00,
    // Frame 1: Image Data
    0x02, 0x02, 0x44, 0x01, 0x00,
    // Frame 2: Graphics Control Extension (delay 10 = 100ms)
    0x21, 0xF9, 0x04, 0x00, 0x0A, 0x00, 0x00, 0x00,
    // Frame 2: Image Descriptor (0,0 2x2)
    0x2C, 0x00, 0x00, 0x00, 0x00, 0x02, 0x00, 0x02, 0x00, 0x00,
    // Frame 2: Image Data
    0x02, 0x02, 0x4C, 0x01, 0x00,
    // Trailer
    0x3B,
  ]);
}

describe('Backend Animated GIF & Sharp Universal Engine (TDD RED)', () => {
  describe('convertImageBuffer with format: image/gif', () => {
    it('converts static PNG buffer to valid GIF format', async () => {
      const samplePng = await sharp({
        create: { width: 40, height: 40, channels: 4, background: { r: 255, g: 100, b: 50, alpha: 1 } },
      }).png().toBuffer();

      const { buffer, mime, ext } = await convertImageBuffer(samplePng, {
        format: 'image/gif',
      });

      assert.strictEqual(mime, 'image/gif');
      assert.strictEqual(ext, 'gif');
      assert.strictEqual(buffer.subarray(0, 3).toString('ascii'), 'GIF');

      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.format, 'gif');
      assert.strictEqual(meta.width, 40);
      assert.strictEqual(meta.height, 40);
    });

    it('applies resize dimensions Lanczos3 downscaling on GIF output', async () => {
      const samplePng = await sharp({
        create: { width: 100, height: 80, channels: 3, background: { r: 50, g: 150, b: 200 } },
      }).png().toBuffer();

      const { buffer } = await convertImageBuffer(samplePng, {
        format: 'image/gif',
        width: 50,
        height: 40,
      });

      const meta = await sharp(buffer).metadata();
      assert.strictEqual(meta.width, 50);
      assert.strictEqual(meta.height, 40);
    });
  });

  describe('Multi-frame animation preservation (TDD RED Probe)', () => {
    it('preserves multi-frame animation when animated: true is specified', async () => {
      const animGifInput = createMinimalAnimatedGifBuffer();
      const inMeta = await sharp(animGifInput, { animated: true }).metadata();
      assert.strictEqual(inMeta.pages, 2, 'Precondition: input buffer must contain 2 pages');

      const { buffer: outGif, mime, ext } = await convertImageBuffer(animGifInput, {
        format: 'image/gif',
        animated: true,
      } as any);

      assert.strictEqual(mime, 'image/gif');
      assert.strictEqual(ext, 'gif');

      const outMeta = await sharp(outGif, { animated: true }).metadata();
      assert.strictEqual(
        outMeta.pages,
        2,
        'Expected output GIF to preserve all 2 animation frames when animated: true'
      );
    });

    it('collapses to single static frame when animated option is omitted', async () => {
      const animGifInput = createMinimalAnimatedGifBuffer();
      const { buffer: staticGif } = await convertImageBuffer(animGifInput, {
        format: 'image/gif',
      });

      const staticMeta = await sharp(staticGif, { animated: true }).metadata();
      assert.strictEqual(staticMeta.pages, 1, 'Default conversion should output 1 static frame');
    });

    it('converts animated GIF to animated WebP when animated: true', async () => {
      const animGifInput = createMinimalAnimatedGifBuffer();
      const { buffer: outWebp, mime } = await convertImageBuffer(animGifInput, {
        format: 'image/webp',
        animated: true,
      } as any);

      assert.strictEqual(mime, 'image/webp');
      const webpMeta = await sharp(outWebp, { animated: true }).metadata();
      assert.strictEqual(
        webpMeta.pages,
        2,
        'Expected output WebP to preserve 2 animation frames'
      );
    });
  });
});
