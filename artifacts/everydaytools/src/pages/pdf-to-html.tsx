import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function PdfToHtml() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number, textOutput?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-to-html', 'pdf');
      const file = files[0];
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let bodyContent = '';

      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const text = textContent.items.map((item: any) => item.str).join(' ');
        if (text.trim()) {
          bodyContent += `<p>${text}</p>\n`;
        }
        setProgress(Math.round((i / numPages) * 100));
      }

      const html = `<!DOCTYPE html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>${file.name}</title>\n<style>body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 2em; line-height: 1.6; }</style>\n</head>\n<body>\n${bodyContent}</body>\n</html>`;

      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '.html'), sizeAfter: blob.size, sizeBefore: file.size, textOutput: html });
    } catch (e) {
      trackToolError('pdf-to-html', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'PDF to HTML']}
      title={t.tools['pdf-to-html']?.title ?? 'PDF to HTML'}
      description={t.tools['pdf-to-html']?.description ?? 'Extract text from a PDF and format it as a clean HTML webpage.'}
      seoSlug="pdf-to-html"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to HTML
          </ToolButton>
        )}
        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Converting to HTML..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
