import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import { useLocale } from '@/hooks/use-locale';
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
  fontSize: 15,
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  fontSize: 12,
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
      <Helmet>
        <title>Tip &amp; Percentage Calculator — Free | EverydayTools Hub</title>
        <meta name="description" content="Calculate tip amounts, split bills between people, and work out percentage changes — free, instant, no signup required." />
      </Helmet>
      <div style={{ maxWidth: 'var(--content-tool)', margin: '0 auto', padding: '32px 24px 64px' }}>
        <Breadcrumb items={['Home', 'Calculators', 'Tip Calculator']} />

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          {t.tools['tip-calculator']?.title}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 32px' }}>
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
                fontSize: 13,
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <label htmlFor="tip-bill" style={labelStyle}>{tc.billAmount}</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 15, fontFamily: 'var(--font-mono)' }}>$</span>
                  <input id="tip-bill" type="number" value={bill} min="0" step="0.01" onChange={e => { setBill(e.target.value); handleCalculate(); }} style={{ ...inputStyle, paddingLeft: 26 }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label htmlFor="tip-pct" style={{ ...labelStyle, margin: 0 }}>{tc.tipPct}</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 600 }}>{tipPercent}%</span>
                </div>
                <input id="tip-pct" type="range" min={0} max={50} step={1} value={tipPercent} onChange={e => { setTipPercent(Number(e.target.value)); handleCalculate(); }} style={{ width: '100%', marginBottom: 12 }} />
                <div style={{ display: 'flex', gap: 6 }}>
                  {QUICK_TIPS.map(p => (
                    <button key={p} onClick={() => { setTipPercent(p); handleCalculate(); }} style={{
                      flex: 1, padding: '6px 0',
                      background: tipPercent === p ? 'var(--accent)' : 'transparent',
                      color: tipPercent === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                      border: '1px solid', borderColor: tipPercent === p ? 'var(--accent)' : 'var(--border)',
                      borderRadius: 'var(--radius)', fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 120ms',
                    }}>{p}%</button>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label htmlFor="tip-people" style={{ ...labelStyle, margin: 0 }}>{tc.numPeople}</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 600 }}>{people}</span>
                </div>
                <input id="tip-people" type="range" min={1} max={20} step={1} value={people} onChange={e => { setPeople(Number(e.target.value)); handleCalculate(); }} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={resultRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{tc.bill}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)' }}>${fmt(numBill)}</span>
              </div>
              <div style={resultRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{tc.tip(tipPercent)}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)' }}>${fmt(tipAmount)}</span>
              </div>
              <div style={{ ...resultRowStyle, borderBottom: 'none', paddingBottom: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>{tc.total}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>${fmt(total)}</span>
              </div>

              {people > 1 && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{tc.tipPerPerson}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)' }}>${fmt(tipPerPerson)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>{tc.totalPerPerson}</span>
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
          fontSize: 14,
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      {suffix && (
        <span style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 13 }}>
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
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginRight: 4, flexShrink: 0, minWidth: 140 }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
        {children}
      </div>
      <div style={{
        background: 'var(--bg-base)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        padding: '8px 18px', fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600,
        color: resultColor ?? 'var(--text-primary)', minWidth: 100, textAlign: 'right', flexShrink: 0,
      }}>
        {result}
      </div>
    </div>
  );
}
