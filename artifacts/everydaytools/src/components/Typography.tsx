import type { ReactNode, CSSProperties } from 'react';

/**
 * CENTRALIZED TYPOGRAPHY COMPONENTS
 *
 * These are the ONLY permitted way to render page-level headings and text.
 * Font size, weight, line-height, letter-spacing, and color are ALL fixed
 * via CSS tokens defined in index.css (--page-title-*, --page-subtitle-*, etc.).
 *
 * The `style` prop accepts ONLY layout overrides (margin, padding, maxWidth,
 * textAlign, display). Font properties placed in `style` are explicitly
 * overridden by the component's own styles — they cannot deviate.
 *
 * To change typography globally: edit the CSS tokens in index.css, not these
 * components, and never pass font values via the `style` prop.
 */

type LayoutStyle = Pick<
  CSSProperties,
  | 'margin' | 'marginTop' | 'marginBottom' | 'marginLeft' | 'marginRight'
  | 'padding' | 'paddingTop' | 'paddingBottom' | 'paddingLeft' | 'paddingRight'
  | 'maxWidth' | 'minWidth' | 'width'
  | 'textAlign' | 'display' | 'flex' | 'order'
>;

interface TypographyProps {
  children: ReactNode;
  className?: string;
  /** Layout overrides only (margin, padding, maxWidth). Font values are ignored. */
  style?: LayoutStyle;
  id?: string;
}

/** H1 page title — identical on every page of the site. */
export function PageTitle({ children, className, style, id }: TypographyProps) {
  return (
    <h1
      id={id}
      className={className}
      style={{
        ...(style as CSSProperties),
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--page-title-size)',
        fontWeight: 'var(--page-title-weight)' as CSSProperties['fontWeight'],
        lineHeight: 'var(--page-title-lh)',
        letterSpacing: 'var(--page-title-ls)',
        color: 'var(--text-primary)',
        margin: (style as CSSProperties)?.marginBottom != null
          ? `0 0 ${(style as CSSProperties).marginBottom}px`
          : '0 0 var(--page-title-mb)',
      }}
    >
      {children}
    </h1>
  );
}

/** Page subtitle / description — identical on every page of the site. */
export function PageSubtitle({ children, className, style, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={className}
      style={{
        ...(style as CSSProperties),
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--page-subtitle-size)',
        fontWeight: 400,
        lineHeight: 'var(--page-subtitle-lh)',
        color: 'var(--text-secondary)',
        maxWidth: 'var(--page-subtitle-maxw)',
        margin: (style as CSSProperties)?.marginBottom != null
          ? `0 0 ${(style as CSSProperties).marginBottom}px`
          : 0,
      }}
    >
      {children}
    </p>
  );
}

/** H2 section title within a page. */
export function SectionTitle({ children, className, style, id }: TypographyProps) {
  return (
    <h2
      id={id}
      className={className}
      style={{
        ...(style as CSSProperties),
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--section-title-size)',
        fontWeight: 'var(--section-title-weight)' as CSSProperties['fontWeight'],
        lineHeight: 'var(--section-title-lh)',
        letterSpacing: 'var(--section-title-ls)',
        color: 'var(--text-primary)',
        margin: (style as CSSProperties)?.marginBottom != null
          ? `0 0 ${(style as CSSProperties).marginBottom}px`
          : '0 0 0.75em',
      }}
    >
      {children}
    </h2>
  );
}

/** Subtitle below a SectionTitle. */
export function SectionSubtitle({ children, className, style, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={className}
      style={{
        ...(style as CSSProperties),
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--text-lg)',
        fontWeight: 400,
        lineHeight: 1.55,
        color: 'var(--text-secondary)',
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}

/** Standard body paragraph. */
export function BodyText({ children, className, style, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={className}
      style={{
        ...(style as CSSProperties),
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--body-text-size)',
        lineHeight: 'var(--body-text-lh)',
        color: 'var(--text-secondary)',
        margin: '0 0 1em',
      }}
    >
      {children}
    </p>
  );
}

/** Small / caption text. */
export function SmallText({ children, className, style, id }: TypographyProps) {
  return (
    <p
      id={id}
      className={className}
      style={{
        ...(style as CSSProperties),
        fontFamily: 'var(--font-ui)',
        fontSize: 'var(--small-text-size)',
        lineHeight: 'var(--small-text-lh)',
        color: 'var(--text-tertiary)',
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}
