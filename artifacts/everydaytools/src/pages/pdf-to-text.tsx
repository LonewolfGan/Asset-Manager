import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';

export default function PdfToText() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number, textOutput?: string} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null);
    setIsProcessing(true);
    setProgress(0);
    
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
      
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;
      let fullText = '';
      
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n\n';
        setProgress(Math.round((i / numPages) * 100));
      }
      
      const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
      setResult({
        blob,
        filename: file.name.replace(/\.pdf$/i, '.txt'),
        sizeAfter: blob.size,
        sizeBefore: file.size,
        textOutput: fullText
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'PDF to Text']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>PDF to Text</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Instantly extract plain text from any PDF document securely in your browser.</p>
      
      <FileUpload accept={['.pdf', 'application/pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Extract Text
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Extracting text..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
  );
}
