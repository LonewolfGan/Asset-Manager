import { useState, useRef } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

type SortDir = 'asc' | 'desc' | null;

export default function CsvViewer() {
  const { t } = useLocale();
  const title = t.tools['csv-viewer']?.title ?? 'CSV Viewer';
  const desc = t.tools['csv-viewer']?.description ?? 'Upload or paste a CSV to view it as a sortable table. No data leaves your browser.';
  const [rows, setRows] = useState<string[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [error, setError] = useState('');
  const [sortCol, setSortCol] = useState<number | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const parse = async (text: string) => {
    setError('');
    try {
      const Papa = (await import('papaparse')).default;
      const result = Papa.parse<string[]>(text.trim(), { skipEmptyLines: true });
      if (result.errors.length && result.data.length === 0) throw new Error(result.errors[0].message);
      const data = result.data as string[][];
      if (data.length === 0) return;
      setHeaders(data[0]);
      setRows(data.slice(1));
      setSortCol(null); setSortDir(null);
      trackToolUsed('csv-viewer', 'documents');
    } catch (e) { 
      trackToolError('csv-viewer', 'general-error');
      setError(e instanceof Error ? e.message : 'Parse error'); 
    }
  };

  const handleFile = async (f: File) => {
    setFile(f);
    const text = await f.text();
    setCsvText(text);
    parse(text);
  };

  const handleSort = (col: number) => {
    if (sortCol === col) {
      if (sortDir === 'asc') setSortDir('desc');
      else if (sortDir === 'desc') { setSortCol(null); setSortDir(null); return; }
      else setSortDir('asc');
    } else {
      setSortCol(col);
      setSortDir('asc');
    }
  };

  const sortedRows = sortCol === null ? rows : [...rows].sort((a, b) => {
    const va = a[sortCol] ?? ''; const vb = b[sortCol] ?? '';
    const na = parseFloat(va); const nb = parseFloat(vb);
    if (!isNaN(na) && !isNaN(nb)) return sortDir === 'asc' ? na - nb : nb - na;
    return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
  });

  const downloadCsv = () => {
    const blob = new Blob([csvText], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file?.name ?? 'data.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Excel & Spreadsheets', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        {rows.length === 0 && (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
            style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', marginBottom: 20 }}
          >
            <input ref={inputRef} type="file" accept=".csv,text/csv" style={{ display: 'none' }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>{t.common.dropFileHere}</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>.csv · max 25 MB</p>
          </div>
        )}

        {rows.length === 0 && (
          <>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{t.common.orPasteDirectly}</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <textarea
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="name,age,city&#10;Alice,30,Paris&#10;Bob,25,Lyon"
                style={{ flex: 1, height: 120, padding: 10, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }}
              />
              <button onClick={() => parse(csvText)}
                style={{ padding: '0 20px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: 500, cursor: 'pointer', alignSelf: 'stretch' }}>
                {t.common.view}
              </button>
            </div>
          </>
        )}

        {error && <p style={{ color: 'var(--danger,#dc2626)', fontFamily: 'var(--font-ui)', fontSize: 14, marginTop: 12 }}>{error}</p>}

        {rows.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ display: 'flex', gap: 16 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{rows.length} rows</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{headers.length} columns</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => { setRows([]); setHeaders([]); setCsvText(''); setFile(null); setError(''); }}
                  style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  {t.common.clear}
                </button>
                {csvText && (
                  <button onClick={downloadCsv}
                    style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--text-primary)', color: 'var(--bg-base)', fontFamily: 'var(--font-ui)', fontSize: 12, cursor: 'pointer' }}>
                    {t.common.downloadCsv}
                  </button>
                )}
              </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-ui)', fontSize: 13 }}>
                <thead>
                  <tr style={{ background: 'var(--bg-elevated)' }}>
                    <th style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 400, width: 40, whiteSpace: 'nowrap' }}>#</th>
                    {headers.map((h, i) => (
                      <th key={i} onClick={() => handleSort(i)} style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', userSelect: 'none' }}>
                        {h}
                        {sortCol === i && <span style={{ marginLeft: 4, color: 'var(--accent)' }}>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.slice(0, 500).map((row, ri) => (
                    <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '')}>
                      <td style={{ padding: '6px 12px', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: 11 }}>{ri + 1}</td>
                      {headers.map((_, ci) => (
                        <td key={ci} style={{ padding: '6px 12px', color: 'var(--text-primary)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {row[ci] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {sortedRows.length > 500 && (
                <p style={{ padding: '8px 12px', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-tertiary)', borderTop: '1px solid var(--border)', margin: 0 }}>
                  Showing 500 of {sortedRows.length} rows
                </p>
              )}
            </div>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="csv-viewer" />
    </>
  );
}
