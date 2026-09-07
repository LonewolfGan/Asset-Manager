import { useState, useRef, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Sliders, Download, RotateCcw } from 'lucide-react';

export default function ImageFilters() {
  const { t } = useLocale();
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [filter, setFilter] = useState<'none' | 'grayscale' | 'sepia' | 'invert' | 'blur' | 'brightness' | 'contrast' | 'hue'>('grayscale');
  const [intensity, setIntensity] = useState<number>(100);
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setImgSrc(url);
    trackToolUsed('image-filters', 'image');
  };

  useEffect(() => {
    if (!imgSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let filterStr = 'none';
      const pct = intensity / 100;
      switch (filter) {
        case 'grayscale': filterStr = `grayscale(${pct})`; break;
        case 'sepia': filterStr = `sepia(${pct})`; break;
        case 'invert': filterStr = `invert(${pct})`; break;
        case 'blur': filterStr = `blur(${(intensity / 10).toFixed(1)}px)`; break;
        case 'brightness': filterStr = `brightness(${(0.2 + pct * 1.8).toFixed(2)})`; break;
        case 'contrast': filterStr = `contrast(${(0.2 + pct * 2.0).toFixed(2)})`; break;
        case 'hue': filterStr = `hue-rotate(${(intensity * 3.6).toFixed(0)}deg)`; break;
        default: filterStr = 'none';
      }
      ctx.filter = filterStr;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
    img.src = imgSrc;
  }, [imgSrc, filter, intensity]);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const ext = file.name.split('.').pop() || 'png';
      a.download = file.name.replace(/\.[^.]+$/, `_${filter}.${ext}`);
      a.click();
      URL.revokeObjectURL(url);
    }, file.type || 'image/png', 0.95);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Image Tools', 'Image Color Filters & Effects']} />
        <PageTitle>Image Filters & Color Effects</PageTitle>
        <PageSubtitle>Apply grayscale, sepia, invert, blur, brightness, and color adjustments directly in your browser.</PageSubtitle>

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
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <Sliders style={{ width: 40, height: 40, margin: '0 auto 12px', color: 'var(--accent)' }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-base)', color: 'var(--text-primary)', margin: 0, fontWeight: 500 }}>
              Drop an image here, or click to browse
            </p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>
              PNG · JPG · WebP · AVIF · BMP · GIF
            </p>
          </div>
        )}

        {file && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Live Preview</p>
                <div style={{ maxHeight: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: 360, objectFit: 'contain' }} />
                </div>
              </div>

              <div>
                <p style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12 }}>Filter Presets</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 20 }}>
                  {(['grayscale', 'sepia', 'invert', 'blur', 'brightness', 'contrast', 'hue', 'none'] as const).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => { setFilter(f); setIntensity(100); }}
                      style={{
                        padding: '10px 8px',
                        borderRadius: 'var(--radius-md)',
                        border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
                        background: filter === f ? 'var(--accent-subtle)' : 'var(--bg-elevated)',
                        color: filter === f ? 'var(--accent)' : 'var(--text-primary)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                      }}
                    >
                      {f === 'none' ? 'Original' : f}
                    </button>
                  ))}
                </div>

                {filter !== 'none' && (
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: 'var(--text-xs)', fontWeight: 500, color: 'var(--text-secondary)' }}>Intensity</label>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{intensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      style={{ width: '100%', accentColor: 'var(--accent)' }}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={download}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      background: 'var(--accent)',
                      color: 'var(--accent-text)',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Download size={16} />
                    Download Filtered Image
                  </button>
                  <button
                    onClick={() => { setFile(null); setImgSrc(null); }}
                    style={{
                      padding: '12px 16px',
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="image-filters" />
    </>
  );
}
