import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function ImageToPdf() {
  const { t } = useLocale();
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

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Image Tools', 'Image to PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['image-to-pdf']?.title ?? 'Image to PDF'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['image-to-pdf']?.description ?? 'Combine multiple images into a single PDF document.'}</p>
      
      <FileUpload accept={['image/jpeg', 'image/png']} maxSizeMB={20} multiple={true} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Convert to PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Creating PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="image-to-pdf" />
  </>
  );
}
