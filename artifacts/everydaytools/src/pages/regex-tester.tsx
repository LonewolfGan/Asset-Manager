import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Regex, CheckCircle2 } from 'lucide-react';

export default function RegexTester() {
  const { t } = useLocale();
  const [pattern, setPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState(`Contact us at support@example.com or sales@enterprise.org for questions.`);
  const [replaceWith, setReplaceWith] = useState('[REDACTED_EMAIL]');

  let matches: string[] = [];
  let replaced = '';
  let isValid = true;
  let errorMsg = '';

  try {
    const re = new RegExp(pattern, flags);
    const found = testString.match(re);
    matches = found ? Array.from(found) : [];
    replaced = testString.replace(re, replaceWith);
  } catch (e) {
    isValid = false;
    errorMsg = e instanceof Error ? e.message : 'Invalid Regular Expression';
  }

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'Regex Tester']} />
        <PageTitle>Regular Expression (Regex) Tester</PageTitle>
        <PageSubtitle>Test and debug regular expressions with live pattern matching, flag configurations, group extractions, and string replacement.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Regular Expression</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', border: `1px solid ${isValid ? 'var(--border)' : '#ef4444'}`, borderRadius: 'var(--radius-md)', padding: '0 10px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>/</span>
                <input
                  type="text"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  style={{ flex: 1, padding: '10px 8px', border: 'none', background: 'transparent', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
                />
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-tertiary)' }}>/</span>
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  placeholder="gims"
                  style={{ width: 50, padding: '10px 4px', border: 'none', background: 'transparent', color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 600 }}
                />
              </div>
            </div>
          </div>

          {!isValid && (
            <p style={{ color: '#ef4444', fontSize: 'var(--text-xs)', margin: '8px 0 0' }}>{errorMsg}</p>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Test String</p>
            <textarea
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              rows={8}
              style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
            />
          </div>

          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: 0 }}>Matches Found ({matches.length})</p>
            </div>
            <div style={{ maxHeight: 200, overflowY: 'auto', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 10, border: '1px solid var(--border)' }}>
              {matches.length === 0 ? (
                <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--text-xs)', margin: 0 }}>No matches found</p>
              ) : (
                matches.map((m, idx) => (
                  <div key={idx} style={{ padding: '4px 8px', background: 'var(--accent-subtle)', color: 'var(--accent)', borderRadius: 4, fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', marginBottom: 4 }}>
                    #{idx + 1}: {m}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Substitution / Replacement</p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={replaceWith}
              onChange={(e) => setReplaceWith(e.target.value)}
              placeholder="Replacement text"
              style={{ flex: 1, padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}
            />
          </div>
          <textarea
            readOnly
            value={replaced}
            rows={4}
            style={{ width: '100%', padding: 10, borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)' }}
          />
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="regex-tester" />
    </>
  );
}
