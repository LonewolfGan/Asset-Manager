import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument, degrees } from 'pdf-lib';

export default function PdfRotate() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees(currentRotation + rotation));
        setProgress(Math.round(((i + 1) / pages.length) * 50));
      }
      
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_rotated.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rotation failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Does this permanently rotate the PDF?", a: "Yes, the rotation is permanently applied to the generated file." },
    { q: "Can I select specific pages?", a: "This tool currently applies rotation to all pages in the PDF." },
    { q: "Does rotation degrade quality?", a: "No, rotation is a metadata change and does not affect text or image quality." },
    { q: "What do the degrees mean?", a: "90° is clockwise, 180° is upside down, and 270° is counter-clockwise." },
    { q: "Is my document uploaded anywhere?", a: "No, the rotation process happens locally on your device." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Rotate PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Rotate PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Rotate all pages in a PDF file permanently.</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Rotation Angle</h3>
          <div style={{ display: 'flex', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={rotation === 90} onChange={() => setRotation(90)} style={{ accentColor: 'var(--accent)' }} />
              <span>Right (90°)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={rotation === 180} onChange={() => setRotation(180)} style={{ accentColor: 'var(--accent)' }} />
              <span>Upside Down (180°)</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="radio" checked={rotation === 270} onChange={() => setRotation(270)} style={{ accentColor: 'var(--accent)' }} />
              <span>Left (270°)</span>
            </label>
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Rotate PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Applying rotation..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
