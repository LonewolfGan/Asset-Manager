import { useState } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';

type Mode = 'format' | 'minify';

export default function JsonFormatter() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const title = t.tools['json-formatter']?.title ?? 'JSON Formatter';
  const desc = t.tools['json-formatter']?.description ?? 'Format, validate, and minify JSON instantly in your browser.';
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<Mode>('format');
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const process = (text: string, m: Mode) => {
    setError(''); setOutput('');
    if (!text.trim()) return;
    try {
      const parsed = JSON.parse(text);
      if (m === 'format') setOutput(JSON.stringify(parsed, null, indent));
      else setOutput(JSON.stringify(parsed));
      trackToolUsed('json-formatter', 'utilities');
    } catch (e) {
      trackToolError('json-formatter', 'general-error');
      setError(e instanceof Error ? e.message : 'Invalid JSON');
    }
  };

  const handleInput = (val: string) => { setInput(val); process(val, mode); };
  const handleMode = (m: Mode) => { setMode(m); process(input, m); };

  const copy = async () => {
    await copyWithToast(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const download = () => {
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'formatted.json'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
          {(['format', 'minify'] as Mode[]).map((m) => (
            <button key={m} onClick={() => handleMode(m)}
              style={{ padding: '6px 16px', borderRadius: 'var(--radius)', border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`, background: mode === m ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: mode === m ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: mode === m ? 600 : 400, cursor: 'pointer' }}>
              {m === 'format' ? t.common.format : t.common.minify}
            </button>
          ))}
          {mode === 'format' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--text-secondary)' }}>{t.jsonFormatter.indent}</span>
              {[2, 4].map((n) => (
                <button key={n} onClick={() => { setIndent(n); process(input, 'format'); }}
                  style={{ padding: '4px 10px', border: `1px solid ${indent === n ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 6, background: indent === n ? 'var(--accent-subtle,#fff4ef)' : 'transparent', color: indent === n ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-mono)', fontSize: 12, cursor: 'pointer' }}>
                  {n}
                </button>
              ))}
            </div>
          )}
          {output && (
            <div style={{ display: 'flex', gap: 6, marginLeft: 'auto' }}>
              <button onClick={copy} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : t.common.copy}</button>
              <button onClick={download} style={{ padding: '5px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{t.common.download}</button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{t.jsonFormatter.inputLabel}</p>
            <textarea value={input} onChange={(e) => handleInput(e.target.value)}
              placeholder='{"name":"Alice","age":30,"city":"Paris"}'
              style={{ width: '100%', height: 420, padding: 14, border: `1px solid ${error ? 'var(--danger,#dc2626)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
            {error && <p style={{ color: 'var(--danger,#dc2626)', fontSize: 12, marginTop: 6, fontFamily: 'var(--font-mono)' }}>{error}</p>}
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>{mode === 'format' ? t.jsonFormatter.formattedOutput : t.jsonFormatter.minifiedOutput}</p>
            <textarea readOnly value={output} placeholder={t.common.outputAppearsHere}
              style={{ width: '100%', height: 420, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
            {output && <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 6, fontFamily: 'var(--font-mono)' }}>{t.jsonFormatter.stats(output.length, new Blob([output]).size)}</p>}
          </div>
        </div>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="json-formatter" />
    </>
  );
}
