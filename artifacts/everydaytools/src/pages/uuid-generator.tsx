import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Fingerprint, Copy, RefreshCw, Check } from 'lucide-react';

export default function UuidGenerator() {
  const { t } = useLocale();
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    trackToolUsed('uuid-generator', 'textCode');
    const list: string[] = [];
    for (let i = 0; i < count; i++) {
      let id: string = crypto.randomUUID();
      if (!hyphens) id = id.replace(/-/g, '');
      if (uppercase) id = id.toUpperCase();
      list.push(id);
    }
    setUuids(list);
  };

  useState(() => { generate(); });

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Data & Code', 'UUID Generator']} />
        <PageTitle>UUID / GUID Generator (v4 Cryptographic)</PageTitle>
        <PageSubtitle>Generate bulk RFC 4122 compliant universally unique identifiers with customizable formatting.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 4 }}>Quantity</label>
              <select value={count} onChange={(e) => setCount(Number(e.target.value))}
                style={{ padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)' }}>
                <option value={1}>1 UUID</option>
                <option value={5}>5 UUIDs</option>
                <option value={10}>10 UUIDs</option>
                <option value={50}>50 UUIDs</option>
                <option value={100}>100 UUIDs</option>
              </select>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', cursor: 'pointer', marginTop: 18 }}>
              <input type="checkbox" checked={uppercase} onChange={(e) => setUppercase(e.target.checked)} />
              Uppercase
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-primary)', cursor: 'pointer', marginTop: 18 }}>
              <input type="checkbox" checked={hyphens} onChange={(e) => setHyphens(e.target.checked)} />
              Include Hyphens
            </label>

            <button onClick={generate} style={{ marginTop: 18, padding: '8px 16px', background: 'var(--accent)', color: 'var(--accent-text)', border: 'none', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-xs)', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={12} />
              Generate
            </button>
          </div>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)' }}>Generated Identifiers</span>
            <button onClick={copyAll} style={{ padding: '6px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-xs)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy All'}
            </button>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', background: 'var(--bg-elevated)', padding: 12, borderRadius: 'var(--radius-md)' }}>
            {uuids.map((id, idx) => (
              <div key={idx} style={{ padding: '4px 0', borderBottom: idx < uuids.length - 1 ? '1px solid var(--border)' : 'none', color: 'var(--text-primary)' }}>
                {id}
              </div>
            ))}
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="uuid-generator" />
    </>
  );
}
