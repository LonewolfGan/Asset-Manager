import type React from 'react';

export const S = {
  page: {
    paddingTop: 48,
    paddingBottom: 80,
    fontFamily: 'var(--font-ui)',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 'var(--text-3xl)',
    fontWeight: 400,
    margin: '0 0 8px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  date: {
    fontSize: 'var(--text-sm)',
    color: 'var(--text-tertiary)',
    margin: '0 0 48px',
  } as React.CSSProperties,
  section: {
    marginBottom: 40,
  } as React.CSSProperties,
  h2: {
    fontSize: 'var(--text-lg)',
    fontWeight: 600,
    margin: '0 0 12px',
    color: 'var(--text-primary)',
  } as React.CSSProperties,
  p: {
    margin: '0 0 12px',
    fontSize: 'var(--text-sm)',
    lineHeight: 1.7,
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  ul: {
    margin: '0 0 12px',
    paddingLeft: 20,
    fontSize: 'var(--text-sm)',
    lineHeight: 1.8,
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
  li: {
    marginBottom: 8,
  } as React.CSSProperties,
  divider: {
    border: 'none',
    borderTop: '1px solid var(--border)',
    margin: '40px 0',
  } as React.CSSProperties,
  email: {
    color: 'var(--text-primary)',
    textDecoration: 'underline',
  } as React.CSSProperties,
  callout: {
    marginTop: 16,
    padding: '12px 16px',
    backgroundColor: 'var(--surface-sunken)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: 'var(--text-xs)',
    color: 'var(--text-secondary)',
  } as React.CSSProperties,
};
