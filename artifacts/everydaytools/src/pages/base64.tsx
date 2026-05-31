import { useState, useRef } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';

type Mode = 'encode' | 'decode';

export default function Base64() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const title = t.tools['base64']?.title ?? 'Base64 Encoder / Decoder';
  const desc = t.tools['base64']?.description ?? 'Encode text or files to Base64 and decode Base64 strings — entirely in your browser.';
  const [mode, setMode] = useState<Mode>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [fileMode, setFileMode] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const process = (text: string, m: Mode) => {
    setError(''); setOutput('');
    if (!text.trim()) return;
    try {
      if (m === 'encode') {
        const bytes = new TextEncoder().encode(text);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        setOutput(btoa(binary));
      } else {
        const binary = atob(text.trim());
        const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
        setOutput(new TextDecoder().decode(bytes));
      }
    } catch (e) {
      trackToolError('base64', 'general-error');
      setError(e instanceof Error ? e.message : t.base64Encoder.invalidInput);
    }
  };

  const handleFile = async (f: File) => {
    setFileName(f.name); setFileMode(true); setError('');
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary = '';
    bytes.forEach((b) => (binary += String.fromCharCode(b)));
    const b64 = btoa(binary);
    const dataUrl = `data:${f.type};base64,${b64}`;
    setOutput(dataUrl);
    setInput('');
  };

  const handleInput = (val: string) => { 
    setInput(val); 
    setFileMode(false); 
    setFileName(''); 
    process(val, mode); 
    if (val.trim()) trackToolUsed('base64', 'utilities');
  };
  const handleMode = (m: Mode) => { setMode(m); setInput(''); setOutput(''); setError(''); setFileMode(false); };

  const copy = async () => {
    await copyWithToast(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['encode', 'decode'] as Mode[]).map((m) => (
            <button key={m} onClick={() => handleMode(m)}
              style={{ padding: '7px 18px', border: `1px solid ${mode === m ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 'var(--radius)', background: mode === m ? 'var(--accent-subtle,#fff4ef)' : 'var(--bg-surface)', color: mode === m ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 14, fontWeight: mode === m ? 600 : 400, cursor: 'pointer' }}>
              {m === 'encode' ? t.common.encode : t.common.decode}
            </button>
          ))}
          {mode === 'encode' && (
            <button onClick={() => inputRef.current?.click()}
              style={{ padding: '7px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 13, cursor: 'pointer' }}>
              {t.base64Encoder.uploadFile}
            </button>
          )}
          <input ref={inputRef} type="file" style={{ display: 'none' }} onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16 }}>
          <div>
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
              {mode === 'encode' ? t.base64Encoder.plainTextInput : t.base64Encoder.base64Input}
            </p>
            {fileMode ? (
              <div style={{ height: 320, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8 }}>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-primary)' }}>{fileName}</span>
                <button onClick={() => { setFileMode(false); setFileName(''); setInput(''); setOutput(''); }} style={{ padding: '4px 12px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>{t.common.clear}</button>
              </div>
            ) : (
              <textarea value={input} onChange={(e) => handleInput(e.target.value)}
                placeholder={mode === 'encode' ? t.base64Encoder.encodePlaceholder : t.base64Encoder.decodePlaceholder}
                style={{ width: '100%', height: 320, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5 }}
              />
            )}
            {error && <p style={{ color: 'var(--danger,#dc2626)', fontSize: 12, marginTop: 6, fontFamily: 'var(--font-mono)' }}>{error}</p>}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', margin: 0 }}>
                {mode === 'encode' ? t.base64Encoder.base64Output : t.base64Encoder.decodedText}
              </p>
              {output && <button onClick={copy} style={{ padding: '3px 10px', border: '1px solid var(--border)', borderRadius: 5, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : t.common.copy}</button>}
            </div>
            <textarea readOnly value={output} placeholder={t.common.outputAppearsHere}
              style={{ width: '100%', height: 320, padding: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 13, resize: 'vertical', boxSizing: 'border-box', lineHeight: 1.5, wordBreak: 'break-all' }}
            />
            {output && <p style={{ color: 'var(--text-tertiary)', fontSize: 12, marginTop: 6, fontFamily: 'var(--font-mono)' }}>{t.base64Encoder.chars(output.length)}</p>}
          </div>
        </div>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="base64" />
    </>
  );
}
