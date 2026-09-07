import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { Landmark } from 'lucide-react';

export default function LoanCalculator() {
  const { t } = useLocale();
  const [amount, setAmount] = useState('200000');
  const [interestRate, setInterestRate] = useState('4.5');
  const [years, setYears] = useState('25');

  const calculateLoan = () => {
    trackToolUsed('loan-calculator', 'calculators');
    const p = parseFloat(amount);
    const r = parseFloat(interestRate) / 100 / 12;
    const n = parseFloat(years) * 12;

    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return null;

    const monthly = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthly * n;
    const totalInterest = totalPayment - p;

    return {
      monthly: monthly.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    };
  };

  const result = calculateLoan();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Calculators', 'Loan & Mortgage Calculator']} />
        <PageTitle>Loan & Mortgage Payment Calculator</PageTitle>
        <PageSubtitle>Compute monthly mortgage payments, total interest costs, and amortization summaries with fixed interest rates.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Loan Amount ($)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Interest Rate (% annual)</label>
              <input type="number" step="0.1" value={interestRate} onChange={(e) => setInterestRate(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>

            <div>
              <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Term (Years)</label>
              <input type="number" value={years} onChange={(e) => setYears(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontSize: 'var(--text-sm)', fontWeight: 600 }} />
            </div>
          </div>
        </div>

        {result && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Monthly Payment</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--accent)', margin: 0 }}>
                ${Number(result.monthly).toLocaleString()}
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Total Interest</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                ${Number(result.totalInterest).toLocaleString()}
              </p>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 20 }}>
              <p style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', margin: '0 0 8px' }}>Total Payment</p>
              <p style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                ${Number(result.totalPayment).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="loan-calculator" />
    </>
  );
}
