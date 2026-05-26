import { Link } from "wouter";

export default function Breadcrumb({ items }: { items: string[] }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24, overflowX: 'auto', whiteSpace: 'nowrap' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {i === 0 ? (
            <Link href="/" style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 120ms ease' }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'}
            >{item}</Link>
          ) : i === items.length - 1 ? (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
          ) : (
            <span style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>{item}</span>
          )}
          {i < items.length - 1 && (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: 'var(--text-tertiary)' }}>
              <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}
