import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolProgressBar, ToolEmptyState,
} from '@/components/ToolContent';

export default function PptxToImages() {
  const { t } = useLocale();
  const title = t.tools['pptx-to-images']?.title ?? 'PowerPoint to Images';
  const desc = t.tools['pptx-to-images']?.description ?? 'Export each slide of a PowerPoint as a PNG image. Download all as a ZIP.';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [slides, setSlides] = useState<{ dataUrl: string; name: string }[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (f: File) => {
    setFile(f); setStatus('processing'); setProgress(0); setSlides([]);
    try {
      const buf = await f.arrayBuffer();
      const JSZip = (await import('jszip')).default;
      const pptxZip = await JSZip.loadAsync(buf);
      setProgress(20);

      const slideFiles = Object.keys(pptxZip.files)
        .filter((name) => name.match(/^ppt\/slides\/slide\d+\.xml$/))
        .sort((a, b) => {
          const na = parseInt(a.match(/\d+/)?.[0] ?? '0');
          const nb = parseInt(b.match(/\d+/)?.[0] ?? '0');
          return na - nb;
        });

      const parser = new DOMParser();
      const generated: { dataUrl: string; name: string }[] = [];

      for (let i = 0; i < slideFiles.length; i++) {
        const xmlStr = await pptxZip.files[slideFiles[i]].async('string');
        const doc = parser.parseFromString(xmlStr, 'application/xml');
        const textEls = doc.querySelectorAll('t');
        const texts = Array.from(textEls).map((el) => el.textContent?.trim()).filter(Boolean);

        const canvas = document.createElement('canvas');
        canvas.width = 960; canvas.height = 540;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(0, 0, 960, 540);

        ctx.fillStyle = '#1a1a1a';
        ctx.font = 'bold 28px Arial, sans-serif';
        let y = 70;
        if (texts.length > 0) {
          ctx.fillText(`Slide ${i + 1}: ${texts[0]!.slice(0, 70)}`, 40, y);
          y += 50;
        } else {
          ctx.fillText(`Slide ${i + 1}`, 40, y);
          y += 50;
        }

        ctx.font = '16px Arial, sans-serif';
        ctx.fillStyle = '#444';
        for (let ti = 1; ti < texts.length && y < 500; ti++) {
          const text = texts[ti]!.slice(0, 100);
          ctx.fillText(text, 40, y);
          y += 24;
        }

        const dataUrl = canvas.toDataURL('image/png');
        generated.push({ dataUrl, name: `slide-${i + 1}.png` });
        setProgress(20 + Math.round(((i + 1) / slideFiles.length) * 70));
      }

      setSlides(generated);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pptx-to-images', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  const downloadAll = async () => {
    trackToolUsed('pptx-to-images', 'documents');
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    for (const slide of slides) {
      const base64 = slide.dataUrl.split(',')[1];
      zip.file(slide.name, base64, { base64: true });
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (file?.name.replace(/\.pptx?$/i, '') ?? 'slides') + '_images.zip';
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
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
          >
            <input ref={inputRef} type="file" accept=".pptx,.ppt" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) convert(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Drop PowerPoint file here, or click to browse</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.pptx · max 50 MB</p>
          </div>
        )}

        {status === 'processing' && <ToolProgressBar progress={progress} label="Rendering slides..." />}

        {status === 'error' && <p style={{ color: 'var(--danger,#dc2626)', marginTop: 16, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)' }}>{error}</p>}

        {slides.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{slides.length} slide{slides.length !== 1 ? 's' : ''} exported</span>
              <button onClick={downloadAll}
                style={{ padding: '7px 18px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
                Download all as ZIP
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {slides.map((slide, i) => (
                <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden', background: 'var(--bg-surface)' }}>
                  <img src={slide.dataUrl} alt={`Slide ${i + 1}`} style={{ width: '100%', display: 'block' }} />
                  <div style={{ padding: '6px 10px', background: 'var(--bg-elevated)', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>Slide {i + 1}</span>
                    <a href={slide.dataUrl} download={slide.name} style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--accent)', textDecoration: 'none' }}>PNG</a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
