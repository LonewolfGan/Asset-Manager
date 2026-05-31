import { useState, useRef } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';

type Mode = 'csv-to-json' | 'json-to-csv';

export default function CsvToJson() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const title = t.tools['csv-to-json']?.title ?? 'CSV ↔ JSON';
  const desc = t.tools['csv-to-json']?.description ?? 'Convert between CSV and JSON formats instantly in your browser.';
  const [mode, setMode] = useState<Mode>('csv-to-json');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setInput(await f.text());
    setOutput(''); setError('');
  };

  const convert = async () => {
    setError(''); setOutput('');
    try {
      if (mode === 'csv-to-json') {
        const Papa = (await import('papaparse')).default;
        const result = Papa.parse(input.trim(), { header: true, skipEmptyLines: true, dynamicTyping: true });
        if (result.errors.length) throw new Error(result.errors[0].message);
        setOutput(JSON.stringify(result.data, null, 2));
      } else {
        const data = JSON.parse(input.trim());
        const rows = Array.isArray(data) ? data : [data];
        if (rows.length === 0) { setOutput(''); return; }
        const Papa = (await import('papaparse')).default;
        setOutput(Papa.unparse(rows));
      }
    } catch (e) {
      trackToolError('csv-to-json', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const download = () => {
    trackToolUsed('csv-to-json', 'documents');
    if (!output) return;
    const ext = mode === 'csv-to-json' ? '.json' : '.csv';
    const mime = mode === 'csv-to-json' ? 'application/json' : 'text/csv';
    const blob = new Blob([output], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `converted${ext}`; a.click();
    URL.revokeObjectURL(url);
  };

  const copyOutput = () => { if (output) { copyWithToast(output); setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Excel & Spreadsheets', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {(['csv-to-json', 'json-to-csv'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(''); setOutput(''); setError(''); }}
              style={{ padding: '7px 18px', borderRadius: 'var(--radius)', border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`, background: mode === m ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: mode === m ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: mode === m ? 600 : 400, cursor: 'pointer' }}>
              {m === 'csv-to-json' ? 'CSV → JSON' : 'JSON → CSV'}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{mode === 'csv-to-json' ? 'CSV Input' : 'JSON Input'}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => inputRef.current?.click()} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Upload file</button>
                <input ref={inputRef} type="file" accept={mode === 'csv-to-json' ? '.csv' : '.json'} style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
              </div>
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(''); setError(''); }}
              placeholder={mode === 'csv-to-json' ? 'name,age\nAlice,30\nBob,25' : '[{"name":"Alice","age":30}]'}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              style={{ width: '100%', height: 280, padding: 12, border: `1px solid ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{mode === 'csv-to-json' ? 'JSON Output' : 'CSV Output'}</span>
              {output && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={copyOutput} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : t.common.copy}</button>
                  <button onClick={download} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{t.common.download}</button>
                </div>
              )}
            </div>
            <textarea readOnly value={output || (error ? `Error: ${error}` : '')}
              placeholder={t.common.outputAppearsHere}
              style={{ width: '100%', height: 280, padding: 12, border: `1px solid ${error ? 'var(--danger,#dc2626)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: error ? 'var(--danger,#dc2626)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <button onClick={convert} disabled={!input.trim()}
          style={{ marginTop: 16, width: '100%', padding: '11px 24px', background: input.trim() ? 'var(--accent)' : 'var(--bg-elevated)', color: input.trim() ? 'var(--accent-text)' : 'var(--text-tertiary)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: input.trim() ? 'pointer' : 'not-allowed' }}>
          {mode === 'csv-to-json' ? 'Convert CSV → JSON' : 'Convert JSON → CSV'}
        </button>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="csv-to-json" />
    </>
  );
}
