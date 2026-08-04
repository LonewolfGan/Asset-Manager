import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolButton } from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import { apiUrl } from '@/lib/apiBase';

export default function MarkdownToDocx() {
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
      const file = files[0];
      const fd = new FormData();
      fd.append('file', file);

      setProgress(40);
      const res = await fetch(apiUrl('/api/convert/markdown-to-docx'), { method: 'POST', body: fd });
      setProgress(90);

      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }

      const blob = await res.blob();
      setProgress(100);
      trackToolUsed('markdown-to-docx', 'documents');
      setResult({ blob, filename: file.name.replace(/\.(md|txt)$/i, '.docx'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('markdown-to-docx', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Markdown to Word']}
      title={t.tools['markdown-to-docx']?.title ?? 'Markdown to Word'}
      description={t.tools['markdown-to-docx']?.description ?? 'Convert Markdown files to Microsoft Word (.docx) format.'}
      seoSlug="markdown-to-docx"
    >
      <ToolWorkspace>
        <FileUpload accept={['.md', '.txt', 'text/markdown', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />

        {files.length > 0 && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to DOCX
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Converting to DOCX..."
          errorMessage={error ?? undefined}
          onRetry={error && files.length > 0 ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
