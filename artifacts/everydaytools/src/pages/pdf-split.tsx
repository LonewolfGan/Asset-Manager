import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import ProgressBar from '@/components/ProgressBar';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';

export default function PdfSplit() {
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'every' | 'range'>('every');
  const [ranges, setRanges] = useState("");

  const parseRanges = (str: string, maxPages: number): number[][] => {
    if (!str.trim()) return [];
    const parts = str.split(',').map(s => s.trim()).filter(Boolean);
    const parsed: number[][] = [];
    
    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        let start = parseInt(startStr);
        let end = parseInt(endStr);
        if (isNaN(start) || isNaN(end) || start < 1 || end < 1) continue;
        if (start > maxPages) start = maxPages;
        if (end > maxPages) end = maxPages;
        if (start > end) {
          const temp = start; start = end; end = temp;
        }
        
        const indices = [];
        for (let i = start; i <= end; i++) indices.push(i - 1);
        if (indices.length > 0) parsed.push(indices);
      } else {
        const page = parseInt(part);
        if (!isNaN(page) && page >= 1 && page <= maxPages) {
          parsed.push([page - 1]);
        }
      }
    }
    return parsed;
  };

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      const file = files[0];
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      const numPages = sourcePdf.getPageCount();
      
      let rangesToExtract: number[][] = [];
      if (mode === 'every') {
        rangesToExtract = Array.from({ length: numPages }, (_, i) => [i]);
      } else {
        rangesToExtract = parseRanges(ranges, numPages);
        if (rangesToExtract.length === 0) {
          throw new Error("Invalid or empty range provided. Try '1-3, 5' format.");
        }
      }
      
      if (rangesToExtract.length === 1 && mode === 'range') {
        // Single PDF output
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(sourcePdf, rangesToExtract[0]);
        copiedPages.forEach(page => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        setResult({ blob, filename: file.name.replace(/\.pdf$/i, '_extracted.pdf'), sizeAfter: blob.size, sizeBefore: file.size });
      } else {
        // ZIP output
        const zip = new JSZip();
        for (let i = 0; i < rangesToExtract.length; i++) {
          const newPdf = await PDFDocument.create();
          const copiedPages = await newPdf.copyPages(sourcePdf, rangesToExtract[i]);
          copiedPages.forEach(page => newPdf.addPage(page));
          const pdfBytes = await newPdf.save();
          const baseName = file.name.replace(/\.pdf$/i, '');
          let filename = `${baseName}_page_${rangesToExtract[i][0] + 1}.pdf`;
          if (rangesToExtract[i].length > 1) {
            filename = `${baseName}_pages_${rangesToExtract[i][0] + 1}-${rangesToExtract[i][rangesToExtract[i].length - 1] + 1}.pdf`;
          }
          zip.file(filename, pdfBytes);
          setProgress(Math.round(((i + 1) / rangesToExtract.length) * 80));
        }
        
        const zipBlob = await zip.generateAsync({ type: "blob", 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            type: "blob" 
        }, (metadata) => {
            setProgress(80 + Math.round(metadata.percent * 0.2));
        });
        
        setResult({ blob: zipBlob, filename: file.name.replace(/\.pdf$/i, '_split.zip'), sizeAfter: zipBlob.size, sizeBefore: file.size });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Split failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Split PDF']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>Split PDF</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Extract pages or split a PDF document into multiple files.</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>Split Options</h3>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, cursor: 'pointer' }}>
            <input type="radio" checked={mode === 'every'} onChange={() => setMode('every')} style={{ accentColor: 'var(--accent)' }} />
            <span>Extract every page into individual PDFs (ZIP)</span>
          </label>
          
          <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12, cursor: 'pointer' }}>
            <input type="radio" checked={mode === 'range'} onChange={() => setMode('range')} style={{ accentColor: 'var(--accent)' }} />
            <span>Extract specific pages or ranges</span>
          </label>
          
          {mode === 'range' && (
            <div style={{ paddingLeft: 28, marginTop: 8 }}>
              <input 
                type="text" 
                placeholder="e.g. 1-3, 5, 7-10" 
                value={ranges} 
                onChange={(e) => setRanges(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none' }}
              />
            </div>
          )}
        </div>
      )}

      {files.length > 0 && !isProcessing && (
        <button onClick={handleConvert} disabled={isProcessing || (mode === 'range' && !ranges.trim())}
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'IBM Plex Sans, sans-serif', fontSize: 15, fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Split PDF
        </button>
      )}
      
      {isProcessing && <ProgressBar progress={progress} label="Splitting PDF..." />}
      {error && <p style={{ color: 'var(--danger)', marginTop: 12, fontSize: 14 }}>{error}</p>}
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
  );
}
