import { useState } from 'react';
import FAQSection from '@/components/FAQSection';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';

export default function AiTextScrubber() {
  const [tab, setTab] = useState<'invisible'|'stylistic'>('invisible');
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [invisiblesCount, setInvisiblesCount] = useState<number | null>(null);

  const handleScanInvisibles = () => {
    const matches = inputText.match(/[\u200B-\u200D\uFEFF\u2060\u2061\u2062\u2063]/g);
    setInvisiblesCount(matches ? matches.length : 0);
  };

  const handleRemoveInvisibles = () => {
    const cleaned = inputText.replace(/[\u200B-\u200D\uFEFF\u2060\u2061\u2062\u2063]/g, "");
    setOutputText(cleaned);
  };

  const replacements: Record<string, string[]> = {
    "In conclusion": ["To sum up", "Overall", "Taken together"],
    "It is important to note": ["Note that", "Worth mentioning"],
    "Furthermore": ["Also", "Beyond this"],
    "In summary": ["In short", "To recap"],
    "It is worth noting": ["Note that"],
    "As previously mentioned": ["As noted above"],
    "In today's world": [""],
    "At the end of the day": ["Ultimately"],
    "Needless to say": [""],
    "It goes without saying": [""],
    "Moving forward": ["Going forward", "Next"],
    "Delve into": ["Explore", "Examine"],
    "Utilize": ["Use"],
    "Leverage": ["Use", "Apply"],
    "In order to": ["To"]
  };

  const handleStylisticScrub = () => {
    let result = inputText;
    for (const [phrase, alts] of Object.entries(replacements)) {
      const alt = alts[Math.floor(Math.random() * alts.length)];
      const regex = new RegExp(phrase, 'gi');
      result = result.replace(regex, alt);
    }
    // Clean up double spaces if replacements were empty
    result = result.replace(/\s{2,}/g, ' ');
    setOutputText(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
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

  const faqs = [
    { q: "What are invisible characters?", a: "Zero-width characters can be embedded in text to invisibly track or watermark it. This tool finds and removes them." },
    { q: "Does this bypass AI detectors?", a: "It removes common stylistic ticks that AI detectors look for, but it does not guarantee bypassing them completely." },
    { q: "Are cryptographic watermarks removed?", a: "No, if watermarks are embedded via token sampling (like OpenAI's watermark), simple stylistic replacement may not remove them entirely." }
  ];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 24px 80px' }}>
      <Breadcrumb items={['Home', 'Privacy Tools', 'AI Text Scrubber']} />
      <h1 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 36, marginBottom: 8, color: 'var(--text)' }}>AI Text Scrubber</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: 15 }}>Remove invisible trackers and common AI stylistic boilerplate from text.</p>
      
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
        <button onClick={() => setTab('invisible')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'invisible' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'invisible' ? 'var(--text)' : 'var(--muted)' }}>Invisible Character Remover</button>
        <button onClick={() => setTab('stylistic')} style={{ flex: 1, padding: '12px', background: 'none', border: 'none', borderBottom: tab === 'stylistic' ? '2px solid var(--accent)' : '2px solid transparent', fontWeight: 500, cursor: 'pointer', color: tab === 'stylistic' ? 'var(--text)' : 'var(--muted)' }}>Stylistic Scrubber</button>
      </div>
      
      <textarea 
        placeholder="Paste text here..."
        value={inputText}
        onChange={e => { setInputText(e.target.value); setOutputText(""); setInvisiblesCount(null); }}
        style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'IBM Plex Sans, sans-serif', resize: 'vertical' }}
      />
      
      {tab === 'invisible' && (
        <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
          <button onClick={handleScanInvisibles} style={{ flex: 1, padding: '12px', background: 'var(--bg)', color: 'var(--text)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontWeight: 500, cursor: 'pointer' }}>Scan</button>
          <button onClick={handleRemoveInvisibles} disabled={!inputText} style={{ flex: 1, padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 500, cursor: 'pointer' }}>Remove</button>
        </div>
      )}
      
      {tab === 'stylistic' && (
        <button onClick={handleStylisticScrub} disabled={!inputText} style={{ width: '100%', marginTop: 16, padding: '12px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', fontWeight: 500, cursor: 'pointer' }}>
          Scrub Phrases
        </button>
      )}
      
      {invisiblesCount !== null && tab === 'invisible' && (
        <p style={{ marginTop: 16, fontSize: 14, color: invisiblesCount > 0 ? 'var(--danger)' : 'var(--success)' }}>
          {invisiblesCount} invisible characters found.
        </p>
      )}
      
      {outputText && (
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 500 }}>Cleaned Output</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCopy} style={{ padding: '6px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer' }}>Copy</button>
              <button onClick={handleDownload} style={{ padding: '6px 12px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontSize: 13, cursor: 'pointer' }}>Download .txt</button>
            </div>
          </div>
          <textarea 
            readOnly
            value={outputText}
            style={{ width: '100%', minHeight: 200, padding: 16, border: '1px solid var(--success)', borderRadius: 'var(--radius)', outline: 'none', fontFamily: 'IBM Plex Mono, monospace', background: 'var(--bg)' }}
          />
        </div>
      )}
      
      <p style={{ marginTop: 24, fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '0 24px' }}>
        <strong>Disclaimer:</strong> This does not guarantee bypass of all AI detection methods, including cryptographic watermarking techniques.
      </p>
      
      <FAQSection faqs={faqs} />
      <AdSlot type="horizontal" />
    </div>
  );
}
