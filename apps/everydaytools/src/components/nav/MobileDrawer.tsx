import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { trackLanguageChanged } from "@/lib/analytics";
import { GROUPS, SLUG_ICON_MAP } from "@/config/top-nav-groups";

export interface MobileDrawerProps {
  open: boolean;
  onClose: () => void;
  onOpenSearch: () => void;
  currentPath: string;
}

export function MobileDrawer({ open, onClose, onOpenSearch, currentPath }: MobileDrawerProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useLocale();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const linkLabel = (href: string) => {
    const slug = href.slice(1);
    return t.nav.links[slug] ?? t.tools[slug]?.title ?? slug;
  };

  if (!open) return null;

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} />
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(300px, 88vw)", background: "var(--bg-surface)", zIndex: 201, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="22" height="22" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="var(--bg-elevated)"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="var(--accent)"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="var(--text-primary)"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="var(--text-primary)"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-sm)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>EverydayTools</span>
          </div>
          <button onClick={onClose} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "var(--text-secondary)", transition: "color 120ms ease" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>

        {/* Mobile search */}
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <button
            onClick={() => { onOpenSearch(); onClose(); }}
            aria-label={t.nav.searchPlaceholder}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              background: "var(--bg-elevated)", border: "1px solid var(--border)",
              borderRadius: "var(--radius-card)", padding: "8px 12px", cursor: "pointer", width: "100%",
              textAlign: "left",
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>
              {t.nav.searchPlaceholder}
            </span>
          </button>
        </div>

        <div style={{ flex: 1 }}>
          {GROUPS.map((group) => {
            const allLinks = group.pairs.flatMap((p) => p.filter(Boolean)) as { href: string }[];
            const isExpanded = expandedGroup === group.id;
            const groupLabel = (t.nav.groups as Record<string, string>)[group.id] ?? group.id;
            return (
              <div key={group.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "13px 20px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", fontWeight: 500, color: "var(--text-primary)", display: "flex", transition: "color 120ms ease", alignItems: "center", justifyContent: "space-between" }}
                >
                  {groupLabel}
                  <svg width="9" height="5" viewBox="0 0 9 5" fill="none" style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 120ms ease" }}>
                    <path d="M1 1l3.5 3L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                {isExpanded && (
                  <div style={{ paddingBottom: 6 }}>
                    {allLinks.map((entry) => (
                      <Link key={entry.href} href={entry.href} onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 28px", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", color: currentPath === entry.href ? "var(--accent)" : "var(--text-secondary)", textDecoration: "none", fontWeight: currentPath === entry.href ? 500 : 400, overflow: "visible" }}>
                        {(() => { const I = SLUG_ICON_MAP[entry.href.slice(1)]; return I ? <I size={15} strokeWidth={1.5} style={{ flexShrink: 0 }} /> : null; })()}
                        {linkLabel(entry.href)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{ borderBottom: "1px solid var(--border)" }}>
            <Link
              href={locale === "FR" ? "/fr/blog" : "/en/blog"}
              onClick={onClose}
              style={{
                display: "block",
                padding: "13px 20px",
                fontFamily: "var(--font-ui)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: currentPath.includes("/blog") ? "var(--accent)" : "var(--text-primary)",
                textDecoration: "none",
              }}
            >
              Blog
            </Link>
          </div>
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)", display: "flex", gap: 8 }}>
          <button onClick={toggle} style={{ padding: "6px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", background: "transparent", color: "var(--text-secondary)", fontFamily: "var(--font-ui)", fontSize: "var(--text-sm)", cursor: "pointer" }}>
            {theme === "dark" ? t.ui.lightMode : t.ui.darkMode}
          </button>
          <div style={{ display: "flex", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden" }}>
            {(["EN", "FR"] as const).map((lang, i) => (
              <button key={lang} onClick={() => { setLocale(lang); trackLanguageChanged(lang.toLowerCase()); }} style={{ background: lang === locale ? "var(--bg-subtle)" : "transparent", color: lang === locale ? "var(--text-primary)" : "var(--text-secondary)", border: "none", borderLeft: i === 1 ? "1px solid var(--border)" : "none", padding: "6px 12px", fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)", fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
