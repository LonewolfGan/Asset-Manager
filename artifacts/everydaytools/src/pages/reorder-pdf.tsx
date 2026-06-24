import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

interface PageThumb {
  index: number;
  dataUrl: string;
}

export default function ReorderPdf() {
  const { t } = useLocale();
  const title = t.tools['reorder-pdf']?.title ?? 'Reorder PDF Pages';
  const desc = t.tools['reorder-pdf']?.description ?? 'Drag and drop PDF pages to reorder them, then download the new PDF.';
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageThumb[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dropIdx, setDropIdx] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadPdf = async (f: File) => {
    setFile(f); setStatus('loading'); setProgress(0); setPages([]);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const thumbs: PageThumb[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 0.3 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp } as any).promise;
        thumbs.push({ index: i - 1, dataUrl: canvas.toDataURL() });
        setProgress(Math.round((i / pdf.numPages) * 100));
      }
      setPages(thumbs);
      setStatus('idle');
    } catch (e) {
      trackToolError('reorder-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Failed to load PDF');
      setStatus('error');
    }
  };

  const handleDrop = (targetIdx: number) => {
    if (dragIdx === null || dragIdx === targetIdx) return;
    setPages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIdx, 1);
      updated.splice(targetIdx, 0, moved);
      return updated;
    });
    setDragIdx(null); setDropIdx(null);
  };

  const removePage = (idx: number) => setPages((prev) => prev.filter((_, i) => i !== idx));

  const save = async () => {
    trackToolUsed('reorder-pdf', 'pdf');
    if (!file) return;
    setStatus('saving'); setProgress(0);
    try {
      const { PDFDocument } = await import('pdf-lib');
      const buf = await file.arrayBuffer();
      const src = await PDFDocument.load(buf);
      const dest = await PDFDocument.create();
      setProgress(30);
      const order = pages.map((p) => p.index);
      const copied = await dest.copyPages(src, order);
      for (const page of copied) dest.addPage(page);
      setProgress(80);
      const bytes = await dest.save();
      const blob = new Blob([bytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.pdf$/i, '_reordered.pdf');
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('reorder-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Failed to save PDF');
      setStatus('error');
    }
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'PDF Tools', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{desc}</p>

        {pages.length === 0 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) loadPdf(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
          >
            <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) loadPdf(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{t.common.dropFileHere}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.pdf · max 50 MB</p>
          </div>
        )}

        {status === 'loading' && (
          <div style={{ marginTop: 20 }}>
            <ToolLoadingState
              status="loading"
              progress={progress}
              label="Loading pages…"
            />
          </div>
        )}

        {status === 'error' && (
          <div style={{ marginTop: 16 }}>
            <ToolLoadingState
              status="error"
              errorMessage={error}
              onRetry={() => file && loadPdf(file)}
            />
          </div>
        )}

        {pages.length > 0 && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {pages.length} page{pages.length !== 1 ? 's' : ''} — drag to reorder, click × to remove
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setPages([]); setFile(null); setStatus('idle'); }}
                  style={{ padding: '6px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  Load different PDF
                </button>
                <button onClick={save} disabled={status === 'saving'}
                  style={{ padding: '6px 18px', background: status === 'saving' ? 'var(--bg-elevated)' : 'var(--accent)', color: status === 'saving' ? 'var(--text-tertiary)' : 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: status === 'saving' ? 'not-allowed' : 'pointer' }}>
                  {status === 'saving' ? 'Saving…' : 'Save Reordered PDF'}
                </button>
              </div>
            </div>

            {status === 'saving' && (
              <div style={{ marginBottom: 12 }}>
                <ToolLoadingState
                  status="loading"
                  progress={progress}
                  label="Saving reordered PDF…"
                />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 12 }}>
              {pages.map((page, idx) => (
                <div
                  key={`${page.index}-${idx}`}
                  draggable
                  onDragStart={() => { setDragIdx(idx); }}
                  onDragOver={(e) => { e.preventDefault(); setDropIdx(idx); }}
                  onDrop={() => handleDrop(idx)}
                  onDragEnd={() => { setDragIdx(null); setDropIdx(null); }}
                  style={{
                    border: `2px solid ${dropIdx === idx ? 'var(--accent)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    background: 'var(--bg-surface)',
                    cursor: 'grab',
                    opacity: dragIdx === idx ? 0.4 : 1,
                    position: 'relative',
                    transition: 'border-color 0.1s',
                  }}
                >
                  <img src={page.dataUrl} alt={`Page ${idx + 1}`} style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: '4px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{idx + 1}</span>
                    <button onClick={() => removePage(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 2px', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', lineHeight: 1 }}>×</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="reorder-pdf" />
    </>
  );
}
