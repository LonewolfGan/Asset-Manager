import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function Ocr() {
  const { t } = useLocale();
  const title = t.tools['ocr']?.title ?? 'OCR — Image to Text';
  const desc = t.tools['ocr']?.description ?? 'Extract text from scanned PDFs or images using Tesseract.js — runs entirely in your browser.';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setStatus('idle'); setOutput(''); setError(''); };

  const recognize = async () => {
    if (!file) return;
    setStatus('loading'); setProgress(0); setProgressLabel('Loading OCR engine…'); setOutput('');
    try {
      const { createWorker } = await import('tesseract.js');
      const worker = await createWorker('eng', 1, {
        logger: (m: { status: string; progress: number }) => {
          setProgressLabel(m.status);
          setProgress(Math.round(m.progress * 100));
          if (m.status.includes('recogniz')) setStatus('processing');
        },
      });
      const result = await worker.recognize(file);
      await worker.terminate();
      setOutput(result.data.text);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'OCR failed');
      setStatus('error');
    }
  };

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name.replace(/\.[^.]+$/, '') ?? 'ocr') + '.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'PDF Tools', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 24, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
          {t.ocr.modelNote}
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', marginBottom: 20 }}
        >
          <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.tif,.webp" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
            {file ? file.name : t.common.dropFileHere}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>
            JPG · PNG · GIF · BMP · TIFF · WebP · max 20 MB
          </p>
        </div>

        {file && status === 'idle' && (
          <button onClick={recognize}
            style={{ width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer', marginBottom: 20 }}>
            {t.ocr.extractBtn}
          </button>
        )}

        {(status === 'loading' || status === 'processing') && (
          <div style={{ padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>{progressLabel || 'Processing…'}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        {status === 'error' && <p style={{ color: 'var(--danger,#dc2626)', fontFamily: 'var(--font-ui)', fontSize: 14, marginBottom: 16 }}>{error}</p>}

        {status === 'done' && output && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, color: 'var(--text-primary)' }}>{t.ocr.extractedText}</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={copy} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{copied ? t.common.copied : t.common.copy}</button>
                <button onClick={download} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--text-primary)', color: 'var(--bg-base)', fontFamily: 'var(--font-ui)', fontSize: 12, cursor: 'pointer' }}>{t.common.downloadTxt}</button>
              </div>
            </div>
            <textarea readOnly value={output}
              style={{ width: '100%', height: 360, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="ocr" />
    </>
  );
}
