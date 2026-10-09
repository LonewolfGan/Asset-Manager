import { describe, it, expect } from 'vitest';
import {
  encodeBase64,
  decodeBase64,
  base64ToBlob,
  applyLineBreaks,
  detectBase64Binary,
} from '@/lib/base64-logic';

describe('Base64 Encoder & Decoder Logic', () => {
  it('correctly encodes ASCII text to Base64', () => {
    expect(encodeBase64('Hello World')).toBe('SGVsbG8gV29ybGQ=');
  });

  it('correctly encodes and decodes UTF-8 international characters and emojis', () => {
    const text = 'Élégance française 🚀 & utf-8 testing 🌟';
    const encoded = encodeBase64(text);
    const decoded = decodeBase64(encoded);
    expect(decoded.error).toBeUndefined();
    expect(decoded.output).toBe(text);
  });

  it('supports URL-safe Base64 mode without standard plus and slash', () => {
    // String that produces + and /
    const text = '>>> ??? &&& *** +++ ///';
    const urlSafe = encodeBase64(text, { urlSafe: true, stripPadding: true });
    expect(urlSafe).not.toContain('+');
    expect(urlSafe).not.toContain('/');
    expect(urlSafe).not.toContain('=');

    const decoded = decodeBase64(urlSafe);
    expect(decoded.output).toBe(text);
  });

  it('detects and reports invalid Base64 input gracefully', () => {
    const invalid = 'Not_A_Valid_Base64_String!!!';
    const res = decodeBase64(invalid);
    expect(res.error).toBeDefined();
  });

  it('converts Base64 Data URL to Blob with correct MIME type', () => {
    const dataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const blob = base64ToBlob(dataUrl);
    expect(blob.type).toBe('image/png');
    expect(blob.size).toBeGreaterThan(0);
  });
});

describe('Base64 Line Breaks & Binary Detection (Phase RED)', () => {
  it('applies chunk line breaks correctly', () => {
    const raw = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    expect(applyLineBreaks(raw, 0)).toBe(raw);
    expect(applyLineBreaks(raw, 10)).toBe('ABCDEFGHIJ\nKLMNOPQRST\nUVWXYZ');
  });

  it('detects PNG data URL and magic bytes', () => {
    const pngDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const detected = detectBase64Binary(pngDataUri);
    expect(detected).not.toBeNull();
    expect(detected?.isImage).toBe(true);
    expect(detected?.mimeType).toBe('image/png');
    expect(detected?.extension).toBe('png');
  });

  it('detects raw PNG base64 via magic bytes', () => {
    const rawPngB64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const detected = detectBase64Binary(rawPngB64);
    expect(detected).not.toBeNull();
    expect(detected?.isImage).toBe(true);
    expect(detected?.mimeType).toBe('image/png');
  });
});
