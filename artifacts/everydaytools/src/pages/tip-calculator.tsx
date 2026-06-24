import { useState } from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { useIsMobile } from '@/hooks/use-mobile';
import { trackToolUsed } from '@/lib/analytics';

const QUICK_TIPS = [15, 18, 20, 25];

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 12px',
  background: 'var(--bg-base)',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius)',
  color: 'var(--text-primary)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-sm)',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 'var(--text-xs)',
  fontWeight: 600,
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--text-tertiary)',
  marginBottom: 6,
  display: 'block',
};

const resultRowStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '14px 0',
  borderBottom: '1px solid var(--border)',
};

function fmt(n: number) {
  return n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtPct(n: number) {
  return n.toPrecision(4).replace(/\.?0+$/, '');
}

export default function TipCalculator() {
  const { t } = useLocale();
  const isMobile = useIsMobile();
  const tc = t.tipCalc;

  const [tab, setTab] = useState<'tip' | 'percent'>('tip');

  const [bill, setBill] = useState('50');
  const [tipPercent, setTipPercent] = useState(20);
  const [people, setPeople] = useState(1);

  const [p1x, setP1x] = useState('20');
  const [p1y, setP1y] = useState('100');
  const [p2x, setP2x] = useState('20');
  const [p2y, setP2y] = useState('100');
  const [p3x, setP3x] = useState('100');
  const [p3y, setP3y] = useState('120');

  const handleCalculate = () => {
    trackToolUsed('tip-calculator', 'calculators');
  };
  const [copied, setCopied] = useState(false);
  const copyTotal = () => {
    navigator.clipboard.writeText(`$${fmt(total)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const numBill = parseFloat(bill) || 0;
  const tipAmount = numBill * (tipPercent / 100);
  const total = numBill + tipAmount;
  const perPerson = people > 0 ? total / people : 0;
  const tipPerPerson = people > 0 ? tipAmount / people : 0;

  const pctChange = (() => {
    const v1 = parseFloat(p3x);
    const v2 = parseFloat(p3y);
    if (!v1) return null;
    return ((v2 - v1) / v1) * 100;
  })();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Tip Calculator']} />

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          {t.tools['tip-calculator']?.title}
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: '0 0 32px' }}>
          {t.tools['tip-calculator']?.description}
        </p>

        <AdSlot type="horizontal" />

        <div style={{ display: 'flex', gap: 0, marginBottom: 28, marginTop: 24, borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', width: 'fit-content' }}>
          {(['tip', 'percent'] as const).map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => setTab(tabKey)}
              style={{
                padding: '9px 22px',
                background: tab === tabKey ? 'var(--accent)' : 'transparent',
                color: tab === tabKey ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 'var(--text-sm)',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 120ms, color 120ms',
              }}
            >
              {tabKey === 'tip' ? tc.tabTip : tc.tabPercent}
            </button>
          ))}
        </div>

        {tab === 'tip' && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label htmlFor="tip-bill" style={labelStyle}>{tc.billAmount}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)' }}>$</span>
                  <input id="tip-bill" type="number" value={bill} min="0" step="0.01" onChange={e => { setBill(e.target.value); handleCalculate(); }} style={{ ...inputStyle, paddingLeft: 26 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label htmlFor="tip-pct" style={{ ...labelStyle, margin: 0 }}>{tc.tipPct}</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{tipPercent}%</span>
                </div>
                <input id="tip-pct" type="range" min={0} max={50} step={1} value={tipPercent} onChange={e => { setTipPercent(Number(e.target.value)); handleCalculate(); }} style={{ width: '100%', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  {QUICK_TIPS.map(p => (
                    <button key={p} onClick={() => { setTipPercent(p); handleCalculate(); }} style={{
                      flex: 1, padding: '6px 0',
                      background: tipPercent === p ? 'var(--accent)' : 'transparent',
                      color: tipPercent === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: '1px solid', borderColor: tipPercent === p ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 500, cursor: 'pointer', transition: 'all 120ms',
                    }}>{p}%</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label htmlFor="tip-people" style={{ ...labelStyle, margin: 0 }}>{tc.numPeople}</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 600 }}>{people}</span>
                </div>
                <input id="tip-people" type="range" min={1} max={20} step={1} value={people} onChange={e => { setPeople(Number(e.target.value)); handleCalculate(); }} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={resultRowStyle}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tc.bill}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>${fmt(numBill)}</span>
              </div>
              <div style={resultRowStyle}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tc.tip(tipPercent)}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', color: 'var(--text-primary)' }}>${fmt(tipAmount)}</span>
              </div>
              <div style={{ ...resultRowStyle, borderBottom: 'none', paddingBottom: 0 }}>
                <span style={{ fontSize: 'var(--text-base)', fontWeight: 600, color: 'var(--text-primary)' }}>{tc.total}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    className="result-copyable"
                    tabIndex={0}
                    role="button"
                    aria-label={`$${fmt(total)} — press Enter or Ctrl+C to copy`}
                    onClick={copyTotal}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ' || ((e.ctrlKey || e.metaKey) && e.key === 'c')) { e.preventDefault(); copyTotal(); } }}
                    style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}
                  >${fmt(total)}</span>
                  <button
                    onClick={copyTotal}
                    aria-label="Copy total"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', background: 'none', border: '1px solid var(--border)', borderRadius: 10, fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: copied ? 'var(--accent)' : 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0, transition: 'border-color 150ms, color 150ms' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.color = copied ? 'var(--accent)' : 'var(--text-secondary)'; }}
                  >
                    {copied ? <CheckCircle2 size={11} /> : <Copy size={11} />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </div>

              {people > 1 && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>{tc.tipPerPerson}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)' }}>${fmt(tipPerPerson)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>{tc.totalPerPerson}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>${fmt(perPerson)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === 'percent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <PercentCard label={tc.pctOf} result={`${fmtPct((parseFloat(p1x) || 0) * (parseFloat(p1y) || 0) / 100)}`}>
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{tc.whatIs}</span>
              <PctInput value={p1x} onChange={setP1x} w={64} suffix="%" />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{tc.isWhatPctOf.replace('is what % of', 'of')}</span>
              <PctInput value={p1y} onChange={setP1y} w={80} />
              <span style={{ color: 'var(--text-secondary)' }}>?</span>
            </PercentCard>

            <PercentCard label={tc.pctOf.replace('What is X% of Y?', 'X is what % of Y?')} result={`${fmtPct(((parseFloat(p2x) || 0) / (parseFloat(p2y) || 1)) * 100)}%`}>
              <PctInput value={p2x} onChange={setP2x} w={80} />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{tc.isWhatPctOf}</span>
              <PctInput value={p2y} onChange={setP2y} w={80} />
              <span style={{ color: 'var(--text-secondary)' }}>?</span>
            </PercentCard>

            <PercentCard
              label={tc.pctChange}
              result={pctChange === null ? '—' : `${pctChange > 0 ? '+' : ''}${fmtPct(pctChange)}%`}
              resultColor={pctChange === null ? undefined : pctChange > 0 ? 'var(--success)' : pctChange < 0 ? 'var(--danger)' : undefined}
            >
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{tc.pctChangeFrom}</span>
              <PctInput value={p3x} onChange={setP3x} w={80} />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{tc.pctChangeTo}</span>
              <PctInput value={p3y} onChange={setP3y} w={80} />
            </PercentCard>
          </div>
        )}

        <div style={{ marginTop: 40 }}><AdSlot type="horizontal" /></div>
      </div>
      <ToolPageSEO internalSlug="tip-calculator" />
    </>
  );

}

function PctInput({ value, onChange, w, suffix }: { value: string; onChange: (v: string) => void; w: number; suffix?: string }) {
  return (
    <div style={{ position: 'relative', width: w, flexShrink: 0 }}>
      <input
        type="number"
        value={value}
        onChange={e => { onChange(e.target.value); trackToolUsed('tip-calculator', 'calculators'); }}
        style={{
          width: '100%',
          padding: suffix ? '8px 20px 8px 10px' : '8px 10px',
          background: 'var(--bg-base)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-sm)',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 'var(--text-sm)' }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

function PercentCard({ label, children, result, resultColor }: {
  label: string; children: React.ReactNode; result: string; resultColor?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)',
      padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginRight: 4, flexShrink: 0, minWidth: 140 }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
        {children}
      </div>
      <div style={{
        background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '8px 18px', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-lg)', fontWeight: 600,
        color: resultColor ?? 'var(--text-primary)', minWidth: 100, textAlign: 'right', flexShrink: 0,
      }}>
        {result}
      </div>
    </div>
  );
}
