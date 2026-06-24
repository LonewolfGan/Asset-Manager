import { useState, useRef, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';

type Position = 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';

export default function WatermarkImage() {
  const { t } = useLocale();
  const title = t.tools['watermark-image']?.title ?? 'Add Watermark to Image';
  const desc = t.tools['watermark-image']?.description ?? 'Add a text watermark to any image with custom position, color, and opacity.';
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('© Watermark');
  const [fontSize, setFontSize] = useState(36);
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(70);
  const [position, setPosition] = useState<Position>('bottom-right');
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imgRef.current || !file) return;
    const img = imgRef.current;
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const hex = color;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    ctx.globalAlpha = opacity / 100;
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = `rgb(${r},${g},${b})`;
    const metrics = ctx.measureText(text);
    const tw = metrics.width;
    const th = fontSize;
    const pad = fontSize * 0.6;
    let x = pad; let y = th + pad;
    if (position === 'top-right') { x = canvas.width - tw - pad; y = th + pad; }
    else if (position === 'center') { x = (canvas.width - tw) / 2; y = (canvas.height + th) / 2; }
    else if (position === 'bottom-left') { x = pad; y = canvas.height - pad; }
    else if (position === 'bottom-right') { x = canvas.width - tw - pad; y = canvas.height - pad; }
    ctx.fillText(text, x, y);
    ctx.globalAlpha = 1;
  };

  useEffect(() => {
    if (file) drawCanvas();
  }, [text, fontSize, color, opacity, position, file]);

  const handleFile = (f: File) => {
    setFile(f);
    const img = new Image();
    img.onload = () => { imgRef.current = img; drawCanvas(); };
    img.src = URL.createObjectURL(f);
  };

  const download = async () => {
    trackToolUsed('watermark-image', 'images');
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('text', text);
      fd.append('fontSize', String(fontSize));
      fd.append('opacity', String(opacity / 100));
      fd.append('position', position);
      fd.append('color', color);
      const res = await fetch('/api/tools/watermark-image', { method: 'POST', body: fd });
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Processing failed');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^.]+$/, '_watermarked.png');
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Download failed');
    }
  };

  const POSITIONS: { id: Position; label: string }[] = [
    { id: 'top-left', label: 'Top Left' }, { id: 'top-right', label: 'Top Right' },
    { id: 'center', label: 'Center' },
    { id: 'bottom-left', label: 'Bottom Left' }, { id: 'bottom-right', label: 'Bottom Right' },
  ];

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Image Tools', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{desc}</p>

        {!file && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '48px 24px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-surface)' }}
          >
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>Drop an image here, or click to browse</p>
          </div>
        )}

        {file && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <canvas ref={canvasRef} style={{ width: '100%', borderRadius: 'var(--radius)', border: '1px solid var(--border)', background: 'var(--bg-elevated)' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Watermark text</label>
                <input value={text} onChange={(e) => setText(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Font size: {fontSize}px</label>
                <input type="range" min="12" max="120" value={fontSize} onChange={(e) => setFontSize(+e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Color</label>
                <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: 48, height: 32, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', cursor: 'pointer', padding: 2 }} />
              </div>
              <div>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Opacity: {opacity}%</label>
                <input type="range" min="5" max="100" value={opacity} onChange={(e) => setOpacity(+e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginBottom: 8 }}>Position</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {POSITIONS.map((p) => (
                  <button key={p.id} onClick={() => setPosition(p.id)}
                    style={{ padding: '5px 12px', border: `1px solid ${position === p.id ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius-md)', background: position === p.id ? 'var(--accent-subtle,#fff4ef)' : 'transparent', color: position === p.id ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={download} style={{ flex: 1, padding: '11px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>Download with Watermark</button>
              <button onClick={() => { setFile(null); imgRef.current = null; }} style={{ padding: '11px 16px', background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', cursor: 'pointer' }}>Change image</button>
            </div>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="watermark-image" />
    </>
  );
}
