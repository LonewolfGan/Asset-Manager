import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolButton,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function TxtToPdf() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [textInput, setTextInput] = useState("");

  const handleConvert = async () => {
    if (mode === 'upload' && !files[0]) return;
    if (mode === 'paste' && !textInput.trim()) return;

    setError(null); setIsProcessing(true); setProgress(10);
    trackToolUsed('txt-to-pdf', 'documents');

    try {
      let text = "";
      let filename = "document.pdf";
      let sizeBefore = 0;

      if (mode === 'upload') {
        text = await files[0].text();
        filename = files[0].name.replace(/\.txt$/i, '.pdf');
        sizeBefore = files[0].size;
      } else {
        text = textInput;
        sizeBefore = new TextEncoder().encode(textInput).length;
      }

      setProgress(30);

      const res = await fetch('/api/convert/text-to-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      setProgress(80);

      if (!res.ok) {
        const json = await res.json().catch(() => ({ error: 'Conversion failed' }));
        throw new Error(json.error ?? 'Conversion failed');
      }

      const blob = await res.blob();
      setProgress(100);
      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore });
    } catch (e) {
      trackToolError('txt-to-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Word Tools', 'Text to PDF']}
      title={t.tools['txt-to-pdf']?.title ?? 'Text to PDF'}
      description={t.tools['txt-to-pdf']?.description ?? 'Convert plain text into a perfectly formatted PDF document.'}
      seoSlug="txt-to-pdf"
    >
      <ToolWorkspace>
        <div style={{ marginBottom: 24, display: 'flex', gap: 16, borderBottom: '1px solid var(--border)' }}>
          <button onClick={() => setMode('upload')} style={{ background: 'none', border: 'none', borderBottom: mode === 'upload' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'upload' ? 'var(--text)' : 'var(--muted)' }}>Upload File</button>
          <button onClick={() => setMode('paste')} style={{ background: 'none', border: 'none', borderBottom: mode === 'paste' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'paste' ? 'var(--text)' : 'var(--muted)' }}>Paste Text</button>
        </div>

        {mode === 'upload' ? (
          <FileUpload accept={['.txt', 'text/plain']} maxSizeMB={10} onFiles={setFiles} />
        ) : (
          <textarea
            placeholder="Paste your text here..."
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'var(--font-mono)', resize: 'vertical', boxSizing: 'border-box' }}
          />
        )}

        {((mode === 'upload' && files.length > 0) || (mode === 'paste' && textInput.trim())) && !isProcessing && (
          <ToolButton variant="primary" fullWidth onClick={handleConvert} disabled={isProcessing}>
            Convert to PDF
          </ToolButton>
        )}

        <ToolLoadingState
          status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
          progress={isProcessing ? progress : undefined}
          label="Generating PDF on server..."
          errorMessage={error ?? undefined}
          onRetry={error ? handleConvert : undefined}
        />
        {result && <ResultPanel {...result} />}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
