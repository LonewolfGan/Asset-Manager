import { Link } from 'wouter';

export default function Footer() {
  const manageConsent = () => {
    window.dispatchEvent(new Event('et:show-consent'));
  };

  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '24px',
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        fontFamily: 'var(--font-ui)',
      }}
    >
      <p style={{ margin: 0, fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center' }}>
        All files processed locally in your browser — nothing is uploaded to any server.
      </p>
      <nav
        style={{
          display: 'flex',
          gap: 20,
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--text-tertiary)',
        }}
      >
        <span>© {new Date().getFullYear()} EverydayTools Hub</span>
        <span style={{ opacity: 0.3 }}>·</span>
        <Link href="/privacy" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
          Privacy Policy
        </Link>
        <span style={{ opacity: 0.3 }}>·</span>
        <Link href="/terms" style={{ color: 'var(--text-tertiary)', textDecoration: 'none' }}>
          Terms of Service
        </Link>
        <span style={{ opacity: 0.3 }}>·</span>
        <button
          onClick={manageConsent}
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            cursor: 'pointer',
            color: 'var(--text-tertiary)',
            fontFamily: 'var(--font-ui)',
            fontSize: 12,
            textDecoration: 'none',
          }}
        >
          Manage cookies
        </button>
      </nav>
    </footer>
  );
}
