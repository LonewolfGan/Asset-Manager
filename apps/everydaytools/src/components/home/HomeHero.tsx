import React from 'react';
import { Link } from 'wouter';
import { useLocale } from '@/hooks/use-locale';

export const HERO_TAGS = [
  { label: 'CSV ↔ JSON', labelFr: 'CSV ↔ JSON', route: '/csv-to-json' },
  { label: 'Markdown to PDF', labelFr: 'Markdown vers PDF', route: '/markdown-to-pdf' },
  { label: 'HTML to PDF', labelFr: 'HTML vers PDF', route: '/html-to-pdf' },
  { label: 'Word to PDF', labelFr: 'Word vers PDF', route: '/word-to-pdf' },
  { label: 'PDF to Text', labelFr: 'PDF vers Texte', route: '/pdf-to-text' },
  { label: 'Excel to PDF', labelFr: 'Excel vers PDF', route: '/excel-to-pdf' },
  { label: 'Image to PDF', labelFr: 'Image vers PDF', route: '/image-to-pdf' },
  { label: 'Word to Markdown', labelFr: 'Word vers Markdown', route: '/word-to-markdown' },
  { label: 'PDF to Word', labelFr: 'PDF vers Word', route: '/pdf-to-word' },
  { label: 'PDF to EPUB', labelFr: 'PDF vers EPUB', route: '/pdf-to-epub' },
  { label: 'PDF to HTML', labelFr: 'PDF vers HTML', route: '/pdf-to-html' },
  { label: 'HTML to Markdown', labelFr: 'HTML vers Markdown', route: '/html-to-markdown' },
  { label: 'TXT to PDF', labelFr: 'TXT vers PDF', route: '/txt-to-pdf' },
  { label: 'TXT to DOCX', labelFr: 'TXT vers DOCX', route: '/txt-to-docx' },
  { label: 'Word to HTML', labelFr: 'Word vers HTML', route: '/word-to-html' },
  { label: 'Word to EPUB', labelFr: 'Word vers EPUB', route: '/word-to-epub' },
];

export function HomeHero() {
  const { t, isFr } = useLocale();

  return (
    <div
      className="container-wide"
      style={{
        position: 'relative',
        overflow: 'hidden',
        textAlign: 'center',
        paddingTop: 'clamp(52px, 7vw, 80px)',
        paddingBottom: 'clamp(40px, 5vw, 56px)',
        background: 'var(--hero-bg)',
      }}
    >
      <style>{`
        @keyframes hero-fade-in-up {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes et-scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes et-scroll-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .hero-title  { animation: hero-fade-in-up 0.45s ease both; }
        .hero-sub    { animation: hero-fade-in-up 0.45s ease 0.08s both; }
        .hero-scroll { animation: hero-fade-in-up 0.45s ease 0.18s both; }
        .hero-pill:hover { background: var(--hero-tag-hover) !important; }
      `}</style>

      {/* Title block */}
      <div style={{ margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <h1 className="hero-title" style={{ margin: 0, lineHeight: 1, userSelect: 'none' }}>
          <span
            aria-hidden="true"
            style={{
              display: 'block',
              fontFamily: 'var(--font-hero)',
              fontSize: 'var(--hero-word-size)',
              fontWeight: 'var(--hero-word-weight)' as React.CSSProperties['fontWeight'],
              color: 'var(--hero-watermark)',
              letterSpacing: 'var(--hero-word-ls)',
              lineHeight: 1.05,
              textTransform: 'uppercase',
            }}
          >
            EVERYDAY
          </span>

          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-hero)',
              fontSize: 'var(--hero-brand-size)',
              fontWeight: 'var(--hero-brand-weight)' as React.CSSProperties['fontWeight'],
              color: 'var(--hero-title)',
              letterSpacing: 'var(--hero-brand-ls)',
              lineHeight: 0.88,
            }}
          >
            Tools
          </span>
        </h1>

        <p
          className="hero-sub"
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: 'var(--hero-sub-size)',
            color: 'var(--hero-subtitle)',
            margin: '22px auto 0',
            lineHeight: 1.7,
            maxWidth: 640,
          }}
        >
          {t.home.subtitle}
        </p>
      </div>

      {/* Infinite scroll pills */}
      <div
        className="hero-scroll"
        style={{
          marginTop: 48,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          width: '90%',
          margin: '48px auto 0',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          maskImage: 'linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Row 1 — scrolls left */}
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div style={{ display: 'flex', gap: 8, width: 'fit-content', animation: 'et-scroll-left 36s linear infinite' }}>
            {[...HERO_TAGS, ...HERO_TAGS].map((tag, i) => (
              <Link key={`r1-${i}`} href={tag.route} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <span
                  className="hero-pill"
                  style={{
                    display: 'inline-block',
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--hero-tag-bg)',
                    color: 'var(--hero-tag-text)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    transition: 'background 150ms ease',
                  }}
                >
                  {isFr ? tag.labelFr : tag.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Row 2 — scrolls right */}
        <div style={{ overflow: 'hidden', width: '100%' }}>
          <div style={{ display: 'flex', gap: 8, width: 'fit-content', animation: 'et-scroll-right 42s linear infinite' }}>
            {[...HERO_TAGS, ...HERO_TAGS].map((tag, i) => (
              <Link key={`r2-${i}`} href={tag.route} style={{ textDecoration: 'none', flexShrink: 0 }}>
                <span
                  className="hero-pill"
                  style={{
                    display: 'inline-block',
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-pill)',
                    background: 'var(--hero-tag-bg)',
                    color: 'var(--hero-tag-text)',
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    fontWeight: 500,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    lineHeight: 1.4,
                    transition: 'background 150ms ease',
                  }}
                >
                  {isFr ? tag.labelFr : tag.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
