import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length === 0) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const pdfDoc = await PDFDocument.create();
      let totalSizeBefore = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSizeBefore += file.size;
        const arrayBuffer = await file.arrayBuffer();
        
        let img;
        if (file.type === 'image/jpeg') {
          img = await pdfDoc.embedJpg(arrayBuffer);
        } else if (file.type === 'image/png') {
          img = await pdfDoc.embedPng(arrayBuffer);
        } else {
          throw new Error(`Unsupported format ${file.type}. Please use JPG or PNG.`);
        }
        
        const page = pdfDoc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        
        setProgress(Math.round(((i + 1) / files.length) * 80));
      }
      
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: 'images_merged.pdf', sizeAfter: blob.size, sizeBefore: totalSizeBefore });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  const faqs = [
    { q: "Is the image quality preserved?", a: "Yes, images are embedded directly into the PDF without re-compression or quality loss." },
    { q: "What formats are supported?", a: "JPEG and PNG images are fully supported." },
    { q: "What is the page size?", a: "Each PDF page automatically matches the exact pixel dimensions of the image it contains." },
    { q: "Can I reorder the images?", a: "Images are added in the order they appear in the file list." },
    { q: "Is there a limit to how many images?", a: "We recommend keeping it under 20 images to prevent browser memory issues." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Image to PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Image to PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Combine multiple images into a single PDF document.</p>
      
      <FileUpload accept={['image/jpeg', 'image/png']} maxSizeMB={20} multiple={true} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Creating PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
