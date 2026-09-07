import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Zap } from 'lucide-react';

export default function ElectricityCalculator() {
  const { t } = useLocale();
  const [watts, setWatts] = useState('1500');
  const [hoursPerDay, setHoursPerDay] = useState('4');
  const [costPerKwh, setCostPerKwh] = useState('0.15');

  const calculateCost = () => {
    trackToolUsed('electricity-calculator', 'calculators');
    const w = parseFloat(watts);
    const h = parseFloat(hoursPerDay);
    const rate = parseFloat(costPerKwh);

    if (isNaN(w) || isNaN(h) || isNaN(rate) || w <= 0 || h <= 0 || rate <= 0) return null;

    const dailyKwh = (w * h) / 1000;
    const dailyCost = dailyKwh * rate;
    const monthlyCost = dailyCost * 30.42;
    const yearlyCost = dailyCost * 365;

    return {
      dailyKwh: dailyKwh.toFixed(2),
      dailyCost: dailyCost.toFixed(2),
      monthlyCost: monthlyCost.toFixed(2),
      yearlyCost: yearlyCost.toFixed(2),
    };
  };

  const result = calculateCost();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Electricity Cost Calculator']} />
        <PageTitle>Electricity & Appliance Cost Calculator</PageTitle>
        <PageSubtitle>Estimate energy consumption in kilowatt-hours (kWh) and calculate daily, monthly, and yearly electricity costs.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Power (Watts)</label>
              <input type="number" value={watts} onChange={(e) => setWatts(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Hours Used per Day</label>
              <input type="number" step="0.5" value={hoursPerDay} onChange={(e) => setHoursPerDay(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Cost per kWh ($ / €)</label>
              <input type="number" step="0.01" value={costPerKwh} onChange={(e) => setCostPerKwh(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>
          </div>
        </div>

        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Daily Cost</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                ${result.dailyCost} <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>({result.dailyKwh} kWh)</span>
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Monthly Cost</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>
                ${result.monthlyCost}
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Annual Cost</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                ${result.yearlyCost}
              </p>
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="electricity-calculator" />
    </>
  );
}
