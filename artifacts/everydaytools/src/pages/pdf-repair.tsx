import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';
import { Wrench, Download } from 'lucide-react';

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfRepair() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [repairedBlob, setRepairedBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setRepairedBlob(null); setProgress(0);
  };

  const repair = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20);
    trackToolUsed('pdf-repair', 'pdf');
    try {
      const fd = new FormData();
      fd.append('file', file);
      setProgress(40);
      const res = await fetch(apiUrl('/api/tools/pdf-repair'), { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'PDF repair failed');
      }
      const blob = await res.blob();
      setRepairedBlob(blob);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pdf-repair', 'general-error');
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Could not repair PDF file');
    }
  };

  const download = () => {
    if (!repairedBlob || !file) return;
    const url = URL.createObjectURL(repairedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '_repaired.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'PDF Tools', 'Repair Damaged PDF']} />
        <PageTitle>PDF Repair Tool</PageTitle>
        <PageSubtitle>Recover and repair damaged, unreadable, or corrupted PDF files via cross-reference table reconstruction.</PageSubtitle>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)',
              padding: '48px 24px',
              textAlign: 'center',
              cursor: 'pointer',
              background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)',
              transition: 'all 0.15s',
            }}
          >
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <Wrench style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop corrupted PDF file here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
              Fixes broken XREFs · Corrupted streams · Structural syntax errors
            </p>
          </div>
        )}

        {file && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setStatus('idle'); setRepairedBlob(null); }}
                style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                Remove
              </button>
            </div>

            {status !== 'processing' && status !== 'done' && (
              <button onClick={repair}
                style={{ marginTop: 16, width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer' }}>
                Attempt PDF Repair
              </button>
            )}

            {status === 'processing' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState
                  status="loading"
                  progress={progress}
                  label="Repairing PDF structure…"
                  steps={['Scanning document stream', 'Rebuilding cross-reference tables', 'Recovering page trees', 'Generating clean PDF']}
                  currentStep={progress < 40 ? 0 : progress < 60 ? 1 : progress < 85 ? 2 : 3}
                />
              </div>
            )}

            {status === 'error' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState status="error" errorMessage={error} onRetry={repair} />
              </div>
            )}

            {status === 'done' && repairedBlob && (
              <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>PDF Repaired Successfully</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(repairedBlob.size)}</p>
                </div>
                <button onClick={download}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={16} />
                  Download Repaired PDF
                </button>
              </div>
            )}
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="pdf-repair" />
    </>
  );
}
