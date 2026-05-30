import { useState } from 'react';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

type Mode = 'format' | 'minify';

function formatHtml(html: string, indent = 2): string {
  const sp = ' '.repeat(indent);
  const voids = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
  let result = ''; let level = 0;
  const tokens = html.split(/(<[^>]+>)/g);
  for (const token of tokens) {
    if (!token.trim()) continue;
    if (token.startsWith('</')) {
      level = Math.max(0, level - 1);
      result += `\n${sp.repeat(level)}${token}`;
    } else if (token.startsWith('<') && !token.startsWith('<!--') && !token.startsWith('<!')) {
      const tag = (token.match(/^<([a-zA-Z0-9-]+)/) ?? [])[1]?.toLowerCase() ?? '';
      result += `\n${sp.repeat(level)}${token}`;
      if (!voids.has(tag) && !token.endsWith('/>')) level++;
    } else {
      const trimmed = token.trim();
      if (trimmed) result += `\n${sp.repeat(level)}${trimmed}`;
    }
  }
  return result.trimStart();
}

function minifyHtml(html: string): string {
  return html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
}

export default function HtmlFormatter() {
  const { t } = useLocale();
  const title = t.tools['html-formatter']?.title ?? 'HTML Formatter & Minifier';
  const desc = t.tools['html-formatter']?.description ?? 'Format or minify HTML with syntax highlighting and a copy button.';
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [copied, setCopied] = useState(false);

  const output = (() => {
    if (!input.trim()) return '';
    return mode === 'format' ? formatHtml(input) : minifyHtml(input);
  })();

  const copy = async () => { 
    trackToolUsed('html-formatter', 'utilities');
    await navigator.clipboard.writeText(output); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 1500); 
  };
  const download = () => {
    trackToolUsed('html-formatter', 'utilities');
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'output.html'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          {(['format', 'minify'] as Mode[]).map((m) => (
            <button key={m} onClick={() => setMode(m)}
              style={{ padding: '6px 16px', border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: mode === m ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: mode === m ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: 'pointer' }}>
              {m === 'format' ? t.common.format : t.common.minify}
            </button>
          ))}
          {output && (
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              <button onClick={copy} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{copied ? t.common.copied : t.common.copy}</button>
              <button onClick={download} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{t.common.download}</button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{t.htmlFormatter.inputLabel}</p>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="<html><head><title>Test</title></head><body><p>Hello world</p></body></html>"
              style={{ width: '100%', height: 420, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{t.htmlFormatter.outputLabel}</p>
            <textarea readOnly value={output} placeholder={t.common.outputAppearsHere}
              style={{ width: '100%', height: 420, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
            {output && <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 6, fontFamily: 'var(--font-mono)' }}>{t.htmlFormatter.bytes(new Blob([output]).size)}</p>}
          </div>
        </div>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="html-formatter" />
    </>
  );
}
