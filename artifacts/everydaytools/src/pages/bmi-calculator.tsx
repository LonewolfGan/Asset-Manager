import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Activity } from 'lucide-react';

export default function BmiCalculator() {
  const { t } = useLocale();
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState('175');
  const [weightKg, setWeightKg] = useState('70');
  const [heightFt, setHeightFt] = useState('5');
  const [heightIn, setHeightIn] = useState('9');
  const [weightLbs, setWeightLbs] = useState('154');

  const calculateBmi = () => {
    trackToolUsed('bmi-calculator', 'calculators');
    let bmi = 0;
    if (unit === 'metric') {
      const hM = Number(heightCm) / 100;
      const wKg = Number(weightKg);
      if (hM > 0 && wKg > 0) bmi = wKg / (hM * hM);
    } else {
      const totalInches = Number(heightFt) * 12 + Number(heightIn);
      const wLbs = Number(weightLbs);
      if (totalInches > 0 && wLbs > 0) bmi = (wLbs / (totalInches * totalInches)) * 703;
    }

    if (bmi <= 0 || isNaN(bmi)) return null;

    let category = 'Normal weight';
    let color = '#10b981';
    if (bmi < 18.5) { category = 'Underweight'; color = '#3b82f6'; }
    else if (bmi < 25) { category = 'Normal weight'; color = '#10b981'; }
    else if (bmi < 30) { category = 'Overweight'; color = '#f59e0b'; }
    else { category = 'Obese'; color = '#ef4444'; }

    return { bmi: bmi.toFixed(1), category, color };
  };

  const result = calculateBmi();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'BMI Calculator']} />
        <PageTitle>Body Mass Index (BMI) Calculator</PageTitle>
        <PageSubtitle>Calculate your body mass index with Metric (cm/kg) or Imperial (ft/lbs) measurements and check WHO category ranges.</PageSubtitle>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
          <button onClick={() => setUnit('metric')}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${unit === 'metric' ? 'var(--accent)' : 'var(--border)'}`, background: unit === 'metric' ? 'var(--accent-subtle)' : 'var(--bg-surface)', color: unit === 'metric' ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
            Metric (cm, kg)
          </button>
          <button onClick={() => setUnit('imperial')}
            style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: `1px solid ${unit === 'imperial' ? 'var(--accent)' : 'var(--border)'}`, background: unit === 'imperial' ? 'var(--accent-subtle)' : 'var(--bg-surface)', color: unit === 'imperial' ? 'var(--accent)' : 'var(--text-primary)', fontWeight: 600, fontSize: 'var(--text-xs)', cursor: 'pointer' }}>
            Imperial (ft/in, lbs)
          </button>
        </div>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          {unit === 'metric' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Height (cm)</label>
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Weight (kg)</label>
                <input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Height (ft)</label>
                <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Height (in)</label>
                <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
              <div>
                <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Weight (lbs)</label>
                <input type="number" value={weightLbs} onChange={(e) => setWeightLbs(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)' }} />
              </div>
            </div>
          )}

          {result && (
            <div style={{ marginTop: 24, padding: 20, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Your Body Mass Index (BMI):</p>
                <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  {result.bmi} <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)' }}>kg/m²</span>
                </p>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', background: `${result.color}20`, border: `1px solid ${result.color}`, color: result.color, fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                {result.category}
              </div>
            </div>
          )}
        </div>

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="bmi-calculator" />
    </>
  );
}
