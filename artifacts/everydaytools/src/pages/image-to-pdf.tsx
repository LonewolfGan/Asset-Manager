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
  ToolStat, ToolLoadingState, ToolEmptyState,
} from '@/components/ToolContent';

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
        const arrayBuffer = await file.arrayBuffer();

        let img;
        if (file.type === 'image/jpeg') {
          img = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          img = await pdfDoc.embedPng(arrayBuffer);
        } else {
          trackToolError('image-to-pdf', 'general-error');
          throw new Error(`Unsupported format ${file.type}. Please use JPG or PNG.`);
        }

        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });

        setProgress(Math.round(((i + 1) / files.length) * 80));
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
        <FileUpload accept={['image/jpeg', 'image/png']} maxSizeMB={20} multiple={true} onFiles={setFiles} />

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
