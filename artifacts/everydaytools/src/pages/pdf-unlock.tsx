import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function PdfUnlock() {
  const { t } = useLocale();
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
      
      let pdfDoc;
      try {
        pdfDoc = await PDFDocument.load(arrayBuffer);
      } catch (err: any) {
        // Fallback for some basic empty passwords
        if (err.message && err.message.includes('password')) {
           try {
              pdfDoc = await PDFDocument.load(arrayBuffer, { password: '' });
           } catch (e2) {
              throw new Error("This PDF requires a User Password to open. We can only remove Owner Passwords (print/copy restrictions).");
           }
        } else {
           throw err;
        }
      }
      
      setProgress(50);
      
      // Saving without password arguments strips the encryption (owner password restrictions)
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_unlocked.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unlock failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Unlock PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['pdf-unlock']?.title ?? 'Unlock PDF'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-unlock']?.description ?? 'Remove printing, copying, and editing restrictions from PDF files.'}</p>
      
      <div style={{ padding: '16px', background: 'var(--danger)', color: 'white', borderRadius: 'var(--radius)', marginBottom: 24, fontSize: 14, opacity: 0.9 }}>
        <strong>Note:</strong> This removes the owner password (print/copy restrictions). It does not bypass user (open) passwords.
      </div>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Unlock PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Unlocking PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-unlock" />
  </>
  );
}
