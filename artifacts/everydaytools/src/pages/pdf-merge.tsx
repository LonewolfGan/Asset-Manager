import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function PdfMerge() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConvert = async () => {
    if (files.length < 2) {
      setError("Please select at least 2 PDFs to merge.");
      return;
    }
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const mergedPdf = await PDFDocument.create();
      let totalSizeBefore = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSizeBefore += file.size;
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: 'merged_document.pdf', sizeAfter: blob.size, sizeBefore: totalSizeBefore });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Merge failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Merge PDFs']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['pdf-merge']?.title ?? 'Merge PDFs'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-merge']?.description ?? 'Combine multiple PDF files into a single document instantly.'}</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} multiple={true} onFiles={setFiles} />
      
      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing || files.length < 2}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: files.length < 2 ? 'not-allowed' : 'pointer', width: '100%', opacity: files.length < 2 ? 0.5 : 1 }}>
          Merge {files.length} PDFs
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Merging PDFs..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-merge" />
  </>
  );
}
