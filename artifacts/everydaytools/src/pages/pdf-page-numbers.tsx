import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function PdfPageNumbers() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [position, setPosition] = useState<'left'|'center'|'right'>('center');
  const [startNum, setStartNum] = useState(1);
  const [fontSize, setFontSize] = useState(12);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-page-numbers', 'pdf');
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pages = pdfDoc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const text = String(startNum + i);
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);

        let x = width / 2 - textWidth / 2; // center
        if (position === 'left') x = 30;
        if (position === 'right') x = width - 30 - textWidth;

        page.drawText(text, {
          x,
          y: 30, // near bottom
          size: fontSize,
          font: helveticaFont,
        });
        setProgress(Math.round(((i + 1) / pages.length) * 50));
      }

      const pdfBytes = await pdfDoc.save();
      setProgress(100);

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_numbered.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-page-numbers', 'general-error');
      setError(e instanceof Error ? e.message : 'Processing failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'Add Page Numbers']}
      title={t.tools['pdf-page-numbers']?.title ?? 'Add Page Numbers'}
      description={t.tools['pdf-page-numbers']?.description ?? 'Insert page numbers into your PDF document easily.'}
      seoSlug="pdf-page-numbers"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && (
          <ToolCard title="PAGE NUMBER SETTINGS">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Position (Bottom)</label>
                <select value={position} onChange={(e) => setPosition(e.target.value as any)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', backgroundColor: 'var(--bg)', color: 'var(--text-primary)' }}>
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Start Number</label>
                <input type="number" min="1" value={startNum} onChange={(e) => setStartNum(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Font Size</label>
                <input type="number" min="8" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 12)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
            </div>
          </ToolCard>
        )}

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Add Numbers
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Applying page numbers..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
