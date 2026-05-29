import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function CsvToExcel() {
  const { t } = useLocale();
  const title = t.tools['csv-to-excel']?.title ?? 'CSV to Excel';
  const desc = t.tools['csv-to-excel']?.description ?? 'Convert CSV files to Excel (.xlsx) in your browser.';
  const [csvText, setCsvText] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [xlsxBlob, setXlsxBlob] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f); setCsvText(''); setStatus('idle'); setXlsxBlob(null);
    setCsvText(await f.text());
  };

  const convert = async () => {
    if (!csvText.trim()) return;
    try {
      const Papa = (await import('papaparse')).default;
      const { data } = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
      const XLSX = (await import('xlsx')).default;
      const ws = XLSX.utils.aoa_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const buf = XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
      setXlsxBlob(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      setStatus('done');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const download = () => {
    if (!xlsxBlob) return;
    const name = file?.name.replace(/\.csv$/i, '.xlsx') ?? 'converted.xlsx';
    const url = URL.createObjectURL(xlsxBlob);
    const a = document.createElement('a');
    a.href = url; a.download = name; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Excel & Spreadsheets', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', marginBottom: 16 }}
        >
          <input ref={inputRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-secondary)', margin: 0 }}>
            {file ? file.name : t.common.dropFileHere}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>.csv · max 25 MB</p>
        </div>

        <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{t.common.orPasteDirectly}</p>
        <textarea
          value={csvText}
          onChange={(e) => { setCsvText(e.target.value); setStatus('idle'); setXlsxBlob(null); }}
          placeholder="name,age,city&#10;Alice,30,Paris&#10;Bob,25,Lyon"
          style={{ width: '100%', height: 220, padding: 12, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', marginBottom: 16 }}
        />

        <button onClick={convert} disabled={!csvText.trim()}
          style={{ width: '100%', padding: '12px 24px', background: csvText.trim() ? 'var(--accent)' : 'var(--bg-elevated)', color: csvText.trim() ? 'var(--accent-text)' : 'var(--text-tertiary)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: csvText.trim() ? 'pointer' : 'not-allowed' }}>
          {t.common.convertFiles(1, 'Excel (.xlsx)')}
        </button>

        {error && <p style={{ color: 'var(--danger,#dc2626)', marginTop: 12, fontFamily: 'var(--font-ui)', fontSize: 14 }}>{error}</p>}

        {status === 'done' && xlsxBlob && (
          <div style={{ marginTop: 16, padding: '14px 20px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-primary)' }}>Excel file ready — {(xlsxBlob.size / 1024).toFixed(1)} KB</span>
            <button onClick={download} style={{ padding: '8px 18px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 6, fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{t.common.download}</button>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="csv-to-excel" />
    </>
  );
}
