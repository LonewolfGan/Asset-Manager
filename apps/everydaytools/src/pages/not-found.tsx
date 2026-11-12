import React from 'react';
import { Link, useLocation } from 'wouter';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft } from 'lucide-react';
import { useLocale } from '@/hooks/use-locale';

export default function NotFound() {
  const { isFr } = useLocale();
  const [, setLocation] = useLocation();

  const homeHref = isFr ? '/fr' : '/';

  const handleGoBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
    } else {
      setLocation(homeHref);
    }
  };

  return (
    <>
      <Helmet>
        <title>{isFr ? 'Page introuvable (404) — EverydayTools' : 'Page Not Found (404) — EverydayTools'}</title>
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
        <div style={{ textAlign: 'center', maxWidth: 640, width: '100%', margin: '0 auto' }}>
          {/* Brand-Accented Hero SVG Illustration */}
          <div
            style={{
              width: '100%',
              maxWidth: 540,
              margin: '0 auto 32px',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <img
              src="/illustrations/404-error.svg"
              alt="EverydayTools 404 Illustration"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                maxHeight: 360,
                objectFit: 'contain',
              }}
              loading="eager"
            />
          </div>

          {/* Semantic hidden tag for screen readers */}
          <span className="sr-only">404</span>

          {/* Swiss Editorial Display Heading */}
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
            {isFr ? 'Page introuvable' : 'Lost in the Workshop'}
          </h1>

          {/* Clean Editorial Prose */}
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.65,
              color: 'var(--text-secondary)',
              margin: '0 auto 36px',
              maxWidth: 480,
            }}
          >
            {isFr
              ? "Le document ou l'outil que vous recherchez a été déplacé ou n'existe pas. Vous pouvez regagner l'accueil pour explorer tous nos outils."
              : "The document or tool you are looking for has been moved or does not exist. You can head back home to explore all tools."}
          </p>

          {/* Action CTAs: Inverted order, calibrated to exact matching 44px height */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* 1. Go Back Button (with ArrowLeft icon) */}
            <button
              type="button"
              onClick={handleGoBack}
              className="group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                boxSizing: 'border-box',
                gap: 8,
                padding: '0 22px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md, 10px)',
                fontSize: 14,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'transform 160ms ease-out, border-color 160ms ease-out, color 160ms ease-out',
              }}
            >
              <ArrowLeft
                size={16}
                aria-hidden="true"
                className="transition-transform duration-150 group-hover:-translate-x-0.5"
              />
              <span>{isFr ? 'Page précédente' : 'Go back'}</span>
            </button>

            {/* 2. Go Back Home Button (Brand Accent #FF6B35 with Home icon) */}
            <Link
              href={homeHref}
              className="group"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: 44,
                boxSizing: 'border-box',
                gap: 8,
                padding: '0 22px',
                background: '#FF6B35',
                color: '#FFFFFF',
                border: '1px solid transparent',
                borderRadius: 'var(--radius-md, 10px)',
                fontSize: 14,
                fontWeight: 500,
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
              <span>{isFr ? "Retour à l'accueil" : 'Go back home'}</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
