import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { apiUrl } from '@/lib/apiBase';
import { ScanText, Copy, Download, Check } from 'lucide-react';

export default function PdfOcr() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [lang, setLang] = useState('eng+fra');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [extractedText, setExtractedText] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setExtractedText(''); setProgress(0);
  };

  const runOcr = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(20);
    trackToolUsed('pdf-ocr', 'pdf');
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('lang', lang);
      setProgress(40);
      const res = await fetch(apiUrl('/api/tools/pdf-ocr'), { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'OCR processing failed');
      }
      const data = await res.json() as { text: string };
      setExtractedText(data.text);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pdf-ocr', 'general-error');
      setStatus('error');
      setError(e instanceof Error ? e.message : 'OCR failed');
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name ?? 'document').replace(/\.pdf$/i, '_ocr.txt');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'PDF Tools', 'PDF OCR (Scanned PDF to Text)']} />
        <PageTitle>PDF OCR — Scanned Document to Text</PageTitle>
        <PageSubtitle>Extract editable text from scanned PDFs and document images using optical character recognition.</PageSubtitle>

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
            <ScanText style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop a scanned PDF here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
              Supports multilingual text recognition (English, French, Spanish, German)
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
              <button onClick={() => { setFile(null); setStatus('idle'); setExtractedText(''); }}
                style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', color: 'var(--text-secondary)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                Remove
              </button>
            </div>

            {status !== 'processing' && status !== 'done' && (
              <div style={{ marginTop: 16, display: 'flex', gap: 12, alignItems: 'center' }}>
                <select value={lang} onChange={(e) => setLang(e.target.value)}
                  style={{ padding: '10px 12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}>
                  <option value="eng+fra">English + French</option>
                  <option value="eng">English only</option>
                  <option value="fra">French only</option>
                  <option value="spa">Spanish</option>
                  <option value="deu">German</option>
                </select>
                <button onClick={runOcr}
                  style={{ flex: 1, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer' }}>
                  Extract Text with OCR
                </button>
              </div>
            )}

            {status === 'processing' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState
                  status="loading"
                  progress={progress}
                  label="Recognizing text…"
                  steps={['Rendering pages', 'Analyzing character glyphs', 'Running OCR engine', 'Formatting output']}
                  currentStep={progress < 30 ? 0 : progress < 60 ? 1 : progress < 85 ? 2 : 3}
                />
              </div>
            )}

            {status === 'error' && (
              <div style={{ marginTop: 16 }}>
                <ToolLoadingState status="error" errorMessage={error} onRetry={runOcr} />
              </div>
            )}

            {status === 'done' && extractedText && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Extracted Text</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={copyText} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy Text'}
                    </button>
                    <button onClick={downloadTxt} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Download size={12} />
                      Download .txt
                    </button>
                  </div>
                </div>
                <textarea
                  readOnly
                  value={extractedText}
                  rows={12}
                  style={{ width: '100%', padding: 12, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical' }}
                />
              </div>
            )}
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="pdf-ocr" />
    </>
  );
}
