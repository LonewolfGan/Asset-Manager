import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  buildPdfFilename,
  validateOdtFile,
  convertOdtToPdf,
  triggerDownload,
  openPreview,
} from '@/lib/odt-to-pdf-logic';

describe('odt-to-pdf-logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides correct source format descriptors', () => {
    const format = getSourceFormat(false);
    expect(format.name).toBe('ODT');
    expect(format.extension).toBe('odt');
    expect(format.color).toBe('#0D9488');
    expect(format.subLabel).toBe('OpenDocument Text');
  });

  it('provides correct target format descriptors', () => {
    const format = getTargetFormat(false);
    expect(format.name).toBe('PDF');
    expect(format.extension).toBe('pdf');
    expect(format.color).toBe('#EC1C24');
    expect(format.subLabel).toBe('Adobe Acrobat');
  });

  it('transforms odt file extensions to .pdf', () => {
    expect(buildPdfFilename('document.odt')).toBe('document.pdf');
    expect(buildPdfFilename('REPORT.ODT')).toBe('REPORT.pdf');
  });

  it('validates supported odt files correctly', () => {
    const validFile = new File(['mock content'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    const result = validateOdtFile(validFile, false);
    expect(result.isValid).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    const invalidFile = new File(['mock content'], 'presentation.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    const result = validateOdtFile(invalidFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Format non supporté');
  });

  it('rejects files exceeding 50MB limit', () => {
    const oversizedFile = new File([''], 'huge.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const result = validateOdtFile(oversizedFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Fichier trop volumineux');
  });

  it('converts odt to pdf successfully via API response', async () => {
    const mockFile = new File(['content'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    const mockBlob = new Blob(['%PDF-1.4 mock pdf content'], { type: 'application/pdf' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await convertOdtToPdf(mockFile, { isFr: false });

    expect(result.filename).toBe('sample.pdf');
    expect(result.sizeBefore).toBe(mockFile.size);
    expect(result.sizeAfter).toBe(mockBlob.size);
    expect(result.blob).toBe(mockBlob);
  });

  it('handles API conversion failure with proper error message', async () => {
    const mockFile = new File(['content'], 'corrupt.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Conversion failed on corrupt ODT' }),
    } as Response);

    await expect(convertOdtToPdf(mockFile, { isFr: true })).rejects.toThrow(
      'Conversion failed on corrupt ODT'
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
