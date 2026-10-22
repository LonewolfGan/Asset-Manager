import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToImageEngine } from '@/engine/engines/pdf-to-image-engine';

describe('PDF to Image Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToImageEngine.id).toBe('pdf-to-image');
    expect(pdfToImageEngine.name).toBe('PDF to Image');
    expect(typeof pdfToImageEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockImageBytes = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a]);
    const mockBlob = new Blob([mockImageBytes], {
      type: 'image/png',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (h: string) => (h === 'content-type' ? 'image/png' : null),
      },
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 sample content'], 'report.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToImageEngine.execute(testFile, {
      format: 'png',
      dpi: 150,
    });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-image');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('report.png');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.mimeType).toBe('image/png');
    expect(result.data).toBe(mockBlob);
  });

  it('handles multi-page ZIP response correctly', async () => {
    const mockZipBytes = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);
    const mockBlob = new Blob([mockZipBytes], {
      type: 'application/zip',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (h: string) => (h === 'content-type' ? 'application/zip' : null),
      },
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 multi-page content'], 'presentation.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToImageEngine.execute(testFile, {
      format: 'jpeg',
      dpi: 300,
    });

    expect(result.filename).toBe('presentation_images.zip');
    expect(result.mimeType).toBe('application/zip');
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'PDF is encrypted or password-protected' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToImageEngine.execute(testFile)).rejects.toThrow(
      'PDF is encrypted or password-protected'
    );
  });
});
