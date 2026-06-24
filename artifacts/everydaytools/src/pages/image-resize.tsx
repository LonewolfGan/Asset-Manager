import { useState, useEffect } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import ToolLoadingState from '@/components/ToolLoadingState';

export default function ImageResize() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [origW, setOrigW] = useState(0);
  const [origH, setOrigH] = useState(0);
  
  const [mode, setMode] = useState<'pixels' | 'percentage'>('pixels');
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [percentage, setPercentage] = useState("50");
  const [lockRatio, setLockRatio] = useState(true);

  useEffect(() => {
    if (files[0]) {
      const img = new Image();
      const url = URL.createObjectURL(files[0]);
      img.onload = () => {
        setOrigW(img.width);
        setOrigH(img.height);
        setWidth(img.width.toString());
        setHeight(img.height.toString());
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [files]);

  const handleWidthChange = (v: string) => {
    setWidth(v);
    const nw = parseInt(v);
    if (lockRatio && !isNaN(nw) && origW > 0) {
      setHeight(Math.round((nw / origW) * origH).toString());
    }
  };

  const handleHeightChange = (v: string) => {
    setHeight(v);
    const nh = parseInt(v);
    if (lockRatio && !isNaN(nh) && origH > 0) {
      setWidth(Math.round((nh / origH) * origW).toString());
    }
  };

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const fd = new FormData();
      fd.append('file', file);

      if (mode === 'percentage') {
        const pct = parseFloat(percentage);
        if (isNaN(pct) || pct <= 0) throw new Error("Invalid percentage.");
        fd.append('percentage', pct.toString());
      } else {
        const w = parseInt(width);
        const h = parseInt(height);
        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
          trackToolError('image-resize', 'general-error');
          throw new Error("Invalid dimensions.");
        }
        fd.append('width', w.toString());
        fd.append('height', h.toString());
      }

      setProgress(30);
      const res = await fetch('/api/tools/image-resize', { method: 'POST', body: fd });
      setProgress(90);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Resize failed');
      }
      const blob = await res.blob();
      setProgress(100);
      trackToolUsed('image-resize', 'images');
      setResult({ blob, filename: file.name.replace(/\.(png|jpe?g|webp)$/i, '_resized.$1'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      trackToolError('image-resize', 'general-error');
      setError(e instanceof Error ? e.message : 'Resizing failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Resize Image']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['image-resize']?.title ?? 'Resize Image'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['image-resize']?.description ?? 'Change the dimensions of your image quickly.'}</p>
      
      <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={20} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 16, flexWrap: 'wrap' }}>
            {([
              { value: 'pixels',     label: 'By Pixels' },
              { value: 'percentage', label: 'By Percentage' },
            ] as const).map(({ value, label }) => (
              <label
                key={value}
                style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, transition: 'background 120ms ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <input type="radio" checked={mode === value} onChange={() => setMode(value)} style={{ width: 15, height: 15 }} />
                <span>{label}</span>
              </label>
            ))}
          </div>

          {mode === 'pixels' ? (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Width (px)</label>
                <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--text-sm)', marginBottom: 6, fontWeight: 500 }}>Height (px)</label>
                <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label
                  style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 8, transition: 'background 120ms ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <input type="checkbox" checked={lockRatio} onChange={e => setLockRatio(e.target.checked)} style={{ accentColor: 'var(--accent)', width: 15, height: 15, flexShrink: 0 }} />
                  <span>Lock Aspect Ratio</span>
                </label>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>Percentage</span>
                <span style={{ fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>{percentage}%</span>
              </div>
              <input type="range" min="1" max="200" value={percentage} onChange={e => setPercentage(e.target.value)} style={{ width: '100%' }} />
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--muted)', marginTop: 8 }}>
                Output: {Math.round(origW * (parseInt(percentage)/100))} x {Math.round(origH * (parseInt(percentage)/100))} px
              </p>
            </div>
          )}
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Resize Image
        </button>
      )}
      
      <ToolLoadingState
        status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
        progress={isProcessing ? progress : undefined}
        label="Resizing..."
        errorMessage={error ?? undefined}
        onRetry={error && files.length > 0 ? handleConvert : undefined}
      />
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="image-resize" />
  </>
  );
}
