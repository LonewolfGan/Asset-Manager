import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolButton,
} from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';
import { apiUrl } from '@/lib/apiBase';

function formatBytes(b: number) {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

export default function PdfToExcel() {
  const { t } = useLocale();
  const title = t.tools['pdf-to-excel']?.title ?? 'PDF to Excel';
  const desc  = t.tools['pdf-to-excel']?.description ?? 'Extract tables from PDFs and export to Excel.';

  const [file, setFile]         = useState<File | null>(null);
  const [status, setStatus]     = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError]       = useState('');
  const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);
  const [xlsxSize, setXlsxSize] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setXlsxBlob(null); setError('');
  };

  const convert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(10);
    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch(apiUrl('/api/convert/pdf-to-excel'), { method: 'POST', body: form });
      setProgress(80);

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      const blob = await res.blob();
      setProgress(100);
      setXlsxBlob(blob);
      setXlsxSize(blob.size);
      setStatus('done');
      trackToolUsed('pdf-to-excel', 'pdf');
    } catch (e) {
      trackToolError('pdf-to-excel', 'general-error');
      setError(e instanceof Error ? e.message : 'Extraction failed');
      setStatus('error');
    }
  };

  const download = () => {
    if (!xlsxBlob || !file) return;
    const url = URL.createObjectURL(xlsxBlob);
    const a   = document.createElement('a');
    a.href    = url;
    a.download = file.name.replace(/\.pdf$/i, '.xlsx');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PDF Tools', title]}
      title={title}
      description={desc}
      seoSlug="pdf-to-excel"
    >
      <ToolWorkspace>
        <div style={{
          padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)',
          border: '1px solid var(--border)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)',
        }}>
          Uses pdfplumber for automatic table detection. Works best on PDFs with real text (not scanned images).
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center',
            cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)',
          }}
        >
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
            {file ? file.name : (t.common.dropFileHere ?? 'Drop file here or click to browse')}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
            .pdf · max 50 MB
          </p>
        </div>

        {file && status === 'idle' && (
          <ToolButton variant="primary" fullWidth onClick={convert}>
            {t.common.convertBtn ?? 'Extract to Excel'}
          </ToolButton>
        )}

        <ToolLoadingState
          status={status === 'processing' ? 'loading' : status === 'error' ? 'error' : 'idle'}
          progress={status === 'processing' ? progress : undefined}
          label="Extracting tables with pdfplumber..."
          errorMessage={error || undefined}
          onRetry={status === 'error' && file ? convert : undefined}
        />

        {status === 'done' && xlsxBlob && (
          <div style={{
            marginTop: 16, padding: '16px 20px', background: 'var(--bg-surface)',
            border: '1px solid var(--border)', borderRadius: 'var(--radius)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>
                Excel file ready
              </p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '4px 0 0' }}>
                {formatBytes(xlsxSize)}
              </p>
            </div>
            <button onClick={download} style={{
              padding: '9px 18px', background: 'var(--accent)', color: 'var(--accent-text)',
              border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)',
              fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer',
            }}>
              {t.common.download ?? 'Download'}
            </button>
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
