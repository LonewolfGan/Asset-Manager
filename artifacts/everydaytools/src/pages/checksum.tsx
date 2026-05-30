import { useState, useRef } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

type HashAlgo = 'SHA-1' | 'SHA-256' | 'SHA-512' | 'SHA-384';
const ALGOS: HashAlgo[] = ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'];

function buf2hex(b: ArrayBuffer) {
  return Array.from(new Uint8Array(b)).map((x) => x.toString(16).padStart(2, '0')).join('');
}

export default function Checksum() {
  const { t } = useLocale();
  const title = t.tools['checksum']?.title ?? 'File Checksum';
  const desc = t.tools['checksum']?.description ?? 'Compute SHA-1, SHA-256, SHA-384, and SHA-512 checksums for any file — entirely in your browser.';
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Partial<Record<HashAlgo, string>>>({});
  const [status, setStatus] = useState<'idle' | 'processing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [expected, setExpected] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [copiedAlgo, setCopiedAlgo] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f); setHashes({}); setStatus('processing'); setProgress(0);
    try {
      const buf = await f.arrayBuffer();
      setProgress(25);
      const results: Partial<Record<HashAlgo, string>> = {};
      for (let i = 0; i < ALGOS.length; i++) {
        const digest = await crypto.subtle.digest(ALGOS[i], buf);
        results[ALGOS[i]] = buf2hex(digest);
        setProgress(25 + (i + 1) * 18);
      }
      setHashes(results);
      setStatus('done');
      trackToolUsed('checksum', 'utilities');
    } catch { 
      trackToolError('checksum', 'general-error');
      setStatus('idle'); 
    }
  };

  function formatBytes(b: number) {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  }

  const matchAlgo = expected.trim() ? ALGOS.find((a) => hashes[a]?.toLowerCase() === expected.trim().toLowerCase()) : null;

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Privacy', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)' }}
        >
          <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 15, color: 'var(--text-secondary)', margin: 0 }}>{t.common.dropFileHere}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 6 }}>Any file type · all hashes computed in your browser</p>
        </div>

        {status === 'processing' && (
          <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
            <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)', marginTop: 8, margin: '8px 0 0' }}>Computing hashes…</p>
          </div>
        )}

        {status === 'done' && file && (
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-primary)', fontWeight: 500 }}>{file.name}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>{formatBytes(file.size)}</span>
            </div>

            {ALGOS.map((algo) => (
              <div key={algo} style={{ padding: '12px 16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase' }}>{algo}</span>
                  <button onClick={() => { copyWithToast(hashes[algo] ?? ''); setCopiedAlgo(algo); setTimeout(() => setCopiedAlgo(null), 1500); }}
                    style={{ padding: '2px 8px', border: '1px solid var(--border)', borderRadius: 4, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 11, color: copiedAlgo === algo ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 150ms ease' }}>{copiedAlgo === algo ? '✓ ' + t.common.copied : t.common.copy}</button>
                </div>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: expected.trim() && hashes[algo]?.toLowerCase() === expected.trim().toLowerCase() ? 'var(--success,#16a34a)' : 'var(--text-primary)', margin: 0, wordBreak: 'break-all', lineHeight: 1.5 }}>
                  {hashes[algo]}
                </p>
              </div>
            ))}

            <div style={{ padding: '16px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>Verify — paste expected hash</p>
              <input value={expected} onChange={(e) => setExpected(e.target.value)}
                placeholder="Paste expected SHA-256, SHA-512, etc."
                style={{ width: '100%', padding: '8px 12px', border: `1px solid ${expected.trim() && !matchAlgo ? 'var(--danger,#dc2626)' : expected.trim() && matchAlgo ? 'var(--success,#16a34a)' : 'var(--border)'}`, borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 12, background: 'var(--bg-base)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
              />
              {expected.trim() && (
                <p style={{ marginTop: 8, fontFamily: 'var(--font-ui)', fontSize: 13, color: matchAlgo ? 'var(--success,#16a34a)' : 'var(--danger,#dc2626)' }}>
                  {matchAlgo ? `Match — ${matchAlgo}` : 'No match for any hash'}
                </p>
              )}
            </div>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="checksum" />
    </>
  );
}
