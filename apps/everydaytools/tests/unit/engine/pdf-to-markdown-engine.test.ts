import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pdfToMarkdownEngine } from '@/engine/engines/pdf-to-markdown-engine';

describe('PDF to Markdown Engine Contract (TDD RED)', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfToMarkdownEngine.id).toBe('pdf-to-markdown');
    expect(pdfToMarkdownEngine.name).toBe('PDF to Markdown');
    expect(typeof pdfToMarkdownEngine.execute).toBe('function');
  });

  it('executes API conversion and returns ToolResult with data Blob, filename and resultSize', async () => {
    const mockMarkdown = '# Architecture Whitepaper 2026\n\n- High-throughput conversion\n- GFM tables';
    const mockBlob = new Blob([mockMarkdown], {
      type: 'text/markdown; charset=utf-8',
    });

    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      blob: async () => mockBlob,
      text: async () => mockMarkdown,
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['%PDF-1.4 sample content'], 'whitepaper.pdf', {
      type: 'application/pdf',
    });

    const result = await pdfToMarkdownEngine.execute(testFile);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toContain('/api/convert/pdf-to-markdown');
    expect(calledOptions.method).toBe('POST');
    expect(calledOptions.body).toBeInstanceOf(FormData);

    expect(result.filename).toBe('whitepaper.md');
    expect(result.resultSize).toBe(mockBlob.size);
    expect(result.originalSize).toBe(testFile.size);
    expect(result.mimeType).toBe('text/markdown; charset=utf-8');
    expect(result.data).toBe(mockBlob);
  });

  it('throws descriptive error on server HTTP error response', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'PDF is password-protected or corrupt' }),
    });
    vi.stubGlobal('fetch', fetchSpy);

    const testFile = new File(['corrupt'], 'bad.pdf', { type: 'application/pdf' });

    await expect(pdfToMarkdownEngine.execute(testFile)).rejects.toThrow(
      'PDF is password-protected or corrupt'
    );
  });
});
