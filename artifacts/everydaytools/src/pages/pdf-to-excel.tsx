import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

export default function PdfToExcel() {
  const { t } = useLocale();
  const title = t.tools['pdf-to-excel']?.title ?? 'PDF to Excel';
  const desc = t.tools['pdf-to-excel']?.description ?? 'Extract tables from PDFs and export to Excel. Runs entirely in your browser.';
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);
  const [rowCount, setRowCount] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => { setFile(f); setStatus('idle'); setXlsxBlob(null); setError(''); };

  const convert = async () => {
    if (!file) return;
    setStatus('processing'); setProgress(5);
    try {
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;
      setProgress(15);
      const buf = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      setProgress(25);

      const allRows: string[][] = [];

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        setProgress(25 + Math.round((i / pdf.numPages) * 50));

        const items = content.items as { str: string; transform: number[] }[];
        if (!items.length) continue;

        // Group items by Y position to form rows
        const byY: Map<number, { x: number; text: string }[]> = new Map();
        for (const item of items) {
          if (!item.str.trim()) continue;
          const y = Math.round(item.transform[5]);
          const x = item.transform[4];
          if (!byY.has(y)) byY.set(y, []);
          byY.get(y)!.push({ x, text: item.str });
        }

        const sorted = [...byY.entries()].sort((a, b) => b[0] - a[0]);
        for (const [, cells] of sorted) {
          cells.sort((a, b) => a.x - b.x);
          allRows.push(cells.map((c) => c.text));
        }

        if (i < pdf.numPages) allRows.push([]);
      }

      setProgress(80);
      setRowCount(allRows.filter((r) => r.length > 0).length);

      const XLSX = (await import('xlsx')).default;
      const ws = XLSX.utils.aoa_to_sheet(allRows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Extracted');
      const buf2 = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      setXlsxBlob(new Blob([buf2], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      setProgress(100);
      setStatus('done');
    } catch (e) {
      trackToolError('pdf-to-excel', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  const download = () => {
    if (!xlsxBlob || !file) return;
    trackToolUsed('pdf-to-excel', 'pdf');
    const url = URL.createObjectURL(xlsxBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.pdf$/i, '.xlsx');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'PDF Tools', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ padding: '12px 16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: 20, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
          Works best on PDFs with text-based tables. Scanned PDFs require OCR first.
        </div>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
        >
          <input ref={inputRef} type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>{file ? file.name : t.common.dropFileHere}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>.pdf · max 50 MB</p>
        </div>

        {file && status === 'idle' && (
          <button onClick={convert} style={{ marginTop: 16, width: '100%', padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>{t.common.convertBtn}</button>
        )}

        {status === 'processing' && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>
              <span>{t.common.processing}</span><span style={{ fontFamily: 'var(--font-mono)' }}>{progress}%</span>
            </div>
            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
          </div>
        )}

        {status === 'error' && <p style={{ color: 'var(--danger,#dc2626)', marginTop: 16, fontFamily: 'var(--font-ui)', fontSize: 14 }}>{error}</p>}

        {status === 'done' && xlsxBlob && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Excel ready — {rowCount} data rows extracted</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', margin: '4px 0 0' }}>{(xlsxBlob.size / 1024).toFixed(1)} KB</p>
            </div>
            <button onClick={download} style={{ padding: '9px 18px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>{t.common.download}</button>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="pdf-to-excel" />
    </>
  );
}
