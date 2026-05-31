import { Link } from 'wouter';
import { useLocale } from '@/hooks/use-locale';

export default function NotFound() {
  const { t } = useLocale();

  return (
    <div style={{
      minHeight: 'calc(100vh - 64px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      background: 'var(--bg-base)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 480 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(80px, 15vw, 120px)',
          fontWeight: 400,
          lineHeight: 1,
          color: 'var(--accent)',
          marginBottom: 24,
          letterSpacing: '-2px',
        }}>
          404
        </div>

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 4vw, 2rem)',
          fontWeight: 400,
          color: 'var(--text-primary)',
          margin: '0 0 12px',
          letterSpacing: '-0.3px',
        }}>
          {t.notFound.title}
        </h1>

        <p style={{
          fontFamily: 'var(--font-ui)',
          fontSize: 'var(--text-base)',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          margin: '0 0 36px',
        }}>
          {t.notFound.description}
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '12px 24px',
            background: 'var(--accent)',
            color: 'var(--accent-text)',
            borderRadius: 'var(--radius-btn)',
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.opacity = '1')}
        >
          {t.notFound.backHome}
        </Link>
      </div>
    </div>
  );
}
