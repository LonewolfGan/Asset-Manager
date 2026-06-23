import { useState, useRef } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { sanitizeHTML } from '@/utils/sanitize';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolProgressBar, ToolEmptyState,
} from '@/components/ToolContent';

export default function ExcelToPdf() {
  const { t } = useLocale();
  const title = t.tools['excel-to-pdf']?.title ?? 'Excel to PDF';
  const desc = t.tools['excel-to-pdf']?.description ?? 'Convert Excel spreadsheets to PDF entirely in your browser.';
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'processing' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f); setStatus('idle'); setError(''); setPdfBlob(null); setProgress(0);
    try {
      const buf = await f.arrayBuffer();
      setFileData(buf);
      const XLSX = (await import('xlsx')).default;
      const wb = XLSX.read(buf, { type: 'buffer' });
      setSheets(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0] ?? '');
    } catch {
      setError('Could not read file. Make sure it is a valid .xlsx or .xls file.');
    }
  };

  const convert = async () => {
    if (!fileData || !selectedSheet) return;
    setStatus('processing'); setProgress(10);
    try {
      const XLSX = (await import('xlsx')).default;
      setProgress(20);
      const wb = XLSX.read(fileData, { type: 'buffer' });
      const ws = wb.Sheets[selectedSheet];
      const html = XLSX.utils.sheet_to_html(ws);
      setProgress(40);

      const styledHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
        body{font-family:Arial,sans-serif;font-size:9pt;padding:20px;}
        table{border-collapse:collapse;width:100%;font-size:9pt;}
        td,th{border:1px solid #bbb;padding:4px 8px;white-space:nowrap;}
        th{background:#f0f0f0;font-weight:bold;}
        tr:nth-child(even){background:#fafafa;}
      </style></head><body>${html}</body></html>`;

      const container = document.createElement('div');
      container.style.cssText = 'position:fixed;left:-9999px;top:0;width:1100px;background:#fff;';
      container.innerHTML = sanitizeHTML(styledHtml);
      document.body.appendChild(container);
      setProgress(55);

      const { toPng } = await import('html-to-image');
      const dataUrl = await toPng(container, { pixelRatio: 1.2 });
      document.body.removeChild(container);
      setProgress(75);

      const jsPDF = (await import('jspdf')).jsPDF;
      const img = new Image();
      await new Promise((res) => { img.onload = res; img.src = dataUrl; });
      const aspect = img.height / img.width;
      const pdf = new jsPDF({ orientation: aspect < 1 ? 'landscape' : 'portrait', unit: 'pt', format: 'a4' });
      const W = pdf.internal.pageSize.getWidth();
      const H = W * aspect;
      if (H <= pdf.internal.pageSize.getHeight()) {
        pdf.addImage(dataUrl, 'PNG', 0, 0, W, H);
      } else {
        const pageH = pdf.internal.pageSize.getHeight();
        let yOffset = 0;
        while (yOffset < H) {
          if (yOffset > 0) pdf.addPage();
          pdf.addImage(dataUrl, 'PNG', 0, -yOffset, W, H);
          yOffset += pageH;
        }
      }
      const blob = pdf.output('blob');
      setPdfBlob(blob);
      setProgress(100);
      setStatus('done');
    } catch (e) {
      setStatus('error');
      trackToolError('excel-to-pdf', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const download = () => {
    trackToolUsed('excel-to-pdf', 'documents');
    if (!pdfBlob || !file) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.(xlsx?|xls)$/i, '.pdf');
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Excel & Spreadsheets', title]}
      title={title}
      description={desc}
      seoSlug="excel-to-pdf"
    >
      <ToolWorkspace>
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', transition: 'all 0.15s' }}
        >
          <input ref={inputRef} type="file" accept=".xlsx,.xls" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{t.common.dropFileHere}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.xlsx · .xls · max 25 MB</p>
        </div>

        {file && (
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{file.name}</p>
              {sheets.length > 1 && (
                <div style={{ marginTop: 8 }}>
                  <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', marginRight: 8 }}>Sheet:</label>
                  <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)}
                    style={{ padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                    {sheets.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}

        {file && status !== 'processing' && (
          <ToolButton variant="primary" fullWidth onClick={convert}>{t.common.convertToPdf}</ToolButton>
        )}

        {status === 'processing' && <ToolProgressBar progress={progress} label={t.common.converting} />}

        {status === 'error' && (
          <div style={{ marginTop: 16, padding: 14, background: 'var(--bg-surface)', border: '1px solid var(--danger,#dc2626)', borderRadius: 'var(--radius)', color: 'var(--danger,#dc2626)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)' }}>{error}</div>
        )}

        {status === 'done' && pdfBlob && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>{t.common.pdfReady((pdfBlob.size / 1024).toFixed(1))}</p>
            <button onClick={download} style={{ padding: '10px 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>{t.common.downloadPdf}</button>
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
