import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  buildPdfFilename,
  validateRtfFile,
  convertRtfToPdf,
  triggerDownload,
  openPreview,
} from '@/lib/rtf-to-pdf-logic';

describe('rtf-to-pdf-logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides correct source format descriptors', () => {
    const format = getSourceFormat(false);
    expect(format.name).toBe('RTF');
    expect(format.extension).toBe('rtf');
    expect(format.color).toBe('#D97706');
    expect(format.subLabel).toBe('Rich Text Format');
  });

  it('provides correct target format descriptors', () => {
    const format = getTargetFormat(false);
    expect(format.name).toBe('PDF');
    expect(format.extension).toBe('pdf');
    expect(format.color).toBe('#EC1C24');
    expect(format.subLabel).toBe('Adobe Acrobat');
  });

  it('transforms rtf file extensions to .pdf', () => {
    expect(buildPdfFilename('document.rtf')).toBe('document.pdf');
    expect(buildPdfFilename('REPORT.RTF')).toBe('REPORT.pdf');
  });

  it('validates supported rtf files correctly', () => {
    const validFile = new File(['mock content'], 'sample.rtf', {
      type: 'application/rtf',
    });
    const result = validateRtfFile(validFile, false);
    expect(result.isValid).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    const invalidFile = new File(['mock content'], 'image.png', {
      type: 'image/png',
    });
    const result = validateRtfFile(invalidFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Format non supporté');
  });

  it('rejects files exceeding 50MB limit', () => {
    const oversizedFile = new File([''], 'huge.rtf', {
      type: 'application/rtf',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const result = validateRtfFile(oversizedFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Fichier trop volumineux');
  });

  it('converts rtf to pdf successfully via API response', async () => {
    const mockFile = new File(['content'], 'sample.rtf', {
      type: 'application/rtf',
    });
    const mockBlob = new Blob(['%PDF-1.4 mock pdf'], { type: 'application/pdf' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await convertRtfToPdf(mockFile, { isFr: false });

    expect(result.filename).toBe('sample.pdf');
    expect(result.sizeBefore).toBe(mockFile.size);
    expect(result.sizeAfter).toBe(mockBlob.size);
    expect(result.blob).toBe(mockBlob);
  });

  it('handles API conversion failure with proper error message', async () => {
    const mockFile = new File(['content'], 'corrupt.rtf', {
      type: 'application/rtf',
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Conversion failed on corrupt RTF' }),
    } as Response);

    await expect(convertRtfToPdf(mockFile, { isFr: true })).rejects.toThrow(
      'Conversion failed on corrupt RTF'
    );
  });

  it('triggers download with an anchor element', () => {
    const blob = new Blob(['%PDF'], { type: 'application/pdf' });
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-pdf');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    triggerDownload(blob, 'sample.pdf');

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-pdf');
  });

  it('opens preview in a new window', () => {
    const blob = new Blob(['%PDF'], { type: 'application/pdf' });
    const createObjectURLMock = vi.fn().mockReturnValue('blob:preview-url');
    globalThis.URL.createObjectURL = createObjectURLMock;

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    openPreview(blob);

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(windowOpenSpy).toHaveBeenCalledWith('blob:preview-url', '_blank', 'noopener,noreferrer');
  });
});
