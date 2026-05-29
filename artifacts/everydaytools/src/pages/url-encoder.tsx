import { useState, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';

type Mode = 'encode' | 'decode';

export default function UrlEncoder() {
  const { t } = useLocale();
  const title = t.tools['url-encoder']?.title ?? 'URL Encoder / Decoder';
  const desc = t.tools['url-encoder']?.description ?? 'Encode and decode URL components in real time. All processing is local.';
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (input) {
      trackToolUsed('url-encoder', 'utilities');
    }
  }, [input, mode]);

  const output = (() => {
    try {
      if (!input) return '';
      return mode === 'encode' ? encodeURIComponent(input) : decodeURIComponent(input);
    } catch { return 'Invalid input'; }
  })();

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(''); }}
              style={{ padding: '7px 18px', border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: mode === m ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: mode === m ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: mode === m ? 600 : 400, cursor: 'pointer' }}>
              {m === 'encode' ? 'Encode' : 'Decode'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
              {mode === 'encode' ? 'Raw URL / text' : 'Encoded URL'}
            </p>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'https://example.com/path?q=hello world&lang=français' : 'https%3A%2F%2Fexample.com%3Fq%3Dhello%20world'}
              style={{ width: '100%', height: 140, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                {mode === 'encode' ? 'Encoded output' : 'Decoded output'}
              </p>
              {output && <button onClick={copy} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{copied ? t.common.copied : t.common.copy}</button>}
            </div>
            <textarea readOnly value={output} placeholder={t.common.outputAppearsHere}
              style={{ width: '100%', height: 140, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5, wordBreak: 'break-all' }}
            />
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 8px' }}>Quick examples</p>
          {[
            ['Space', ' ', '%20'],
            ['Ampersand', '&', '%26'],
            ['Equals', '=', '%3D'],
            ['Hash', '#', '%23'],
          ].map(([label, raw, enc]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)', minWidth: 80 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>{raw}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-tertiary)' }}>→</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-primary)' }}>{enc}</span>
            </div>
          ))}
        </div>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="url-encoder" />
    </>
  );
}
