import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import mammoth from 'mammoth';
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
    expect(format.color).toContain('var(--accent');
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

  it('converts word to text in-browser via mammoth without network or delays', async () => {
    const mockFile = new File(['mock docx binary content'], 'sample.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const fakeBuffer = new ArrayBuffer(16);
    vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(fakeBuffer);

    const extractSpy = vi.spyOn(mammoth, 'extractRawText').mockResolvedValue({
      value: 'Extracted plain text in browser\nLine 2',
      messages: [],
    });

    const fetchSpy = vi.spyOn(globalThis, 'fetch');
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout');

    const result = await convertWordToText(mockFile, { isFr: false });

    expect(extractSpy).toHaveBeenCalledWith({ arrayBuffer: fakeBuffer });
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(setTimeoutSpy).not.toHaveBeenCalled();
    expect(result.filename).toBe('sample.txt');
    expect(result.textOutput).toBe('Extracted plain text in browser\nLine 2');
    expect(result.sizeBefore).toBe(mockFile.size);
    expect(result.sizeAfter).toBe(new Blob(['Extracted plain text in browser\nLine 2']).size);
    expect(result.blob).toBeInstanceOf(Blob);
    expect(result.blob.type).toBe('text/plain;charset=utf-8');
  });

  it('handles in-browser extraction failure with localized error message', async () => {
    const mockFile = new File(['corrupted content'], 'broken.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(new ArrayBuffer(8));
    vi.spyOn(mammoth, 'extractRawText').mockRejectedValue(new Error('Corrupt zip archive'));

    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await expect(convertWordToText(mockFile, { isFr: true })).rejects.toThrow(
      'Corrupt zip archive'
    );
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('falls back to custom error fallback or localized default if mammoth rejects without message', async () => {
    const mockFile = new File(['bad'], 'test.docx');
    vi.spyOn(mockFile, 'arrayBuffer').mockResolvedValue(new ArrayBuffer(4));
    vi.spyOn(mammoth, 'extractRawText').mockRejectedValue('Unknown raw failure');

    await expect(
      convertWordToText(mockFile, { isFr: true, errorFallback: 'Erreur personnalisée' })
    ).rejects.toThrow('Erreur personnalisée');

    await expect(
      convertWordToText(mockFile, { isFr: false })
    ).rejects.toThrow('Failed to extract text. Please try again.');
  });

  it('triggers download with an anchor element and delayed URL revocation', () => {
    vi.useFakeTimers();
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
    expect(revokeObjectURLMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-url');
    vi.useRealTimers();
  });
});

