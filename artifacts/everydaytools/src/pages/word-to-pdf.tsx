import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

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
    setStatus('processing'); setProgress(10);
    trackToolUsed('word-to-pdf', 'documents');
    try {
      const mammoth = (await import('mammoth')).default;
      setProgress(25);
      const arrayBuf = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: arrayBuf });
      setProgress(50);
      const html = result.value;

      const jsPDF = (await import('jspdf')).jsPDF;
      setProgress(65);

      const fullHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1a1a1a; }
        h1,h2,h3 { font-weight: bold; margin: 1em 0 0.5em; }
        h1 { font-size: 2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.2em; }
        p { margin: 0 0 1em; } ul, ol { margin: 0 0 1em 2em; }
        table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        td, th { border: 1px solid #ccc; padding: 6px 10px; }
        strong { font-weight: bold; } em { font-style: italic; }
      </style></head><body>${html}</body></html>`;

      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:794px;background:#fff;padding:0;';
      container.innerHTML = fullHtml;
      document.body.appendChild(container);
      setProgress(75);

      const { toPng } = await import('html-to-image');
      const pages: string[] = [];
      const totalH = container.scrollHeight;
      const pageH = 1122;
      const numPages = Math.max(1, Math.ceil(totalH / pageH));

      for (let i = 0; i < numPages; i++) {
        container.scrollTop = 0;
        const clip = document.createElement('div');
        clip.style.cssText = `width:794px;height:${Math.min(pageH, totalH - i * pageH)}px;overflow:hidden;position:relative;`;
        const inner = document.createElement('div');
        inner.style.cssText = `position:absolute;top:-${i * pageH}px;width:794px;`;
        inner.innerHTML = container.innerHTML;
        clip.appendChild(inner);
        document.body.appendChild(clip);
        const dataUrl = await toPng(clip, { width: 794, pixelRatio: 1.5 });
        pages.push(dataUrl);
        document.body.removeChild(clip);
      }
      document.body.removeChild(container);

      setProgress(90);
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: 'a4' });
      const A4W = pdf.internal.pageSize.getWidth();
      const A4H = pdf.internal.pageSize.getHeight();

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();
        pdf.addImage(pages[i], 'PNG', 0, 0, A4W, A4H);
      }

      const blob = pdf.output('blob');
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
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Documents', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', transition: 'all 0.15s' }}
        >
          <input ref={inputRef} type="file" accept=".docx,.doc" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
            Drop DOCX or DOC file here, or click to browse
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>.docx · .doc · max 25 MB</p>
        </div>

        {file && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(file.size)}</p>
            </div>
            <button onClick={() => { setFile(null); setStatus('idle'); setPdfBlob(null); }}
              style={{ padding: '4px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 12, cursor: 'pointer' }}>
              Remove
            </button>
          </div>
        )}

        {file && status !== 'processing' && (
          <button onClick={convert}
            style={{ marginTop: 16, width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            Convert to PDF
          </button>
        )}

        {status === 'processing' && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Converting…</span><span style={{ fontFamily: 'var(--font-mono)' }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-surface)', border: '1px solid var(--danger, #dc2626)', borderRadius: 'var(--radius)', color: 'var(--danger, #dc2626)', fontFamily: 'var(--font-ui)', fontSize: 14 }}>
            {error}
          </div>
        )}

        {status === 'done' && pdfBlob && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>PDF ready</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', margin: '2px 0 0' }}>{formatBytes(pdfBlob.size)}</p>
            </div>
            <button onClick={download}
              style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>
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
