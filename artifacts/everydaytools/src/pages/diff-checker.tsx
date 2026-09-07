import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { GitCompare } from 'lucide-react';

export default function DiffChecker() {
  const { t } = useLocale();
  const [textA, setTextA] = useState(`The quick brown fox jumps over the lazy dog.
EverydayTools provides fast browser tools.
All operations run in client memory.`);
  const [textB, setTextB] = useState(`The quick brown fox leaps over the lazy dog.
EverydayTools provides 80+ fast browser tools.
All operations run in client memory with privacy.`);
  const [diff, setDiff] = useState<Array<{ type: 'same' | 'add' | 'remove'; text: string }>>([]);

  const computeDiff = () => {
    trackToolUsed('diff-checker', 'textCode');
    const linesA = textA.split('\n');
    const linesB = textB.split('\n');
    const out: Array<{ type: 'same' | 'add' | 'remove'; text: string }> = [];

    const maxLen = Math.max(linesA.length, linesB.length);
    for (let i = 0; i < maxLen; i++) {
      const a = linesA[i];
      const b = linesB[i];
      if (a === b) {
        out.push({ type: 'same', text: a ?? '' });
      } else {
        if (a !== undefined) out.push({ type: 'remove', text: `- ${a}` });
        if (b !== undefined) out.push({ type: 'add', text: `+ ${b}` });
      }
    }
    setDiff(out);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Text Diff Checker']} />
        <PageTitle>Text Diff Checker</PageTitle>
        <PageSubtitle>Compare two text documents or code snippets to highlight line-by-line differences and modifications.</PageSubtitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Original Text</p>
            <textarea
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Changed Text</p>
            <textarea
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              rows={10}
              style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>
        </div>

        <button onClick={computeDiff} style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <GitCompare size={16} />
          Compare Differences
        </button>

        {diff.length > 0 && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Line Differences</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              {diff.map((d, idx) => (
                <div key={idx} style={{
                  color: d.type === 'add' ? '#10b981' : d.type === 'remove' ? '#ef4444' : 'var(--text-secondary)',
                  background: d.type === 'add' ? 'rgba(16, 185, 129, 0.1)' : d.type === 'remove' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                  padding: '2px 6px'
                }}>
                  {d.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="diff-checker" />
    </>
  );
}
