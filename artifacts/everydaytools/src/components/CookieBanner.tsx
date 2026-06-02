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
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        width: 'calc(100% - 32px)',
        maxWidth: 780,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        flexWrap: 'wrap',
        fontFamily: 'var(--font-ui)',
      }}
    >
      <p style={{
        margin: 0,
        flex: 1,
        fontSize: 'var(--text-sm)',
        color: 'var(--text-secondary)',
        lineHeight: 1.5,
        minWidth: 200,
      }}>
        {t.cookie.message}{' '}
        <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{t.cookie.neverUploaded}</strong>
        {' — '}
        <a
          href="/privacy"
          style={{
            color: 'var(--text-primary)',
            textDecoration: 'underline',
            fontWeight: 500,
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
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
            borderRadius: 'var(--radius-btn)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--text-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {t.cookie.essentialOnly}
        </button>
        <button
          onClick={accept}
          style={{
            padding: '8px 18px',
            background: 'var(--accent)',
            border: 'none',
            borderRadius: 'var(--radius-btn)',
            color: '#1A1916',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          {t.cookie.acceptAll}
        </button>
      </div>
    </div>
  );
}
