import { useState, useEffect } from 'react';
import { hasConsent, setConsent, resetConsent } from '@/lib/consent';
import { useLocale } from '@/hooks/use-locale';

export default function CookieBanner() {
  const { t } = useLocale();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!hasConsent()) setVisible(true);
    setMounted(true);

    const show = () => {
      resetConsent();
      setVisible(true);
    };
    window.addEventListener('et:show-consent', show);
    return () => window.removeEventListener('et:show-consent', show);
  }, []);

  if (!mounted || !visible) return null;

  const accept = () => { setConsent(true, true); setVisible(false); };
  const reject = () => { setConsent(false, false); setVisible(false); };

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        zIndex: 9999,
        background: 'var(--bg-surface)',
        borderTop: '1px solid var(--border)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, maxWidth: 680 }}>
        {t.cookie.message}{' '}
        <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{t.cookie.neverUploaded}</strong>
        {' — '}
        <a href="/privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'underline' }}>
          {t.cookie.privacyPolicy}
        </a>
      </p>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button
          onClick={reject}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {t.cookie.essentialOnly}
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 16px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius)',
            color: 'var(--accent-text)',
            fontFamily: 'var(--font-ui)',
            fontSize: 13,
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {t.cookie.acceptAll}
        </button>
      </div>
    </div>
  );
}
