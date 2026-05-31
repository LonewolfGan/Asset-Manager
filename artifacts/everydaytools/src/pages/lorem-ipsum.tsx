import { useState } from 'react';
import { copyWithToast } from '@/utils/copy';
import { trackToolUsed, trackToolError } from '@/lib/analytics';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

const WORDS = ['lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis','nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat','duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla','pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui','officia','deserunt','mollit','anim','id','est','laborum'];

function randomWord() { return WORDS[Math.floor(Math.random() * WORDS.length)]; }
function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }

function makeSentence(wordCount = 10) {
  const len = Math.floor(Math.random() * 8) + wordCount - 3;
  const words = Array.from({ length: Math.max(5, len) }, randomWord);
  return capitalize(words.join(' ')) + '.';
}

function makeParagraph(sentenceCount = 4) {
  return Array.from({ length: sentenceCount }, () => makeSentence()).join(' ');
}

type Type = 'paragraphs' | 'sentences' | 'words' | 'lists';

export default function LoremIpsum() {
  const { t } = useLocale();
  const title = t.tools['lorem-ipsum']?.title ?? 'Lorem Ipsum Generator';
  const desc = t.tools['lorem-ipsum']?.description ?? 'Generate placeholder text for your designs. Choose paragraphs, sentences, words, or lists.';
  const [type, setType] = useState<Type>('paragraphs');
  const [count, setCount] = useState(3);
  const [classic, setClassic] = useState(true);
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const CLASSIC_START = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    let result = '';
    if (type === 'paragraphs') {
      const paras = Array.from({ length: count }, (_, i) => {
        if (i === 0 && classic) return CLASSIC_START + ' ' + Array.from({ length: 3 }, () => makeSentence()).join(' ');
        return makeParagraph(4);
      });
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, (_, i) => {
        if (i === 0 && classic) return CLASSIC_START;
        return makeSentence();
      });
      result = sentences.join(' ');
    } else if (type === 'words') {
      if (classic) {
        const base = 'Lorem ipsum dolor sit amet consectetur adipiscing elit'.split(' ');
        const extra = Array.from({ length: Math.max(0, count - base.length) }, randomWord);
        result = [...base, ...extra].slice(0, count).join(' ');
      } else {
        result = Array.from({ length: count }, randomWord).join(' ');
      }
    } else {
      result = Array.from({ length: count }, () => capitalize(randomWord() + ' ' + randomWord() + ' ' + randomWord())).map((item) => `• ${item}`).join('\n');
    }
    trackToolUsed('lorem-ipsum', 'utilities');
    setOutput(result);
  };

  const copy = async () => { await copyWithToast(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '24px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Text & Code', title]} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 36, marginBottom: 8, color: 'var(--text-primary)' }}>{title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 15, fontFamily: 'var(--font-ui)' }}>{desc}</p>

        <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {(['paragraphs', 'sentences', 'words', 'lists'] as Type[]).map((tp) => (
              <button key={tp} onClick={() => setType(tp)}
                style={{ padding: '6px 14px', border: `1px solid ${type === tp ? 'var(--accent)' : 'var(--border)'}`, borderRadius: 8, background: type === tp ? 'var(--accent-subtle,#fff4ef)' : 'transparent', color: type === tp ? 'var(--accent)' : 'var(--text-secondary)', fontFamily: 'var(--font-ui)', fontSize: 13, fontWeight: type === tp ? 600 : 400, cursor: 'pointer' }}>
                {t.loremIpsum.types[tp]}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <label style={{ fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-secondary)' }}>{t.loremIpsum.count}</label>
              <input type="number" min="1" max="50" value={count} onChange={(e) => setCount(Math.max(1, Math.min(50, +e.target.value)))}
                style={{ width: 70, padding: '5px 10px', border: '1px solid var(--border)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 14, background: 'var(--bg-base)', color: 'var(--text-primary)' }}
              />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontFamily: 'var(--font-ui)', fontSize: 14, color: 'var(--text-secondary)' }}>
              <input type="checkbox" checked={classic} onChange={(e) => setClassic(e.target.checked)} style={{ accentColor: 'var(--accent)' }} />
              {t.loremIpsum.classicStart}
            </label>
          </div>

          <button onClick={generate}
            style={{ padding: '11px 24px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>
            {t.common.generate}
          </button>
        </div>

        {output && (
          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
              <button onClick={copy} style={{ padding: '5px 14px', border: '1px solid var(--border)', borderRadius: 6, background: 'transparent', fontFamily: 'var(--font-ui)', fontSize: 13, color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'color 150ms ease' }}>{copied ? '✓ ' + t.common.copied : t.common.copy}</button>
            </div>
            <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', fontFamily: 'var(--font-ui)', fontSize: 14, lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {output}
            </div>
          </div>
        )}
        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="lorem-ipsum" />
    </>
  );
}
