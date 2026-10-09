import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  buildTextFilename,
  validateWordFile,
  convertWordToText,
  triggerDownload,
} from '@/lib/word-to-text-logic';

describe('word-to-text-logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides correct source format descriptors', () => {
    const format = getSourceFormat(false);
    expect(format.name).toBe('Word');
    expect(format.extension).toBe('docx');
    expect(format.color).toBe('#185ABD');
  });

  it('provides localized target format descriptors', () => {
    const formatFr = getTargetFormat(true);
    expect(formatFr.name).toBe('Texte');
    expect(formatFr.extension).toBe('txt');
    expect(formatFr.subLabel).toBe('Texte Brut UTF-8');

    const formatEn = getTargetFormat(false);
    expect(formatEn.name).toBe('Text');
    expect(formatEn.extension).toBe('txt');
    expect(formatEn.subLabel).toBe('Plain Text UTF-8');
  });

  it('transforms word file extensions to .txt', () => {
    expect(buildTextFilename('report.docx')).toBe('report.txt');
    expect(buildTextFilename('NOTES.DOC')).toBe('NOTES.txt');
    expect(buildTextFilename('archive.doc')).toBe('archive.txt');
  });

  it('validates supported word files correctly', () => {
    const validFile = new File(['mock content'], 'document.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const result = validateWordFile(validFile, false);
    expect(result.isValid).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    const invalidFile = new File(['mock content'], 'image.png', {
      type: 'image/png',
    });
    const result = validateWordFile(invalidFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Format non supporté');
  });

  it('rejects files exceeding 50MB limit', () => {
    const oversizedFile = new File([''], 'huge.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const result = validateWordFile(oversizedFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Fichier trop volumineux');
  });

  it('converts word to text successfully via API response', async () => {
    const mockFile = new File(['content'], 'sample.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: 'Extracted plain text content' }),
    } as Response);

    const result = await convertWordToText(mockFile, { isFr: false });

    expect(result.filename).toBe('sample.txt');
    expect(result.textOutput).toBe('Extracted plain text content');
    expect(result.sizeBefore).toBe(mockFile.size);
    expect(result.sizeAfter).toBe(new Blob(['Extracted plain text content']).size);
  });

  it('handles API conversion failure with proper error message', async () => {
    const mockFile = new File(['content'], 'broken.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Extraction failed on corrupt docx' }),
    } as Response);

    await expect(convertWordToText(mockFile, { isFr: true })).rejects.toThrow(
      'Extraction failed on corrupt docx'
    );
  });

  it('triggers download with an anchor element', () => {
    const blob = new Blob(['plain text'], { type: 'text/plain' });
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-url');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    triggerDownload(blob, 'result.txt');

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
  });
});
