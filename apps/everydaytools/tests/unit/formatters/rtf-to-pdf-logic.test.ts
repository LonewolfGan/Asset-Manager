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

describe('rtf-to-pdf-logic [TDD-Lock ECC]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides tokenized source format descriptors compliant with design system', () => {
    const format = getSourceFormat(false);
    expect(format.name).toBe('RTF');
    expect(format.extension).toBe('rtf');
    expect(format.color).toBe('var(--accent, #d97706)');
    expect(format.subLabel).toBe('Rich Text Format');
  });

  it('provides tokenized target format descriptors compliant with design system', () => {
    const format = getTargetFormat(false);
    expect(format.name).toBe('PDF');
    expect(format.extension).toBe('pdf');
    expect(format.color).toBe('var(--accent, #dc2626)');
    expect(format.subLabel).toBe('Adobe Acrobat');
  });

  it('transforms rtf file extensions to .pdf and provides fallback for empty basenames', () => {
    expect(buildPdfFilename('document.rtf')).toBe('document.pdf');
    expect(buildPdfFilename('REPORT.RTF')).toBe('REPORT.pdf');
    expect(buildPdfFilename('financial.report.rtf')).toBe('financial.report.pdf');
    expect(buildPdfFilename('.rtf')).toBe('document.pdf');
    expect(buildPdfFilename('')).toBe('document.pdf');
  });

  it('validates supported rtf files correctly', () => {
    const validRtf = new File(['{\\rtf1 mock content}'], 'sample.rtf', {
      type: 'application/rtf',
    });
    expect(validateRtfFile(validRtf, false).isValid).toBe(true);

    const validTextRtf = new File(['{\\rtf1 mock content}'], 'notes.rtf', {
      type: 'text/rtf',
    });
    expect(validateRtfFile(validTextRtf, false).isValid).toBe(true);
  });

  it('rejects unsupported file formats and prevents bypass via empty mime type', () => {
    const invalidFile = new File(['mock content'], 'image.png', {
      type: 'image/png',
    });
    const frResult = validateRtfFile(invalidFile, true);
    expect(frResult.isValid).toBe(false);
    expect(frResult.errorTitle).toBe('Format non supporté');
    expect(frResult.errorDesc).toContain('.rtf');

    const enResult = validateRtfFile(invalidFile, false);
    expect(enResult.isValid).toBe(false);
    expect(enResult.errorTitle).toBe('Unsupported format');
    expect(enResult.errorDesc).toContain('.rtf');

    // Crucial check: prevent bypass when browser reports empty mime type
    const exeFile = new File(['mock binary'], 'malicious.exe', { type: '' });
    expect(validateRtfFile(exeFile, false).isValid).toBe(false);
    const binFile = new File(['mock binary'], 'payload.bin', { type: '' });
    expect(validateRtfFile(binFile, false).isValid).toBe(false);
  });

  it('rejects files exceeding 50MB limit with bilingual errors', () => {
    const oversizedFile = new File([''], 'huge.rtf', {
      type: 'application/rtf',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const frResult = validateRtfFile(oversizedFile, true);
    expect(frResult.isValid).toBe(false);
    expect(frResult.errorTitle).toBe('Fichier trop volumineux');
    expect(frResult.errorDesc).toContain('50 Mo');

    const enResult = validateRtfFile(oversizedFile, false);
    expect(enResult.isValid).toBe(false);
    expect(enResult.errorTitle).toBe('File too large');
    expect(enResult.errorDesc).toContain('50 MB');
  });

  it('converts rtf to pdf successfully via API response with skipDelay', async () => {
    const mockFile = new File(['content'], 'sample.rtf', {
      type: 'application/rtf',
    });
    const mockBlob = new Blob(['%PDF-1.4 mock pdf'], { type: 'application/pdf' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await convertRtfToPdf(mockFile, { isFr: false, skipDelay: true });

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

    await expect(convertRtfToPdf(mockFile, { isFr: true, skipDelay: true })).rejects.toThrow(
      'Conversion failed on corrupt RTF'
    );
  });

  it('triggers download with delayed blob revocation', () => {
    vi.useFakeTimers();
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
    expect(revokeObjectURLMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-pdf');
    vi.useRealTimers();
  });

  it('opens preview in a new window with delayed blob revocation', () => {
    vi.useFakeTimers();
    const blob = new Blob(['%PDF'], { type: 'application/pdf' });
    const createObjectURLMock = vi.fn().mockReturnValue('blob:preview-url');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    openPreview(blob);

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(windowOpenSpy).toHaveBeenCalledWith('blob:preview-url', '_blank', 'noopener,noreferrer');
    expect(revokeObjectURLMock).not.toHaveBeenCalled();

    vi.advanceTimersByTime(10000);
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:preview-url');
    vi.useRealTimers();
  });
});
