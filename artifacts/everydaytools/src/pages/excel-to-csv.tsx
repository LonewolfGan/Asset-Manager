import { useState, useRef } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { useLocale } from '@/hooks/use-locale';
import ToolPageLayout from '@/components/ToolPageLayout';
import {
  ToolWorkspace, ToolCard, ToolButton, ToolBadge,
  ToolStat, ToolProgressBar, ToolEmptyState,
} from '@/components/ToolContent';

export default function ExcelToCsv() {
  const { t } = useLocale();
  const title = t.tools['excel-to-csv']?.title ?? 'Excel to CSV';
  const desc = t.tools['excel-to-csv']?.description ?? 'Convert Excel sheets to CSV format in your browser.';
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState('');
  const [csvContent, setCsvContent] = useState('');
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f); setStatus('idle'); setCsvContent(''); setError('');
    try {
      const buf = await f.arrayBuffer();
      setFileData(buf);
      const XLSX = (await import('xlsx')).default;
      const wb = XLSX.read(buf, { type: 'buffer' });
      setSheets(wb.SheetNames);
      setSelectedSheet(wb.SheetNames[0] ?? '');
    } catch { setError('Could not read file.'); }
  };

  const convert = async () => {
    if (!fileData || !selectedSheet) return;
    try {
      const XLSX = (await import('xlsx')).default;
      const wb = XLSX.read(fileData, { type: 'buffer' });
      const ws = wb.Sheets[selectedSheet];
      const csv = XLSX.utils.sheet_to_csv(ws);
      setCsvContent(csv);
      setStatus('done');
    } catch (e) {
      trackToolError('excel-to-csv', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const download = () => {
    trackToolUsed('excel-to-csv', 'documents');
    if (!csvContent || !file) return;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.(xlsx?)$/i, `_${selectedSheet}.csv`);
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolPageLayout
      breadcrumb={['Home', 'Excel & Spreadsheets', title]}
      title={title}
      description={desc}
      seoSlug="excel-to-csv"
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
          <div style={{ marginTop: 16, padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, margin: '0 0 8px', color: 'var(--text-primary)' }}>{file.name}</p>
            {sheets.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <label style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{t.common.exportSheet}</label>
                <select value={selectedSheet} onChange={(e) => setSelectedSheet(e.target.value)}
                  style={{ padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
                  {sheets.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <ToolButton variant="primary" onClick={convert}>{t.common.convertBtn}</ToolButton>
              </div>
            )}
          </div>
        )}

        {error && <p style={{ color: 'var(--danger,#dc2626)', marginTop: 12, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)' }}>{error}</p>}

        {status === 'done' && csvContent && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>
                {t.common.preview(csvContent.split('\n').length)}
              </span>
              <button onClick={download}
                style={{ padding: '7px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer' }}>
                {t.common.downloadCsv}
              </button>
            </div>
            <textarea readOnly value={csvContent.slice(0, 3000) + (csvContent.length > 3000 ? '\n…' : '')}
              style={{ width: '100%', height: 280, padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical', boxSizing: 'border-box' }} />
          </div>
        )}
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
