import { useState, useEffect, useRef } from 'react';

export default function CopyToast() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = () => {
      setVisible(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(false), 1800);
    };
    window.addEventListener('et:copied', handler);
    return () => {
      window.removeEventListener('et:copied', handler);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: 'fixed',
        bottom: 32,
        left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 10}px)`,
        opacity: visible ? 1 : 0,
        pointerEvents: 'none',
        transition: 'opacity 0.18s ease, transform 0.18s ease',
        zIndex: 9999,
        background: 'var(--text-primary)',
        color: 'var(--bg-surface)',
        padding: '10px 20px',
        borderRadius: 100,
        fontSize: 'var(--text-sm)',
        fontWeight: 500,
        fontFamily: 'var(--font-ui)',
        letterSpacing: '0.01em',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 20px rgba(0,0,0,0.18)',
      }}
    >
      <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
        <path d="M2 6.5L5 9.5L11 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Copied
    </div>
  );
}
