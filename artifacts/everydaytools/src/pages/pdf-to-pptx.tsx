import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function PdfToPptx() {
  const { t } = useLocale();
  const title = t.tools['pdf-to-pptx']?.title ?? 'PDF to PowerPoint';
  const desc = t.tools['pdf-to-pptx']?.description ?? 'Convert each PDF page into a PowerPoint slide with an image per page.';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (f: File) => {
    setFile(f); setStatus('processing'); setProgress(5);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      setProgress(15);

      const PptxGenJS = (await import('pptxgenjs')).default;
      const pptx = new PptxGenJS();
      pptx.layout = 'LAYOUT_WIDE';

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const vp = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = vp.width; canvas.height = vp.height;
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport: vp } as any).promise;
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const slide = pptx.addSlide();
        slide.addImage({ data: dataUrl, x: 0, y: 0, w: '100%', h: '100%' });
        setProgress(15 + Math.round((i / pdf.numPages) * 75));
      }

      setProgress(90);
      const blob = await pptx.write({ outputType: 'blob' }) as Blob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = f.name.replace(/\.pdf$/i, '.pptx');
      a.click();
      URL.revokeObjectURL(url);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'PowerPoint', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 20, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
          Each PDF page is rendered as a full-slide image in the PPTX. Editable text is not preserved.
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) convert(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
        >
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) convert(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>
            {file ? file.name : 'Drop PDF here, or click to browse'}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>.pdf · max 50 MB</p>
        </div>

        {status === 'processing' && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>Rendering pages…</span><span style={{ fontFamily: 'var(--font-mono)' }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        {status === 'error' && <p style={{ color: 'var(--danger,#dc2626)', marginTop: 16, fontFamily: 'var(--font-ui)', fontSize: 14 }}>{error}</p>}
        {status === 'done' && <p style={{ color: 'var(--text-secondary)', marginTop: 16, fontFamily: 'var(--font-ui)', fontSize: 14 }}>PPTX downloaded successfully.</p>}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="pdf-to-pptx" />
    </>
  );
}
