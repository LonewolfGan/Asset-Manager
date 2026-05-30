import { useState } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

export default function AiTextScrubber() {
  const { t } = useLocale();
  const tc = t.aiTextScrubber;
  const [tab, setTab] = useState<'invisible'|'stylistic'>('invisible');
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [invisiblesCount, setInvisiblesCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleScanInvisibles = async () => {
    try {
      const res = await fetch('/api/text/scrub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, options: { invisibles: true, stylistic: false } }),
      });
      const data = await res.json();
      setInvisiblesCount(data.removedCount ?? 0);
    } catch {
      const matches = inputText.match(/[\u200B-\u200D\uFEFF\u2060\u2061\u2062\u2063]/g);
      setInvisiblesCount(matches ? matches.length : 0);
    }
  };

  const handleRemoveInvisibles = async () => {
    try {
      const res = await fetch('/api/text/scrub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, options: { invisibles: true, stylistic: false } }),
      });
      const data = await res.json();
      setOutputText(data.cleaned ?? inputText);
    } catch {
      setOutputText(inputText.replace(/[\u200B-\u200D\uFEFF\u2060\u2061\u2062\u2063]/g, ""));
    }
  };

  const handleStylisticScrub = async () => {
    try {
      const res = await fetch('/api/text/scrub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputText, options: { invisibles: false, stylistic: true } }),
      });
      const data = await res.json();
      setOutputText(data.cleaned ?? inputText);
    } catch {
      setOutputText(inputText);
    }
  };

  const handleCopy = () => {
    copyWithToast(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    trackToolUsed('ai-text-scrubber', 'utilities');
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'scrubbed_text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Privacy Tools', 'AI Text Scrubber']} />
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{t.tools['ai-text-scrubber']?.title ?? 'AI Text Scrubber'}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{t.tools['ai-text-scrubber']?.description ?? 'Remove invisible trackers and common AI stylistic boilerplate from text.'}</p>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button onClick={() => setTab('invisible')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'invisible' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'invisible' ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{tc.tabInvisible}</button>
        <button onClick={() => setTab('stylistic')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'stylistic' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'stylistic' ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{tc.tabStylistic}</button>
      </div>

      <textarea
        placeholder={tc.placeholder}
        value={inputText}
        onChange={e => { setInputText(e.target.value); setOutputText(""); setInvisiblesCount(null); }}
        style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'var(--font-ui)', resize: 'vertical', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
      />

      {tab === 'invisible' && (
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button onClick={handleScanInvisibles} style={{ flex: 1, padding: '12px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}>{tc.scan}</button>
          <button onClick={handleRemoveInvisibles} disabled={!inputText} style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}>{tc.removeBtn}</button>
        </div>
      )}

      {tab === 'stylistic' && (
        <button onClick={handleStylisticScrub} disabled={!inputText} style={{ width: '100%', marginTop: 16, padding: '12px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}>
          {tc.scrubPhrases}
        </button>
      )}

      {invisiblesCount !== null && tab === 'invisible' && (
        <p style={{ marginTop: 16, fontSize: 14, color: invisiblesCount > 0 ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-ui)' }}>
          {tc.foundCount(invisiblesCount)}
        </p>
      )}

      {outputText && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{tc.cleanedOutput}</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopy} style={{ padding: '6px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)', color: copied ? 'var(--accent)' : 'var(--text-primary)', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : tc.copy}</button>
              <button onClick={handleDownload} style={{ padding: '6px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>{tc.downloadTxt}</button>
            </div>
          </div>
          <textarea
            readOnly
            value={outputText}
            style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--success)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'var(--font-mono)', background: 'var(--bg-base)', color: 'var(--text-primary)' }}
          />
        </div>
      )}

      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--text-tertiary)', textAlign: 'center', padding: '0 24px', fontFamily: 'var(--font-ui)' }}>
        {tc.disclaimer}
      </p>
      <AdSlot type="horizontal" />
    </div>
    <ToolPageSEO internalSlug="ai-text-scrubber" />
  </>
  );
}
