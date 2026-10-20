import { describe, it, expect } from 'vitest';
import { canConvertClientSide } from '@/lib/image-convert-logic';

describe('Image Conversion Matrix Routing (Wave 6 / Task 5)', () => {
  const MB = 1024 * 1024;
  const STANDARD_SIZE = 2 * MB; // 2 Mo (well within 15 Mo limit)
  const OVERSIZED = 16 * MB;    // 16 Mo (exceeds 15 Mo limit)
  const BOUNDARY_MAX = 15 * MB; // Exactly 15 Mo boundary

  describe('Fast-path Client-side Canvas/DOM (true)', () => {
    it('#49: image/png -> image/webp routes to client-side', () => {
      expect(canConvertClientSide('image/png', 'image/webp', STANDARD_SIZE)).toBe(true);
    });

    it('#50: image/jpeg -> image/webp routes to client-side', () => {
      expect(canConvertClientSide('image/jpeg', 'image/webp', STANDARD_SIZE)).toBe(true);
    });

    it('#51: image/gif -> image/webp routes to client-side', () => {
      expect(canConvertClientSide('image/gif', 'image/webp', STANDARD_SIZE)).toBe(true);
    });

    it('#52: image/bmp -> image/webp routes to client-side', () => {
      expect(canConvertClientSide('image/bmp', 'image/webp', STANDARD_SIZE)).toBe(true);
    });

    it('#54: image/webp -> image/png routes to client-side', () => {
      expect(canConvertClientSide('image/webp', 'image/png', STANDARD_SIZE)).toBe(true);
    });

    it('#55: image/webp -> image/jpeg routes to client-side', () => {
      expect(canConvertClientSide('image/webp', 'image/jpeg', STANDARD_SIZE)).toBe(true);
    });

    it('#66: image/gif -> image/png routes to client-side', () => {
      expect(canConvertClientSide('image/gif', 'image/png', STANDARD_SIZE)).toBe(true);
    });

    it('#67: image/bmp -> image/jpeg routes to client-side', () => {
      expect(canConvertClientSide('image/bmp', 'image/jpeg', STANDARD_SIZE)).toBe(true);
    });

    it('handles uppercase MIME types seamlessly', () => {
      expect(canConvertClientSide('IMAGE/PNG', 'IMAGE/WEBP', STANDARD_SIZE)).toBe(true);
    });

    it('allows client conversion at exactly 15 Mo boundary', () => {
      expect(canConvertClientSide('image/png', 'image/webp', BOUNDARY_MAX)).toBe(true);
    });
  });

  describe('Server-side Sharp Delegation (false)', () => {
    it('#53: image/tiff -> image/webp requires dedicated server', () => {
      expect(canConvertClientSide('image/tiff', 'image/webp', STANDARD_SIZE)).toBe(false);
    });

    it('#68: image/tiff -> image/png requires dedicated server', () => {
      expect(canConvertClientSide('image/tiff', 'image/png', STANDARD_SIZE)).toBe(false);
    });

    it('#69: image/tiff -> image/jpeg requires dedicated server', () => {
      expect(canConvertClientSide('image/tiff', 'image/jpeg', STANDARD_SIZE)).toBe(false);
    });

    it('#100: image/webp -> image/gif requires server (Canvas cannot encode GIF)', () => {
      expect(canConvertClientSide('image/webp', 'image/gif', STANDARD_SIZE)).toBe(false);
    });

    it('delegates any file > 15 Mo to server regardless of MIME pair', () => {
      expect(canConvertClientSide('image/png', 'image/webp', OVERSIZED)).toBe(false);
      expect(canConvertClientSide('image/jpeg', 'image/webp', OVERSIZED)).toBe(false);
      expect(canConvertClientSide('image/bmp', 'image/jpeg', OVERSIZED)).toBe(false);
    });

    it('delegates unsupported target formats to server', () => {
      expect(canConvertClientSide('image/png', 'image/tiff', STANDARD_SIZE)).toBe(false);
      expect(canConvertClientSide('image/webp', 'image/x-icon', STANDARD_SIZE)).toBe(false);
    });

    it('delegates HEIC/HEIF images to server/dedicated pipeline', () => {
      expect(canConvertClientSide('image/heic', 'image/png', STANDARD_SIZE)).toBe(false);
      expect(canConvertClientSide('image/heif', 'image/webp', STANDARD_SIZE)).toBe(false);
    });
  });
});
