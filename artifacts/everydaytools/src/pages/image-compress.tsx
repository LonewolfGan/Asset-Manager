import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';

export default function ImageCompress() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(80);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      
      // Load image into canvas
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
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      const q = quality / 100;
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Canvas toBlob failed"));
        }, mimeType, q);
      });
      
      setProgress(100);
      setResult({ blob, filename: file.name.replace(/\.(png|jpe?g|webp)$/i, '_compressed.$1'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Is the compression lossy?", a: "Yes, reducing the quality slider introduces lossy compression to reduce file size." },
    { q: "Does it work with PNG files?", a: "PNG files don't support quality adjustments in standard browsers, so compressing PNGs here usually converts them or leaves them identical." },
    { q: "What's the best quality setting?", a: "A quality setting of 80% usually provides the best balance between file size and visual fidelity." },
    { q: "Are images uploaded to a server?", a: "No, all compression happens securely within your device's browser using Canvas APIs." },
    { q: "Is EXIF metadata kept?", a: "No, drawing the image to a canvas strips camera metadata (EXIF/XMP)." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Compress Image']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Compress Image</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Reduce image file sizes instantly without server uploads.</p>
      
      <FileUpload accept={['image/jpeg', 'image/png', 'image/webp']} maxSizeMB={20} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>Quality</span>
            <span style={{ fontSize: 14, fontFamily: 'IBM Plex Mono, monospace' }}>{quality}%</span>
          </div>
          <input 
            type="range" 
            min="1" max="100" 
            value={quality} 
            onChange={(e) => setQuality(parseInt(e.target.value))} 
            style={{ width: '100%', accentColor: 'var(--accent)' }} 
          />
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>Lower quality = smaller file size.</p>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Compress Image
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Compressing..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
