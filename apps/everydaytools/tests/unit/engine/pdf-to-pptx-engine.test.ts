import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToPptxEngine } from '@/engine/engines/pdf-to-pptx-engine';

describe('PDF to PPTX Engine Contract (TDD)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToPptxEngine.id).toBe('pdf-to-pptx');
    expect(pdfToPptxEngine.name).toBe('PDF to PowerPoint Engine');
    expect(typeof pdfToPptxEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockBlob = new Blob(['sample-pptx-binary'], {
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 test presentation content'], 'pitch-deck.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToPptxEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-pptx');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('pitch-deck.pptx');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Corrupt or unreadable PDF presentation stream' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToPptxEngine.execute(testFile)).rejects.toThrow(
      'Corrupt or unreadable PDF presentation stream'
    );
  });
});
