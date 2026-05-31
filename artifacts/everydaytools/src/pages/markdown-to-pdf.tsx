import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { marked } from 'marked';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { sanitizeHTML } from '@/utils/sanitize';

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
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'Markdown to PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['markdown-to-pdf']?.title ?? 'Markdown to PDF'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['markdown-to-pdf']?.description ?? 'Convert Markdown (.md) or text files into a simple PDF document.'}</p>
      
      <FileUpload accept={['.md', '.txt', 'text/markdown', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Converting..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="markdown-to-pdf" />
  </>
  );
}
