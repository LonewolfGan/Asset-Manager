import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { TRANSLATIONS } from "@/i18n/translations";

const TITLE_TO_SLUG: Record<string, string> = {};

// Register all English titles -> slug
Object.entries(TRANSLATIONS.EN.tools).forEach(([slug, { title }]) => {
  TITLE_TO_SLUG[title.toLowerCase().trim()] = slug;
});

// Register all French titles -> slug
Object.entries(TRANSLATIONS.FR.tools).forEach(([slug, { title }]) => {
  TITLE_TO_SLUG[title.toLowerCase().trim()] = slug;
});

export default function Breadcrumb({ items }: { items: string[] }) {
  const { t } = useLocale();
  const bc = t.nav.breadcrumb;

  const STATIC_MAP: Record<string, string> = {
    // English keys
    "home":                  bc.home,
    "pdf tools":             bc.pdf,
    "word tools":            bc.word,
    "image tools":           bc.image,
    "images":                bc.image,
    "privacy tools":         bc.privacy,
    "calculators":           bc.calculators,
    "tools":                 bc.tools,
    "text & code":           bc.textCode,
    "data & code":           bc.textCode,
    "excel & spreadsheets":  bc.excelSpreadsheets,
    "spreadsheets":          bc.excelSpreadsheets,
    "documents":             bc.documents,
    "privacy":               bc.privacy,

    // French keys
    "accueil":               bc.home,
    "outils pdf":            bc.pdf,
    "outils word":           bc.word,
    "outils image":          bc.image,
    "outils confidentialite":bc.privacy,
    "confidentialité":       bc.privacy,
    "calculatrices":         bc.calculators,
    "outils":                bc.tools,
    "texte & code":          bc.textCode,
    "tableurs & données":    bc.excelSpreadsheets,
    "tableurs":              bc.excelSpreadsheets,
  };

  const translate = (item: string): string => {
    if (!item) return "";
    const normalized = item.toLowerCase().trim();

    // 1. Static section names (EN & FR)
    if (STATIC_MAP[normalized]) {
      return STATIC_MAP[normalized];
    }

    // 2. Direct slug match (e.g. item === 'pdf-merge')
    if (t.tools[item]) {
      return t.tools[item].title;
    }

    // 3. Registered title match (either EN or FR title passed)
    const slug = TITLE_TO_SLUG[normalized];
    if (slug && t.tools[slug]) {
      return t.tools[slug].title;
    }

    return item;
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24, overflowX: "auto", whiteSpace: "nowrap" }}>
      {items.map((item, i) => {
        const label = translate(item);
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {i === 0 ? (
              <Link
                href="/"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "var(--text-xs)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  transition: "color 120ms ease",
                }}
                onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"}
                onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
              >
                {label}
              </Link>
            ) : i === items.length - 1 ? (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-primary)", fontWeight: 500 }}>
                {label}
              </span>
            ) : (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "var(--text-xs)", color: "var(--text-secondary)" }}>
                {label}
              </span>
            )}
            {i < items.length - 1 && (
              <ChevronRight size={12} strokeWidth={1.5} style={{ flexShrink: 0, color: "var(--text-tertiary)" }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
