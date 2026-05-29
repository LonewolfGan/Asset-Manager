import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

function analyze(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  const chars = text.length;
  const charsNoSpace = text.replace(/\s/g, '').length;
  const sentences = text.trim() ? text.split(/[.!?]+/).filter((s) => s.trim()).length : 0;
  const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0;
  const readingTimeSec = Math.ceil((words / 238) * 60);
  const readingMin = Math.floor(readingTimeSec / 60);
  const readingSec = readingTimeSec % 60;
  return { words, chars, charsNoSpace, sentences, paragraphs, readingMin, readingSec };
}

export default function WordCounter() {
  const { t } = useLocale();
  const title = t.tools['word-counter']?.title ?? 'Word & Character Counter';
  const desc = t.tools['word-counter']?.description ?? 'Count words, characters, sentences, paragraphs, and estimate reading time.';
  const [text, setText] = useState('');
  const stats = analyze(text);

  const stat = (label: string, value: string | number) => (
    <div style={{ padding: '14px 16px', background: 'var(--bg-elevated)', borderRadius: 10, textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 4px' }}>{value}</p>
      <p style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-tertiary)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</p>
    </div>
  );

  return (
    <>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
          {stat('Words', stats.words)}
          {stat('Characters', stats.chars)}
          {stat('No spaces', stats.charsNoSpace)}
          {stat('Sentences', stats.sentences)}
          {stat('Paragraphs', stats.paragraphs)}
          {stat('Reading time', stats.words === 0 ? '0s' : stats.readingMin > 0 ? `${stats.readingMin}m ${stats.readingSec}s` : `${stats.readingSec}s`)}
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here…"
          style={{ width: '100%', height: 340, padding: 16, border: '1px solid var(--border)', borderRadius: 'var(--radius)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.6, resize: 'vertical', boxSizing: 'border-box' }}
        />

        {text && (
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button onClick={() => setText('')} style={{ padding: '5px 14px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Clear</button>
            <button onClick={() => navigator.clipboard.writeText(text)} style={{ padding: '5px 14px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>Copy text</button>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="word-counter" />
    </>
  );
}
