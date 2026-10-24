import { describe, it, expect, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  pdfSplitEngine,
  createPdfSplitEngine,
  type PdfSplitMetadata,
  type PdfSplitExecuteOptions,
} from '@/engine/engines/pdf-split-engine';

async function createSamplePdfBlob(pages = 4): Promise<Blob> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`Page ${i}`, { x: 50, y: 500 });
  }
  const bytes = await doc.save();
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

describe('PDF Split Engine Contract (TDD RED)', () => {
  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfSplitEngine.id).toBe('pdf-split');
    expect(pdfSplitEngine.name).toBe('Split PDF');
    expect(typeof pdfSplitEngine.execute).toBe('function');
  });

  it('rejects execution when no valid pages or tranches are provided', async () => {
    const blob = await createSamplePdfBlob(3);
    const file = new File([blob], 'doc.pdf', { type: 'application/pdf' });

    await expect(
      pdfSplitEngine.execute(file, { mode: 'extract', selectedPages: [] })
    ).rejects.toThrow(/no valid pages/i);
  });

  it('extracts selected pages as a single PDF document in-browser', async () => {
    const blob = await createSamplePdfBlob(4);
    const file = new File([blob], 'multi_page.pdf', { type: 'application/pdf' });

    const stages: string[] = [];
    const onProgress = vi.fn(({ stage }: { percent: number; stage?: string }) => {
      if (stage) stages.push(stage);
    });

    const result = await pdfSplitEngine.execute(file, {
      mode: 'extract',
      selectedPages: [1, 3],
      extractAsSinglePdf: true,
      onProgress,
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.data.type).toBe('application/pdf');
    expect(result.filename).toBe('multi_page_extracted.pdf');
    expect((result.metadata as any)?.isZip).toBe(false);
    expect((result.metadata as any)?.segmentCount).toBe(1);
    expect(onProgress).toHaveBeenCalled();
    expect(stages).toContain('reading');
    expect(stages).toContain('splitting');
  });

  it('splits pages into individual files inside a ZIP archive in-browser', async () => {
    const blob = await createSamplePdfBlob(3);
    const file = new File([blob], 'document.pdf', { type: 'application/pdf' });

    const result = await pdfSplitEngine.execute(file, {
      mode: 'extract',
      selectedPages: [1, 2, 3],
      extractAsSinglePdf: false,
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.data.type).toBe('application/zip');
    expect(result.filename).toBe('document_split.zip');
    expect((result.metadata as any)?.isZip).toBe(true);
    expect((result.metadata as any)?.segmentCount).toBe(3);
  });

  it('supports cancellation via AbortSignal', async () => {
    const blob = await createSamplePdfBlob(3);
    const file = new File([blob], 'doc.pdf', { type: 'application/pdf' });

    const controller = new AbortController();
    controller.abort();

    await expect(
      pdfSplitEngine.execute(file, {
        mode: 'extract',
        selectedPages: [1],
        signal: controller.signal,
      })
    ).rejects.toThrow(/abort/i);
  });

  it('creates an engine instance with default options via factory', () => {
    const customEngine = createPdfSplitEngine({ mode: 'split', extractAsSinglePdf: true });
    expect(customEngine.id).toBe('pdf-split');
  });
});
