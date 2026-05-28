import { useState, useRef, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function ImageCrop() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [imgObj, setImgObj] = useState<HTMLImageElement | null>(null);
  const [cropStart, setCropStart] = useState<{x:number,y:number}|null>(null);
  const [cropRect, setCropRect] = useState<{x:number,y:number,w:number,h:number}|null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null); // null = free

  useEffect(() => {
    if (files[0]) {
      const img = new Image();
      const url = URL.createObjectURL(files[0]);
      img.onload = () => {
        setImgObj(img);
        setCropRect(null);
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [files]);

  useEffect(() => {
    if (imgObj && canvasRef.current && containerRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d')!;
      
      // Responsive sizing
      const maxWidth = containerRef.current.clientWidth;
      const scale = Math.min(1, maxWidth / imgObj.width);
      canvas.width = imgObj.width * scale;
      canvas.height = imgObj.height * scale;
      
      // Draw background
      ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);
      
      // Draw overlay
      if (cropRect) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.clearRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
        ctx.drawImage(
            imgObj, 
            cropRect.x / scale, cropRect.y / scale, cropRect.w / scale, cropRect.h / scale,
            cropRect.x, cropRect.y, cropRect.w, cropRect.h
        );
        
        ctx.strokeStyle = 'var(--accent)';
        ctx.lineWidth = 2;
        ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h);
      }
    }
  }, [imgObj, cropRect]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCropStart({ x, y });
    setCropRect({ x, y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!cropStart) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    let cx = e.clientX - rect.left;
    let cy = e.clientY - rect.top;
    
    // Bounds
    cx = Math.max(0, Math.min(cx, canvasRef.current!.width));
    cy = Math.max(0, Math.min(cy, canvasRef.current!.height));

    let w = cx - cropStart.x;
    let h = cy - cropStart.y;
    
    if (aspectRatio) {
      // Force aspect ratio
      const signW = Math.sign(w) || 1;
      const signH = Math.sign(h) || 1;
      if (Math.abs(w) / aspectRatio > Math.abs(h)) {
        h = Math.abs(w) / aspectRatio * signH;
      } else {
        w = Math.abs(h) * aspectRatio * signW;
      }
      
      // Check bounds again with forced ratio
      if (cropStart.x + w > canvasRef.current!.width) w = canvasRef.current!.width - cropStart.x;
      if (cropStart.x + w < 0) w = -cropStart.x;
      if (cropStart.y + h > canvasRef.current!.height) h = canvasRef.current!.height - cropStart.y;
      if (cropStart.y + h < 0) h = -cropStart.y;
    }

    setCropRect({
      x: w < 0 ? cropStart.x + w : cropStart.x,
      y: h < 0 ? cropStart.y + h : cropStart.y,
      w: Math.abs(w),
      h: Math.abs(h)
    });
  };

  const handleMouseUp = () => {
    setCropStart(null);
  };

  const handleCrop = async () => {
    if (!imgObj || !cropRect || !files[0]) return;
    
    const canvas = canvasRef.current!;
    const scale = imgObj.width / canvas.width;
    
    const sx = cropRect.x * scale;
    const sy = cropRect.y * scale;
    const sw = cropRect.w * scale;
    const sh = cropRect.h * scale;

    if (sw === 0 || sh === 0) return;

    const outCanvas = document.createElement('canvas');
    outCanvas.width = sw;
    outCanvas.height = sh;
    const ctx = outCanvas.getContext('2d')!;
    ctx.drawImage(imgObj, sx, sy, sw, sh, 0, 0, sw, sh);

    const blob = await new Promise<Blob>((res) => outCanvas.toBlob(b => res(b!), files[0].type, 1));
    setResult({ blob, filename: files[0].name.replace(/\.(png|jpe?g|webp)$/i, '_cropped.$1'), sizeAfter: blob.size, sizeBefore: files[0].size });
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Crop Image']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['image-crop']?.title ?? 'Crop Image'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['image-crop']?.description ?? 'Crop images easily with aspect ratio presets.'}</p>
      
      {!imgObj && <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={20} onFiles={setFiles} />}
      
      {imgObj && (
        <div style={{ marginTop: 24 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <button onClick={() => setAspectRatio(null)} style={{ padding: '6px 12px', background: aspectRatio === null ? 'var(--accent)' : 'var(--bg)', color: aspectRatio === null ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13 }}>Free</button>
            <button onClick={() => setAspectRatio(1)} style={{ padding: '6px 12px', background: aspectRatio === 1 ? 'var(--accent)' : 'var(--bg)', color: aspectRatio === 1 ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13 }}>1:1 (Square)</button>
            <button onClick={() => setAspectRatio(4/3)} style={{ padding: '6px 12px', background: aspectRatio === 4/3 ? 'var(--accent)' : 'var(--bg)', color: aspectRatio === 4/3 ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13 }}>4:3</button>
            <button onClick={() => setAspectRatio(16/9)} style={{ padding: '6px 12px', background: aspectRatio === 16/9 ? 'var(--accent)' : 'var(--bg)', color: aspectRatio === 16/9 ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13 }}>16:9</button>
            <button onClick={() => setAspectRatio(3/2)} style={{ padding: '6px 12px', background: aspectRatio === 3/2 ? 'var(--accent)' : 'var(--bg)', color: aspectRatio === 3/2 ? '#fff' : 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: 13 }}>3:2</button>
          </div>
          
          <div ref={containerRef} style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
            <canvas 
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: 'crosshair', display: 'block', touchAction: 'none' }}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {cropRect && canvasRef.current ? 
                `Selection: ${Math.round(cropRect.w * (imgObj.width / canvasRef.current.width))} x ${Math.round(cropRect.h * (imgObj.height / canvasRef.current.height))} px` 
                : 'Click and drag to select area'}
            </span>
            <button onClick={() => { setImgObj(null); setFiles([]); setResult(null); }} style={{ background: 'none', border: 'none', color: 'var(--danger)', fontSize: 14, cursor: 'pointer' }}>Cancel</button>
          </div>

          <button onClick={handleCrop} disabled={!cropRect || cropRect.w === 0}
            style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: (!cropRect || cropRect.w === 0) ? 'not-allowed' : 'pointer', width: '100%', opacity: (!cropRect || cropRect.w === 0) ? 0.5 : 1 }}>
            Crop & Download
          </button>
        </div>
      )}
      
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="image-crop" />
  </>
  );
}
