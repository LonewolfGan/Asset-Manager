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

describe('odt-to-pdf-logic [TDD-Lock ECC]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides tokenized source format descriptors compliant with design system', () => {
    const format = getSourceFormat(false);
    expect(format.name).toBe('ODT');
    expect(format.extension).toBe('odt');
    expect(format.color).toBe('var(--accent, #0d9488)');
    expect(format.subLabel).toBe('OpenDocument Text');
  });

  it('provides tokenized target format descriptors compliant with design system', () => {
    const format = getTargetFormat(false);
    expect(format.name).toBe('PDF');
    expect(format.extension).toBe('pdf');
    expect(format.color).toBe('var(--accent, #dc2626)');
    expect(format.subLabel).toBe('Adobe Acrobat');
  });

  it('transforms odt file extensions to .pdf and provides fallback for empty basenames', () => {
    expect(buildPdfFilename('document.odt')).toBe('document.pdf');
    expect(buildPdfFilename('REPORT.ODT')).toBe('REPORT.pdf');
    expect(buildPdfFilename('document.fodt')).toBe('document.pdf');
    expect(buildPdfFilename('FLAT.FODT')).toBe('FLAT.pdf');
    expect(buildPdfFilename('quarterly.finance.odt')).toBe('quarterly.finance.pdf');
    expect(buildPdfFilename('.odt')).toBe('document.pdf');
    expect(buildPdfFilename('.fodt')).toBe('document.pdf');
  });

  it('validates supported odt and fodt files correctly', () => {
    const validOdt = new File(['mock content'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    expect(validateOdtFile(validOdt, false).isValid).toBe(true);

    const validFodt = new File(['mock content'], 'sample.fodt', {
      type: 'application/vnd.oasis.opendocument.text-flat-xml',
    });
    expect(validateOdtFile(validFodt, false).isValid).toBe(true);
  });

  it('rejects unsupported file formats including empty mime type non-odt files', () => {
    const invalidFile = new File(['mock content'], 'presentation.pptx', {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });
    const frResult = validateOdtFile(invalidFile, true);
    expect(frResult.isValid).toBe(false);
    expect(frResult.errorTitle).toBe('Format non supporté');
    expect(frResult.errorDesc).toContain('.odt');

    const enResult = validateOdtFile(invalidFile, false);
    expect(enResult.isValid).toBe(false);
    expect(enResult.errorTitle).toBe('Unsupported format');
    expect(enResult.errorDesc).toContain('.odt');

    // Crucial check: prevent bypass when browser reports empty mime type
    const exeFile = new File(['mock binary'], 'payload.exe', { type: '' });
    expect(validateOdtFile(exeFile, false).isValid).toBe(false);
    const binFile = new File(['mock binary'], 'archive.bin', { type: '' });
    expect(validateOdtFile(binFile, false).isValid).toBe(false);
  });

  it('rejects files exceeding 50MB limit with bilingual errors', () => {
    const oversizedFile = new File([''], 'huge.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const frResult = validateOdtFile(oversizedFile, true);
    expect(frResult.isValid).toBe(false);
    expect(frResult.errorTitle).toBe('Fichier trop volumineux');
    expect(frResult.errorDesc).toContain('50 Mo');

    const enResult = validateOdtFile(oversizedFile, false);
    expect(enResult.isValid).toBe(false);
    expect(enResult.errorTitle).toBe('File too large');
    expect(enResult.errorDesc).toContain('50 MB');
  });

  it('converts odt to pdf successfully via API response with skipDelay', async () => {
    const mockFile = new File(['content'], 'sample.odt', {
      type: 'application/vnd.oasis.opendocument.text',
    });
    const mockBlob = new Blob(['%PDF-1.4 mock pdf content'], { type: 'application/pdf' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await convertOdtToPdf(mockFile, { isFr: false, skipDelay: true });

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
