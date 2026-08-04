import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolButton } from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import { apiUrl } from '@/lib/apiBase';

export default function PdfToHtml() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(20);
    try {
      trackToolUsed('pdf-to-html', 'pdf');
      const file = files[0];
      const fd = new FormData();
      fd.append('file', file);

      setProgress(40);
      const res = await fetch(apiUrl('/api/tools/pdf-to-html'), { method: 'POST', body: fd });
      setProgress(90);

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }

      const blob = await res.blob();
      setProgress(100);
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '.html'), sizeAfter: blob.size, sizeBefore: file.size });
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
          label="Extracting PDF content..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
