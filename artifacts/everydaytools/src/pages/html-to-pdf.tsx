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

export default function HtmlToPdf() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [htmlInput, setHtmlInput] = useState("");

  const handleConvert = async () => {
    if (mode === 'upload' && !files[0]) return;
    if (mode === 'paste' && !htmlInput.trim()) return;

    setError(null); setIsProcessing(true); setProgress(0);
    try {
      setProgress(20);
      let res: Response;
      let filename = "webpage.pdf";
      let sizeBefore = 0;

      if (mode === 'upload') {
        filename = files[0].name.replace(/\.html?$/i, '.pdf');
        sizeBefore = files[0].size;
        const fd = new FormData();
        fd.append('file', files[0]);
        res = await fetch('/api/tools/html-to-pdf', { method: 'POST', body: fd });
      } else {
        sizeBefore = htmlInput.length;
        res = await fetch('/api/tools/html-to-pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html: htmlInput }),
        });
      }

      setProgress(80);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }
      const blob = await res.blob();
      setProgress(100);
      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore });
      trackToolUsed('html-to-pdf', 'documents');
    } catch (e) {
      trackToolError('html-to-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'HTML to PDF']}
      title={t.tools['html-to-pdf']?.title ?? 'HTML to PDF'}
      description={t.tools['html-to-pdf']?.description ?? 'Convert HTML snippets or files into a PDF document visually.'}
      seoSlug="html-to-pdf"
    >
      <ToolWorkspace>
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setMode('upload')} style={{ background: 'none', border: 'none', borderBottom: mode === 'upload' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'upload' ? 'var(--text)' : 'var(--muted)' }}>Upload File</button>
          <button onClick={() => setMode('paste')} style={{ background: 'none', border: 'none', borderBottom: mode === 'paste' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'paste' ? 'var(--text)' : 'var(--muted)' }}>Paste HTML</button>
        </div>

        {mode === 'upload' ? (
          <FileUpload accept={['.html', '.htm', 'text/html']} maxSizeMB={10} onFiles={setFiles} />
        ) : (
          <textarea
            placeholder="Paste your HTML code here..."
            value={htmlInput}
            onChange={e => setHtmlInput(e.target.value)}
            style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'monospace' }}
          />
        )}

        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted)', marginTop: 8 }}>Note: Complex CSS may not render perfectly client-side. The output is a visual rendering (not selectable text).</p>

        {((mode === 'upload' && files.length > 0) || (mode === 'paste' && htmlInput.trim())) && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to PDF
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Rendering HTML..."
          errorMessage={error ?? undefined}
          onRetry={error && (files.length > 0 || htmlInput.trim().length > 0) ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
