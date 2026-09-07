import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Calendar, Cake, Clock } from 'lucide-react';

export default function AgeCalculator() {
  const { t } = useLocale();
  const [birthDate, setBirthDate] = useState('1995-06-15');

  const calculateAge = () => {
    trackToolUsed('age-calculator', 'calculators');
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime()) || birth > now) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }

    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilBday = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalHours, daysUntilBday };
  };

  const age = calculateAge();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Age Calculator']} />
        <PageTitle>Exact Age Calculator</PageTitle>
        <PageSubtitle>Calculate your exact chronological age in years, months, days, hours, and find your next birthday countdown.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Date of Birth</label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            style={{ padding: '10px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
          />
        </div>

        {age && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Exact Age</p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--accent)', margin: 0 }}>
                {age.years} yrs, {age.months} mos, {age.days} days
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Next Birthday In</p>
              <p style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)', margin: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Cake size={20} color="var(--accent)" />
                {age.daysUntilBday} days
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Total Lived</p>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)', margin: 0 }}>
                {age.totalDays.toLocaleString()} days · {age.totalHours.toLocaleString()} hours
              </p>
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="age-calculator" />
    </>
  );
}
