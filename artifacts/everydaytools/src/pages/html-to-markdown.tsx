import { useState, useRef } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import { useLocale } from '@/hooks/use-locale';
import ToolPageLayout from '@/components/ToolPageLayout';
import { ToolWorkspace, ToolButton } from '@/components/ToolContent';

export default function HtmlToMarkdown() {
  const { t } = useLocale();
  const title = t.tools['html-to-markdown']?.title ?? 'HTML to Markdown';
  const desc = t.tools['html-to-markdown']?.description ?? 'Convert HTML content to clean Markdown format in your browser.';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (f: File) => {
    setInput(await f.text());
    setOutput(''); setError('');
  };

  const convert = async () => {
    if (!input.trim()) return;
    setError('');
    try {
      const Turndown = (await import('turndown')).default;
      const td = new Turndown({ headingStyle: 'atx', codeBlockStyle: 'fenced' });
      setOutput(td.turndown(input));
      trackToolUsed('html-to-markdown', 'textCode');
    } catch (e) {
      trackToolError('html-to-markdown', 'general-error');
      setError(e instanceof Error ? e.message : 'Conversion failed');
    }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'output.md'; a.click();
    URL.revokeObjectURL(url);
  };

  const copyOutput = () => { if (output) { copyWithToast(output); setCopied(true); setTimeout(() => setCopied(false), 1500); } };

  return (
    <ToolPageLayout breadcrumb={['Home', 'Text & Code', title]} title={title} description={desc} seoSlug="html-to-markdown">
      <ToolWorkspace>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          {/* Input */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>HTML Input</span>
              <button onClick={() => inputRef.current?.click()} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Upload file</button>
              <input ref={inputRef} type="file" accept=".html,.htm" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>
            <textarea
              value={input}
              onChange={(e) => { setInput(e.target.value); setOutput(''); setError(''); }}
              placeholder="<h1>Hello world</h1><p>This is HTML content.</p>"
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
              style={{ width: '100%', height: 320, padding: 12, border: `1px solid ${isDragging ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {/* Output */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)' }}>Markdown Output</span>
              {output && (
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={copyOutput} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer' }}>{copied ? '✓ Copied' : 'Copy'}</button>
                  <button onClick={download} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>Download</button>
                </div>
              )}
            </div>
            <textarea readOnly value={output || (error ? `Error: ${error}` : '')}
              placeholder="Converted markdown appears here"
              style={{ width: '100%', height: 320, padding: 12, border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: error ? 'var(--danger)' : 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        <ToolButton variant="primary" fullWidth onClick={convert} disabled={!input.trim()}>
          Convert HTML → Markdown
        </ToolButton>
      </ToolWorkspace>
    </ToolPageLayout>
  );
}
