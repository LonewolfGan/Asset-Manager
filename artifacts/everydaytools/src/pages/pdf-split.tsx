import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import ResultPanel from '@/components/ResultPanel';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolLoadingState from '@/components/ToolLoadingState';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

export default function PdfSplit() {
  const { t } = useLocale();
  const [files, setFiles] = useState<File[]>([]);
  const [result, setResult] = useState<{blob: Blob, filename: string, sizeAfter: number, sizeBefore?: number} | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<'every' | 'range'>('every');
  const [ranges, setRanges] = useState("");

  const handleConvert = async () => {
    if (!files[0]) return;
    setError(null); setIsProcessing(true); setProgress(0);
    try {
      trackToolUsed('pdf-split', 'pdf');
      const file = files[0];
      const fd = new FormData();
      fd.append('file', file);
      fd.append('mode', mode);
      if (mode === 'range') fd.append('ranges', ranges);
      setProgress(20);
      const res = await fetch('/api/tools/pdf-split', { method: 'POST', body: fd });
      setProgress(85);
      if (!res.ok) {
        const err = await res.json() as { error?: string };
        throw new Error(err.error ?? 'Split failed');
      }
      const blob = await res.blob();
      const ct = res.headers.get('Content-Type') ?? '';
      const isZip = ct.includes('zip');
      const filename = file.name.replace(/\.pdf$/i, isZip ? '_split.zip' : '_extracted.pdf');
      setResult({ blob, filename, sizeAfter: blob.size, sizeBefore: file.size });
      setProgress(100);
    } catch (e) {
      trackToolError('pdf-split', 'general-error');
      setError(e instanceof Error ? e.message : 'Split failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
      <Breadcrumb items={['Home', 'PDF Tools', 'Split PDF']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['pdf-split']?.title ?? 'Split PDF'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{t.tools['pdf-split']?.description ?? 'Extract pages or split a PDF document into multiple files.'}</p>
      
      <FileUpload accept={['.pdf']} maxSizeMB={50} onFiles={setFiles} />
      
      {files.length > 0 && (
        <div style={{ marginTop: 24, padding: 20, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 500, marginBottom: 16 }}>Split Options</h3>
          
          {([
            { value: 'every', label: 'Extract every page into individual PDFs (ZIP)' },
            { value: 'range', label: 'Extract specific pages or ranges' },
          ] as const).map(({ value, label }) => (
            <label
              key={value}
              style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', padding: '10px 12px', borderRadius: 'var(--radius-md)', marginBottom: 4, transition: 'background 120ms ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <input type="radio" checked={mode === value} onChange={() => setMode(value)} style={{ width: 15, height: 15 }} />
              <span>{label}</span>
            </label>
          ))}
          
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
          style={{ marginTop: 16, padding: '12px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', width: '100%' }}>
          Split PDF
        </button>
      )}
      
      <ToolLoadingState
        status={isProcessing ? 'loading' : error ? 'error' : 'idle'}
        progress={isProcessing ? progress : undefined}
        label="Splitting PDF..."
        errorMessage={error ?? undefined}
        onRetry={error && files.length > 0 ? handleConvert : undefined}
      />
      {result && <ResultPanel {...result} />}
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="pdf-split" />
  </>
  );
}
