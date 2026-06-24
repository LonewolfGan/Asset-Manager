import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { useLocale } from '@/hooks/use-locale';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import { apiUrl } from '@/lib/apiBase';

// Formats pdf-lib can embed natively without re-encoding
const NATIVE_PDF_FORMATS = new Set(['image/jpeg', 'image/jpg', 'image/png']);

/**
 * For formats that pdf-lib cannot embed natively (WebP, AVIF, HEIC, TIFF, BMP,
 * GIF, SVG…), pre-convert to JPEG via the API (sharp) then embed as JPEG.
 * Returns the buffer and its MIME type ready for pdf-lib.
 */
async function normaliseToEmbeddable(file: File): Promise<{ buffer: ArrayBuffer; mime: 'image/jpeg' | 'image/png' }> {
  if (file.type === 'image/png') {
    return { buffer: await file.arrayBuffer(), mime: 'image/png' };
  }
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    return { buffer: await file.arrayBuffer(), mime: 'image/jpeg' };
  }
  // Anything else: convert to JPEG on the server (handles WebP, AVIF, HEIC, TIFF, BMP, GIF, SVG…)
  const form = new FormData();
  form.append('file', file);
  form.append('format', 'image/jpeg');
  form.append('quality', '0.92');

  const res = await fetch(apiUrl('/api/convert/image'), { method: 'POST', body: form });
  if (!res.ok) {
    // Server couldn't handle it — give a clear message
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `Could not convert ${file.name} (${file.type}) to a PDF-embeddable format.`);
  }
  const buffer = await res.arrayBuffer();
  return { buffer, mime: 'image/jpeg' };
}

export default function ImageToPdf() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const pdfDoc = await PDFDocument.create();
      let totalSizeBefore = 0;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSizeBefore += file.size;

        const { buffer, mime } = await normaliseToEmbeddable(file);

        const img = mime === 'image/png'
          ? await pdfDoc.embedPng(buffer)
          : await pdfDoc.embedJpg(buffer);

        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

        setProgress(Math.round(((i + 1) / files.length) * 85));
      }

      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      trackToolUsed('image-to-pdf', 'images');

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResult({ blob, filename: 'images_merged.pdf', sizeAfter: blob.size, sizeBefore: totalSizeBefore });
    } catch (e) {
      trackToolError('image-to-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Image Tools', 'Image to PDF']}
      title={t.tools['image-to-pdf']?.title ?? 'Image to PDF'}
      description={t.tools['image-to-pdf']?.description ?? 'Combine multiple images into a single PDF document.'}
      seoSlug="image-to-pdf"
    >
      <ToolWorkspace>
        <FileUpload
          accept={['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif', 'image/tiff', 'image/svg+xml', 'image/bmp', 'image/heic', 'image/heif']}
          maxSizeMB={20}
          multiple={true}
          onFiles={setFiles}
        />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to PDF
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Creating PDF..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
