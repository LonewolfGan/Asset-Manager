import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';
import { FileCode2, Copy, Download, Check } from 'lucide-react';

export default function PdfToMarkdown() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setMarkdown(''); setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20);
    trackToolUsed('pdf-to-markdown', 'pdf');
    try {
      const fd = new FormData();
      fd.append('file', file);
      setProgress(40);
      const res = await fetch(apiUrl('/api/convert/pdf-to-markdown'), { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Conversion failed');
      }
      const text = await res.text();
      setMarkdown(text);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pdf-to-markdown', 'general-error');
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name ?? 'document').replace(/\.pdf$/i, '.md');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'PDF Tools', 'PDF to Markdown']} />
        <PageTitle>PDF to Markdown Converter</PageTitle>
        <PageSubtitle>Extract formatted text, headings, lists, and tables from PDF files into clean Markdown syntax.</PageSubtitle>

        {!file && (
          <div
            onClick={() => inputRef.current?.click()}
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius)',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: 'var(--bg-surface)',
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <FileCode2 style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop a PDF file here, or click to browse
            </p>
          </div>
        )}

        {file && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={() => { setFile(null); setStatus('idle'); setMarkdown(''); }}
                style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                Remove
              </button>
            </div>

            {status !== 'processing' && status !== 'done' && (
              <button onClick={convert}
                style={{ marginTop: 16, width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer' }}>
                Convert to Markdown
              </button>
            )}

            {status === 'processing' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState
                  status="loading"
                  progress={progress}
                  label="Converting to Markdown…"
                  steps={['Extracting text', 'Detecting headings & paragraphs', 'Formatting markdown tables', 'Finalizing output']}
                  currentStep={progress < 30 ? 0 : progress < 60 ? 1 : progress < 85 ? 2 : 3}
                />
              </div>
            )}

            {status === 'error' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState status="error" errorMessage={error} onRetry={convert} />
              </div>
            )}

            {status === 'done' && markdown && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Markdown Output</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={copyText} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy MD'}
                    </button>
                    <button onClick={downloadMd} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Download size={12} />
                      Download .md
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  value={markdown}
                  rows={14}
                  style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical' }}
                />
              </div>
            )}
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="pdf-to-markdown" />
    </>
  );
}
