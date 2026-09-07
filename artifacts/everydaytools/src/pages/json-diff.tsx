import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { GitCompare, CheckCircle, AlertCircle } from 'lucide-react';

export default function JsonDiff() {
  const { t } = useLocale();
  const [jsonLeft, setJsonLeft] = useState(`{
  "name": "EverydayTools",
  "version": "1.0.0",
  "features": ["conversion", "privacy", "calculators"],
  "enabled": true
}`);
  const [jsonRight, setJsonRight] = useState(`{
  "name": "EverydayTools Hub",
  "version": "1.1.0",
  "features": ["conversion", "privacy", "calculators", "ocr"],
  "enabled": true,
  "theme": "dark"
}`);
  const [diffLines, setDiffLines] = useState<Array<{ type: 'same' | 'add' | 'remove'; text: string }>>([]);
  const [error, setError] = useState('');

  const compare = () => {
    setError('');
    trackToolUsed('json-diff', 'textCode');
    try {
      const objL = JSON.parse(jsonLeft);
      const objR = JSON.parse(jsonRight);
      const strL = JSON.stringify(objL, null, 2).split('\n');
      const strR = JSON.stringify(objR, null, 2).split('\n');

      const lines: Array<{ type: 'same' | 'add' | 'remove'; text: string }> = [];
      const setR = new Set(strR);
      const setL = new Set(strL);

      strL.forEach(l => {
        if (setR.has(l)) {
          lines.push({ type: 'same', text: l });
        } else {
          lines.push({ type: 'remove', text: `- ${l}` });
        }
      });
      strR.forEach(r => {
        if (!setL.has(r)) {
          lines.push({ type: 'add', text: `+ ${r}` });
        }
      });

      setDiffLines(lines);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid JSON input');
    }
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'JSON Diff & Comparator']} />
        <PageTitle>JSON Diff & Validator</PageTitle>
        <PageSubtitle>Compare two JSON payloads side-by-side to easily spot additions, deletions, and structural changes.</PageSubtitle>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Original JSON</p>
            <textarea
              value={jsonLeft}
              onChange={(e) => setJsonLeft(e.target.value)}
              rows={12}
              style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Modified JSON</p>
            <textarea
              value={jsonRight}
              onChange={(e) => setJsonRight(e.target.value)}
              rows={12}
              style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>
        </div>

        <button onClick={compare} style={{ width: '100%', padding: '12px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          <GitCompare size={16} />
          Compare JSONs
        </button>

        {error && (
          <div style={{ padding: 12, background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', marginBottom: 16 }}>
            {error}
          </div>
        )}

        {diffLines.length > 0 && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>Diff Comparison</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-md)', overflowX: 'auto' }}>
              {diffLines.map((dl, idx) => (
                <div key={idx} style={{
                  color: dl.type === 'add' ? '#10b981' : dl.type === 'remove' ? '#ef4444' : 'var(--text-secondary)',
                  background: dl.type === 'add' ? 'rgba(16, 185, 129, 0.1)' : dl.type === 'remove' ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                  padding: '2px 6px',
                  whiteSpace: 'pre-wrap'
                }}>
                  {dl.text}
                </div>
              ))}
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="json-diff" />
    </>
  );
}
