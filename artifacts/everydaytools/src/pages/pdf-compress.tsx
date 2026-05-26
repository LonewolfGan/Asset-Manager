import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';

export default function PdfCompress() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      setProgress(30);
      
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setProgress(60);
      
      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_compressed.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "How does the compression work?", a: "Compression removes unused objects and utilizes PDF object streams. Image re-encoding is not performed client-side." },
    { q: "Will the image quality drop?", a: "No, this method is lossless. It doesn't downsample images, so the visual quality remains identical to the original." },
    { q: "What compression ratio can I expect?", a: "It depends entirely on how the PDF was originally created. Some files shrink by 50%+, while already optimized files may see little change." },
    { q: "Can it compress password-protected PDFs?", a: "No, encrypted PDFs cannot be compressed. Unlock the PDF first." },
    { q: "Are my files uploaded?", a: "No, all processing happens locally in your web browser. Your files are completely private." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Compress PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Compress PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Reduce PDF file size losslessly directly in your browser.</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Compress File
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Compressing PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      
      {result && (
        <div style={{ marginTop: 16 }}>
          <ResultPanel {...result} />
        </div>
      )}
      
      <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 24, textAlign: 'center' }}>
        Note: Compression removes unused objects. Image re-encoding is not performed client-side.
      </p>
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
