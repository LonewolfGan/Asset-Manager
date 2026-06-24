import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolLoadingState, ToolEmptyState,
} from '@/components/ToolContent';

export default function PdfToEpub() {
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
      trackToolUsed('pdf-to-epub', 'pdf');
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

      let blob;
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const Epub = (await import('epub-gen-memory')).default as any;
        const epub = new Epub({
          title: file.name.replace(/\.pdf$/i, ''),
          author: 'EverydayTools',
          content: [{
            title: 'Content',
            data: bodyContent || '<p>No content extracted.</p>'
          }]
        });
        blob = await epub.genEpub();
      } catch (epubErr) {
        throw new Error("EPUB generation encountered an issue. Try the PDF to Text tool instead.");
      }

      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '.epub'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('pdf-to-epub', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'PDF to EPUB']}
      title={t.tools['pdf-to-epub']?.title ?? 'PDF to EPUB'}
      description={t.tools['pdf-to-epub']?.description ?? 'Turn your PDF files into flowable EPUB e-books for comfortable reading.'}
      seoSlug="pdf-to-epub"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to EPUB
          </ToolButton>
        )}
        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Creating EPUB..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
