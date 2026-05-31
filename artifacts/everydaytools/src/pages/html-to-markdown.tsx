import { useState, useRef } from 'react';
import { copyWithToast } from '@/utils/copy';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackToolUsed, trackToolError } from '@/lib/analytics';

export default function HtmlToMarkdown() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const title = t.tools['html-to-markdown']?.title ?? 'HTML to Markdown';
  const desc = t.tools['html-to-markdown']?.description ?? 'Convert HTML to clean Markdown. Paste HTML or upload an .html file.';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const convert = async (html: string) => {
    setError(''); setOutput('');
    if (!html.trim()) return;
    try {
      const TurndownService = (await import('turndown')).default;
      const td = new TurndownService({ headingStyle: 'atx', codeBlockStyle: 'fenced', bulletListMarker: '-' });
      setOutput(td.turndown(html));
      if (html.trim()) trackToolUsed('html-to-markdown', 'documents');
    } catch (e) { 
      trackToolError('html-to-markdown', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed'); 
    }
  };

  const handleFile = async (f: File) => {
    const text = await f.text(); setInput(text); convert(text);
  };

  const copy = async () => { await copyWithToast(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const download = () => {
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'output.md'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Documents', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8, gap: 6 }}>
          <button onClick={() => inputRef.current?.click()} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Upload .html file</button>
          <input ref={inputRef} type="file" accept=".html,.htm" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>HTML Input</p>
            <textarea value={input} onChange={(e) => { setInput(e.target.value); convert(e.target.value); }}
              placeholder="<h1>Title</h1><p>Paragraph with <strong>bold</strong> and <a href='#'>links</a>.</p>"
              style={{ width: '100%', height: 400, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>Markdown Output</p>
              {output && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={copy} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : t.common.copy}</button>
                  <button onClick={download} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>{t.common.download}</button>
                </div>
              )}
            </div>
            <textarea readOnly value={output || (error ? `Error: ${error}` : '')} placeholder="Markdown output appears as you type…"
              style={{ width: '100%', height: 400, padding: 14, border: `1px solid ${error ? 'var(--danger,#dc2626)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: error ? 'var(--danger,#dc2626)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
          </div>
        </div>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="html-to-markdown" />
    </>
  );
}
