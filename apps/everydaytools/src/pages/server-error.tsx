import React from 'react';
import { Link } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { RotateCw, Home } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

export interface ServerErrorProps {
  error?: Error;
  resetError?: () => void;
  params?: Record<string, string | undefined>;
}

export default function ServerError(props?: ServerErrorProps) {
  const { resetError } = props || {};
  const { isFr } = useLocale();

  const handleReload = () => {
    if (resetError) {
      resetError();
    } else if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const homeHref = isFr ? '/fr' : '/';

  return (
    <>
      <Helmet>
        <title>{isFr ? 'Erreur serveur (500) — EverydayTools' : 'Server Error (500) — EverydayTools'}</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main
        className="container-wide"
        style={{
          minHeight: 'calc(100dvh - 72px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: 48,
          paddingBottom: 96,
          color: 'var(--text-primary)',
        }}
      >
        {/* Generous centered container — calibrated width so text and illustration breathe naturally */}
        <div style={{ textAlign: 'center', maxWidth: 760, width: '100%', margin: '0 auto' }}>
          {/* Brand-Accented Hero SVG Illustration — expansive horizontal presence */}
          <div
            style={{
              width: '100%',
              maxWidth: 620,
              margin: '0 auto 32px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src="/illustrations/500-error.svg"
              alt="EverydayTools 500 Illustration"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: 380,
                objectFit: 'contain',
              }}
              loading="eager"
            />
          </div>

          {/* Semantic hidden tag for screen readers */}
          <span className="sr-only">500</span>

          {/* Swiss Editorial Display Heading — exact same font & optical weight as 404 */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.25rem, 5vw, 3rem)',
              fontWeight: 400,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
            }}
          >
            {isFr ? 'Erreur serveur' : 'Internal Server Error'}
          </h1>

          {/* Clean Editorial Prose — widened measure (620px) to prevent cramped wrapping */}
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 auto 36px',
              maxWidth: 620,
            }}
          >
            {isFr
              ? "Nos serveurs ont rencontré un obstacle temporaire lors du traitement. Vos documents restent en sécurité et ne sont pas conservés. Vous pouvez réessayer ou regagner l'accueil."
              : "Our servers hit an unexpected error while processing. Your files remain safe and unpersisted. You can try again or head back home."}
          </p>

          {/* Action CTAs: Exactly identical 44px height */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* 1. Reload Button */}
            <button
              type="button"
              data-testid="reload-btn"
              onClick={handleReload}
              className="group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                minHeight: 44,
                maxHeight: 44,
                lineHeight: '42px',
                boxSizing: 'border-box',
                margin: 0,
                gap: 8,
                padding: '0 24px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md, 10px)',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-ui)',
                cursor: 'pointer',
                transition: 'transform 160ms ease-out, border-color 160ms ease-out, color 160ms ease-out',
              }}
            >
              <RotateCw
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:rotate-45"
              />
              <span style={{ lineHeight: 1 }}>{isFr ? 'Recharger la page' : 'Try again'}</span>
            </button>

            {/* 2. Go Back Home Button (Brand Accent #FF6B35) */}
            <Link
              href={homeHref}
              className="group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                minHeight: 44,
                maxHeight: 44,
                lineHeight: '42px',
                boxSizing: 'border-box',
                margin: 0,
                gap: 8,
                padding: '0 24px',
                background: '#FF6B35',
                color: '#FFFFFF',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md, 10px)',
                fontSize: 14,
                fontWeight: 500,
                fontFamily: 'var(--font-ui)',
                textDecoration: 'none',
                boxShadow: '0 1px 2px rgba(255, 107, 53, 0.2), 0 4px 12px rgba(255, 107, 53, 0.15)',
                transition: 'transform 160ms ease-out, background 160ms ease-out, opacity 160ms ease-out',
              }}
            >
              <Home
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:scale-105"
              />
              <span style={{ lineHeight: 1 }}>{isFr ? "Retour à l'accueil" : 'Go back home'}</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
