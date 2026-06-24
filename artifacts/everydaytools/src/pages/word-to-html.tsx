import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { sanitizeHTML } from '@/utils/sanitize';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolEmptyState,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function WordToHtml() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number, textOutput?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    trackToolUsed('word-to-html', 'documents');
    try {
      const file = files[0];
      setProgress(30);
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/convert/docx-to-html', { method: 'POST', body: fd });
      setProgress(80);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }
      const html = await res.text();
      setProgress(100);
      const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
      setResult({ blob, filename: file.name.replace(/\.docx?$/i, '.html'), sizeAfter: blob.size, sizeBefore: file.size, textOutput: html });
    } catch (e) {
      trackToolError('word-to-html', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Word to HTML']}
      title={t.tools['word-to-html']?.title ?? 'Word to HTML'}
      description={t.tools['word-to-html']?.description ?? 'Convert DOCX documents to clean, web-ready HTML code.'}
      seoSlug="word-to-html"
    >
      <ToolWorkspace>
        <FileUpload accept={['.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']} maxSizeMB={50} onFiles={setFiles} />

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

        {result && (
          <div style={{ marginTop: 24 }}>
            <ResultPanel {...result} />
          </div>
        )}

        {result && result.textOutput && (
          <div style={{ marginTop: 32, border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, background: 'var(--surface)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--panel-label-weight)' as React.CSSProperties['fontWeight'], marginBottom: 12 }}>Preview</h3>
            <div
              style={{ maxHeight: 400, overflow: 'auto', background: 'var(--bg)', padding: 16, borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(result.textOutput.replace(/<!DOCTYPE html>.*<body>/is, '').replace(/<\/body><\/html>/i, '')) }}
            />
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
