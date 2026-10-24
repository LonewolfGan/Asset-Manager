import { describe, it, expect, vi } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import {
  pdfRotateEngine,
  createPdfRotateEngine,
  type PdfRotateExecuteOptions,
  type PdfRotateMetadata,
} from '@/engine/engines/pdf-rotate-engine';

async function createSamplePdfBlob(pages = 3): Promise<Blob> {
  const doc = await PDFDocument.create();
  for (let i = 1; i <= pages; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`Page ${i}`, { x: 50, y: 500 });
  }
  const bytes = await doc.save();
  return new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
}

describe('PDF Rotate Engine Contract (TDD RED)', () => {
  it('exposes contract metadata complying with ToolEngineContract', () => {
    expect(pdfRotateEngine.id).toBe('pdf-rotate');
    expect(pdfRotateEngine.name).toBe('Rotate PDF');
    expect(typeof pdfRotateEngine.execute).toBe('function');
  });

  it('executes in-browser global rotation across all pages', async () => {
    const blob = await createSamplePdfBlob(3);
    const file = new File([blob], 'doc.pdf', { type: 'application/pdf' });
    const stages: string[] = [];
    const onProgress = vi.fn(({ stage }: { percent: number; stage?: string }) => {
      if (stage) stages.push(stage);
    });

    const result = await pdfRotateEngine.execute(file, {
      rotationDeg: 90,
      onProgress,
    });

    expect(result.data).toBeInstanceOf(Blob);
    expect(result.data.type).toBe('application/pdf');
    expect(result.filename).toBe('doc_rotated.pdf');
    const meta = result.metadata as unknown as PdfRotateMetadata;
    expect(meta.pageCount).toBe(3);
    expect(meta.rotatedCount).toBe(3);
    expect(stages).toContain('reading');
    expect(stages).toContain('rotating');
    expect(stages).toContain('complete');

    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    for (const page of loaded.getPages()) {
      expect(page.getRotation().angle).toBe(90);
    }
  });

  it('executes selective rotation on targeted pages', async () => {
    const blob = await createSamplePdfBlob(3);
    const file = new File([blob], 'report.pdf', { type: 'application/pdf' });

    const result = await pdfRotateEngine.execute(file, {
      pageRotations: { 0: 90, 2: 180 },
    });

    const meta = result.metadata as unknown as PdfRotateMetadata;
    expect(meta.rotatedCount).toBe(2);
    expect(meta.pageCount).toBe(3);

    const loaded = await PDFDocument.load(await result.data.arrayBuffer());
    const pages = loaded.getPages();
    expect(pages[0].getRotation().angle).toBe(90);
    expect(pages[1].getRotation().angle).toBe(0);
    expect(pages[2].getRotation().angle).toBe(180);
  });

  it('supports cancellation via AbortSignal', async () => {
    const blob = await createSamplePdfBlob(2);
    const file = new File([blob], 'doc.pdf', { type: 'application/pdf' });
    const controller = new AbortController();
    controller.abort();

    await expect(
      pdfRotateEngine.execute(file, {
        rotationDeg: 90,
        signal: controller.signal,
      })
    ).rejects.toThrow(/abort/i);
  });

  it('creates an engine instance with default options via factory', () => {
    const customEngine = createPdfRotateEngine({ rotationDeg: 180 });
    expect(customEngine.id).toBe('pdf-rotate');
  });
});
