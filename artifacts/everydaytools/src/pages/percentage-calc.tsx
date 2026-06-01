import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackToolUsed } from '@/lib/analytics';

type TabId = 'of' | 'isWhat' | 'change' | 'discount' | 'tip' | 'markup';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: 10,
  border: '1px solid var(--border)', borderRadius: 'var(--radius)',
  background: 'var(--bg-base)', color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', outline: 'none', boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block', marginBottom: 8,
  fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase',
  color: 'var(--text-tertiary)',
};

export default function PercentageCalc() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const pc = t.pctCalc;
  const [tab, setTab] = useState<TabId>('of');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [n, setN] = useState('1');
  const [copied, setCopied] = useState(false);
  const copyResult = (val: string) => {
    if (val === '—') return;
    navigator.clipboard.writeText(val);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const vx = parseFloat(x);
  const vy = parseFloat(y);
  const vn = parseFloat(n);

  const getResult = (): string => {
    if (isNaN(vx) || isNaN(vy)) return '—';
    trackToolUsed('percentage-calc', 'calculators');
    switch (tab) {
      case 'of':
        return `${(vx / 100) * vy}`;
      case 'isWhat':
        return `${(vx / vy) * 100}%`;
      case 'change': {
        const change = ((vy - vx) / vx) * 100;
        return `${Math.abs(change).toFixed(2)}% ${change >= 0 ? pc.increase : pc.decrease}`;
      }
      case 'discount': {
        const final = vy * (1 - vx / 100);
        const saved = vy * (vx / 100);
        return `${pc.finalPrice}: ${final.toFixed(2)} (${pc.saved}: ${saved.toFixed(2)})`;
      }
      case 'tip': {
        if (isNaN(vn) || vn < 1) return '—';
        const tip = vy * (vx / 100);
        const total = vy + tip;
        const perPerson = total / vn;
        return `${pc.perPerson}: ${perPerson.toFixed(2)} · ${pc.tipLabel}: ${tip.toFixed(2)}`;
      }
      case 'markup': {
        const selling = vy / (1 - vx / 100);
        const markup = selling - vy;
        return `${pc.sellingPrice}: ${selling.toFixed(2)} (${pc.markupLabel}: ${markup.toFixed(2)})`;
      }
      default: return '—';
    }
  };

  const TABS: { id: TabId; label: string }[] = [
    { id: 'of',       label: pc.tabs.of },
    { id: 'isWhat',   label: pc.tabs.isWhat },
    { id: 'change',   label: pc.tabs.change },
    { id: 'discount', label: pc.tabs.discount },
    { id: 'tip',      label: pc.tabs.tip },
    { id: 'markup',   label: pc.tabs.markup },
  ];

  const reset = (id: TabId) => { setTab(id); setX(''); setY(''); };

  return (
    <>
      <div style={{ maxWidth: 'var(--content-wide)', margin: '0 auto', padding: '32px 24px 80px' }}>
        <Breadcrumb items={['Home', 'Calculators', 'Percentage Calculator']} />
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          {t.tools['percentage-calc']?.title ?? 'Percentage Calculator'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)' }}>
          {t.tools['percentage-calc']?.description ?? 'Instantly calculate percentages, discounts, tips, and margins.'}
        </p>

        {/* Tab switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {TABS.map(tb => (
            <button
              key={tb.id}
              onClick={() => reset(tb.id)}
              style={{
                padding: '8px 16px',
                background: tab === tb.id ? 'var(--accent)' : 'transparent',
                color: tab === tb.id ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: '1px solid var(--border)', borderRadius: 'var(--radius)',
                cursor: 'pointer', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-ui)', fontWeight: 500,
                transition: 'background 120ms, color 120ms',
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Input panel */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 24, marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 24 }}>
            {tab === 'of' && (<>
              <div><label htmlFor="pct-x" style={labelStyle}>{pc.labels.whatIsPct}</label><input id="pct-x" type="number" value={x} onChange={e => setX(e.target.value)} style={inputStyle} /></div>
              <div><label htmlFor="pct-y" style={labelStyle}>{pc.labels.ofY}</label><input id="pct-y" type="number" value={y} onChange={e => setY(e.target.value)} style={inputStyle} /></div>
            </>)}
            {tab === 'isWhat' && (<>
              <div><label htmlFor="pct-x" style={labelStyle}>{pc.labels.xIsWhat}</label><input id="pct-x" type="number" value={x} onChange={e => setX(e.target.value)} style={inputStyle} /></div>
              <div><label htmlFor="pct-y" style={labelStyle}>{pc.labels.ofY}</label><input id="pct-y" type="number" value={y} onChange={e => setY(e.target.value)} style={inputStyle} /></div>
            </>)}
            {tab === 'change' && (<>
              <div><label htmlFor="pct-x" style={labelStyle}>{pc.labels.changeFrom}</label><input id="pct-x" type="number" value={x} onChange={e => setX(e.target.value)} style={inputStyle} /></div>
              <div><label htmlFor="pct-y" style={labelStyle}>{pc.labels.changeTo}</label><input id="pct-y" type="number" value={y} onChange={e => setY(e.target.value)} style={inputStyle} /></div>
            </>)}
            {tab === 'discount' && (<>
              <div><label htmlFor="pct-x" style={labelStyle}>{pc.labels.discountPct}</label><input id="pct-x" type="number" value={x} onChange={e => setX(e.target.value)} style={inputStyle} /></div>
              <div><label htmlFor="pct-y" style={labelStyle}>{pc.labels.origPrice}</label><input id="pct-y" type="number" value={y} onChange={e => setY(e.target.value)} style={inputStyle} /></div>
            </>)}
            {tab === 'tip' && (<>
              <div><label htmlFor="pct-x" style={labelStyle}>{pc.labels.tipPct}</label><input id="pct-x" type="number" value={x} onChange={e => setX(e.target.value)} style={inputStyle} /></div>
              <div><label htmlFor="pct-y" style={labelStyle}>{pc.labels.billAmount}</label><input id="pct-y" type="number" value={y} onChange={e => setY(e.target.value)} style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="pct-n" style={labelStyle}>{pc.labels.splitBetween}</label>
                <input id="pct-n" type="number" value={n} onChange={e => setN(e.target.value)} style={inputStyle} />
              </div>
            </>)}
            {tab === 'markup' && (<>
              <div><label htmlFor="pct-x" style={labelStyle}>{pc.labels.marginPct}</label><input id="pct-x" type="number" value={x} onChange={e => setX(e.target.value)} style={inputStyle} /></div>
              <div><label htmlFor="pct-y" style={labelStyle}>{pc.labels.cost}</label><input id="pct-y" type="number" value={y} onChange={e => setY(e.target.value)} style={inputStyle} /></div>
            </>)}
          </div>

          <div style={{ background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 10 }}>
              {pc.result}
            </div>
            <div style={{ fontSize: 32, fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>
              {getResult()}
            </div>
            {getResult() !== '—' && (
              <button
                onClick={() => copyResult(getResult())}
                aria-label="Copy result"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 14px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', transition: 'border-color 150ms, color 150ms' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = copied ? 'var(--accent)' : 'var(--text-secondary)'; }}
              >
                {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                {copied ? 'Copied' : 'Copy result'}
              </button>
            )}
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="percentage-calc" />
    </>
  );
}
