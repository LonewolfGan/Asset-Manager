import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolButton } from '@/components/ToolContent';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function PptxToImages() {
  const { t } = useLocale();
  const title = t.tools['pptx-to-images']?.title ?? 'PowerPoint to Images';
  const desc = t.tools['pptx-to-images']?.description ?? 'Export each slide of a PowerPoint as a PNG image. Download all as a ZIP.';

  const [file, setFile]       = useState<File | null>(null);
  const [status, setStatus]   = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError]     = useState('');
  const [slides, setSlides]   = useState<{ dataUrl: string; name: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (f: File) => {
    setFile(f); setStatus('processing'); setProgress(10); setSlides([]); setError('');

    try {
      // ── API path: LibreOffice headless → real PNG slides ──────────────────
      const form = new FormData();
      form.append('file', f);

      const res = await fetch('/api/tools/pptx-to-images', { method: 'POST', body: form });
      setProgress(70);

      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? `Server error ${res.status}`);
      }

      // API returns a ZIP containing slide-1.png, slide-2.png, …
      const zipBlob = await res.blob();
      const JSZip   = (await import('jszip')).default;
      const zip     = await JSZip.loadAsync(zipBlob);

      setProgress(85);

      const slideNames = Object.keys(zip.files)
        .filter((n) => n.endsWith('.png'))
        .sort((a, b) => {
          const num = (s: string) => parseInt(s.match(/\d+/)?.[0] ?? '0');
          return num(a) - num(b);
        });

      const generated: { dataUrl: string; name: string }[] = [];
      for (const name of slideNames) {
        const data = await zip.files[name].async('base64');
        generated.push({ dataUrl: `data:image/png;base64,${data}`, name });
      }

      if (generated.length === 0) throw new Error('No slide images found in server response.');

      setSlides(generated);
      setProgress(100);
      setStatus('done');
      trackToolUsed('pptx-to-images', 'documents');
    } catch (e) {
      trackToolError('pptx-to-images', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  const downloadAll = async () => {
    const JSZip = (await import('jszip')).default;
    const zip   = new JSZip();
    for (const slide of slides) {
      const base64 = slide.dataUrl.split(',')[1];
      zip.file(slide.name, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = (file?.name.replace(/\.pptx?$/i, '') ?? 'slides') + '_slides.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'PowerPoint', title]}
      title={title}
      description={desc}
      seoSlug="pptx-to-images"
    >
      <ToolWorkspace>
        {slides.length === 0 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) convert(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
              borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center',
              cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)',
              transition: 'all 0.15s',
            }}
          >
            <input ref={inputRef} type="file" accept=".pptx,.ppt" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) convert(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>
              Drop a PowerPoint file here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
              .pptx · max 50 MB
            </p>
          </div>
        )}

        <ToolLoadingState
          status={status === 'processing' ? 'loading' : status === 'error' ? 'error' : 'idle'}
          progress={status === 'processing' ? progress : undefined}
          label="Converting slides with LibreOffice..."
          errorMessage={error || undefined}
          onRetry={status === 'error' && file ? () => convert(file) : undefined}
        />

        {slides.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>
                {slides.length} slide{slides.length !== 1 ? 's' : ''} — pixel-accurate render
              </span>
              <button onClick={downloadAll} style={{
                padding: '7px 18px', background: 'var(--accent)', color: 'var(--accent-text)',
                border: 'none', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)',
                fontWeight: 500, cursor: 'pointer',
              }}>
                Download all as ZIP
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <img src={slide.dataUrl} alt={`Slide ${i + 1}`} style={{ width: '100%', display: 'block' }} loading="lazy" />
                  <div style={{
                    padding: '6px 10px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                      Slide {i + 1}
                    </span>
                    <a href={slide.dataUrl} download={slide.name} style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--accent)', textDecoration: 'none' }}>
                      PNG
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 16 }}>
              <button
                onClick={() => { setSlides([]); setFile(null); setStatus('idle'); }}
                style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                Convert another file
              </button>
            </div>
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
