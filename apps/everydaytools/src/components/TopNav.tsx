import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { useLocale } from "@/hooks/use-locale";
import { trackLanguageChanged } from "@/lib/analytics";
import SearchModal from "@/components/SearchModal";
import { GROUPS } from "@/config/top-nav-groups";
import { NavDropdown } from "@/components/nav/NavDropdown";
import { MobileDrawer } from "@/components/nav/MobileDrawer";

function useOutsideClick(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const fn = (e: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(e.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", fn);
    document.addEventListener("touchstart", fn);
    return () => {
      document.removeEventListener("mousedown", fn);
      document.removeEventListener("touchstart", fn);
    };
  }, [ref, handler]);
}

export default function TopNav() {
  const [location] = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const navLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { theme, toggle } = useTheme();
  const { locale, setLocale, t } = useLocale();

  const clearNavTimer = () => {
    if (navLeaveTimer.current) clearTimeout(navLeaveTimer.current);
  };
  const scheduleNavClose = () => {
    clearNavTimer();
    navLeaveTimer.current = setTimeout(() => setOpenGroup(null), 200);
  };

  useOutsideClick(navRef, () => setOpenGroup(null));

  useEffect(() => {
    setOpenGroup(null);
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchModalOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
        <div
          ref={navRef}
          style={{ padding: "0 clamp(16px, 4vw, 24px)", height: 56, display: "flex", alignItems: "center", gap: 0 }}
        >
          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 9, textDecoration: "none", flexShrink: 0, marginRight: 32 }}>
            <svg width="28" height="28" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <rect width="64" height="64" rx="11" fill="var(--bg-elevated)"/>
              <rect x="14" y="15" width="36" height="7" rx="2" fill="var(--accent)"/>
              <rect x="14" y="28" width="28" height="7" rx="2" fill="var(--text-primary)"/>
              <rect x="14" y="41" width="36" height="7" rx="2" fill="var(--text-primary)"/>
            </svg>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "var(--text-base)", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", lineHeight: 1 }}>
              EverydayTools
            </span>
          </Link>

          {/* Desktop nav dropdowns */}
          <div
            className="hidden lg:flex"
            style={{ alignItems: "center", gap: 16 }}
            onMouseLeave={scheduleNavClose}
            onMouseEnter={clearNavTimer}
          >
            {GROUPS.map((group) => (
              <NavDropdown
                key={group.id}
                group={group}
                isOpen={openGroup === group.id}
                onOpen={() => setOpenGroup(group.id)}
                onClose={() => setOpenGroup(null)}
                clearTimer={clearNavTimer}
                currentPath={location}
              />
            ))}
            <Link
              href={locale === "FR" ? "/fr/blog" : "/en/blog"}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "var(--text-sm)",
                fontWeight: 500,
                color: location.includes("/blog") ? "var(--text-primary)" : "var(--text-secondary)",
                textDecoration: "none",
                padding: "6px 0",
                borderBottom: location.includes("/blog") ? "2px solid var(--accent)" : "2px solid transparent",
                whiteSpace: "nowrap",
                transition: "color 120ms ease, border-color 120ms ease",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={(e) => { if (!location.includes("/blog")) (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              Blog
            </Link>
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Search trigger — desktop */}
          <button
            className="hidden lg:flex"
            onClick={() => setSearchModalOpen(true)}
            aria-label="Search tools"
            data-testid="search-input"
            style={{
              width: 270,
              height: 38,
              alignItems: "center",
              gap: 8,
              background: "var(--bg-elevated)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-input)",
              padding: "0 14px",
              cursor: "pointer",
              transition: "border-color 120ms ease",
              fontFamily: "var(--font-ui)",
              textAlign: "left",
              boxSizing: "border-box",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <span style={{ flex: 1, fontSize: "var(--text-sm)", color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>
              {t.nav.searchPlaceholder}
            </span>
          </button>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 8 }}>
            {/* Locale */}
            <div className="hidden lg:flex" data-testid="lang-switcher" style={{ alignItems: "center", height: 38, border: "1px solid var(--border)", borderRadius: "var(--radius-card)", overflow: "hidden", boxSizing: "border-box" }}>
              {(["EN", "FR"] as const).map((lang, i) => (
                <button
                  key={lang}
                  data-testid={`lang-${lang.toLowerCase()}`}
                  onClick={() => { setLocale(lang); trackLanguageChanged(lang.toLowerCase()); }}
                  style={{
                    background: lang === locale ? "var(--bg-subtle)" : "transparent",
                    color: lang === locale ? "var(--text-primary)" : "var(--text-secondary)",
                    border: "none",
                    borderLeft: i === 1 ? "1px solid var(--border)" : "none",
                    padding: "0 11px",
                    height: "100%",
                    fontFamily: "var(--font-mono)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background 120ms ease, color 120ms ease",
                  }}
                >
                  {lang}
                </button>
              ))}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="hidden lg:flex"
              style={{ width: 38, height: 38, alignItems: "center", justifyContent: "center", background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", cursor: "pointer", color: "var(--text-secondary)", transition: "background 150ms ease, color 150ms ease, border-color 150ms ease" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--bg-elevated)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "none"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
            >
              {theme === "dark" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Mobile hamburger */}
            <button className="flex lg:hidden" data-testid="hamburger-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ background: "none", border: "1px solid var(--border)", borderRadius: "var(--radius-card)", cursor: "pointer", padding: "7px", color: "var(--text-secondary)" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 5h12M2 8h12M2 11h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </nav>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} onOpenSearch={() => setSearchModalOpen(true)} currentPath={location} />
      <SearchModal open={searchModalOpen} onClose={() => setSearchModalOpen(false)} />
    </>
  );
}
