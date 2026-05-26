import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import JSZip from 'jszip';

export default function PdfToImage() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const [scale, setScale] = useState(2); // 2x roughly 144dpi

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
      
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      
      const zip = new JSZip();
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        await page.render({ canvasContext: ctx, viewport }).promise;
        
        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b) resolve(b);
            else reject(new Error("Canvas toBlob failed"));
          }, format, 0.95);
        });
        
        const ext = format === 'image/jpeg' ? '.jpg' : '.png';
        const name = `${file.name.replace(/\.pdf$/i, '')}_page_${i}${ext}`;
        
        if (numPages === 1) {
          setResult({ blob, filename: name, sizeAfter: blob.size, sizeBefore: file.size });
          setProgress(100);
          return; // Exit early for single page
        }
        
        zip.file(name, blob);
        setProgress(Math.round((i / numPages) * 80));
      }
      
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setProgress(100);
      setResult({ blob: zipBlob, filename: file.name.replace(/\.pdf$/i, '_images.zip'), sizeAfter: zipBlob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Are all pages converted?", a: "Yes, every page is rendered to an image. If there are multiple pages, they are bundled into a ZIP file." },
    { q: "What resolution are the images?", a: "You can select the scale. 2x corresponds to roughly 144 DPI (good for screens), while 3x is closer to print quality." },
    { q: "Should I use PNG or JPEG?", a: "PNG is lossless and better for text and line art. JPEG creates smaller files and is better for photos." },
    { q: "Are files uploaded to a server?", a: "No, all rendering happens securely inside your web browser." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'PDF to Image']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>PDF to Image</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert PDF pages into high-quality JPEG or PNG images.</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Format</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={format === 'image/jpeg'} onChange={() => setFormat('image/jpeg')} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14 }}>JPEG</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={format === 'image/png'} onChange={() => setFormat('image/png')} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14 }}>PNG</span>
                </label>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 500, marginBottom: 12 }}>Resolution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={scale === 1} onChange={() => setScale(1)} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14 }}>Standard (72 DPI)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={scale === 2} onChange={() => setScale(2)} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14 }}>High (144 DPI)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input type="radio" checked={scale === 3} onChange={() => setScale(3)} style={{ accentColor: 'var(--accent)' }} />
                  <span style={{ fontSize: 14 }}>Maximum (216 DPI)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Extract Images
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Rendering pages..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
