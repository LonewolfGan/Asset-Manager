import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';
import { FileStack, Download, ArrowRight } from 'lucide-react';

function formatBytes(b: number) {
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / (1024 * 1024)).toFixed(2)} MB`;
}

const SUPPORTED_FORMATS = ['pdf', 'docx', 'doc', 'odt', 'rtf', 'txt', 'html', 'epub', 'pptx', 'xlsx'];

export default function DocumentConverter() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('pdf');
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setResultBlob(null); setProgress(0);
  };

  const convert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20);
    trackToolUsed('document-converter', 'word');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('targetFormat', targetFormat);
      setProgress(40);
      const res = await fetch(apiUrl('/api/tools/document-convert'), { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Document conversion failed');
      }
      const blob = await res.blob();
      setResultBlob(blob);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('document-converter', 'general-error');
      setStatus('error');
      setError(e instanceof Error ? e.message : 'Document conversion failed');
    }
  };

  const download = () => {
    if (!resultBlob || !file) return;
    const url = URL.createObjectURL(resultBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.[^.]+$/, `.${targetFormat}`);
    a.click();
    URL.revokeObjectURL(url);
  };

  const inputExt = file?.name.split('.').pop()?.toLowerCase() ?? 'docx';

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Documents', 'Universal Document Converter']} />
        <PageTitle>Universal Document Converter</PageTitle>
        <PageSubtitle>Convert between DOCX, DOC, ODT, RTF, TXT, HTML, EPUB, PDF, PPTX, and XLSX with maximum layout fidelity via headless LibreOffice.</PageSubtitle>

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
            <input ref={inputRef} type="file" accept=".docx,.doc,.odt,.rtf,.txt,.html,.htm,.epub,.pptx,.xlsx" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <FileStack style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop any document file here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
              DOCX · DOC · ODT · RTF · TXT · HTML · EPUB · PPTX · XLSX
            </p>
          </div>
        )}

        {file && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(file.size)}</p>
              </div>
              <button onClick={() => { setFile(null); setStatus('idle'); setResultBlob(null); }}
                style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                Remove
              </button>
            </div>

            {status !== 'processing' && status !== 'done' && (
              <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
                  Convert {inputExt.toUpperCase()} to:
                </label>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <select
                    value={targetFormat}
                    onChange={(e) => setTargetFormat(e.target.value)}
                    style={{ padding: '10px 16px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
                  >
                    {SUPPORTED_FORMATS.filter(fmt => fmt !== inputExt).map(fmt => (
                      <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                    ))}
                  </select>

                  <button onClick={convert}
                    style={{ flex: 1, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span>Convert Now</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {status === 'processing' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState
                  status="loading"
                  progress={progress}
                  label={`Converting to ${targetFormat.toUpperCase()}…`}
                  steps={['Loading document layout', 'Spawning LibreOffice engine', 'Rendering font mappings & vector paths', 'Exporting output file']}
                  currentStep={progress < 30 ? 0 : progress < 60 ? 1 : progress < 85 ? 2 : 3}
                />
              </div>
            )}

            {status === 'error' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState status="error" errorMessage={error} onRetry={convert} />
              </div>
            )}

            {status === 'done' && resultBlob && (
              <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>Document Ready ({targetFormat.toUpperCase()})</p>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(resultBlob.size)}</p>
                </div>
                <button onClick={download}
                  style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Download size={16} />
                  Download {targetFormat.toUpperCase()}
                </button>
              </div>
            )}
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="document-converter" />
    </>
  );
}
