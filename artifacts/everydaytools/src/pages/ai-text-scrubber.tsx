import { useState } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { PageTitle, PageSubtitle } from '@/components/Typography';

// ── Client-side scrub logic ───────────────────────────────────────────────────
const INVISIBLE_RE = /[\u200B\u200C\u200D\u2060\u2061\u2062\u2063\uFEFF]/g;

const REPLACEMENT_MAP: Record<string, string[]> = {
  "In conclusion":            ["To sum up", "Overall", "Taken together"],
  "It is important to note":  ["Note that", "Worth mentioning"],
  "Furthermore":              ["Also", "Beyond this"],
  "In summary":               ["In short", "To recap"],
  "It is worth noting":       ["Note that"],
  "As previously mentioned":  ["As noted"],
  "In today's world":         [""],
  "At the end of the day":    ["Ultimately"],
  "Needless to say":          [""],
  "It goes without saying":   [""],
};

function scrubInvisibles(text: string): { cleaned: string; removedCount: number } {
  const matches = text.match(INVISIBLE_RE);
  const removedCount = matches ? matches.length : 0;
  return { cleaned: text.replace(INVISIBLE_RE, ""), removedCount };
}

function scrubStylistic(text: string): string {
  let cleaned = text;
  for (const [phrase, alternatives] of Object.entries(REPLACEMENT_MAP)) {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi");
    cleaned = cleaned.replace(regex, (match) => {
      const isCapitalized = match.charAt(0) !== match.charAt(0).toLowerCase();
      const randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
      if (!randomAlt) return "";
      return isCapitalized
        ? randomAlt.charAt(0).toUpperCase() + randomAlt.slice(1)
        : randomAlt.toLowerCase();
    });
  }
  return cleaned.replace(/\s{2,}/g, " ").trim();
}
// ─────────────────────────────────────────────────────────────────────────────

export default function AiTextScrubber() {
  const { t } = useLocale();
  const tc = t.aiTextScrubber;
  const [tab, setTab] = useState<'invisible' | 'stylistic'>('invisible');
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [invisiblesCount, setInvisiblesCount] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const switchTab = (newTab: 'invisible' | 'stylistic') => {
    setTab(newTab);
    setOutputText("");
    setInvisiblesCount(null);
  };

  const handleScanInvisibles = () => {
    const matches = inputText.match(INVISIBLE_RE);
    setInvisiblesCount(matches ? matches.length : 0);
  };

  const handleRemoveInvisibles = () => {
    const { cleaned } = scrubInvisibles(inputText);
    setOutputText(cleaned);
    trackToolUsed('ai-text-scrubber', 'utilities');
  };

  const handleStylisticScrub = () => {
    setOutputText(scrubStylistic(inputText));
    trackToolUsed('ai-text-scrubber', 'utilities');
  };

  const handleCopy = () => {
    copyWithToast(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
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
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Privacy Tools', 'AI Text Scrubber']} />
        <PageTitle>
          {t.tools['ai-text-scrubber']?.title ?? 'AI Text Scrubber'}
        </PageTitle>
        <PageSubtitle>
          {t.tools['ai-text-scrubber']?.description ?? 'Remove invisible characters and AI-detection patterns from text.'}
        </PageSubtitle>

        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          <button onClick={() => switchTab('invisible')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'invisible' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'invisible' ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{tc.tabInvisible}</button>
          <button onClick={() => switchTab('stylistic')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'stylistic' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'stylistic' ? 'var(--text-primary)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)' }}>{tc.tabStylistic}</button>
        </div>

        <textarea
          placeholder={tc.placeholder}
          value={inputText}
          onChange={e => { setInputText(e.target.value); setOutputText(""); setInvisiblesCount(null); }}
          style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'var(--font-ui)', resize: 'vertical', background: 'var(--bg-base)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
        />

        {tab === 'invisible' && (
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <button onClick={handleScanInvisibles} disabled={!inputText} style={{ flex: 1, padding: '12px', background: 'var(--bg-surface)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}>{tc.scan}</button>
            <button onClick={handleRemoveInvisibles} disabled={!inputText} style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}>{tc.removeBtn}</button>
          </div>
        )}

        {tab === 'stylistic' && (
          <button onClick={handleStylisticScrub} disabled={!inputText} style={{ width: '100%', marginTop: 16, padding: '12px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontWeight: 500, cursor: 'pointer' }}>
            {tc.scrubPhrases}
          </button>
        )}

        {invisiblesCount !== null && tab === 'invisible' && (
          <p style={{ marginTop: 16, fontSize: 'var(--text-sm)', color: invisiblesCount > 0 ? 'var(--danger)' : 'var(--success)', fontFamily: 'var(--font-ui)' }}>
            {tc.foundCount(invisiblesCount)}
          </p>
        )}

        {outputText && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 'var(--panel-label-weight)' as React.CSSProperties['fontWeight'], color: 'var(--text-primary)', fontFamily: 'var(--font-ui)' }}>{tc.cleanedOutput}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleCopy} style={{ padding: '6px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-ui)', color: copied ? 'var(--accent)' : 'var(--text-primary)', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : tc.copy}</button>
                <button onClick={handleDownload} style={{ padding: '6px 12px', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)', cursor: 'pointer', fontFamily: 'var(--font-ui)', color: 'var(--text-primary)' }}>{tc.downloadTxt}</button>
              </div>
            </div>
            <textarea
              readOnly
              value={outputText}
              style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--success)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'var(--font-mono)', background: 'var(--bg-base)', color: 'var(--text-primary)', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <p style={{ marginTop: 24, fontSize: 'var(--text-sm)', color: 'var(--text-tertiary)', textAlign: 'center', padding: '0 24px', fontFamily: 'var(--font-ui)' }}>
          {tc.disclaimer}
        </p>
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="ai-text-scrubber" />
    </>
  );
}
