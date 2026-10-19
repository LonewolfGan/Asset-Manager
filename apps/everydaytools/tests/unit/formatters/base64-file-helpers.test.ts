import { describe, it, expect } from 'vitest';
import { prepareEncodedFileResult, resolveDownloadInfo } from '@/lib/base64-file-helpers';

describe('base64-file-helpers', () => {
  it('formats encoded file result with prefix and url-safe transforms', () => {
    const rawDataUrl = 'data:text/plain;base64,hello+/=';
    const result = prepareEncodedFileResult(rawDataUrl, {
      dataUriPrefix: false,
      urlSafe: true,
      stripPadding: true,
      chunkSize: 0,
    });
    expect(result).not.toContain('+');
    expect(result).not.toContain('/');
    expect(result).not.toContain('=');
    expect(result).toBe('hello-_');
  });

  it('keeps dataUriPrefix intact when enabled', () => {
    const rawDataUrl = 'data:image/png;base64,iVBORw0KGgo=';
    const result = prepareEncodedFileResult(rawDataUrl, {
      dataUriPrefix: true,
      urlSafe: false,
      stripPadding: false,
      chunkSize: 0,
    });
    expect(result).toBe(rawDataUrl);
  });

  it('resolves download blob and filename correctly for text and binary', () => {
    const textInfo = resolveDownloadInfo({
      mode: 'encode',
      input: 'hello',
      output: 'aGVsbG8=',
      detectedBinary: null,
    });
    expect(textInfo.filename).toBe('encoded-base64.txt');
    expect(textInfo.blob.type).toContain('text/plain');

    const binaryInfo = resolveDownloadInfo({
      mode: 'decode',
      input: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      output: '',
      detectedBinary: {
        isImage: true,
        mimeType: 'image/png',
        extension: 'png',
        dataUrl: 'data:image/png;base64,...',
      },
    });
    expect(binaryInfo.filename).toBe('decoded-file.png');
    expect(binaryInfo.blob.type).toBe('image/png');
  });
});
