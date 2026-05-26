import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';

export default function ImageResize() {
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
      let targetW = parseInt(width);
      let targetH = parseInt(height);
      
      if (mode === 'percentage') {
        const pct = parseInt(percentage) / 100;
        targetW = Math.round(origW * pct);
        targetH = Math.round(origH * pct);
      }
      
      if (isNaN(targetW) || isNaN(targetH) || targetW <= 0 || targetH <= 0) {
        throw new Error("Invalid dimensions.");
      }

      const file = files[0];
      const img = new Image();
      const url = URL.createObjectURL(file);
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      URL.revokeObjectURL(url);
      setProgress(50);

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, targetW, targetH);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        }, file.type, 0.92);
      });
      
      setProgress(100);
      setResult({ blob, filename: file.name.replace(/\.(png|jpe?g|webp)$/i, '_resized.$1'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Resizing failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Is aspect ratio maintained?", a: "Yes, by default 'Lock Aspect Ratio' is enabled so the image doesn't stretch." },
    { q: "Can I upscale images?", a: "Yes, you can increase dimensions, though it may result in pixelation." },
    { q: "What's the max size?", a: "Most browsers support canvas sizes up to roughly 10,000 pixels." },
    { q: "Is metadata preserved?", a: "No, drawing to a canvas removes EXIF metadata." },
    { q: "Is processing secure?", a: "Yes, images are resized entirely in your browser." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Resize Image']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Resize Image</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Change the dimensions of your image quickly.</p>
      
      <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={20} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={mode === 'pixels'} onChange={() => setMode('pixels')} style={{ accentColor: 'var(--accent)' }} />
              <span>By Pixels</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={mode === 'percentage'} onChange={() => setMode('percentage')} style={{ accentColor: 'var(--accent)' }} />
              <span>By Percentage</span>
            </label>
          </div>

          {mode === 'pixels' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Width (px)</label>
                <input type="number" value={width} onChange={e => handleWidthChange(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Height (px)</label>
                <input type="number" value={height} onChange={e => handleHeightChange(e.target.value)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                  <input type="checkbox" checked={lockRatio} onChange={e => setLockRatio(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
                  <span>Lock Aspect Ratio</span>
                </label>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 500 }}>Percentage</span>
                <span style={{ fontSize: 14, fontFamily: 'IBM Plex Mono, monospace' }}>{percentage}%</span>
              </div>
              <input type="range" min="1" max="200" value={percentage} onChange={e => setPercentage(e.target.value)} style={{ width: '100%', accentColor: 'var(--accent)' }} />
              <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                Output: {Math.round(origW * (parseInt(percentage)/100))} x {Math.round(origH * (parseInt(percentage)/100))} px
              </p>
            </div>
          )}
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Resize Image
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Resizing..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
