import { describe, it, expect } from 'vitest';
import { md5, md5Bytes } from '@/lib/hash-md5-pure';

describe('hash-md5-pure', () => {
  it('correctly computes MD5 for string inputs', () => {
    expect(md5('hello')).toBe('5d41402abc4b2a76b9719d911017c592');
    expect(md5('EverydayTools')).toBe('948969bface89c84b42d26cde5dd555d');
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
    // Unicode UTF-8 test: 'café' -> md5sum: 07117fe4a1ebd544965dc19573183da2
    expect(md5('café')).toBe('07117fe4a1ebd544965dc19573183da2');
  });

  it('correctly computes MD5 for Uint8Array binary bytes', () => {
    const encoder = new TextEncoder();
    const bytes1 = encoder.encode('hello');
    expect(md5Bytes(bytes1)).toBe('5d41402abc4b2a76b9719d911017c592');

    const bytes2 = encoder.encode('EverydayTools');
    expect(md5Bytes(bytes2)).toBe('948969bface89c84b42d26cde5dd555d');

    const emptyBytes = new Uint8Array(0);
    expect(md5Bytes(emptyBytes)).toBe('d41d8cd98f00b204e9800998ecf8427e');

    const bytesCafe = encoder.encode('café');
    expect(md5Bytes(bytesCafe)).toBe('07117fe4a1ebd544965dc19573183da2');
  });
});
