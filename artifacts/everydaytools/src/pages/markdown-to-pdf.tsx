import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { marked } from 'marked';
import { useLocale } from '@/hooks/use-locale';
import { sanitizeHTML } from '@/utils/sanitize';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolLoadingState, ToolEmptyState,
} from '@/components/ToolContent';

export default function MarkdownToPdf() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const text = await file.text();
      setProgress(30);

      const htmlContent = await marked(text);
      setProgress(50);

      // Basic text extraction from HTML for a simple PDF
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = sanitizeHTML(htmlContent);
      const plainText = tempDiv.textContent || tempDiv.innerText || '';
      const lines = plainText.split('\n');

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      let page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      let y = height - 50;
      const fontSize = 12;
      const lineHeight = 16;

      for (const line of lines) {
        if (y < 50) {
          page = pdfDoc.addPage();
          y = height - 50;
        }

        // Simple word wrap
        const words = line.split(' ');
        let currentLine = '';
        for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth > width - 100 && currentLine !== '') {
                page.drawText(currentLine, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
                y -= lineHeight;
                currentLine = word;
                if (y < 50) {
                    page = pdfDoc.addPage();
                    y = height - 50;
                }
            } else {
                currentLine = testLine;
            }
        }
        if (currentLine) {
            page.drawText(currentLine, { x: 50, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= lineHeight;
        }
      }

      setProgress(80);
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      trackToolUsed('markdown-to-pdf', 'documents');

      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.(md|txt)$/i, '.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('markdown-to-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Markdown to PDF']}
      title={t.tools['markdown-to-pdf']?.title ?? 'Markdown to PDF'}
      description={t.tools['markdown-to-pdf']?.description ?? 'Convert Markdown (.md) or text files into a simple PDF document.'}
      seoSlug="markdown-to-pdf"
    >
      <ToolWorkspace>
        <FileUpload accept={['.md', '.txt', 'text/markdown', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to PDF
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Converting to PDF..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
