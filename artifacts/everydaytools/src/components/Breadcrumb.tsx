import { Link } from "wouter";
import { useLocale } from "@/hooks/use-locale";
import { TRANSLATIONS } from "@/i18n/translations";

const EN_TITLE_TO_SLUG: Record<string, string> = {};
Object.entries(TRANSLATIONS.EN.tools).forEach(([slug, { title }]) => {
  EN_TITLE_TO_SLUG[title] = slug;
});

export default function Breadcrumb({ items }: { items: string[] }) {
  const { t } = useLocale();
  const bc = t.nav.breadcrumb;

  const STATIC_MAP: Record<string, string> = {
    Home:           bc.home,
    "PDF Tools":    bc.pdf,
    "Word Tools":   bc.word,
    "Image Tools":  bc.image,
    "Privacy Tools":bc.privacy,
    Calculators:    bc.calculators,
    Tools:          bc.tools,
  };

  const translate = (item: string): string => {
    if (STATIC_MAP[item]) return STATIC_MAP[item];
    const slug = EN_TITLE_TO_SLUG[item];
    if (slug && t.tools[slug]) return t.tools[slug].title;
    return item;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, overflowX: "auto", whiteSpace: "nowrap" }}>
      {items.map((item, i) => {
        const label = translate(item);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i === 0 ? (
              <Link href="/"
                style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-secondary)", textDecoration: "none", transition: "color 120ms ease" }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
              >{label}</Link>
            ) : i === items.length - 1 ? (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-primary)", fontWeight: 500 }}>{label}</span>
            ) : (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>{label}</span>
            )}
            {i < items.length - 1 && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, color: "var(--text-tertiary)" }}>
                <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        );
      })}
    </div>
  );
}
