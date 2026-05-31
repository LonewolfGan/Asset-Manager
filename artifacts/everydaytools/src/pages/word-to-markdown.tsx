import { useState, useRef } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

export default function WordToMarkdown() {
  const { t } = useLocale();
  const title = t.tools['word-to-markdown']?.title ?? 'Word to Markdown';
  const desc = t.tools['word-to-markdown']?.description ?? 'Convert DOCX files to clean Markdown in your browser.';
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setFile(f); setStatus('idle'); setOutput(''); setError('');
    trackToolUsed('word-to-markdown', 'documents');
    try {
      const mammoth = (await import('mammoth')).default;
      const buf = await f.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer: buf });
      const html = result.value;
      const TurndownService = (await import('turndown')).default;
      const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      const md = td.turndown(html);
      setOutput(md);
      setStatus('done');
    } catch (e) {
      trackToolError('word-to-markdown', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
      setStatus('error');
    }
  };

  const download = () => {
    if (!output || !file) return;
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name.replace(/\.(docx?)$/i, '.md');
    a.click();
    URL.revokeObjectURL(url);
  };

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Documents', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
          onClick={() => inputRef.current?.click()}
          style={{ border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: isDragging ? 'var(--bg-elevated)' : 'var(--bg-surface)', marginBottom: 20 }}
        >
          <input ref={inputRef} type="file" accept=".docx" style={{ display: 'none' }}
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 0 }}>{file ? file.name : t.common.dropFileHere}</p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', marginTop: 6 }}>.docx · max 25 MB</p>
        </div>

        {status === 'error' && <p style={{ color: 'var(--danger,#dc2626)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', marginBottom: 16 }}>{error}</p>}

        {status === 'done' && output && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>Markdown Output</span>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={copy} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>{copied ? t.common.copied : t.common.copy}</button>
                <button onClick={download} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--text-primary)', color: 'var(--bg-base)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', cursor: 'pointer' }}>{t.common.download}</button>
              </div>
            </div>
            <textarea readOnly value={output}
              style={{ width: '100%', height: 440, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.6 }}
            />
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="word-to-markdown" />
    </>
  );
}
