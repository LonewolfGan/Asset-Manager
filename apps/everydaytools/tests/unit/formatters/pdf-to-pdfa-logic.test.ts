import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSourceFormat,
  getTargetFormat,
  buildPdfaFilename,
  validatePdfFile,
  convertPdfToPdfa,
  triggerDownload,
  openPreview,
} from '@/lib/pdf-to-pdfa-logic';

describe('pdf-to-pdfa-logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('provides correct source format descriptors', () => {
    const formatFr = getSourceFormat(true);
    expect(formatFr.name).toBe('PDF');
    expect(formatFr.extension).toBe('pdf');
    expect(formatFr.color).toBe('#EC1C24');
    expect(formatFr.subLabel).toBe('Document Adobe Acrobat');

    const formatEn = getSourceFormat(false);
    expect(formatEn.subLabel).toBe('Adobe Acrobat Document');
  });

  it('provides correct target format descriptors', () => {
    const formatFr = getTargetFormat(true);
    expect(formatFr.name).toBe('PDF/A');
    expect(formatFr.extension).toBe('pdf');
    expect(formatFr.color).toBe('#1D4ED8');
    expect(formatFr.subLabel).toBe('Archivage ISO 19005');

    const formatEn = getTargetFormat(false);
    expect(formatEn.subLabel).toBe('ISO 19005 Archival');
  });

  it('transforms pdf filenames to append _pdfa.pdf', () => {
    expect(buildPdfaFilename('contract.pdf')).toBe('contract_pdfa.pdf');
    expect(buildPdfaFilename('ARCHIVE.PDF')).toBe('ARCHIVE_pdfa.pdf');
  });

  it('validates supported pdf files correctly', () => {
    const validFile = new File(['mock content'], 'contract.pdf', {
      type: 'application/pdf',
    });
    const result = validatePdfFile(validFile, false);
    expect(result.isValid).toBe(true);
  });

  it('rejects unsupported file formats', () => {
    const invalidFile = new File(['mock content'], 'image.png', {
      type: 'image/png',
    });
    const result = validatePdfFile(invalidFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Format non supporté');
  });

  it('rejects files exceeding 50MB limit', () => {
    const oversizedFile = new File([''], 'huge.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(oversizedFile, 'size', { value: 51 * 1024 * 1024 });

    const result = validatePdfFile(oversizedFile, true);
    expect(result.isValid).toBe(false);
    expect(result.errorTitle).toBe('Fichier trop volumineux');
  });

  it('converts pdf to pdf/a successfully via API response', async () => {
    const mockFile = new File(['content'], 'contract.pdf', {
      type: 'application/pdf',
    });
    const mockBlob = new Blob(['%PDF-1.4 mock pdf/a content'], { type: 'application/pdf' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    } as Response);

    const result = await convertPdfToPdfa(mockFile, { isFr: false });

    expect(result.filename).toBe('contract_pdfa.pdf');
    expect(result.sizeBefore).toBe(mockFile.size);
    expect(result.sizeAfter).toBe(mockBlob.size);
    expect(result.blob).toBe(mockBlob);
  });

  it('handles API conversion failure with proper error message', async () => {
    const mockFile = new File(['content'], 'corrupt.pdf', {
      type: 'application/pdf',
    });

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Conversion failed on corrupt PDF' }),
    } as Response);

    await expect(convertPdfToPdfa(mockFile, { isFr: true })).rejects.toThrow(
      'Conversion failed on corrupt PDF'
    );
  });

  it('triggers download with an anchor element', () => {
    const blob = new Blob(['%PDF'], { type: 'application/pdf' });
    const createObjectURLMock = vi.fn().mockReturnValue('blob:mock-pdfa');
    const revokeObjectURLMock = vi.fn();
    globalThis.URL.createObjectURL = createObjectURLMock;
    globalThis.URL.revokeObjectURL = revokeObjectURLMock;

    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');

    triggerDownload(blob, 'contract_pdfa.pdf');

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(appendChildSpy).toHaveBeenCalled();
    expect(removeChildSpy).toHaveBeenCalled();
    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:mock-pdfa');
  });

  it('opens preview in a new window', () => {
    const blob = new Blob(['%PDF'], { type: 'application/pdf' });
    const createObjectURLMock = vi.fn().mockReturnValue('blob:preview-url');
    globalThis.URL.createObjectURL = createObjectURLMock;

    const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    openPreview(blob);

    expect(createObjectURLMock).toHaveBeenCalledWith(blob);
    expect(windowOpenSpy).toHaveBeenCalledWith('blob:preview-url', '_blank');
  });
});
