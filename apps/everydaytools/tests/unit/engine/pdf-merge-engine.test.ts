import { describe, it, expect, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  pdfMergeEngine,
  createPdfMergeEngine,
  type PdfMergeMetadata,
  type PdfMergeExecuteOptions,
} from '@/engine/engines/pdf-merge-engine';

async function createTestPdfBlob(label: string): Promise<Blob> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([400, 600]);
  page.drawText(label, { x: 50, y: 500 });
  const bytes = await doc.save();
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

describe('PDF Merge Engine Contract (TDD RED)', () => {
  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfMergeEngine.id).toBe('pdf-merge');
    expect(pdfMergeEngine.name).toBe('Merge PDF');
    expect(typeof pdfMergeEngine.execute).toBe('function');
  });

  it('rejects execution when fewer than 2 files are provided', async () => {
    const file = new File(['dummy'], 'doc1.pdf', { type: 'application/pdf' });
    await expect(pdfMergeEngine.execute([file])).rejects.toThrow(/at least 2/i);
    await expect(pdfMergeEngine.execute([])).rejects.toThrow(/at least 2/i);
  });

  it('merges 2 PDF files in-browser and returns ToolResult with Blob, pageCount, and filename', async () => {
    const blob1 = await createTestPdfBlob('Page from Doc 1');
    const blob2 = await createTestPdfBlob('Page from Doc 2');

    const file1 = new File([blob1], 'report_part1.pdf', { type: 'application/pdf' });
    const file2 = new File([blob2], 'report_part2.pdf', { type: 'application/pdf' });

    const stages: string[] = [];
    const onProgress = vi.fn(({ percent, stage }: { percent: number; stage?: string }) => {
      if (stage) stages.push(stage);
    });

    const result = await pdfMergeEngine.execute([file1, file2], {
      filename: 'combined_report.pdf',
      onProgress,
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.data.type).toBe('application/pdf');
    expect(result.filename).toBe('combined_report.pdf');
    expect((result.metadata as any)?.mergedCount).toBe(2);
    expect((result.metadata as any)?.pageCount).toBe(2);
    expect((result.metadata as any)?.totalSize).toBe(file1.size + file2.size);
    expect(onProgress).toHaveBeenCalled();
    expect(stages).toContain('reading');
    expect(stages).toContain('merging');
  });

  it('supports cancellation via AbortSignal', async () => {
    const blob1 = await createTestPdfBlob('Doc 1');
    const blob2 = await createTestPdfBlob('Doc 2');

    const file1 = new File([blob1], 'd1.pdf', { type: 'application/pdf' });
    const file2 = new File([blob2], 'd2.pdf', { type: 'application/pdf' });

    const controller = new AbortController();
    controller.abort();

    await expect(
      pdfMergeEngine.execute([file1, file2], { signal: controller.signal })
    ).rejects.toThrow(/abort/i);
  });

  it('creates an engine instance with default options via factory', () => {
    const customEngine = createPdfMergeEngine({ filename: 'custom.pdf' });
    expect(customEngine.id).toBe('pdf-merge');
  });
});
