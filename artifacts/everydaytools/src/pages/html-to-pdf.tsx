import { useState, useRef } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import { toCanvas } from 'html-to-image';

export default function HtmlToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [mode, setMode] = useState<'upload' | 'paste'>('upload');
  const [htmlInput, setHtmlInput] = useState("");

  const handleConvert = async () => {
    if (mode === 'upload' && !files[0]) return;
    if (mode === 'paste' && !htmlInput.trim()) return;
    
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      let htmlContent = "";
      let filename = "webpage.pdf";
      let sizeBefore = 0;
      
      if (mode === 'upload') {
        htmlContent = await files[0].text();
        filename = files[0].name.replace(/\.html?$/i, '.pdf');
        sizeBefore = files[0].size;
      } else {
        htmlContent = htmlInput;
        sizeBefore = htmlInput.length;
      }
      
      setProgress(20);
      
      // Create hidden div
      const container = document.createElement('div');
      container.innerHTML = htmlContent;
      Object.assign(container.style, {
        position: 'absolute',
        left: '-9999px',
        top: '0',
        width: '800px', // A4 width approx
        background: 'white',
        color: 'black',
        padding: '20px'
      });
      document.body.appendChild(container);
      
      setProgress(40);
      
      // Render to canvas
      const canvas = await toCanvas(container, { backgroundColor: '#ffffff' });
      document.body.removeChild(container);
      setProgress(60);
      
      // Compress canvas to jpeg for PDF embedding
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      const pdfDoc = await PDFDocument.create();
      const img = await pdfDoc.embedJpg(imgData);
      
      // Calculate page dimensions (maintain aspect ratio)
      const a4Width = 595.28;
      const imgWidth = img.width;
      const imgHeight = img.height;
      const ratio = imgWidth / a4Width;
      const a4Height = imgHeight / ratio;
      
      const page = pdfDoc.addPage([a4Width, a4Height]);
      page.drawImage(img, { x: 0, y: 0, width: a4Width, height: a4Height });
      
      setProgress(80);
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Why doesn't it look exactly like my webpage?", a: "Complex CSS, external stylesheets, and JavaScript might not render perfectly in the browser-side converter." },
    { q: "Are external images supported?", a: "Only if they do not have restrictive CORS policies. Otherwise, they might be omitted." },
    { q: "Is the text selectable in the PDF?", a: "No, this tool renders the HTML visually into an image, which is then placed in the PDF." },
    { q: "Can I paste HTML code directly?", a: "Yes, switch to the 'Paste HTML' tab." },
    { q: "Is data sent to a server?", a: "No, the HTML is rendered securely in your browser." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Word Tools', 'HTML to PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>HTML to PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Convert HTML snippets or files into a PDF document visually.</p>
      
      <div style={{ marginBottom: 24, display: 'flex', gap: 16, borderBottom: '1px solid var(--border)' }}>
        <button onClick={() => setMode('upload')} style={{ background: 'none', border: 'none', borderBottom: mode === 'upload' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'upload' ? 'var(--text)' : 'var(--muted)' }}>Upload File</button>
        <button onClick={() => setMode('paste')} style={{ background: 'none', border: 'none', borderBottom: mode === 'paste' ? '2px solid var(--accent)' : '2px solid transparent', padding: '8px 16px', fontWeight: 500, cursor: 'pointer', color: mode === 'paste' ? 'var(--text)' : 'var(--muted)' }}>Paste HTML</button>
      </div>
      
      {mode === 'upload' ? (
        <FileUpload accept={['.html', '.htm', 'text/html']} maxSizeMB={10} onFiles={setFiles} />
      ) : (
        <textarea 
          placeholder="Paste your HTML code here..."
          value={htmlInput}
          onChange={e => setHtmlInput(e.target.value)}
          style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'monospace' }}
        />
      )}
      
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8 }}>Note: Complex CSS may not render perfectly client-side. The output is a visual rendering (not selectable text).</p>
      
      {((mode === 'upload' && files.length > 0) || (mode === 'paste' && htmlInput.trim())) && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Rendering HTML..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
