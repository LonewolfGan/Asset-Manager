import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import ToolPageSEO from '@/components/ToolPageSEO';

export default function PdfPageNumbers() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [position, setPosition] = useState<'left'|'center'|'right'>('center');
  const [startNum, setStartNum] = useState(1);
  const [fontSize, setFontSize] = useState(12);

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
      
      const pages = pdfDoc.getPages();
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const text = String(startNum + i);
        const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
        
        let x = width / 2 - textWidth / 2; // center
        if (position === 'left') x = 30;
        if (position === 'right') x = width - 30 - textWidth;
        
        page.drawText(text, {
          x,
          y: 30, // near bottom
          size: fontSize,
          font: helveticaFont,
        });
        setProgress(Math.round(((i + 1) / pages.length) * 50));
      }
      
      const pdfBytes = await pdfDoc.save();
      setProgress(100);
      
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_numbered.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Processing failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Add Page Numbers']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Add Page Numbers</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Insert page numbers into your PDF document easily.</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 24, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Position (Bottom)</label>
              <select value={position} onChange={(e) => setPosition(e.target.value as any)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg)' }}>
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Start Number</label>
              <input type="number" min="1" value={startNum} onChange={(e) => setStartNum(parseInt(e.target.value) || 1)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, marginBottom: 6, fontWeight: 500 }}>Font Size</label>
              <input type="number" min="8" max="24" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value) || 12)} style={{ width: '100%', padding: '10px', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }} />
            </div>
          </div>
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Add Numbers
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Applying page numbers..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-page-numbers" />
  </>
  );
}
