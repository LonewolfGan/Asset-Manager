import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { sanitizeHTML } from '@/utils/sanitize';
import { PageTitle, PageSubtitle } from '@/components/Typography';

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function WordToPdf() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setPdfBlob(null); setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20);
    trackToolUsed('word-to-pdf', 'documents');
    try {
      const fd = new FormData();
      fd.append('file', file);
      setProgress(40);
      const res = await fetch('/api/tools/word-to-pdf', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }
      const blob = await res.blob();
      setPdfBlob(blob);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('word-to-pdf', 'general-error');
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const download = () => {
    if (!pdfBlob || !file) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.(docx?|doc)$/i, '.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  const title = t.tools['word-to-pdf']?.title ?? 'Word to PDF';
  const desc = t.tools['word-to-pdf']?.description ?? 'Convert DOCX and DOC files to PDF entirely in your browser.';

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Documents', title]} />
        <PageTitle>{title}</PageTitle>
        <PageSubtitle>{desc}</PageSubtitle>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', transition: 'all 0.15s' }}
        >
          <input ref={inputRef} type="file" accept=".docx,.doc" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            Drop DOCX or DOC file here, or click to browse
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.docx · .doc · max 25 MB</p>
        </div>

        {file && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setStatus('idle'); setPdfBlob(null); }}
              style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        )}

        {file && status !== 'processing' && (
          <button onClick={convert}
            style={{ marginTop: 16, width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
            Convert to PDF
          </button>
        )}

        {status === 'processing' && (
          <div style={{ marginTop: 16 }}>
            <ToolLoadingState
              status="loading"
              progress={progress}
              label="Converting…"
              steps={['Reading document', 'Converting to HTML', 'Rendering pages', 'Generating PDF']}
              currentStep={progress < 40 ? 0 : progress < 60 ? 1 : progress < 85 ? 2 : 3}
            />
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 16 }}>
            <ToolLoadingState
              status="error"
              errorMessage={error}
              onRetry={convert}
            />
          </div>
        )}

        {status === 'done' && pdfBlob && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>PDF ready</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(pdfBlob.size)}</p>
            </div>
            <button onClick={download}
              style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
              Download PDF
            </button>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="word-to-pdf" />
    </>
  );
}
