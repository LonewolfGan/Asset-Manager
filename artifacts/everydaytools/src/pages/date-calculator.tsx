import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { CalendarDays, ArrowRight } from 'lucide-react';

export default function DateCalculator() {
  const { t } = useLocale();
  const [mode, setMode] = useState<'diff' | 'add'>('diff');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [addDays, setAddDays] = useState(45);

  const calculateDiff = () => {
    trackToolUsed('date-calculator', 'calculators');
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    const weeks = (diffDays / 7).toFixed(1);
    return { diffDays, weeks };
  };

  const calculateAdd = () => {
    trackToolUsed('date-calculator', 'calculators');
    const d = new Date(startDate);
    if (isNaN(d.getTime())) return null;
    d.setDate(d.getDate() + Number(addDays));
    return d.toISOString().split('T')[0];
  };

  const diffResult = calculateDiff();
  const addResult = calculateAdd();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Date Calculator']} />
        <PageTitle>Date Difference & Duration Calculator</PageTitle>
        <PageSubtitle>Calculate elapsed days between two calendar dates or project a future date by adding/subtracting days.</PageSubtitle>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setMode('diff')}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${mode === 'diff' ? 'var(--accent)' : 'var(--border)'}`, background: mode === 'diff' ? 'var(--accent-subtle)' : 'var(--bg-surface)', color: mode === 'diff' ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
            Date Difference
          </button>
          <button onClick={() => setMode('add')}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${mode === 'add' ? 'var(--accent)' : 'var(--border)'}`, background: mode === 'add' ? 'var(--accent-subtle)' : 'var(--bg-surface)', color: mode === 'add' ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
            Add / Subtract Days
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          {mode === 'diff' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Days to Add / Subtract</label>
                <input type="number" value={addDays} onChange={(e) => setAddDays(Number(e.target.value))}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, padding: 16, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Result:</p>
            {mode === 'diff' && diffResult && (
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
                {diffResult.diffDays} days ({diffResult.weeks} weeks)
              </p>
            )}
            {mode === 'add' && addResult && (
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
                {addResult}
              </p>
            )}
          </div>
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="date-calculator" />
    </>
  );
}
