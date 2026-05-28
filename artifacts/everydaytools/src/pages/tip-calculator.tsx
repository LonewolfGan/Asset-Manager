import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';

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
  const s = n.toPrecision(4).replace(/\.?0+$/, '');
  return s;
}

export default function TipCalculator() {
  const { t } = useLocale();

  const [tab, setTab] = useState<'tip' | 'percent'>('tip');

  // Tip state
  const [bill, setBill] = useState('50');
  const [tipPercent, setTipPercent] = useState(20);
  const [people, setPeople] = useState(1);

  // Percentage calc state
  const [p1x, setP1x] = useState('20');
  const [p1y, setP1y] = useState('100');
  const [p2x, setP2x] = useState('20');
  const [p2y, setP2y] = useState('100');
  const [p3x, setP3x] = useState('100');
  const [p3y, setP3y] = useState('120');

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
      <ToolPageSEO slug="tip-calculator" />
      <div style={{ maxWidth: 'var(--content-tool)', margin: '0 auto', padding: '32px 24px 64px' }}>
        <Breadcrumb items={['Home', 'Calculators', t.tools['tip-calculator']?.title ?? 'Tip Calculator']} />

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
          {t.tools['tip-calculator']?.title}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', margin: '0 0 32px' }}>
          {t.tools['tip-calculator']?.description}
        </p>

        <AdSlot type="horizontal" />

        {/* Tab switcher */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28, borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden', width: 'fit-content' }}>
          {(['tip', 'percent'] as const).map((t_) => (
            <button
              key={t_}
              onClick={() => setTab(t_)}
              style={{
                padding: '9px 22px',
                background: tab === t_ ? 'var(--accent)' : 'transparent',
                color: tab === t_ ? 'var(--accent-text)' : 'var(--text-secondary)',
                border: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'background 120ms, color 120ms',
              }}
            >
              {t_ === 'tip' ? 'Tip Calculator' : 'Percentages'}
            </button>
          ))}
        </div>

        {/* ── TIP TAB ── */}
        {tab === 'tip' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            {/* Inputs */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
              {/* Bill amount */}
              <div>
                <label style={labelStyle}>Bill Amount</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: 15, fontFamily: 'var(--font-mono)' }}>$</span>
                  <input
                    type="number"
                    value={bill}
                    min="0"
                    step="0.01"
                    onChange={e => setBill(e.target.value)}
                    style={{ ...inputStyle, paddingLeft: 26 }}
                  />
                </div>
              </div>

              {/* Tip % slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Tip Percentage</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 600 }}>{tipPercent}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  step={1}
                  value={tipPercent}
                  onChange={e => setTipPercent(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', marginBottom: 12 }}
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  {QUICK_TIPS.map(p => (
                    <button
                      key={p}
                      onClick={() => setTipPercent(p)}
                      style={{
                        flex: 1,
                        padding: '6px 0',
                        background: tipPercent === p ? 'var(--accent)' : 'transparent',
                        color: tipPercent === p ? 'var(--accent-text)' : 'var(--text-secondary)',
                        border: '1px solid',
                        borderColor: tipPercent === p ? 'var(--accent)' : 'var(--border)',
                        borderRadius: 'var(--radius)',
                        fontFamily: 'var(--font-mono)',
                        fontSize: 13,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 120ms',
                      }}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>

              {/* People slider */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <label style={{ ...labelStyle, margin: 0 }}>Number of People</label>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)', fontWeight: 600 }}>{people}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={people}
                  onChange={e => setPeople(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)' }}
                />
              </div>
            </div>

            {/* Results */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-card)', padding: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={resultRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Bill</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)' }}>${fmt(numBill)}</span>
              </div>
              <div style={resultRowStyle}>
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Tip ({tipPercent}%)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, color: 'var(--text-primary)' }}>${fmt(tipAmount)}</span>
              </div>
              <div style={{ ...resultRowStyle, borderBottom: 'none', paddingBottom: 0 }}>
                <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--accent)' }}>${fmt(total)}</span>
              </div>

              {people > 1 && (
                <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Tip / person</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 15, color: 'var(--text-primary)' }}>${fmt(tipPerPerson)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)' }}>Total / person</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--accent)' }}>${fmt(perPerson)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PERCENT TAB ── */}
        {tab === 'percent' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* What is X% of Y? */}
            <PercentCard
              label="What is X% of Y?"
              result={`${fmtPct((parseFloat(p1x) || 0) * (parseFloat(p1y) || 0) / 100)}`}
            >
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>What is</span>
              <PctInput value={p1x} onChange={setP1x} w={64} suffix="%" />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>of</span>
              <PctInput value={p1y} onChange={setP1y} w={80} />
              <span style={{ color: 'var(--text-secondary)' }}>?</span>
            </PercentCard>

            {/* X is what % of Y? */}
            <PercentCard
              label="X is what % of Y?"
              result={`${fmtPct(((parseFloat(p2x) || 0) / (parseFloat(p2y) || 1)) * 100)}%`}
            >
              <PctInput value={p2x} onChange={setP2x} w={80} />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>is what % of</span>
              <PctInput value={p2y} onChange={setP2y} w={80} />
              <span style={{ color: 'var(--text-secondary)' }}>?</span>
            </PercentCard>

            {/* % change from X to Y */}
            <PercentCard
              label="% change from X to Y"
              result={
                pctChange === null
                  ? '—'
                  : `${pctChange > 0 ? '+' : ''}${fmtPct(pctChange)}%`
              }
              resultColor={
                pctChange === null ? undefined
                  : pctChange > 0 ? '#22c55e'
                  : pctChange < 0 ? '#ef4444'
                  : undefined
              }
            >
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>% change from</span>
              <PctInput value={p3x} onChange={setP3x} w={80} />
              <span style={{ color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>to</span>
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
        onChange={e => onChange(e.target.value)}
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

function PercentCard({
  label,
  children,
  result,
  resultColor,
}: {
  label: string;
  children: React.ReactNode;
  result: string;
  resultColor?: string;
}) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-card)',
      padding: '20px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap',
    }}>
      <span style={{
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
        marginRight: 4,
        flexShrink: 0,
        minWidth: 140,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', flex: 1 }}>
        {children}
      </div>
      <div style={{
        background: 'var(--bg-base)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px 18px',
        fontFamily: 'var(--font-mono)',
        fontSize: 18,
        fontWeight: 600,
        color: resultColor ?? 'var(--text-primary)',
        minWidth: 100,
        textAlign: 'right',
        flexShrink: 0,
      }}>
        {result}
      </div>
    </div>
  );
}
