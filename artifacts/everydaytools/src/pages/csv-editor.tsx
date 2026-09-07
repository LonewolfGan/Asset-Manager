import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { Table, Plus, Trash2, Download, Upload } from 'lucide-react';

export default function CsvEditor() {
  const { t } = useLocale();
  const [headers, setHeaders] = useState<string[]>(['Name', 'Email', 'Role', 'Status']);
  const [rows, setRows] = useState<string[][]>([
    ['John Doe', 'john@example.com', 'Admin', 'Active'],
    ['Jane Smith', 'jane@example.com', 'Editor', 'Active'],
    ['Bob Wilson', 'bob@example.com', 'Viewer', 'Inactive'],
  ]);
  const fileRef = useRef<HTMLInputElement>(null);

  const updateCell = (rowIndex: number, colIndex: number, val: string) => {
    const next = [...rows];
    next[rowIndex][colIndex] = val;
    setRows(next);
  };

  const updateHeader = (colIndex: number, val: string) => {
    const next = [...headers];
    next[colIndex] = val;
    setHeaders(next);
  };

  const addRow = () => {
    setRows([...rows, new Array(headers.length).fill('')]);
  };

  const deleteRow = (rowIndex: number) => {
    setRows(rows.filter((_, idx) => idx !== rowIndex));
  };

  const addCol = () => {
    setHeaders([...headers, `Col ${headers.length + 1}`]);
    setRows(rows.map(r => [...r, '']));
  };

  const loadCsv = (f: File) => {
    Papa.parse(f, {
      skipEmptyLines: true,
      complete: (res) => {
        if (res.data.length > 0) {
          const raw = res.data as string[][];
          setHeaders(raw[0]);
          setRows(raw.slice(1));
          trackToolUsed('csv-editor', 'excel');
        }
      }
    });
  };

  const exportCsv = () => {
    const csv = Papa.unparse({ fields: headers, data: rows });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'spreadsheet.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'spreadsheet.xlsx');
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Spreadsheets', 'Interactive CSV Editor']} />
        <PageTitle>Online CSV & Spreadsheet Editor</PageTitle>
        <PageSubtitle>Quickly view, edit, add/remove columns and rows, and export clean CSV or Excel files without software installation.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) loadCsv(e.target.files[0]); }} />
            <button onClick={() => fileRef.current?.click()} style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Upload size={14} />
              Open CSV
            </button>
            <button onClick={addRow} style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} />
              Add Row
            </button>
            <button onClick={addCol} style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Plus size={14} />
              Add Column
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportCsv} style={{ padding: '8px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />
              Export CSV
            </button>
            <button onClick={exportExcel} style={{ padding: '8px 16px', background: 'var(--accent-subtle)', color: 'var(--accent)', border: '1px solid var(--accent)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Download size={14} />
              Export Excel
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)' }}>
            <thead>
              <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '8px 12px', width: 40, color: 'var(--text-tertiary)' }}>#</th>
                {headers.map((h, ci) => (
                  <th key={ci} style={{ padding: '8px', borderRight: '1px solid var(--border)' }}>
                    <input
                      value={h}
                      onChange={(e) => updateHeader(ci, e.target.value)}
                      style={{ width: '100%', padding: '4px 8px', border: '1px solid transparent', background: 'transparent', fontWeight: 600, color: 'var(--text-primary)' }}
                    />
                  </th>
                ))}
                <th style={{ width: 40 }}></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, ri) => (
                <tr key={ri} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '8px 12px', textAlign: 'center', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{ri + 1}</td>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{ padding: '4px', borderRight: '1px solid var(--border)' }}>
                      <input
                        value={cell}
                        onChange={(e) => updateCell(ri, ci, e.target.value)}
                        style={{ width: '100%', padding: '6px 8px', border: '1px solid transparent', background: 'transparent', color: 'var(--text-primary)' }}
                      />
                    </td>
                  ))}
                  <td style={{ padding: '4px', textAlign: 'center' }}>
                    <button onClick={() => deleteRow(ri)} style={{ border: 'none', background: 'transparent', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="csv-editor" />
    </>
  );
}
