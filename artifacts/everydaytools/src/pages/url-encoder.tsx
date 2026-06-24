import { useState, useEffect } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';

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
    } catch { return t.urlEncoder.invalidInput; }
  })();

  const copy = async () => { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <PageTitle>{title}</PageTitle>
        <PageSubtitle>{desc}</PageSubtitle>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button key={m} onClick={() => { setMode(m); setInput(''); }}
              style={{ padding: '7px 18px', border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: mode === m ? 'var(--accent-subtle)' : 'var(--bg-surface)', color: mode === m ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: mode === m ? 600 : 400, cursor: 'pointer' }}>
              {m === 'encode' ? t.common.encode : t.common.decode}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
              {mode === 'encode' ? t.urlEncoder.rawUrlText : t.urlEncoder.encodedUrl}
            </p>
            <textarea value={input} onChange={(e) => setInput(e.target.value)}
              placeholder={mode === 'encode' ? 'https://example.com/path?q=hello world&lang=français' : 'https%3A%2F%2Fexample.com%3Fq%3Dhello%20world'}
              style={{ width: '100%', height: 140, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                {mode === 'encode' ? t.urlEncoder.encodedOutput : t.urlEncoder.decodedOutput}
              </p>
              {output && <button onClick={copy} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', cursor: 'pointer' }}>{copied ? t.common.copied : t.common.copy}</button>}
            </div>
            <textarea readOnly value={output} placeholder={t.common.outputAppearsHere}
              style={{ width: '100%', height: 140, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5, wordBreak: 'break-all' }}
            />
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)' }}>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-primary)', margin: '0 0 8px' }}>{t.urlEncoder.quickExamples}</p>
          {([
            [t.urlEncoder.examples.space, ' ', '%20'],
            [t.urlEncoder.examples.ampersand, '&', '%26'],
            [t.urlEncoder.examples.equals, '=', '%3D'],
            [t.urlEncoder.examples.hash, '#', '%23'],
          ] as [string, string, string][]).map(([label, raw, enc]) => (
            <div key={label} style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)', minWidth: 80 }}>{label}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{raw}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-tertiary)' }}>→</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>{enc}</span>
            </div>
          ))}
        </div>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="url-encoder" />
    </>
  );
}
