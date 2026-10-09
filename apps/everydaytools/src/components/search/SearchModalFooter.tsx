import React from 'react';

const kbdStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 18,
  height: 18,
  padding: '0 4px',
  background: 'var(--bg-elevated)',
  border: '1px solid var(--border-strong)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 10,
  fontFamily: 'var(--font-mono)',
  color: 'var(--text-secondary)',
  lineHeight: 1,
};

export const SearchModalFooter: React.FC<{ locale: string }> = ({ locale }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '8px 16px',
        borderTop: '1px solid var(--border)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-tertiary)',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <kbd style={kbdStyle}>↑</kbd>
        <kbd style={kbdStyle}>↓</kbd>
        {locale === 'FR' ? 'naviguer' : 'navigate'}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <kbd style={kbdStyle}>↵</kbd>
        {locale === 'FR' ? 'ouvrir' : 'open'}
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <kbd style={kbdStyle}>ESC</kbd>
        {locale === 'FR' ? 'fermer' : 'close'}
      </span>
    </div>
  );
};
