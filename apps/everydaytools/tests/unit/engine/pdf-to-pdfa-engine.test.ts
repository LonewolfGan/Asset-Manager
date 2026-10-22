import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToPdfaEngine, createPdfToPdfaEngine } from '@/engine/engines/pdf-to-pdfa-engine';

describe('PDF to PDF/A Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToPdfaEngine.id).toBe('pdf-to-pdfa');
    expect(pdfToPdfaEngine.name).toBe('PDF to PDF/A');
    expect(typeof pdfToPdfaEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockPdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
    const mockBlob = new Blob([mockPdfBytes], {
      type: 'application/pdf',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      headers: {
        get: (h: string) => {
          if (h.toLowerCase() === 'content-type') return 'application/pdf';
          if (h.toLowerCase() === 'x-page-count') return '2';
          return null;
        },
      },
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 sample content'], 'rapport.pdf', {
      type: 'application/pdf',
    });

    const engine = createPdfToPdfaEngine({ conformance: '2b' });
    const result = await engine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-pdfa');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('rapport_pdfa2b.pdf');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.mimeType).toBe('application/pdf');
    expect(result.data).toBe(mockBlob);
  });

  it('serializes custom conformance option into FormData correctly', async () => {
    const mockBlob = new Blob(['%PDF-'], { type: 'application/pdf' });
    let capturedFormData: FormData | null = null;

    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((_url: string, init: any) => {
        capturedFormData = init.body;
        return Promise.resolve({
          ok: true,
          blob: async () => mockBlob,
          headers: { get: () => 'application/pdf' },
        });
      })
    );

    const testFile = new File(['%PDF-1.4'], 'contract.pdf', { type: 'application/pdf' });
    const engine = createPdfToPdfaEngine();
    const result = await engine.execute(testFile, { conformance: '1b' });

    expect(capturedFormData).not.toBeNull();
    expect((capturedFormData as any).get('conformance')).toBe('1b');
    expect(result.filename).toBe('contract_pdfa1b.pdf');
  });

  it('throws descriptive error on server HTTP error response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: 'Ghostscript PDF/A conversion failed' }),
      })
    );

    const testFile = new File(['%PDF-1.4'], 'corrupt.pdf', { type: 'application/pdf' });
    await expect(pdfToPdfaEngine.execute(testFile)).rejects.toThrow(
      'Ghostscript PDF/A conversion failed'
    );
  });
});
