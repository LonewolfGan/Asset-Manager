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
import { apiUrl } from '@/lib/apiBase';

export default function PdfToText() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number, textOutput?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null);
    setIsProcessing(true);
    setProgress(0);

    try {
      trackToolUsed('pdf-to-text', 'pdf');
      const file = files[0];
      setProgress(30);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch(apiUrl('/api/convert/pdf-to-text'), { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }
      const fullText = await res.text();
      setProgress(100);
      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '.txt'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
        textOutput: fullText
      });
    } catch (e) {
      trackToolError('pdf-to-text', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', 'PDF to Text']}
      title={t.tools['pdf-to-text']?.title ?? 'PDF to Text'}
      description={t.tools['pdf-to-text']?.description ?? 'Instantly extract plain text from any PDF document securely in your browser.'}
      seoSlug="pdf-to-text"
    >
      <ToolWorkspace>
        <FileUpload accept={['.pdf', 'application/pdf']} maxSizeMB={50} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Extract Text
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Extracting text..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
