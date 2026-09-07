import { useState } from 'react';
import AdSlot from '@/components/AdSlot';
import Breadcrumb from '@/components/Breadcrumb';
import ToolPageSEO from '@/components/ToolPageSEO';
import { useLocale } from '@/hooks/use-locale';
import { trackToolUsed } from '@/lib/analytics';
import { PageTitle, PageSubtitle } from '@/components/Typography';
import { ShieldCheck, ShieldAlert, Check, X } from 'lucide-react';

export default function PasswordStrength() {
  const { t } = useLocale();
  const [password, setPassword] = useState('');

  const evaluateStrength = () => {
    trackToolUsed('password-strength', 'calculators');
    if (!password) return null;

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const length = password.length;

    let pool = 0;
    if (hasLower) pool += 26;
    if (hasUpper) pool += 26;
    if (hasNumber) pool += 10;
    if (hasSpecial) pool += 33;

    const entropy = pool > 0 ? Math.round(length * Math.log2(pool)) : 0;

    let level = 'Very Weak';
    let color = '#ef4444';
    let timeToCrack = 'Instant';

    if (entropy > 80 && length >= 12) {
      level = 'Very Strong';
      color = '#10b981';
      timeToCrack = 'Centuries';
    } else if (entropy > 60 && length >= 10) {
      level = 'Strong';
      color = '#10b981';
      timeToCrack = 'Several Years';
    } else if (entropy > 40 && length >= 8) {
      level = 'Fair';
      color = '#f59e0b';
      timeToCrack = 'A few days';
    } else {
      timeToCrack = 'Few minutes or seconds';
    }

    return {
      entropy,
      level,
      color,
      timeToCrack,
      checks: [
        { label: 'At least 12 characters', pass: length >= 12 },
        { label: 'Uppercase letters (A-Z)', pass: hasUpper },
        { label: 'Lowercase letters (a-z)', pass: hasLower },
        { label: 'Numbers (0-9)', pass: hasNumber },
        { label: 'Special symbols (!@#$%...)', pass: hasSpecial },
      ]
    };
  };

  const evalResult = evaluateStrength();

  return (
    <>
      <div className="container-wide" style={{ paddingTop: 24, paddingBottom: 80 }}>
        <Breadcrumb items={['Home', 'Security & Privacy', 'Password Strength Checker']} />
        <PageTitle>Password Strength & Entropy Checker</PageTitle>
        <PageSubtitle>Test password resistance against brute-force attacks and evaluate information entropy in bits in real-time.</PageSubtitle>

        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginBottom: 20 }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Enter Password to Test</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Type a password..."
            style={{ width: '100%', padding: '12px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', fontWeight: 600 }}
          />
        </div>

        {evalResult && (
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 4px' }}>Security Rating</p>
                <p style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: evalResult.color, margin: 0 }}>
                  {evalResult.level} ({evalResult.entropy} bits of entropy)
                </p>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                Estimated crack time: <strong style={{ color: 'var(--text-primary)' }}>{evalResult.timeToCrack}</strong>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 16 }}>
              {evalResult.checks.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 'var(--text-xs)', color: c.pass ? '#10b981' : 'var(--text-tertiary)' }}>
                  {c.pass ? <Check size={14} /> : <X size={14} />}
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <AdSlot type="horizontal" />
      </div>
      <ToolPageSEO internalSlug="password-strength" />
    </>
  );
}
